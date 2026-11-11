# Landing page e CRM — auditoria de 10/11/2026

Estado: parcial; revisão de código, sem validação de produção ou prova visual.
Destino solicitado: projeto Supabase `arofhwinueenjvdtnvch`, separado da Limpax.
Acesso solicitado: `enzoroncisvale@gmail.com` (não verificado nem alterado).

## Achados e correções locais

| Prioridade | Evidência | Situação |
| --- | --- | --- |
| Crítica | `app/actions/lead-capture.ts` usava IDs fixos e service role | IDs removidos; configuração do servidor obrigatória, conferência de projeto e vínculo organização/funil/etapa antes da escrita |
| Alta | Erros de INSERT ignorados; retorno de sucesso incondicional | Todas as consultas verificadas; falha retorna erro visível, sem link de sucesso |
| Alta | Qualquer visitante podia substituir nome/e-mail de contato existente pelo telefone | Captura reutiliza o contato sem sobrescrever a ficha |
| Alta | Action pública sem validação ou limite | Schema Zod, limites de tamanho, rate limit por telefone hasheado e limite global por organização; fallback em memória do helper existente continua limitado a cada instância |
| Alta | Formulário não cria agenda, conversa nem tarefa | Continua pendente; só contato e lead são gravados. Não anunciar integração completa |
| Média | Data e horários apresentados como reserva sem consulta de disponibilidade | Interface explicita preferência sujeita a confirmação |
| Média | WhatsApp aberto automaticamente após chamada assíncrona | Removida abertura automática; link manual no resultado |
| Média | Telefone com DDD 55 era confundido com código de país | Normalização distingue pelo comprimento |
| Média | Notas podiam aparecer na mensagem externa e em erro bruto | Mensagem de WhatsApp não inclui notas; erro público genérico; log sem dados pessoais |
| Média | Data local construída por conversão UTC | Data civil usa ano/mês/dia do navegador |
| Média | `app/page.tsx` contém Instagram genérico e telefone de exemplo | Pendente confirmar os canais reais antes de publicar |
| Média | Avaliações e contagens fixas em `app/estetica/page.tsx` e `app/saude/page.tsx` | Não verificadas; precisam de fonte real antes de publicar |

## Bloqueio externo medido

O conector Supabase recusou `get_project` para o projeto solicitado com mensagem de falta de permissão.
`list_projects` não incluiu esse projeto. Nenhum outro projeto foi modificado.
Isso impede conferir schema, policies RLS, migrations aplicadas, usuário, organização e configurações reais.
Não foram lidos arquivos de credenciais `.env*`.

## Configuração preparada

O template `.env.example` e `lib/env.ts` declaram `LANDING_SUPABASE_PROJECT_REF`,
`LANDING_ORGANIZATION_ID`, `LANDING_PIPELINE_ID`, `LANDING_STAGE_ID` e `LANDING_COMPANY_WHATSAPP`.
Sem configuração validada, a captura recusa escrita e mostra indisponibilidade.
O ref esperado desta instalação é `arofhwinueenjvdtnvch`; a URL e as credenciais dos clients
canônicos ainda precisam ser configuradas no ambiente autorizado. Não trocar apenas a URL mantendo chaves de outro banco.

## Próxima implementação após acesso

1. Inspecionar schema e garantir migrations/baseline compatíveis, sem copiar dados da Limpax.
2. Confirmar conta e associação da pessoa solicitada à organização correta; não conceder papel de plataforma por inferência.
3. Criar operação transacional e idempotente para contato, lead, solicitação de agenda, inbox e tarefa vinculados. A gravação atual de contato e lead não é atômica: uma falha posterior pode deixar contato sem lead e reenvios podem duplicar leads.
4. Registrar solicitação pendente de confirmação na agenda, usando fuso e disponibilidade reais.
5. Inserir entrada do site na inbox sem inventar mensagem recebida/enviada pelo WhatsApp e sem disparar automação.
6. Persistir modelos configuráveis por organização e etapa, com edição na tela. Adicionar atalhos manuais nas fichas de contato e nos cards de funil. Clicar em link não pode marcar mensagem como enviada.
7. Provar RLS entre dois tenants e a jornada real em desktop/celular; verificar observabilidade e recibos de falha.

## Checklist do sistema vivo

- Entrada: `NicheBookingForm` → `submitLeadCapture` → schema Zod.
- Saída atual: tabelas `contacts` e `crm_leads`; consumidores existentes são Contatos e Funis.
- Registro: `audit()` para cada criação bem-sucedida, request ID e log sanitizado nas falhas.
- Porta: rotas públicas `/estetica` e `/saude`; telas existentes de contatos e funis.
- Recuperação: erro em `role=alert`, botão liberado no `finally`; repetição com limites. Reconciliação transacional e deduplicação estão pendentes.
- Continuidade: envio do WhatsApp depende do clique e confirmação da pessoa; não há confirmação automática de agenda.
- Retorno: falha não avança ao sucesso; agenda/inbox/tarefa ainda não têm aresta implementada.
- Destino: infraestrutura e integração pública desta instalação; não muda o contrato do núcleo de atendimento.

## Validação

TypeScript completo: `node node_modules/typescript/bin/tsc --noEmit`, exit 0.
O launcher pnpm tentou baixar sua versão fixada e falhou por DNS; os CLIs já instalados foram executados diretamente pelo Node, sem instalar dependências.
Oito verificações diretas do schema passaram via Node/tsx; isso não substitui a suíte Vitest.
ESLint dos arquivos alterados: zero erros; aviso preexistente de setState no efeito de calendário.
Testes adicionados: normalização/validação e isolamento do destino.
A execução Vitest falhou na coleta por resolução de caminho Windows do setup (`/@id/C:/.../vitest.setup.ts`), antes de executar casos.
Tentativa com loader alternativo falhou em `__dirname` da configuração existente.
Não há prova de RLS, E2E, banco remoto, publicação ou UX visual nesta entrega.
