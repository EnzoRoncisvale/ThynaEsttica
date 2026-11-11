"use server";

import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { audit } from "@/lib/audit";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/ai/dispatcher/rate-limit";
import { formularioPublicoSchema } from "@/lib/leads/formulario-publico";

export interface LeadCaptureInput {
  name: string;
  phone: string;
  email?: string;
  niche: "estetica" | "saude";
  selectedService: string;
  preferredDay?: string;
  preferredTime?: string;
  notes?: string;
}

export async function submitLeadCapture(raw: LeadCaptureInput) {
  const parsed = formularioPublicoSchema.safeParse(raw);
  if (!parsed.success)
    return { success: false, error: "Confira seu nome, telefone com DDD e os demais campos." };
  const input = parsed.data;
  const requestId = randomUUID();
  const organizationId = env.LANDING_ORGANIZATION_ID;
  const pipelineId = env.LANDING_PIPELINE_ID;
  const stageId = env.LANDING_STAGE_ID;
  const companyPhone = env.LANDING_COMPANY_WHATSAPP.replace(/\D/g, "");

  // Nunca usar o banco ou os IDs de outra instalacao.
  if (
    !env.LANDING_SUPABASE_PROJECT_REF ||
    new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname !==
      `${env.LANDING_SUPABASE_PROJECT_REF}.supabase.co` ||
    ![organizationId, pipelineId, stageId].every((id) => z.uuid().safeParse(id).success) ||
    !/^55[1-9]\d{9,10}$/.test(companyPhone) ||
    (env.SUPABASE_SERVER_URL && env.SUPABASE_SERVER_URL !== env.NEXT_PUBLIC_SUPABASE_URL)
  ) {
    return {
      success: false,
      error: "O formulário está temporariamente indisponível. Tente novamente mais tarde.",
    };
  }
  try {
    const bucket = createHash("sha256").update(`${organizationId}:${input.phone}`).digest("hex");
    const rate = await checkRateLimit(`landing:${bucket}`, 3, 600);
    const total = await checkRateLimit(`landing:${organizationId}`, 60, 60);
    if (!rate.allowed || !total.allowed)
      return { success: false, error: "Muitas tentativas. Aguarde alguns minutos." };
    const db = createAdminClient();
    const { data: stage, error: stageError } = await db
      .from("crm_stages")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("pipeline_id", pipelineId)
      .eq("id", stageId)
      .maybeSingle();
    if (stageError || !stage) throw new Error("invalid_destination");
    const phone = `+${input.phone}`;
    const { data: existing, error: lookupError } = await db
      .from("contacts")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("phone_number", phone)
      .maybeSingle();
    if (lookupError) throw new Error("contact_lookup_failed");
    let contactId = existing?.id;
    // Captura publica nao pode sobrescrever o cadastro de cliente existente.
    if (!contactId) {
      const { data: contact, error } = await db
        .from("contacts")
        .insert({
          organization_id: organizationId,
          name: input.name,
          phone_number: phone,
          email: input.email || null,
          source: "website",
          tags: [input.niche],
        })
        .select("id")
        .single();
      if (error || !contact) throw new Error("contact_insert_failed");
      contactId = contact.id;
      void audit({
        action: "contact.created",
        organizationId,
        resourceType: "contact",
        resourceId: contactId,
        requestId,
        bypassedRls: true,
      });
    }
    const description = [
      `Solicitação do site: ${input.name}`,
      `Serviço: ${input.selectedService}`,
      `Preferência (a confirmar): ${input.preferredDay || "Não informada"} ${input.preferredTime || ""}`,
      input.notes || "",
    ].join("\n");
    const { data: lead, error } = await db
      .from("crm_leads")
      .insert({
        organization_id: organizationId,
        pipeline_id: pipelineId,
        stage_id: stageId,
        contact_id: contactId,
        title: `${input.selectedService} - ${input.name}`,
        description,
        source: "website",
        status: "open",
        position_in_stage: 0,
      })
      .select("id")
      .single();
    if (error || !lead) throw new Error("lead_insert_failed");
    void audit({
      action: "lead.created",
      organizationId,
      resourceType: "lead",
      resourceId: lead.id,
      requestId,
      bypassedRls: true,
    });
    const message = `Olá! Sou ${input.name}. Gostaria de solicitar ${input.selectedService} para ${input.preferredDay || "um dia a combinar"}, às ${input.preferredTime || "um horário a combinar"}. Aguardo confirmação.`;
    return {
      success: true,
      whatsappUrl: `https://wa.me/${companyPhone}?text=${encodeURIComponent(message)}`,
    };
  } catch {
    logger.error("Falha na captura pública de lead", { requestId });
    return {
      success: false,
      error: "Não foi possível concluir sua solicitação. Tente novamente mais tarde.",
    };
  }
}
