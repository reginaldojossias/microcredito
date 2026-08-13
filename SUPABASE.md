# Setup Supabase — Kukula Microcrédito

## 1. Criar projecto
1. Aceda a https://supabase.com/dashboard
2. Crie um projecto (ex.: `kukula-microcredito`)
3. Em **Project Settings → API**, copie:
   - Project URL
   - `anon` `public` key
   - `service_role` key (secret)

## 2. Variáveis de ambiente
Copie `.env.local.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 3. Criar tabelas
No Supabase: **SQL Editor → New query**, cole e execute o ficheiro:

`supabase/migrations/001_schema.sql`

Isto cria enums, tabelas, RLS, triggers, produtos e definições de cobrança.

## 4. Popular dados demo
```bash
npm run seed
```

Contas:
| Email | Password | Papel |
|-------|----------|-------|
| admin@kukula.ao | demo1234 | Admin |
| analista@kukula.ao | demo1234 | Analista |
| maria.fernandes@email.com | demo1234 | Cliente |

## 5. Auth
Em **Authentication → Providers**, confirme que Email está activo.
Em desenvolvimento, desactive "Confirm email" se quiser login imediato após registo.

## Tabelas
- `profiles` — clientes e staff (liga a `auth.users`)
- `credit_products` — produtos de crédito
- `documents` — documentos do cliente
- `loan_applications` — pedidos
- `loans` — empréstimos activos
- `installments` — prestações
- `payments` — pagamentos
- `disbursements` — desembolsos
- `notifications` — notificações
- `audit_logs` — auditoria
- `collection_settings` — regras de cobrança
