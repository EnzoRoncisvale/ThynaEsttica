const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
const dotenv = fs.readFileSync(envPath, "utf8");
const env = {};
for (const line of dotenv.split("\n")) {
  const parts = line.trim().split("=");
  if (parts.length >= 2 && !line.trim().startsWith("#")) {
    const key = parts[0].trim();
    const val = parts.slice(1).join("=").trim();
    env[key] = val;
  }
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function setup() {
  console.log("Configurando organização e funil para Thyná Estética...");

  const orgId = "56e0f251-8248-409e-8d90-e6cff7232257";

  // 1. Atualizar nome da organização
  const { data: updatedOrg, error: orgErr } = await supabase
    .from("organizations")
    .update({
      legal_name: "Thyná Estética & Saúde Integrada",
      display_name: "Thyná Estética",
    })
    .eq("id", orgId)
    .select();

  if (orgErr) {
    console.error("Erro ao atualizar organização:", orgErr);
  } else {
    console.log("Organização atualizada:", updatedOrg);
  }

  // 2. Atualizar o pipeline do CRM
  const pipelineId = "a4d190c7-38af-497f-9625-dea2e65ee48a";
  const { data: updatedPipe, error: pipeErr } = await supabase
    .from("crm_pipelines")
    .update({
      name: "Atendimentos Thyná Estética",
    })
    .eq("id", pipelineId)
    .select();

  if (pipeErr) {
    console.error("Erro ao atualizar pipeline:", pipeErr);
  } else {
    console.log("Pipeline atualizado:", updatedPipe);
  }

  // 3. Atualizar etapas do funil para o fluxo da clínica
  const stagesToUpdate = [
    { id: "f5586240-0bca-48e5-8758-e672bfaaf665", name: "1. Novo Lead (Site / WhatsApp)", position: 1 },
    { id: "3b55d431-62c5-47bc-9684-7cf0876d5ee5", name: "2. Horário em Negociação", position: 2 },
    { id: "d8ad6079-32a1-42b2-be18-300ee5f7ca73", name: "3. Agendamento Confirmado", position: 3 },
    { id: "cc3d5320-e98e-4dc9-98de-6c84eff70104", name: "4. Procedimento / Sessão Realizada", position: 4 },
    { id: "f2fa3f53-cb37-4f86-9ae8-b715cf3e1a22", name: "5. Pós-Atendimento & Retorno", position: 5 },
    { id: "eeaec608-43ae-4a10-92e9-0db625552e41", name: "6. Pacote Fechado / Fidelizada ✨", position: 6 },
    { id: "021e60e4-4637-433c-b118-e156a9ecd784", name: "7. Não Compareceu / Cancelado", position: 7 },
  ];

  for (const s of stagesToUpdate) {
    const { error: sErr } = await supabase
      .from("crm_stages")
      .update({ name: s.name, position: s.position })
      .eq("id", s.id);
    if (sErr) console.error("Erro ao atualizar stage " + s.id, sErr);
    else console.log("Stage atualizado: " + s.name);
  }

  console.log("Setup concluído com sucesso!");
}

setup().catch(console.error);
