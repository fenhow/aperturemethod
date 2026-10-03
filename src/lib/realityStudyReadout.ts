import { ALPHA, corrWord, effectWord, fmtP, type Anova, type ProportionTest } from "@/lib/stats";
import type { StudyStats } from "@/lib/realityStudyStats";

/**
 * The plain-English sentences that sit beside every statistic, shared by the
 * dashboard and the PDF so the two always say the same thing.
 *
 * Rule for the wording: lead with what it means, then the numbers in brackets
 * for the appendix. "Significant" always means p < 0.05.
 *
 * @illustrative-figures — the dollar amounts here are the H2 survey thresholds,
 * not our fees. Fees live only in src/lib/pricing.ts.
 */

const r0 = (x: number) => Math.round(x).toString();
const sign = (x: number) => (x > 0 ? "+" : "") + r0(x);
const ci = (c: { lo: number; hi: number } | null) => (c ? `${r0(c.lo)}% to ${r0(c.hi)}%` : "n/a");

export const VERDICT_LABEL: Record<ProportionTest["verdict"], string> = {
  supported: "Statistically supported",
  against: "Statistically rejected",
  inconclusive: "Not yet conclusive",
  "no-data": "No data yet",
};

export function proportionSentence(t: ProportionTest, what: string): string {
  if (t.verdict === "no-data") return "No answers yet.";
  const range = `95% confidence interval ${ci(t.ci)}`;
  if (t.verdict === "supported")
    return `We can be 95% confident the true share is above ${t.threshold}% (${range}; one-sided exact binomial ${fmtP(t.pAbove)}).`;
  if (t.verdict === "against")
    return `We can be 95% confident the true share is below ${t.threshold}% (${range}; ${fmtP(t.pBelow)}).`;
  return `The true share could still sit either side of ${t.threshold}% (${range}). More responses are needed before ${what} can be called.`;
}

export function overconfidenceSentence(s: StudyStats): string | null {
  const o = s.stats.overconfidence;
  if (!o) return null;
  const sig = o.p < ALPHA;
  const dir = o.mean > 0 ? "higher" : "lower";
  return sig
    ? `Owners rated themselves significantly ${dir} than they scored: a mean gap of ${sign(o.mean)} points (95% CI ${sign(o.ci.lo)} to ${sign(o.ci.hi)}; paired t-test, t(${o.n - 1}) = ${o.t.toFixed(2)}, ${fmtP(o.p)}; ${effectWord(o.d)} effect, d = ${o.d.toFixed(2)}).`
    : `The gap between self-rating and score (${sign(o.mean)} points, 95% CI ${sign(o.ci.lo)} to ${sign(o.ci.hi)}) is not statistically different from zero yet (${fmtP(o.p)}).`;
}

export function correlationSentence(s: StudyStats): string | null {
  const c = s.stats.correlation;
  if (!c) return null;
  const sig = c.pRho < ALPHA;
  return `${sig ? "There is" : "So far there is"} ${corrWord(c.rho)} ${c.rho >= 0 ? "positive" : "negative"} relationship between how well owners think they know the business and how well they can evidence it (Spearman rho = ${c.rho.toFixed(2)}, ${fmtP(c.pRho)}${sig ? "" : ", not significant"}; Pearson r = ${c.r.toFixed(2)}).`;
}

export function groupSentence(a: Anova | null): string {
  if (!a) return "Not enough answers in two or more groups to compare yet.";
  return a.p < ALPHA
    ? `Average scores differ significantly between these groups (one-way ANOVA, F = ${a.f.toFixed(2)}, ${fmtP(a.p)}; the grouping explains ${r0(a.eta2 * 100)}% of the variation).`
    : `No significant difference in average score between these groups yet (F = ${a.f.toFixed(2)}, ${fmtP(a.p)}).`;
}

export function moeSentence(s: StudyStats): string {
  const m = s.stats.moe;
  const t = s.stats.moeAtTarget;
  return m === null
    ? "Margin of error appears once responses arrive."
    : `Margin of error for a headline percentage at this sample size: about ±${r0(m)} points (95% confidence, worst case). At ${s.target} responses it narrows to ±${r0(t ?? 0)}.`;
}

export const STATS_CAVEAT =
  "Tests assume a random sample. This one is self-selected, so p-values and intervals describe the owners who took part and should be reported with that caveat.";
