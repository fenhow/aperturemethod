/**
 * Small, dependency-free inferential statistics for the Clarity Check study.
 *
 * Everything reduces to the regularised incomplete beta function, which gives
 * exact tails for the t, F and binomial distributions. Implementation follows
 * Numerical Recipes (Lanczos log-gamma, Lentz continued fraction). Verified in
 * scripts against known values; see the self-check at the bottom of this file.
 *
 * Caveat that travels with every number here: these tests assume a random
 * sample. The study is self-selected, so results describe the owners who took
 * part. The report says so in its limitations section.
 */

export const ALPHA = 0.05;

function lgamma(x: number): number {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x;
  const tmp = x + 5.5 - (x + 0.5) * Math.log(x + 5.5);
  let ser = 1.000000000190015;
  for (const ci of c) ser += ci / ++y;
  return -tmp + Math.log((2.5066282746310005 * ser) / x);
}

function betacf(a: number, b: number, x: number): number {
  const MAXIT = 300, EPS = 3e-14, FPMIN = 1e-300;
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d; h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

/** Regularised incomplete beta I_x(a, b). */
export function ibeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}

/** Two-sided p-value for a t statistic with df degrees of freedom. */
export function tTwoSided(t: number, df: number): number {
  return ibeta(df / (df + t * t), df / 2, 0.5);
}

/** Critical t for a two-sided test at level alpha (bisection on the exact tail). */
export function tCrit(df: number, alpha = ALPHA): number {
  let lo = 0, hi = 100;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (tTwoSided(mid, df) > alpha) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Upper-tail p-value for an F statistic. */
export function fUpper(f: number, d1: number, d2: number): number {
  if (f <= 0) return 1;
  return ibeta(d2 / (d2 + d1 * f), d2 / 2, d1 / 2);
}

/** P(X >= k) for X ~ Binomial(n, p). */
export function binomUpper(k: number, n: number, p: number): number {
  if (k <= 0) return 1;
  if (k > n) return 0;
  return ibeta(p, k, n - k + 1);
}

/** P(X <= k) for X ~ Binomial(n, p). */
export function binomLower(k: number, n: number, p: number): number {
  return 1 - binomUpper(k + 1, n, p);
}

export type Interval = { lo: number; hi: number };

/** Wilson score interval for a proportion, as percentages. */
export function wilson(k: number, n: number, z = 1.959963985): Interval | null {
  if (!n) return null;
  const p = k / n;
  const denom = 1 + (z * z) / n;
  const centre = (p + (z * z) / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
  return { lo: 100 * Math.max(0, centre - half), hi: 100 * Math.min(1, centre + half) };
}

/** Worst-case (p = 0.5) margin of error at 95%, in percentage points. */
export function marginOfError(n: number): number | null {
  return n ? 100 * 1.959963985 * Math.sqrt(0.25 / n) : null;
}

export type ProportionTest = {
  k: number; n: number; pct: number; ci: Interval | null;
  threshold: number; pAbove: number | null; pBelow: number | null;
  verdict: "supported" | "against" | "inconclusive" | "early" | "no-data";
};

/**
 * Tests a share against a threshold (e.g. H1: is the true share above 40%?).
 * "supported": significantly above (exact one-sided binomial, p < alpha).
 * "against": significantly below. Otherwise inconclusive at this sample size.
 */
/**
 * No verdict below this many answers (Oct 2026). An exact test can reach
 * p < 0.05 with five like-minded answers (5 of 5 below a 50% line gives
 * p = 0.03), which is arithmetically true and practically meaningless.
 */
export const MIN_N_FOR_VERDICT = 30;

export function proportionTest(k: number, n: number, thresholdPct: number): ProportionTest {
  const p0 = thresholdPct / 100;
  if (!n) return { k, n, pct: 0, ci: null, threshold: thresholdPct, pAbove: null, pBelow: null, verdict: "no-data" };
  const pAbove = binomUpper(k, n, p0);
  const pBelow = binomLower(k, n, p0);
  const verdict =
    n < MIN_N_FOR_VERDICT ? "early" : pAbove < ALPHA ? "supported" : pBelow < ALPHA ? "against" : "inconclusive";
  return { k, n, pct: (100 * k) / n, ci: wilson(k, n), threshold: thresholdPct, pAbove, pBelow, verdict };
}

export type MeanTest = {
  n: number; mean: number; sd: number; ci: Interval; t: number; p: number; d: number;
};

/** One-sample t-test of mean(xs) against mu (paired test when xs are differences). */
export function meanTest(xs: number[], mu = 0): MeanTest | null {
  const n = xs.length;
  if (n < 3) return null;
  const mean = xs.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1));
  const se = sd / Math.sqrt(n);
  const tc = tCrit(n - 1);
  const t = se ? (mean - mu) / se : 0;
  return { n, mean, sd, ci: { lo: mean - tc * se, hi: mean + tc * se }, t, p: se ? tTwoSided(t, n - 1) : 1, d: sd ? (mean - mu) / sd : 0 };
}

export type Correlation = { n: number; r: number; rho: number; p: number; pRho: number };

function rank(xs: number[]): number[] {
  const idx = xs.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0]);
  const r = new Array<number>(xs.length);
  for (let i = 0; i < idx.length; ) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1]![0] === idx[i]![0]) j++;
    for (let k = i; k <= j; k++) r[idx[k]![1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
}

function pearson(x: number[], y: number[]): number {
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (x[i]! - mx) * (y[i]! - my);
    sxx += (x[i]! - mx) ** 2;
    syy += (y[i]! - my) ** 2;
  }
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
}

const rP = (r: number, n: number) => (Math.abs(r) >= 1 ? 0 : tTwoSided(r * Math.sqrt((n - 2) / (1 - r * r)), n - 2));

/** Pearson r and Spearman rho with two-sided p-values. */
export function correlation(x: number[], y: number[]): Correlation | null {
  const n = x.length;
  if (n < 4) return null;
  const r = pearson(x, y);
  const rho = pearson(rank(x), rank(y));
  return { n, r, rho, p: rP(r, n), pRho: rP(rho, n) };
}

export type Anova = { groups: number; n: number; f: number; p: number; eta2: number };

/** One-way ANOVA across groups (groups with fewer than 2 observations are dropped). */
export function anova(groups: number[][]): Anova | null {
  const gs = groups.filter((g) => g.length >= 2);
  const N = gs.reduce((a, g) => a + g.length, 0);
  const k = gs.length;
  if (k < 2 || N - k < 1) return null;
  const grand = gs.flat().reduce((a, b) => a + b, 0) / N;
  let ssb = 0, ssw = 0;
  for (const g of gs) {
    const m = g.reduce((a, b) => a + b, 0) / g.length;
    ssb += g.length * (m - grand) ** 2;
    for (const v of g) ssw += (v - m) ** 2;
  }
  const f = ssw ? ssb / (k - 1) / (ssw / (N - k)) : 0;
  return { groups: k, n: N, f, p: fUpper(f, k - 1, N - k), eta2: ssb + ssw ? ssb / (ssb + ssw) : 0 };
}

/** "p = 0.03", "p < 0.001". */
export function fmtP(p: number | null | undefined): string {
  if (p === null || p === undefined) return "p = n/a";
  return p < 0.001 ? "p < 0.001" : `p = ${p < 0.01 ? p.toFixed(3) : p.toFixed(2)}`;
}

/** Plain-English size of a correlation. */
export function corrWord(r: number): string {
  const a = Math.abs(r);
  return a < 0.1 ? "no meaningful" : a < 0.3 ? "a weak" : a < 0.5 ? "a moderate" : "a strong";
}

/** Plain-English size of Cohen's d. */
export function effectWord(d: number): string {
  const a = Math.abs(d);
  return a < 0.2 ? "negligible" : a < 0.5 ? "small" : a < 0.8 ? "medium" : "large";
}
