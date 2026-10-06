import "server-only";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { bands, questions } from "@/lib/realityCheck";
import { wilson, type Interval } from "@/lib/stats";
import { MIN_SECONDS, type StudyRow } from "@/lib/realityStudyStats";

/**
 * The website Clarity Check (/clarity-check, cohort 'site'), read as marketing
 * and demand data. Kept entirely apart from the capstone survey: the website
 * version has no honesty commitment, no profile and no follow-up questions, so its
 * rows never enter the study figures, and the study's rows never enter these.
 *
 * Counted means: not removed from the dashboard, not tagged as a test, and
 * finished in at least MIN_SECONDS (the same speed rule as the survey).
 */

export type SiteRow = StudyRow;

/** A date range from the dashboard, as Central-time calendar days (YYYY-MM-DD). */
export type SiteRange = { from?: string; to?: string; label: string };

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Epoch ms of midnight Central time on a YYYY-MM-DD day (DST-safe). */
function ctMidnight(day: string): number {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  const guess = Date.UTC(y, m - 1, d, 6); // midnight CST
  const h = Number(new Date(guess).toLocaleString("en-US", { timeZone: "America/Chicago", hour: "numeric", hour12: false }));
  return h === 1 ? guess - 3_600_000 : guess; // CDT: midnight is an hour earlier
}

/** Today in Central time as YYYY-MM-DD. */
export function ctToday(now = Date.now()): string {
  return new Date(now).toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

/** Turns ?range= / ?from= / ?to= into a range. Default: all time. */
export function parseRange(q: { range?: string; from?: string; to?: string }, now = Date.now()): SiteRange {
  const from = q.from && DAY_RE.test(q.from) ? q.from : undefined;
  const to = q.to && DAY_RE.test(q.to) ? q.to : undefined;
  if (from || to) {
    const fmt = (d: string) => new Date(ctMidnight(d) + 12 * 3_600_000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" });
    return { from, to, label: `${from ? fmt(from) : "Start"} to ${to ? fmt(to) : "today"}` };
  }
  const days = Number(q.range);
  if ([7, 30, 90, 365].includes(days)) {
    const start = ctToday(now - (days - 1) * DAY);
    return { from: start, label: days === 365 ? "Last 12 months" : `Last ${days} days` };
  }
  return { label: "All time" };
}

export type SiteStats = {
  range: SiteRange;
  /** Daily when the range is a month or less, otherwise weekly. */
  trendUnit: "day" | "week";
  firstStored: string | null;
  lastStored: string | null;
  totalRows: number;
  n: number;
  exclusions: { reason: string; count: number }[];
  last7: number;
  last30: number;
  trend: { label: string; n: number }[];
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

export function computeSite(allRows: SiteRow[], range: SiteRange = { label: "All time" }, now = Date.now()): SiteStats {
  const time = (r: SiteRow) => new Date(r.created_at).getTime();
  const lo = range.from ? ctMidnight(range.from) : -Infinity;
  const hi = range.to ? ctMidnight(range.to) + DAY : Infinity;
  const all = allRows.filter((r) => time(r) >= lo && time(r) < hi);
  const tagged = all.map((r) => ({ ...r, excluded: siteExclusion(r) }));
  const rows = tagged.filter((r) => !r.excluded);
  const countedEver = allRows.filter((r) => !siteExclusion(r));
  const n = rows.length;
  const scores = rows.map((r) => r.score);

  const exMap = new Map<string, number>();
  for (const r of tagged) {
    if (!r.excluded) continue;
    const key = r.excluded.startsWith("Removed") ? "Removed by you" : r.excluded;
    exMap.set(key, (exMap.get(key) ?? 0) + 1);
  }

  // Trend: from the range start (or the first response) to the range end (or now).
  const firstTs = allRows.length ? Math.min(...allRows.map(time)) : now;
  const startTs = Number.isFinite(lo) ? lo : Math.min(firstTs, now - 11 * 7 * DAY);
  const endTs = Number.isFinite(hi) ? Math.min(hi - 1, now) : now;
  const trendUnit: "day" | "week" = endTs - startTs <= 31 * DAY ? "day" : "week";
  const dayKey = (t: number) => ctToday(t);
  const short = (t: number) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Chicago" });
  let trend: { label: string; n: number }[];
  if (trendUnit === "day") {
    // Step a day at a time and de-duplicate, so a DST change never doubles or drops a day.
    const keys = new Map<string, number>();
    for (let t = startTs; dayKey(t) <= dayKey(endTs); t += DAY) keys.set(dayKey(t), t);
    keys.set(dayKey(endTs), endTs);
    trend = [...keys].map(([key, t]) => ({ label: short(t), n: rows.filter((r) => dayKey(time(r)) === key).length }));
  } else {
    const weeks: number[] = [];
    for (let w = weekStart(startTs); w <= weekStart(endTs); w += 7 * DAY) weeks.push(w);
    trend = weeks.slice(-26).map((w) => ({ label: short(w + 12 * 3_600_000), n: rows.filter((r) => weekStart(time(r)) === w).length }));
  }

  const byQuestion = questions
    .map((q) => {
      const answered = rows.filter((r) => typeof r.answers?.[q.id] === "number");
      const cannot = answered.filter((r) => r.answers[q.id]! <= 1).length;
      return { id: q.id, area: q.area, prompt: q.prompt, n: answered.length, pct: pct(cannot, answered.length), ci: wilson(cannot, answered.length) };
    })
    .sort((a, b) => b.pct - a.pct);

  const srcMap = new Map<string | null, number>();
  for (const r of rows) srcMap.set(r.source ?? null, (srcMap.get(r.source ?? null) ?? 0) + 1);

  const stamps = allRows.map(time);
  return {
    range,
    trendUnit,
    firstStored: stamps.length ? new Date(Math.min(...stamps)).toISOString() : null,
    lastStored: stamps.length ? new Date(Math.max(...stamps)).toISOString() : null,
    totalRows: all.length,
    n,
    exclusions: [...exMap].map(([reason, count]) => ({ reason, count })),
    last7: countedEver.filter((r) => now - time(r) < 7 * DAY).length,
    last30: countedEver.filter((r) => now - time(r) < 30 * DAY).length,
    trend,
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
export async function loadSite(range?: SiteRange): Promise<SiteStats | null> {
  if (!serviceRoleConfigured) return null;
  const { data, error } = await createAdminClient()
    .from("reality_check_responses")
    .select("*")
    .eq("cohort", "site")
    .order("created_at", { ascending: true })
    .limit(10000);
  if (error) throw new Error(error.message);
  return computeSite((data ?? []) as SiteRow[], range);
}
