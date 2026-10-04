-- Reality Check study: manual exclusions from the dashboard (Oct 2026).
-- The Exclude button on /method-lab/study writes a reason here; Restore clears it.
-- Rows are never deleted, so the report can state what was removed and why.
-- Run once: Supabase Dashboard -> SQL Editor -> paste -> Run. Safe to run twice.

alter table public.reality_check_responses add column if not exists excluded_reason text;
