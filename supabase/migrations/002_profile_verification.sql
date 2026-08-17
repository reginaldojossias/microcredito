-- Verificação de perfil do cliente (KYC)
-- Executar após 001_schema.sql

do $$ begin
  create type verification_status as enum (
    'nao_verificado',
    'em_analise',
    'verificado',
    'rejeitado'
  );
exception when duplicate_object then null; end $$;

alter table public.profiles
  add column if not exists verification_status verification_status not null default 'nao_verificado';

alter table public.profiles
  add column if not exists id_document_type text;

alter table public.profiles
  add column if not exists date_of_birth date;

alter table public.profiles
  add column if not exists province text;

alter table public.profiles
  add column if not exists district text;

alter table public.profiles
  add column if not exists neighborhood text;

create index if not exists profiles_verification_idx
  on public.profiles (verification_status);

-- Clientes já activos passam a verificados (dados demo / existentes)
update public.profiles
set verification_status = 'verificado'
where status = 'activo'
  and verification_status = 'nao_verificado'
  and role = 'cliente';

-- Storage para documentos de identidade
insert into storage.buckets (id, name, public)
values ('client-documents', 'client-documents', false)
on conflict (id) do nothing;

drop policy if exists "client_docs_select_own_or_staff" on storage.objects;
create policy "client_docs_select_own_or_staff" on storage.objects
for select using (
  bucket_id = 'client-documents'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_staff()
  )
);

drop policy if exists "client_docs_insert_own" on storage.objects;
create policy "client_docs_insert_own" on storage.objects
for insert with check (
  bucket_id = 'client-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "client_docs_update_own_or_staff" on storage.objects;
create policy "client_docs_update_own_or_staff" on storage.objects
for update using (
  bucket_id = 'client-documents'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_staff()
  )
);

drop policy if exists "client_docs_delete_own_or_staff" on storage.objects;
create policy "client_docs_delete_own_or_staff" on storage.objects
for delete using (
  bucket_id = 'client-documents'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_staff()
  )
);
