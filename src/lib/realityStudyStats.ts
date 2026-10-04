import "server-only";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { questions, bands } from "@/lib/realityCheck";
import { studyFields, STUDY_TARGET, type StudyFieldId } from "@/lib/realityStudy";
import { anova, correlation, marginOfError, meanTest, proportionTest, wilson, type Anova } from "@/lib/stats";

/**
 * Everything the /admin/study dashboard shows, computed from the raw rows.
 *
 * The CLEAN sample is what the capstone counts: cohort 'study', first attempt
 * only, finished in 45 seconds or more, and not tagged as a test. Rows that fail
 * those rules are kept in the database and counted here as exclusions, so the
 * report can say exactly what was left out and why.
 */

export const MIN_SECONDS = 45;
/** Below this, a percentage is shown but flagged as too early to read. */
export const MIN_N_TO_READ = 30;

export type StudyRow = {
  run_id: string;
  created_at: string;
  /** Last change: the second ping, or an Exclude / Restore from the dashboard. */
  updated_at?: string;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  answers: Record<string, number>;
  score: number;
  band: string;
  gaps: number;
  blind_spot: string | null;
  self_rating: number | null;
  duration_s: number | null;
  repeat_taker: boolean;
  profile_done: boolean;
  zip3: string | null;
  /** Set by Fenwick from the dashboard (Exclude button). Null = counted. */
  excluded_reason?: string | null;
} & Partial<Record<StudyFieldId, string | null>>;

export type Count = { key: string; label: string; n: number; pct: number; avgScore: number | null };

/** H1's falsification line and H2's, as registered in the capstone plan. */
export const H1_THRESHOLD = 40;
export const H2_THRESHOLD = 50;
const PAY_3000 = ["3000-4500", "4500-7500", "over-7500"];
const PAY_4500 = ["4500-7500", "over-7500"];

const isTest = (r: StudyRow) => (r.source ?? "").startsWith("test");

/** The reasons offered by the dashboard's Exclude button. */
export const EXCLUDE_REASONS = [
  "My own test",
  "Not a business owner or manager",
  "Duplicate response",
  "Not a serious answer",
  "Other",
] as const;

export function exclusionReason(r: StudyRow): string | null {
  if (r.excluded_reason) return `Removed: ${r.excluded_reason}`;
  if (isTest(r)) return "Tagged as a test";
  if (r.repeat_taker) return "Repeat attempt";
  if (r.duration_s !== null && r.duration_s < MIN_SECONDS) return `Under ${MIN_SECONDS} seconds`;
  return null;
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const median = (xs: number[]) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
};
const pct = (n: number, d: number) => (d ? (100 * n) / d : 0);

function countBy(rows: StudyRow[], key: StudyFieldId): Count[] {
  const field = studyFields.find((f) => f.id === key)!;
  const answered = rows.filter((r) => r[key]);
  return field.options.map((o) => {
    const hit = answered.filter((r) => r[key] === o.value);
    return {
      key: o.value,
      label: o.label,
      n: hit.length,
      pct: pct(hit.length, answered.length),
      avgScore: mean(hit.map((r) => r.score)),
    };
  });
}

export async function loadStudy(filter: { revenue?: string; industry?: string; source?: string }) {
  if (!serviceRoleConfigured) return null;
  const { data, error } = await createAdminClient()
    .from("reality_check_responses")
    .select("*")
    .eq("cohort", "study")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) throw new Error(error.message);
  const all = (data ?? []) as StudyRow[];

  const { count: optins } = await createAdminClient()
    .from("reality_check_study_optins")
    .select("id", { count: "exact", head: true });

  return computeStudy(all, optins ?? 0, filter);
}

/** Pure computation, separate from the database read so it can be tested. */
export function computeStudy(
  all: StudyRow[],
  optins: number,
  filter: { revenue?: string; industry?: string; source?: string }
) {

  const exclusions = new Map<string, number>();
  const cleanAll: StudyRow[] = [];
  for (const r of all) {
    const why = exclusionReason(r);
    if (why) exclusions.set(why, (exclusions.get(why) ?? 0) + 1);
    else cleanAll.push(r);
  }

  // Optional segment filter, applied to the clean sample only.
  const rows = cleanAll.filter(
    (r) =>
      (!filter.revenue || r.revenue === filter.revenue) &&
      (!filter.industry || r.industry === filter.industry) &&
      (!filter.source || (r.source ?? "direct") === filter.source)
  );
  const n = rows.length;
  const scores = rows.map((r) => r.score);
  const rated = rows.filter((r) => r.self_rating !== null);
  const gapsPerRated = rated.map((r) => r.self_rating! * 10 - r.score);

  // Per question: share who could not answer with confidence (scored 0 or 1).
  const byQuestion = questions
    .map((q) => {
      const answered = rows.filter((r) => typeof r.answers?.[q.id] === "number");
      const cannot = answered.filter((r) => r.answers[q.id]! <= 1).length;
      return { id: q.id, area: q.area, prompt: q.prompt, n: answered.length, pct: pct(cannot, answered.length), ci: wilson(cannot, answered.length) };
    })
    .sort((a, b) => b.pct - a.pct);

  const blindSpots = questions
    .map((q) => ({ id: q.id, area: q.area, n: rows.filter((r) => r.blind_spot === q.id).length }))
    .filter((b) => b.n > 0)
    .sort((a, b) => b.n - a.n);

  const bandCounts = bands.map((b) => ({
    name: b.name,
    n: rows.filter((r) => r.band === b.name).length,
    pct: pct(rows.filter((r) => r.band === b.name).length, n),
  }));

  const histogram = Array.from({ length: 10 }, (_, i) => {
    const lo = i * 10;
    const hi = i === 9 ? 100 : lo + 9;
    return { label: `${lo}–${hi}`, n: scores.filter((s) => s >= lo && s <= hi).length };
  });

  // H1: $1–20M firms with no access to decision-grade analysis.
  const h1Pool = rows.filter((r) => (r.revenue === "1-5m" || r.revenue === "5-20m") && r.analysis_source);
  const h1Hit = h1Pool.filter((r) => ["no-one", "bookkeeper-cpa", "software-only"].includes(r.analysis_source!));
  // H2: would pay $3,000 or more.
  const h2Pool = rows.filter((r) => r.wtp);
  const h2Hit = h2Pool.filter((r) => PAY_3000.includes(r.wtp!));
  const h2Price = h2Pool.filter((r) => PAY_4500.includes(r.wtp!));

  // Does the average score genuinely differ between groups, or is it chance?
  const groupTest = (key: StudyFieldId): Anova | null => {
    const field = studyFields.find((f) => f.id === key)!;
    return anova(
      field.options
        .filter((o) => o.value !== "prefer-not")
        .map((o) => rows.filter((r) => r[key] === o.value).map((r) => r.score))
    );
  };
  const overconfidentN = gapsPerRated.filter((g) => g > 0).length;

  const sources = new Map<string, number>();
  for (const r of cleanAll) sources.set(r.source ?? "direct", (sources.get(r.source ?? "direct") ?? 0) + 1);

  return {
    target: STUDY_TARGET,
    totalRows: all.length,
    cleanTotal: cleanAll.length,
    exclusions: [...exclusions.entries()].map(([reason, count]) => ({ reason, count })),
    optins,
    n,
    filtered: Boolean(filter.revenue || filter.industry || filter.source),
    meanScore: mean(scores),
    medianScore: median(scores),
    meanSelf: mean(rated.map((r) => r.self_rating! * 10)),
    meanOverconfidence: mean(gapsPerRated),
    pctOverconfident: pct(gapsPerRated.filter((g) => g > 0).length, gapsPerRated.length),
    nRated: rated.length,
    meanGaps: mean(rows.map((r) => r.gaps)),
    profileRate: pct(rows.filter((r) => r.profile_done).length, n),
    scatter: rated.map((r) => ({ self: r.self_rating!, score: r.score })),
    byQuestion,
    blindSpots,
    bandCounts,
    histogram,
    h1: proportionTest(h1Hit.length, h1Pool.length, H1_THRESHOLD),
    h2: proportionTest(h2Hit.length, h2Pool.length, H2_THRESHOLD),
    h2AtPrice: { n: h2Pool.length, pct: pct(h2Price.length, h2Pool.length), ci: wilson(h2Price.length, h2Pool.length) },
    stats: {
      moe: marginOfError(n),
      moeAtTarget: marginOfError(STUDY_TARGET),
      meanScore: meanTest(scores),
      overconfidence: meanTest(gapsPerRated),
      overconfidentCi: wilson(overconfidentN, gapsPerRated.length),
      correlation: correlation(rated.map((r) => r.self_rating! * 10), rated.map((r) => r.score)),
      groups: {
        revenue: groupTest("revenue"),
        employees: groupTest("employees"),
        industry: groupTest("industry"),
        role: groupTest("role"),
        years: groupTest("years"),
        region: groupTest("region"),
        analysis_source: groupTest("analysis_source"),
        wtp: groupTest("wtp"),
        candor: groupTest("candor"),
      } as Record<StudyFieldId, Anova | null>,
    },
    profile: {
      revenue: countBy(rows, "revenue"),
      employees: countBy(rows, "employees"),
      industry: countBy(rows, "industry"),
      role: countBy(rows, "role"),
      years: countBy(rows, "years"),
      region: countBy(rows, "region"),
      analysis_source: countBy(rows, "analysis_source"),
      wtp: countBy(rows, "wtp"),
      candor: countBy(rows, "candor"),
    },
    sources: [...sources.entries()].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
    recent: all.map((r) => ({ ...r, excluded: exclusionReason(r) })),
  };
}

export type StudyStats = ReturnType<typeof computeStudy>;
