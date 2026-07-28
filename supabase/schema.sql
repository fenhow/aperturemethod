-- =============================================================================
-- The Aperture Method — client portal schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query →
-- paste → Run. Safe to re-run (idempotent).
-- =============================================================================

-- ---------- Profiles: one row per authenticated user -------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  company    text,
  role       text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Is the current request an admin? (SECURITY DEFINER bypasses RLS to avoid
-- recursive policy evaluation.)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "profiles_read" on public.profiles;
create policy "profiles_read" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid());

-- Auto-create a profile whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Documents: metadata for each stored file -------------------------
create table if not exists public.documents (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references public.profiles (id) on delete cascade,
  name         text not null,
  path         text not null unique,
  size         bigint,
  content_type text,
  uploaded_by  uuid references public.profiles (id),
  created_at   timestamptz not null default now()
);

alter table public.documents enable row level security;

drop policy if exists "documents_read" on public.documents;
create policy "documents_read" on public.documents
  for select using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "documents_insert_admin" on public.documents;
create policy "documents_insert_admin" on public.documents
  for insert with check (public.is_admin());

drop policy if exists "documents_update_admin" on public.documents;
create policy "documents_update_admin" on public.documents
  for update using (public.is_admin());

drop policy if exists "documents_delete_admin" on public.documents;
create policy "documents_delete_admin" on public.documents
  for delete using (public.is_admin());

-- ---------- Storage: a private bucket, files under a per-owner folder ---------
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Files are stored at "<owner_id>/<uuid>.<ext>". A client may read only files in
-- their own folder; the admin may read, write, and delete everything.
drop policy if exists "storage_read" on storage.objects;
create policy "storage_read" on storage.objects
  for select using (
    bucket_id = 'documents'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

drop policy if exists "storage_insert_admin" on storage.objects;
create policy "storage_insert_admin" on storage.objects
  for insert with check (bucket_id = 'documents' and public.is_admin());

drop policy if exists "storage_delete_admin" on storage.objects;
create policy "storage_delete_admin" on storage.objects
  for delete using (bucket_id = 'documents' and public.is_admin());

-- =============================================================================
-- After you sign in once at /portal/login, make yourself the admin by running:
--   update public.profiles set role = 'admin' where email = 'YOUR-EMAIL-HERE';
-- =============================================================================
