-- The Aperture Method — data request tracking.
--
-- Stores the personalised "what we still need" list alongside each intake, so a stalled
-- engagement is visible rather than remembered. Safe to run more than once.
--
-- Run: Supabase Dashboard -> SQL Editor -> paste -> Run

alter table public.intake_drafts
  add column if not exists data_request jsonb not null default '[]'::jsonb;

alter table public.onboarding_submissions
  add column if not exists data_request jsonb not null default '[]'::jsonb;

-- Item status, and why the distinction matters:
--   outstanding — never mentioned, or ticked as unavailable
--   provided    — the CLIENT said they can share it. An intention, not an arrival.
--   received    — FENWICK confirmed the file is in hand. Only ever set by you.
--   waived      — agreed it is not needed for this engagement.
--
-- Keeping "provided" and "received" apart is the whole point. "They said they'd send it"
-- and "we have it" are different facts, and a phase that starts on the first one is a phase
-- that stalls two weeks in.

-- One row per outstanding item, newest engagements first. This is what an admin view reads.
create or replace view public.v_data_request_outstanding as
select
  d.token,
  d.company,
  d.email,
  d.signer_name,
  d.completed,
  d.updated_at,
  item ->> 'id'       as item_id,
  item ->> 'label'    as item_label,
  item ->> 'priority' as priority,
  item ->> 'status'   as status
from public.intake_drafts d
cross join lateral jsonb_array_elements(d.data_request) as item
where item ->> 'status' in ('outstanding', 'provided')
order by d.updated_at desc,
         case item ->> 'priority' when 'blocking' then 0 else 1 end;

-- One row per engagement: how much is still missing. The chase list.
create or replace view public.v_data_request_summary as
select
  d.token,
  coalesce(nullif(d.company, ''), d.email, 'Unnamed')                            as client,
  d.completed,
  d.updated_at,
  count(*) filter (where item ->> 'status' = 'outstanding')                      as outstanding,
  count(*) filter (where item ->> 'status' = 'outstanding'
                     and item ->> 'priority' = 'blocking')                       as blocking,
  count(*) filter (where item ->> 'status' = 'provided')                         as promised,
  count(*) filter (where item ->> 'status' = 'received')                         as received,
  count(*)                                                                        as total
from public.intake_drafts d
left join lateral jsonb_array_elements(d.data_request) as item on true
group by d.token, d.company, d.email, d.completed, d.updated_at
order by blocking desc, outstanding desc, d.updated_at desc;

-- Mark an item received (or waived). Call from an admin action; service-role only.
create or replace function public.set_data_item_status(
  p_token uuid,
  p_item_id text,
  p_status text
) returns jsonb
language plpgsql security definer as $$
declare updated jsonb;
begin
  if p_status not in ('outstanding', 'provided', 'received', 'waived') then
    raise exception 'invalid status: %', p_status;
  end if;

  select jsonb_agg(
           case when item ->> 'id' = p_item_id
                then jsonb_set(item, '{status}', to_jsonb(p_status))
                else item end)
    into updated
    from public.intake_drafts d
    cross join lateral jsonb_array_elements(d.data_request) as item
   where d.token = p_token;

  if updated is null then
    raise exception 'no draft or no items for token %', p_token;
  end if;

  update public.intake_drafts set data_request = updated where token = p_token;
  return updated;
end $$;

-- ------------------------------------------------------------------ verify
-- After running, this should list every engagement with something outstanding:
--
--   select * from public.v_data_request_summary;
--
-- And to see the detail for one client:
--
--   select item_label, priority, status
--     from public.v_data_request_outstanding
--    where token = 'paste-token-here';
--
-- To mark something as actually received:
--
--   select public.set_data_item_status('paste-token-here', 'transactions', 'received');
