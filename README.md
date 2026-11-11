# 🌸 Thyná Estética — Landing Page & CRM Sem VPS

Esta é a versão do CRM adaptada para rodar como um **site normal**, sem a necessidade de manter uma VPS (Virtual Private Server) ou gerenciar contêineres Docker (como WAHA, Caddy, Traefik ou workers em daemon).

Pode ser hospedado diretamente na **Vercel**, **Netlify**, **Render**, ou em qualquer hospedagem Node.js tradicional.

---

## 💡 O que mudou em relação à versão VPS?

1. **Sem Docker / Sem VPS:**
   - Foram removidos todos os scripts de instalação de VPS (`hostgator-setup-kit`), arquivos `Dockerfile`, `docker-compose*` e configurações de proxies reversos (`Caddyfile`, `Traefik`).
2. **Processamento Serverless:**
   - Em vez de processos daemon contínuos (`agent-worker` e `scheduler` rodando 24/7 num contêiner), as rotinas de segundo plano (drenagem de eventos, inteligência artificial, regras de automação e follow-ups) são acionadas sob demanda via endpoints HTTP (`/api/v1/cron/*`).
   - Inclui configuração pronta para Vercel Cron em `vercel.json`.
3. **Supabase Cloud Nativo:**
   - O banco de dados PostgreSQL, a autenticação de usuários, o Realtime (WebSockets) e o armazenamento de mídias (Storage) rodam 100% no Supabase na nuvem com isolamento multi-tenant (RLS).
4. **WhatsApp Desacoplado:**
   - As variáveis de ambiente do WAHA não são mais obrigatórias para o boot da aplicação. É possível conectar via Meta Cloud API oficial, WAHA hospedado externamente como serviço (SaaS), ou Evolution API.
5. **Rate Limiting Tolerante:**
   - O Upstash Redis é opcional. Se não configurado, o sistema utiliza fallback automático em memória sem interromper o serviço.

---

## 🛠️ Como rodar localmente

### 1. Pré-requisitos
- Node.js 22+
- `pnpm` instalado (`npm install -g pnpm`)

### 2. Configurar o `.env.local`
Crie ou edite o arquivo `.env.local` com as credenciais do seu projeto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

*(Opcional: configure chaves de IA como `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` ou `OPENROUTER_API_KEY` se desejar usar os agentes).*

### 3. Instalar dependências
```bash
pnpm install
```

### 4. Iniciar em desenvolvimento
```bash
pnpm dev
```
Acesse: [http://localhost:3000](http://localhost:3000)

### 5. Compilar para produção
```bash
pnpm build
pnpm start
```

---

## ☁️ Deploy na Vercel / Netlify

1. Envie o repositório para o seu GitHub/GitLab.
2. Conecte o repositório na **Vercel** ou **Netlify**.
3. Adicione as Variáveis de Ambiente no painel da hospedagem:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - *(Opcional)* `ANTHROPIC_API_KEY` / `OPENAI_API_KEY`
   - *(Opcional)* `INTERNAL_CRON_SECRET` (para proteger as rotas de cron)
4. O arquivo `vercel.json` já configurado cuidará de agendar as tarefas de drenagem de eventos (`/api/v1/cron/event-log-drain`).

---

## 📂 Estrutura Simplificada

```
sem-vps/
├── app/                  # Rotas e páginas do Next.js 16 (App Router)
│   ├── (auth)/           # Login, recuperação de senha, convites
│   ├── admin/            # Painel administrativo
│   ├── api/v1/cron/      # Rotas de cron disparadas via HTTP (Vercel Cron)
│   └── app/              # Interface do CRM (Inbox, Contatos, Kanban, IA)
├── components/           # Componentes UI (React 19 + Tailwind 4 + Radix)
├── lib/                  # Regras de negócio, Supabase clients, IA SDK
├── workers/              # Handlers modulares de eventos (executados via cron/api)
├── public/               # Ativos estáticos e marca
├── vercel.json           # Agendamento serverless de crons
└── package.json          # Dependências e scripts sem amarras de VPS/Docker
```
