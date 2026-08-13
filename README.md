# Kukula Microcrédito E.I

Plataforma web de gestão de microcrédito com **Supabase** (Auth + Postgres).

## Arranque rápido

1. Crie um projecto em [supabase.com](https://supabase.com/dashboard)
2. Copie `.env.local.example` → `.env.local` e preencha as chaves
3. No SQL Editor do Supabase, execute `supabase/migrations/001_schema.sql`
4. Popule dados demo:
   ```bash
   npm install
   npm run seed
   npm run dev
   ```

Guia completo: [SUPABASE.md](./SUPABASE.md)

## Contas demo (após seed)

| Email | Password | Área |
|-------|----------|------|
| admin@kukula.ao | demo1234 | `/admin` |
| analista@kukula.ao | demo1234 | `/admin` |
| maria.fernandes@email.com | demo1234 | `/cliente` |

## Stack

- Next.js App Router + TypeScript + Tailwind
- Supabase Auth, Postgres, RLS
- Server Actions para pedidos, decisões, desembolsos e pagamentos
