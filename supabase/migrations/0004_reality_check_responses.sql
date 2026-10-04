-- The Aperture Method: Clarity Check responses (Oct 2026).
--
-- One row per finished Clarity Check, anonymous by design. Feeds the EMBA
-- capstone study (cohort = 'study', from /reality-check/study) and keeps the
-- public quiz's completions too (cohort = 'site'), so the two can be compared
-- without ever being mixed.
--
-- NOTHING here identifies a person: no name, email, company, IP or full ZIP.
-- Emails for the benchmark report live in a SEPARATE table with no key back to
-- this one. Keep it that way; the page promises it.
--
-- Written only by the server (service role). RLS is on with no policies, so
-- the anon key can neither read nor write.
--
-- Run: Supabase Dashboard -> SQL Editor -> paste -> Run. Safe to run twice.

create table if not exists public.reality_check_responses (
  run_id           uuid primary key,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  cohort           text not null default 'site' check (cohort in ('site', 'study')),
  source           text,
  medium           text,
  campaign         text,
  question_count   int  not null,
  answers          jsonb not null,
  score            int  not null check (score between 0 and 100),
  band             text not null,
  gaps             int  not null,
  blind_spot       text,
  self_rating      int  check (self_rating between 1 and 10),
  duration_s       int,
  repeat_taker     boolean not null default false,
  profile_done     boolean not null default false,
  revenue          text,
  employees        text,
  industry         text,
  role             text,
  years            text,
  region           text,
  zip3             text check (zip3 ~ '^[0-9]{3}$'),
  analysis_source  text,
  wtp              text
);

create index if not exists reality_check_responses_cohort_idx
  on public.reality_check_responses (cohort, created_at desc);

alter table public.reality_check_responses enable row level security;

create table if not exists public.reality_check_study_optins (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  email       text not null unique
);
alter table public.reality_check_study_optins enable row level security;

-- Clean study sample: finished in a believable time, first attempt only.
-- This is what the capstone counts. Raw rows stay in the table for audit.
create or replace view public.v_rc_study_clean
  with (security_invoker = true) as
select *,
       (self_rating * 10) - score as overconfidence  -- self-rating on the same 0-100 scale, minus measured
from public.reality_check_responses
where cohort = 'study'
  and not repeat_taker
  and coalesce(duration_s, 9999) >= 45;

-- Headline numbers, one row. Paste into the capstone; label n.
create or replace view public.v_rc_study_summary
  with (security_invoker = true) as
select
  count(*)                                                    as n,
  round(avg(score), 1)                                        as mean_clarity,
  percentile_cont(0.5) within group (order by score)          as median_clarity,
  round(avg(self_rating * 10), 1)                             as mean_self_rating_x10,
  round(avg(overconfidence), 1)                               as mean_overconfidence,
  round(100.0 * avg((overconfidence > 0)::int), 1)            as pct_overconfident,
  round(avg(gaps), 1)                                         as mean_gaps,
  -- H1: share with no access to decision-grade analysis, among $1-20M firms
  round(100.0 * avg((analysis_source in ('no-one', 'bookkeeper-cpa', 'software-only'))::int)
        filter (where revenue in ('1-5m', '5-20m')), 1)       as h1_pct_no_analysis_1_20m,
  count(*) filter (where revenue in ('1-5m', '5-20m'))        as n_1_20m,
  -- H2: share who would pay $3,000 or more
  round(100.0 * avg((wtp in ('3000-4500', '4500-7500', 'over-7500'))::int)
        filter (where wtp is not null), 1)                    as h2_pct_pay_3000_plus
from public.v_rc_study_clean;

-- Which questions owners cannot answer: % scoring 0 or 1 on each.
create or replace view public.v_rc_study_by_question
  with (security_invoker = true) as
select q.key as question,
       count(*) as n,
       round(100.0 * avg(((q.value)::int <= 1)::int), 1) as pct_cannot_answer
from public.v_rc_study_clean r
cross join lateral jsonb_each_text(r.answers) q
group by q.key
order by pct_cannot_answer desc;

-- Views would otherwise be reachable through the public API with the anon key.
-- security_invoker makes them obey the table's RLS; the revokes make it explicit.
revoke all on public.reality_check_responses, public.reality_check_study_optins,
              public.v_rc_study_clean, public.v_rc_study_summary, public.v_rc_study_by_question
  from anon, authenticated;
