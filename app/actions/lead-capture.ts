"use server";

import { createAdminClient } from "@/lib/supabase/admin";

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

const ORG_ID = "56e0f251-8248-409e-8d90-e6cff7232257";
const PIPELINE_ID = "a4d190c7-38af-497f-9625-dea2e65ee48a";
const STAGE_ID = "f5586240-0bca-48e5-8758-e672bfaaf665"; // 1. Novo Lead (Site / WhatsApp)

export async function submitLeadCapture(input: LeadCaptureInput) {
  try {
    const supabase = createAdminClient();

    // Normalizar telefone
    const rawDigits = input.phone.replace(/\D/g, "");
    let cleanPhone = rawDigits;
    if (rawDigits.length >= 10 && rawDigits.length <= 11 && !rawDigits.startsWith("55")) {
      cleanPhone = `55${rawDigits}`;
    }

    const nicheLabel = input.niche === "estetica" ? "Estética" : "Saúde";

    // 1. Procurar ou criar contato
    const e164Phone = `+${cleanPhone}`;
    let contactId: string | null = null;
    const { data: existingContact } = await supabase
      .from("contacts")
      .select("id, tags")
      .eq("organization_id", ORG_ID)
      .eq("phone_number", e164Phone)
      .maybeSingle();

    if (existingContact) {
      contactId = existingContact.id;
      const currentTags = Array.isArray(existingContact.tags) ? existingContact.tags : [];
      const updatedTags = Array.from(new Set([...currentTags, nicheLabel, input.selectedService]));
      await supabase
        .from("contacts")
        .update({
          name: input.name,
          email: input.email || undefined,
          tags: updatedTags,
          updated_at: new Date().toISOString(),
        })
        .eq("id", contactId);
    } else {
      const { data: newContact, error: cErr } = await supabase
        .from("contacts")
        .insert({
          organization_id: ORG_ID,
          name: input.name,
          phone_number: e164Phone,
          phone_whatsapp: "sim",
          email: input.email || null,
          source: "website",
          tags: [nicheLabel, input.selectedService],
        })
        .select("id")
        .single();

      if (!cErr && newContact) {
        contactId = newContact.id;
      }
    }

    // 2. Criar Lead no Kanban
    const title = `[${nicheLabel}] ${input.selectedService} - ${input.name}`;
    const descParts = [
      `Nome: ${input.name}`,
      `WhatsApp: ${input.phone}`,
      input.email ? `E-mail: ${input.email}` : null,
      `Área: ${nicheLabel}`,
      `Procedimento / Serviço: ${input.selectedService}`,
      input.preferredDay || input.preferredTime
        ? `Preferência: ${input.preferredDay || ""} às ${input.preferredTime || ""}`
        : null,
      input.notes ? `Observações / Queixa: ${input.notes}` : null,
      `Data de captação: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
    ].filter(Boolean);

    await supabase.from("crm_leads").insert({
      organization_id: ORG_ID,
      pipeline_id: PIPELINE_ID,
      stage_id: STAGE_ID,
      contact_id: contactId,
      title,
      description: descParts.join("\n"),
      source: "website",
      status: "open",
      position_in_stage: 0,
    });

    // 3. Montar link do WhatsApp para atendimento imediato
    const companyPhone = process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || "5561999999999";
    const cleanCompanyPhone = companyPhone.replace(/\D/g, "");

    let message = "";
    if (input.niche === "estetica") {
      message = `Olá Thyná! Me chamo *${input.name}* e gostaria de agendar o protocolo *${input.selectedService}*${
        input.preferredDay ? ` para ${input.preferredDay} às ${input.preferredTime || "14:00"}` : ""
      }.${input.notes ? `\n\nObservação: ${input.notes}` : ""}`;
    } else {
      message = `Olá Thyná! Me chamo *${input.name}* e gostaria de agendar uma consulta de *${input.selectedService}*${
        input.preferredDay ? ` para ${input.preferredDay} às ${input.preferredTime || "14:00"}` : ""
      }.${input.notes ? `\n\nDetalhes/Objetivo: ${input.notes}` : ""}`;
    }

    const whatsappUrl = `https://wa.me/${cleanCompanyPhone}?text=${encodeURIComponent(message)}`;

    return { success: true, whatsappUrl };
  } catch (err: any) {
    console.error("Erro no submitLeadCapture:", err);
    return { success: false, error: err?.message || "Falha ao registrar contato" };
  }
}
