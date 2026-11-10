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

async function test() {
  console.log("=== TESTE DE CONEXÃO SUPABASE CLOUD ===");
  console.log("Endpoint:", env.NEXT_PUBLIC_SUPABASE_URL);

  const { data: orgs, error: orgErr } = await supabase
    .from("organizations")
    .select("id, legal_name, display_name, cnpj");
  if (orgErr) {
    console.error("Erro orgs:", orgErr);
  } else {
    console.log("Organizações:", orgs);
  }

  const { data: users, error: userErr } = await supabase
    .from("user_organizations")
    .select("id, role, user_id, organization_id");
  if (userErr) {
    console.error("Erro membros:", userErr);
  } else {
    console.log("Vínculos de usuários (user_organizations):", users);
  }

  const { data: pipelines, error: pipeErr } = await supabase
    .from("crm_pipelines")
    .select("id, name, organization_id");
  if (pipeErr) {
    console.error("Erro pipelines:", pipeErr);
  } else {
    console.log("Funis de Vendas:", pipelines);
  }

  const { data: stages, error: stageErr } = await supabase
    .from("crm_stages")
    .select("id, name, position")
    .order("position", { ascending: true });
  if (stageErr) {
    console.error("Erro stages:", stageErr);
  } else {
    console.log("Etapas do Funil (" + stages.length + " etapas):", stages.map(s => s.name));
  }

  const { data: channels, error: chanErr } = await supabase
    .from("channels")
    .select("id, name, channel_type, status");
  if (chanErr) {
    console.error("Erro canais:", chanErr);
  } else {
    console.log("Canais cadastrados:", channels.length);
  }

  const { data: authUsers, error: authErr } = await supabase.auth.admin.listUsers();
  if (authErr) {
    console.error("Erro auth users:", authErr);
  } else {
    console.log("Usuários no Supabase Auth:", authUsers.users.map(u => ({ id: u.id, email: u.email })));
  }
}

test();
