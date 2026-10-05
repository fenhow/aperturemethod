import "server-only";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { bands, questions } from "@/lib/realityCheck";
import { wilson, type Interval } from "@/lib/stats";
import { MIN_SECONDS, type StudyRow } from "@/lib/realityStudyStats";

/**
 * The website Clarity Check (/clarity-check, cohort 'site'), read as marketing
 * and demand data. Kept entirely apart from the capstone survey: the website
 * version has no honesty commitment, no profile and no price question, so its
 * rows never enter the study figures, and the study's rows never enter these.
 *
 * Counted means: not removed from the dashboard, not tagged as a test, and
 * finished in at least MIN_SECONDS (the same speed rule as the survey).
 */

export type SiteRow = StudyRow;

export type SiteStats = {
  totalRows: number;
  n: number;
  exclusions: { reason: string; count: number }[];
  last7: number;
  last30: number;
  weekly: { label: string; n: number }[];
  meanScore: number | null;
  medianScore: number | null;
  meanGaps: number | null;
  medianSeconds: number | null;
  histogram: { label: string; n: number }[];
  bandCounts: { name: string; n: number; pct: number }[];
  byQuestion: { id: string; area: string; prompt: string; n: number; pct: number; ci: Interval | null }[];
  blindSpots: { id: string; area: string; n: number }[];
  sources: { source: string | null; count: number }[];
  recent: (SiteRow & { excluded: string | null })[];
};

export function siteExclusion(r: SiteRow): string | null {
  if (r.excluded_reason) return `Removed: ${r.excluded_reason}`;
  if ((r.source ?? "").startsWith("test")) return "Tagged as a test";
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
const DAY = 86_400_000;

/** Monday of the week containing `t`, in Central time, as a short label. */
function weekStart(t: number): number {
  const ct = new Date(new Date(t).toLocaleString("en-US", { timeZone: "America/Chicago" }));
  const dow = (ct.getDay() + 6) % 7;
  ct.setHours(0, 0, 0, 0);
  return ct.getTime() - dow * DAY;
}

export function computeSite(all: SiteRow[], now = Date.now()): SiteStats {
  const tagged = all.map((r) => ({ ...r, excluded: siteExclusion(r) }));
  const rows = tagged.filter((r) => !r.excluded);
  const n = rows.length;
  const scores = rows.map((r) => r.score);

  const exMap = new Map<string, number>();
  for (const r of tagged) {
    if (!r.excluded) continue;
    const key = r.excluded.startsWith("Removed") ? "Removed by you" : r.excluded;
    exMap.set(key, (exMap.get(key) ?? 0) + 1);
  }

  const time = (r: SiteRow) => new Date(r.created_at).getTime();
  const thisWeek = weekStart(now);
  const weekly = Array.from({ length: 12 }, (_, i) => {
    const start = thisWeek - (11 - i) * 7 * DAY;
    const label = new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { label, n: rows.filter((r) => weekStart(time(r)) === start).length };
  });

  const byQuestion = questions
    .map((q) => {
      const answered = rows.filter((r) => typeof r.answers?.[q.id] === "number");
      const cannot = answered.filter((r) => r.answers[q.id]! <= 1).length;
      return { id: q.id, area: q.area, prompt: q.prompt, n: answered.length, pct: pct(cannot, answered.length), ci: wilson(cannot, answered.length) };
    })
    .sort((a, b) => b.pct - a.pct);

  const srcMap = new Map<string | null, number>();
  for (const r of rows) srcMap.set(r.source ?? null, (srcMap.get(r.source ?? null) ?? 0) + 1);

  return {
    totalRows: all.length,
    n,
    exclusions: [...exMap].map(([reason, count]) => ({ reason, count })),
    last7: rows.filter((r) => now - time(r) < 7 * DAY).length,
    last30: rows.filter((r) => now - time(r) < 30 * DAY).length,
    weekly,
    meanScore: mean(scores),
    medianScore: median(scores),
    meanGaps: mean(rows.map((r) => r.gaps)),
    medianSeconds: median(rows.map((r) => r.duration_s).filter((d): d is number => d !== null)),
    histogram: Array.from({ length: 10 }, (_, i) => {
      const lo = i * 10;
      const hi = i === 9 ? 100 : lo + 9;
      return { label: `${lo}–${hi}`, n: scores.filter((s) => s >= lo && s <= hi).length };
    }),
    bandCounts: bands.map((b) => {
      const k = rows.filter((r) => r.band === b.name).length;
      return { name: b.name, n: k, pct: pct(k, n) };
    }),
    byQuestion,
    blindSpots: questions
      .map((q) => ({ id: q.id, area: q.area, n: rows.filter((r) => r.blind_spot === q.id).length }))
      .filter((b) => b.n > 0)
      .sort((a, b) => b.n - a.n),
    sources: [...srcMap].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
    recent: [...tagged].sort((a, b) => time(b) - time(a)),
  };
}

/** Null when the service key is not set; throws on a database error. */
export async function loadSite(): Promise<SiteStats | null> {
  if (!serviceRoleConfigured) return null;
  const { data, error } = await createAdminClient()
    .from("reality_check_responses")
    .select("*")
    .eq("cohort", "site")
    .order("created_at", { ascending: true })
    .limit(10000);
  if (error) throw new Error(error.message);
  return computeSite((data ?? []) as SiteRow[]);
}
