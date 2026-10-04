-- Reality Check study: manual exclusions from the dashboard (Oct 2026).
-- The Exclude button on /method-lab/study writes a reason here; Restore clears it.
-- Rows are never deleted, so the report can state what was removed and why.
-- Run once: Supabase Dashboard -> SQL Editor -> paste -> Run. Safe to run twice.

alter table public.reality_check_responses add column if not exists excluded_reason text;

-- The candour question at the end of the optional profile (Oct 2026).
alter table public.reality_check_responses add column if not exists candor text;

-- Which version of the price question a row answered (Oct 2026). Null = version 1
-- (asked in the profile, before the result, service undescribed). 2 = asked after
-- the result with the service described. H2 is read from version 2 only.
alter table public.reality_check_responses add column if not exists wtp_version int;
