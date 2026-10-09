-- The Aperture Method — book pre-orders ("Look Closer").
--
-- Before this table, a pre-order went nowhere durable: the form posted to
-- /api/newsletter, which forwarded to NEWSLETTER_WEBHOOK_URL if that env var was
-- set and otherwise just console.info'd the address into the Vercel log, where
-- it ages out. Anyone who reserved a copy was effectively lost. This is the
-- durable list.
--
-- WHAT IS STORED: an email address, an optional name, whether the person says
-- they are in a Mays MBA cohort (they read free), which page they signed up
-- from, and the date and time. Nothing else — no IP, no tracking.
--
-- One row per address: signing up twice updates the row rather than making a
-- second one, so the list stays a mailing list and `created_at` keeps saying
-- when they first asked.
--
-- SAFE TO RUN ON AN EXISTING DATABASE — every statement is idempotent.
--
-- Run:  Supabase Dashboard -> SQL Editor -> paste -> Run
--   or: supabase db push

create extension if not exists "pgcrypto";

create table if not exists public.book_preorders (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  name         text,
  mays_cohort  boolean not null default false,
  source       text not null default 'book',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Bring a hand-made table up to spec; `create table if not exists` silently
-- skips an existing one, so these ALTERs are what matter on a second run.
alter table public.book_preorders add column if not exists email       text;
alter table public.book_preorders add column if not exists name        text;
alter table public.book_preorders add column if not exists mays_cohort boolean not null default false;
alter table public.book_preorders add column if not exists source      text not null default 'book';
alter table public.book_preorders add column if not exists created_at  timestamptz not null default now();
alter table public.book_preorders add column if not exists updated_at  timestamptz not null default now();

-- The upsert target. Addresses are lowercased by the route before they arrive,
-- so a plain unique index is enough and ON CONFLICT (email) can use it.
create unique index if not exists book_preorders_email_idx on public.book_preorders (email);
create index if not exists book_preorders_created_idx on public.book_preorders (created_at desc);
create index if not exists book_preorders_mays_idx on public.book_preorders (mays_cohort) where mays_cohort;

-- Row-Level Security ON with NO policies: the anon key can read nothing even if
-- it leaks. Every write goes through /api/book/preorder, which holds the service
-- role and bypasses RLS. Read the list in the Supabase dashboard.
alter table public.book_preorders enable row level security;

-- Keep updated_at honest without trusting the client to send it.
create or replace function public.touch_book_preorders()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists book_preorders_touch on public.book_preorders;
create trigger book_preorders_touch
  before update on public.book_preorders
  for each row execute function public.touch_book_preorders();
