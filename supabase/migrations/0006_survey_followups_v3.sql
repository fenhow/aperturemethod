-- Clarity Check survey, version 3 follow-ups (6 Oct 2026).
-- The price question is retired. After the result, respondents now answer two
-- research questions about help in general (no brand, no price, no email):
--   need       how much an outside view of their numbers would help right now
--   help_pref  which kind of help would suit them best
-- Capstone H2 is read from these. Earlier price answers (wtp) are kept as is.
-- Run once: Supabase Dashboard -> SQL Editor -> paste -> Run. Safe to run twice.

alter table public.reality_check_responses add column if not exists need text;
alter table public.reality_check_responses add column if not exists help_pref text;
alter table public.reality_check_responses add column if not exists followup_version int;
