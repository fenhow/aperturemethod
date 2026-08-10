-- The Aperture Method — onboarding schema.
--
-- This did not exist in the repository. Every table below was created by hand in the
-- Supabase dashboard, which meant a clean clone could not run save-and-resume and nobody
-- could verify the token column was actually unguessable. Committing it makes the
-- environment reproducible and the security property auditable.
--
-- Run:  supabase db push        (or paste into the SQL editor)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- drafts
-- A partially-completed intake. Long-form: an owner fills this over several sittings,
-- so losing one is a serious business failure.
create table if not exists public.intake_drafts (
  token        uuid primary key default gen_random_uuid(),
  email        text,
  company      text,
  signer_name  text,
  segments     jsonb not null default '[]'::jsonb,
  answers      jsonb not null default '{}'::jsonb,
  completed    boolean not null default false,
  document_id  uuid,
  owner_id     uuid,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- abandoned drafts hold revenue, payroll, ownership and named staff. They should not
  -- live forever, and a token pulled from an old inbox should stop working.
  expires_at   timestamptz not null default now() + interval '180 days'
);

create index if not exists intake_drafts_email_idx      on public.intake_drafts (email);
create index if not exists intake_drafts_expires_idx    on public.intake_drafts (expires_at);
create index if not exists intake_drafts_incomplete_idx on public.intake_drafts (completed)
  where completed = false;

-- updated_at is the concurrency token: the app should send the value it last saw and
-- refuse the write if it has moved, so two open tabs cannot clobber each other.
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists intake_drafts_touch on public.intake_drafts;
create trigger intake_drafts_touch
  before update on public.intake_drafts
  for each row execute function public.touch_updated_at();

-- Service-role only. There is no login on this flow — possession of the token is the
-- entire authorisation model — so anon must never reach the table directly.
alter table public.intake_drafts enable row level security;
-- (deliberately no anon/authenticated policy: all access goes through the server route)

-- ----------------------------------------------------------- submissions
create table if not exists public.onboarding_submissions (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null,
  email        text,
  company      text,
  signer_name  text,
  payload      jsonb not null default '{}'::jsonb,
  document_id  uuid,
  owner_id     uuid,
  created_at   timestamptz not null default now()
);
alter table public.onboarding_submissions enable row level security;

-- -------------------------------------------------------------- documents
create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid,
  kind        text not null,
  title       text,
  storage_path text not null,
  created_at  timestamptz not null default now()
);
alter table public.documents enable row level security;

-- Clients may read only their own documents.
drop policy if exists documents_own on public.documents;
create policy documents_own on public.documents
  for select to authenticated using (owner_id = auth.uid());

-- ---------------------------------------------------------------- storage
-- Private bucket for generated intake and agreement PDFs.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------- hygiene
-- Purge expired drafts and long-completed ones. Schedule via pg_cron or an edge function.
create or replace function public.purge_stale_intake_drafts() returns integer
language plpgsql security definer as $$
declare n integer;
begin
  delete from public.intake_drafts
   where expires_at < now()
      or (completed = true and updated_at < now() - interval '90 days');
  get diagnostics n = row_count;
  return n;
end $$;
