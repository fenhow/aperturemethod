-- The Aperture Method — Aperture Analytics workbench engagements.
--
-- The Financial Analysis Workbench had no persistence of any kind: close the tab
-- without exporting a .aperture.json and hours of normalisation work were gone.
-- This table is the durable side of that fix. The browser still autosaves locally
-- first — the server is for durability and for reopening an engagement on another
-- machine, not for the keystroke-by-keystroke path.
--
-- WHAT IS STORED HERE: client financial statements, normalisation add-backs and
-- valuation working. Treat it as client-confidential material and reflect it in
-- the engagement letter. Nothing is written unless the operator is inside the
-- Method Lab.
--
-- SAFE TO RUN ON AN EXISTING DATABASE — every statement is idempotent.
--
-- Run:  Supabase Dashboard -> SQL Editor -> paste -> Run
--   or: supabase db push

create extension if not exists "pgcrypto";

create table if not exists public.analytics_engagements (
  id             uuid primary key default gen_random_uuid(),
  slug           text,
  company        text,
  code           text,
  entity_status  text,
  release        text,
  analyst        text,
  state          jsonb not null default '{}'::jsonb,
  schema_version int not null default 1,
  archived       boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Bring a hand-made table up to spec; `create table if not exists` silently skips
-- an existing one, so these ALTERs are what actually matter on a second run.
alter table public.analytics_engagements add column if not exists slug           text;
alter table public.analytics_engagements add column if not exists company        text;
alter table public.analytics_engagements add column if not exists code           text;
alter table public.analytics_engagements add column if not exists entity_status  text;
alter table public.analytics_engagements add column if not exists release        text;
alter table public.analytics_engagements add column if not exists analyst        text;
alter table public.analytics_engagements add column if not exists state          jsonb not null default '{}'::jsonb;
alter table public.analytics_engagements add column if not exists schema_version int not null default 1;
alter table public.analytics_engagements add column if not exists archived       boolean not null default false;
alter table public.analytics_engagements add column if not exists created_at     timestamptz not null default now();
alter table public.analytics_engagements add column if not exists updated_at     timestamptz not null default now();

create index if not exists analytics_engagements_updated_idx
  on public.analytics_engagements (updated_at desc);
create index if not exists analytics_engagements_company_idx
  on public.analytics_engagements (company);

-- Row-Level Security ON with NO policies. The anon key can therefore read nothing,
-- even if it leaks; every access goes through a server route holding the service
-- role, which bypasses RLS and is itself gated by the Method Lab passphrase.
alter table public.analytics_engagements enable row level security;

-- Keep updated_at honest without trusting the client to send it.
create or replace function public.touch_analytics_engagements()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists analytics_engagements_touch on public.analytics_engagements;
create trigger analytics_engagements_touch
  before update on public.analytics_engagements
  for each row execute function public.touch_analytics_engagements();
