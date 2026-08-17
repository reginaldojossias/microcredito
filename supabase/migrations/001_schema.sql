-- Kukula Microcrédito E.I — Schema completo
-- Executar no SQL Editor do Supabase (ou via CLI: supabase db push)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('cliente', 'admin', 'analista', 'gestor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type profile_status as enum ('activo', 'pendente', 'bloqueado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_status as enum (
    'nao_verificado',
    'em_analise',
    'verificado',
    'rejeitado'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type document_status as enum ('pendente', 'em_analise', 'aprovado', 'rejeitado', 'corrigir');
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum (
    'rascunho', 'enviado', 'em_analise', 'info_adicional', 'aprovado', 'rejeitado',
    'contrato_pendente', 'contrato_aceite', 'desembolso_pendente', 'activo', 'liquidado', 'em_atraso'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type loan_status as enum ('activo', 'em_atraso', 'liquidado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type installment_status as enum ('pendente', 'pago', 'atrasado', 'parcial');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('confirmado', 'pendente', 'falhado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type disbursement_status as enum ('pendente', 'processando', 'confirmado', 'falhado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notification_type as enum (
    'pedido', 'analise', 'aprovacao', 'rejeicao', 'desembolso',
    'lembrete', 'atraso', 'pagamento', 'liquidacao'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Profiles (liga a auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'cliente',
  full_name text not null,
  email text not null unique,
  phone text,
  address text,
  id_document text,
  id_document_type text,
  date_of_birth date,
  province text,
  district text,
  neighborhood text,
  profession text,
  income numeric(14,2) default 0,
  status profile_status not null default 'pendente',
  verification_status verification_status not null default 'nao_verificado',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_status_idx on public.profiles (status);
create index if not exists profiles_verification_idx on public.profiles (verification_status);

-- ---------------------------------------------------------------------------
-- Credit products
-- ---------------------------------------------------------------------------
create table if not exists public.credit_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  description text not null,
  min_amount numeric(14,2) not null,
  max_amount numeric(14,2) not null,
  min_term integer not null,
  max_term integer not null,
  interest_rate numeric(6,3) not null,
  requirements text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Documents
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  doc_type text not null,
  status document_status not null default 'pendente',
  file_url text,
  notes text,
  reviewed_by uuid references public.profiles (id),
  uploaded_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_client_idx on public.documents (client_id);
create index if not exists documents_status_idx on public.documents (status);

-- ---------------------------------------------------------------------------
-- Loan applications
-- ---------------------------------------------------------------------------
create table if not exists public.loan_applications (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  client_id uuid not null references public.profiles (id) on delete restrict,
  product_id uuid not null references public.credit_products (id) on delete restrict,
  amount numeric(14,2) not null check (amount > 0),
  term integer not null check (term > 0),
  purpose text not null,
  status application_status not null default 'enviado',
  analyst_id uuid references public.profiles (id),
  decision_note text,
  monthly_payment numeric(14,2) not null default 0,
  total_payable numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists loan_applications_client_idx on public.loan_applications (client_id);
create index if not exists loan_applications_status_idx on public.loan_applications (status);

-- ---------------------------------------------------------------------------
-- Loans
-- ---------------------------------------------------------------------------
create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  application_id uuid unique references public.loan_applications (id) on delete set null,
  reference text not null unique,
  client_id uuid not null references public.profiles (id) on delete restrict,
  principal numeric(14,2) not null,
  total_payable numeric(14,2) not null,
  paid_amount numeric(14,2) not null default 0,
  balance numeric(14,2) not null,
  term integer not null,
  interest_rate numeric(6,3) not null,
  status loan_status not null default 'activo',
  disbursed_at timestamptz,
  next_due_date date,
  next_installment_amount numeric(14,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists loans_client_idx on public.loans (client_id);
create index if not exists loans_status_idx on public.loans (status);

-- ---------------------------------------------------------------------------
-- Installments
-- ---------------------------------------------------------------------------
create table if not exists public.installments (
  id uuid primary key default gen_random_uuid(),
  loan_id uuid not null references public.loans (id) on delete cascade,
  number integer not null,
  due_date date not null,
  amount numeric(14,2) not null,
  paid_amount numeric(14,2) not null default 0,
  status installment_status not null default 'pendente',
  paid_at timestamptz,
  unique (loan_id, number)
);

create index if not exists installments_loan_idx on public.installments (loan_id);
create index if not exists installments_due_idx on public.installments (due_date);

-- ---------------------------------------------------------------------------
-- Payments
-- ---------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  loan_id uuid not null references public.loans (id) on delete restrict,
  installment_id uuid references public.installments (id) on delete set null,
  amount numeric(14,2) not null check (amount > 0),
  method text not null,
  status payment_status not null default 'pendente',
  paid_at timestamptz not null default now(),
  confirmed_by uuid references public.profiles (id),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists payments_loan_idx on public.payments (loan_id);

-- ---------------------------------------------------------------------------
-- Disbursements
-- ---------------------------------------------------------------------------
create table if not exists public.disbursements (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.loan_applications (id) on delete cascade,
  loan_id uuid references public.loans (id) on delete set null,
  amount numeric(14,2) not null,
  method text not null default 'transferencia',
  status disbursement_status not null default 'pendente',
  confirmed_at timestamptz,
  confirmed_by uuid references public.profiles (id),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists disbursements_status_idx on public.disbursements (status);

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type notification_type not null,
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications (user_id, read);

-- ---------------------------------------------------------------------------
-- Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  actor_id uuid references public.profiles (id) on delete set null,
  actor_name text not null,
  target text not null,
  detail text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);

-- ---------------------------------------------------------------------------
-- Collection settings
-- ---------------------------------------------------------------------------
create table if not exists public.collection_settings (
  id integer primary key default 1 check (id = 1),
  grace_days integer not null default 3,
  daily_penalty_rate numeric(6,3) not null default 0.15,
  preferred_channel text not null default 'SMS + App',
  updated_at timestamptz not null default now()
);

insert into public.collection_settings (id) values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists documents_updated_at on public.documents;
create trigger documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

drop trigger if exists loan_applications_updated_at on public.loan_applications;
create trigger loan_applications_updated_at
before update on public.loan_applications
for each row execute function public.set_updated_at();

drop trigger if exists loans_updated_at on public.loans;
create trigger loans_updated_at
before update on public.loans
for each row execute function public.set_updated_at();

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'analista', 'gestor')
  );
$$;

create or replace function public.current_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Auto profile on signup (metadata: full_name, role, phone, ...)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, role, full_name, email, phone, address, id_document, profession, income, status
  ) values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'cliente'),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'id_document',
    new.raw_user_meta_data->>'profession',
    coalesce((new.raw_user_meta_data->>'income')::numeric, 0),
    coalesce((new.raw_user_meta_data->>'status')::profile_status, 'pendente')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Reference generator: KUK-YYYY-XXXX
create or replace function public.next_loan_reference()
returns text
language plpgsql
as $$
declare
  year_part text := to_char(now(), 'YYYY');
  seq int;
begin
  select count(*) + 1 into seq from public.loan_applications
  where extract(year from created_at) = extract(year from now());
  return 'KUK-' || year_part || '-' || lpad(seq::text, 4, '0');
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.credit_products enable row level security;
alter table public.documents enable row level security;
alter table public.loan_applications enable row level security;
alter table public.loans enable row level security;
alter table public.installments enable row level security;
alter table public.payments enable row level security;
alter table public.disbursements enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.collection_settings enable row level security;

-- Profiles
drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff" on public.profiles
for select using (auth.uid() = id or public.is_staff());

drop policy if exists "profiles_update_own_or_staff" on public.profiles;
create policy "profiles_update_own_or_staff" on public.profiles
for update using (auth.uid() = id or public.is_staff());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id or public.is_staff());

-- Products (public read)
drop policy if exists "products_public_read" on public.credit_products;
create policy "products_public_read" on public.credit_products
for select using (active = true or public.is_staff());

drop policy if exists "products_staff_write" on public.credit_products;
create policy "products_staff_write" on public.credit_products
for all using (public.is_staff()) with check (public.is_staff());

-- Documents
drop policy if exists "documents_select" on public.documents;
create policy "documents_select" on public.documents
for select using (client_id = auth.uid() or public.is_staff());

drop policy if exists "documents_insert_own" on public.documents;
create policy "documents_insert_own" on public.documents
for insert with check (client_id = auth.uid() or public.is_staff());

drop policy if exists "documents_update" on public.documents;
create policy "documents_update" on public.documents
for update using (client_id = auth.uid() or public.is_staff());

-- Applications
drop policy if exists "applications_select" on public.loan_applications;
create policy "applications_select" on public.loan_applications
for select using (client_id = auth.uid() or public.is_staff());

drop policy if exists "applications_insert_own" on public.loan_applications;
create policy "applications_insert_own" on public.loan_applications
for insert with check (client_id = auth.uid() or public.is_staff());

drop policy if exists "applications_update" on public.loan_applications;
create policy "applications_update" on public.loan_applications
for update using (client_id = auth.uid() or public.is_staff());

-- Loans
drop policy if exists "loans_select" on public.loans;
create policy "loans_select" on public.loans
for select using (client_id = auth.uid() or public.is_staff());

drop policy if exists "loans_staff_write" on public.loans;
create policy "loans_staff_write" on public.loans
for all using (public.is_staff()) with check (public.is_staff());

-- Installments
drop policy if exists "installments_select" on public.installments;
create policy "installments_select" on public.installments
for select using (
  exists (
    select 1 from public.loans l
    where l.id = loan_id and (l.client_id = auth.uid() or public.is_staff())
  )
);

drop policy if exists "installments_staff_write" on public.installments;
create policy "installments_staff_write" on public.installments
for all using (public.is_staff()) with check (public.is_staff());

-- Payments
drop policy if exists "payments_select" on public.payments;
create policy "payments_select" on public.payments
for select using (
  exists (
    select 1 from public.loans l
    where l.id = loan_id and (l.client_id = auth.uid() or public.is_staff())
  )
);

drop policy if exists "payments_insert" on public.payments;
create policy "payments_insert" on public.payments
for insert with check (
  exists (
    select 1 from public.loans l
    where l.id = loan_id and (l.client_id = auth.uid() or public.is_staff())
  )
);

drop policy if exists "payments_update_staff" on public.payments;
create policy "payments_update_staff" on public.payments
for update using (public.is_staff());

-- Disbursements
drop policy if exists "disbursements_staff" on public.disbursements;
create policy "disbursements_staff" on public.disbursements
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "disbursements_client_read" on public.disbursements;
create policy "disbursements_client_read" on public.disbursements
for select using (
  exists (
    select 1 from public.loan_applications a
    where a.id = application_id and a.client_id = auth.uid()
  )
);

-- Notifications
drop policy if exists "notifications_own" on public.notifications;
create policy "notifications_own" on public.notifications
for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
for update using (user_id = auth.uid() or public.is_staff());

drop policy if exists "notifications_insert_staff" on public.notifications;
create policy "notifications_insert_staff" on public.notifications
for insert with check (public.is_staff() or user_id = auth.uid());

-- Audit
drop policy if exists "audit_staff_read" on public.audit_logs;
create policy "audit_staff_read" on public.audit_logs
for select using (public.is_staff());

drop policy if exists "audit_staff_insert" on public.audit_logs;
create policy "audit_insert_authenticated" on public.audit_logs
for insert with check (auth.uid() is not null);

-- Collection settings
drop policy if exists "collection_read" on public.collection_settings;
create policy "collection_read" on public.collection_settings
for select using (public.is_staff());

drop policy if exists "collection_staff_write" on public.collection_settings;
create policy "collection_staff_write" on public.collection_settings
for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Seed products (idempotent by slug)
-- ---------------------------------------------------------------------------
insert into public.credit_products (slug, name, description, min_amount, max_amount, min_term, max_term, interest_rate, requirements)
values
  (
    'negocio',
    'Crédito Negócio',
    'Financiamento para reforço de capital de giro, stock e expansão de pequenos negócios.',
    50000, 2500000, 3, 24, 2.5,
    array['Documento de identificação válido','Comprovativo de actividade','Comprovativo de morada','Extratos ou registo de vendas']
  ),
  (
    'pessoal',
    'Crédito Pessoal',
    'Solução ágil para necessidades pessoais urgentes, com análise transparente e prazos flexíveis.',
    25000, 750000, 2, 18, 2.8,
    array['Documento de identificação válido','Comprovativo de rendimento','Comprovativo de morada']
  ),
  (
    'agricola',
    'Crédito Agrícola',
    'Apoio a produtores e cooperativas para insumos, equipamentos e campanhas sazonais.',
    100000, 5000000, 6, 36, 2.2,
    array['Documento de identificação válido','Comprovativo de exploração agrícola','Plano de utilização do crédito']
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  min_amount = excluded.min_amount,
  max_amount = excluded.max_amount,
  min_term = excluded.min_term,
  max_term = excluded.max_term,
  interest_rate = excluded.interest_rate,
  requirements = excluded.requirements,
  active = true;
