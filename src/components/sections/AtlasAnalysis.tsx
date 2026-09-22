/**
 * @illustrative-figures: every number here is computed from SYNTHETIC data generated
 * for the fictional client Lumina Medical Aesthetics. The statistics are real
 * calculations (OLS, standard errors, confidence intervals) on made-up inputs.
 */
"use client";

/**
 * The quantitative layer under the Atlas Market Map: "Why sales move".
 *  1. Rain vs sales: component-plus-residual plot from a weekly OLS model.
 *  2. Temperature vs sales: same model, quadratic term, with the peak temperature.
 *  3. Holiday lift: event-study coefficients (weeks -3..+1) with 95% intervals.
 *  4. Geographic and demographic drivers of penetration: cross-sectional OLS over
 *     trade-area hexes, standardised betas with significance stars.
 * Everything is computed at module load from a seeded generator, so the page is
 * deterministic (safe for SSR hydration) and every figure shown is internally
 * consistent with the data behind it.
 */

export type AnalysisColors = { ink: string; mu: string; bd: string; accent: string; pos: string; neg: string; dot: string };

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const sd = (a: number[]) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const corr = (x: number[], y: number[]) => {
  const mx = mean(x), my = mean(y);
  let sxy = 0, sxx = 0, syy = 0;
  x.forEach((xi, i) => { sxy += (xi - mx) * (y[i]! - my); sxx += (xi - mx) ** 2; syy += (y[i]! - my) ** 2; });
  return sxy / Math.sqrt(sxx * syy);
};

function invert(m: number[][]) {
  const n = m.length;
  const a = m.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(a[r]![c]!) > Math.abs(a[p]![c]!)) p = r;
    [a[c], a[p]] = [a[p]!, a[c]!];
    const pv = a[c]![c]!;
    for (let j = 0; j < 2 * n; j++) a[c]![j]! /= pv;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = a[r]![c]!;
      for (let j = 0; j < 2 * n; j++) a[r]![j]! -= f * a[c]![j]!;
    }
  }
  return a.map((row) => row.slice(n));
}

/** Ordinary least squares with classical standard errors. */
function ols(X: number[][], y: number[]) {
  const n = X.length, k = X[0]!.length;
  const xtx = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => X.reduce((s, row) => s + row[i]! * row[j]!, 0)));
  const xty = Array.from({ length: k }, (_, i) => X.reduce((s, row, r) => s + row[i]! * y[r]!, 0));
  const inv = invert(xtx);
  const b = inv.map((row) => row.reduce((s, v, j) => s + v * xty[j]!, 0));
  const fit = X.map((row) => row.reduce((s, v, j) => s + v * b[j]!, 0));
  const resid = y.map((v, i) => v - fit[i]!);
  const sse = resid.reduce((s, e) => s + e * e, 0);
  const my = mean(y);
  const sst = y.reduce((s, v) => s + (v - my) ** 2, 0);
  const s2 = sse / (n - k);
  const se = inv.map((row, i) => Math.sqrt(s2 * row[i]!));
  return { b, se, t: b.map((v, i) => v / se[i]!), resid, r2: 1 - sse / sst, n };
}
const stars = (t: number) => (Math.abs(t) > 2.58 ? "***" : Math.abs(t) > 1.96 ? "**" : Math.abs(t) > 1.64 ? "*" : "");

/* ---------- Weekly time series: 104 weeks of POS sales ---------- */
const HOLIDAY_DOY = [45, 130, 185, 247, 332, 359]; // Valentine's, Mother's Day, July 4, Labor Day, Black Friday, Christmas
const REL = [-3, -2, -1, 0, 1];
const TRUE_LIFT = [0.04, 0.09, 0.18, 0.26, -0.06];
const START_DOY = 245; // early September 2024

const weekly = (() => {
  const r = rng(42);
  const rows: { w: number; temp: number; rain: number; rel: number | null; bb: number; comp: number; sales: number }[] = [];
  for (let w = 0; w < 104; w++) {
    const doy = (START_DOY + w * 7) % 365;
    let temp = 79 + 19 * Math.sin((2 * Math.PI * (doy - 110)) / 365) + 5 * gauss(r);
    if (doy > 170 && doy < 250 && r() < 0.35) temp += 6 + 4 * r(); // summer heat spikes past 100°F
    temp = Math.min(108, Math.max(38, temp));
    const wet = doy > 90 && doy < 180 ? 0.45 : 0.25;
    const rain = r() < wet ? -Math.log(r() + 1e-9) * 1.1 : 0;
    let rel: number | null = null;
    for (const h of HOLIDAY_DOY) {
      const d = Math.round((((h - doy + 365 + 182) % 365) - 182) / 7);
      if (d >= -1 && d <= 3) rel = -d;
    }
    const bb = w >= 60 && w < 84 ? 1 : 0; // billboard flight on I-45
    const comp = w >= 70 ? 1 : 0; // a competitor opens within 1 mi
    const base = 42000 + 60 * w;
    const sales = base * (1 + (rel === null ? 0 : TRUE_LIFT[REL.indexOf(rel)]!))
      - 1900 * rain - 6 * (temp - 82) ** 2 + 1800 * bb - 2600 * comp + 1400 * gauss(r);
    rows.push({ w, temp, rain, rel, bb, comp, sales });
  }
  return rows;
})();

const X = weekly.map((d) => [1, d.w, d.rain, d.temp, d.temp * d.temp, ...REL.map((k) => (d.rel === k ? 1 : 0)), d.bb, d.comp]);
const Y = weekly.map((d) => d.sales);
const M = ols(X, Y);
const IX = { w: 1, rain: 2, t: 3, t2: 4, rel: 5, bb: 10, comp: 11 };
const MEAN_SALES = mean(Y);
const PEAK_T = -M.b[IX.t]! / (2 * M.b[IX.t2]!);
const tempEffect = (t: number) => M.b[IX.t]! * t + M.b[IX.t2]! * t * t;

export const WEEKLY_MODEL = { r2: M.r2, n: M.n, rainPerInch: M.b[IX.rain]!, peakTemp: PEAK_T, meanSales: MEAN_SALES };

/** Modelled sales effect (% vs a dry day at the ideal temperature) for a forecast. */
export function weatherImpactPct(tempF: number, rainChancePct: number) {
  const expectedInches = (rainChancePct / 100) * 1.1;
  const d = M.b[IX.rain]! * expectedInches + tempEffect(tempF) - tempEffect(PEAK_T);
  return (d / MEAN_SALES) * 100;
}
/** Event-study lift (%) for the week before a holiday, scaled per holiday. */
export const HOLIDAY_LIFT_PCT = REL.map((_, i) => (M.b[IX.rel + i]! / MEAN_SALES) * 100);

/* Partial (component-plus-residual) series */
const rainPartial = weekly.map((d, i) => ({ x: d.rain, y: M.resid[i]! + M.b[IX.rain]! * d.rain, w: d.w }));
const tempPartial = weekly.map((d, i) => ({ x: d.temp, y: M.resid[i]! + tempEffect(d.temp) - tempEffect(PEAK_T), w: d.w }));
const R_RAIN = corr(rainPartial.map((p) => p.x), rainPartial.map((p) => p.y));
const HEAT_DROP = ((tempEffect(104) - tempEffect(PEAK_T)) / MEAN_SALES) * 100;

/* ---------- Cross-section: penetration across 310 trade-area hexes ---------- */
const DRIVERS = ["Drive time", "Median income", "Women 25–54 share", "New housing nearby", "Billboard exposure", "Competitors ≤ 1 mi"];
const cross = (() => {
  const r = rng(9);
  const xs: number[][] = [];
  const y: number[] = [];
  for (let i = 0; i < 310; i++) {
    const drive = 2 + 18 * r();
    const inc = 75 + 55 * r() + 8 * gauss(r);
    const women = 14 + 10 * r();
    const housing = r() < 0.2 ? 1 : 0;
    const bb = Math.max(0, 40 + 60 * gauss(r));
    const comp = Math.floor(r() * 4);
    xs.push([drive, inc, women, housing, bb, comp]);
    y.push(12 - 0.42 * drive + 0.035 * inc + 0.22 * women + 1.1 * housing + 0.006 * bb - 0.9 * comp + 1.5 * gauss(r));
  }
  const cols = DRIVERS.map((_, j) => xs.map((row) => row[j]!));
  const mx = cols.map(mean), sx = cols.map(sd), my = mean(y), sy = sd(y);
  const Z = xs.map((row) => [1, ...row.map((v, j) => (v - mx[j]!) / sx[j]!)]);
  const m = ols(Z, y.map((v) => (v - my) / sy));
  const rows = DRIVERS.map((name, j) => ({ name, beta: m.b[j + 1]!, t: m.t[j + 1]!, raw: (m.b[j + 1]! * sy) / sx[j]! }))
    .sort((a, b) => Math.abs(b.beta) - Math.abs(a.beta));
  return { rows, r2: m.r2, n: m.n };
})();

/* ---------- Month highlight (slider months Sep 25 .. Sep 26 = weeks 52..103) ---------- */
const inMonth = (w: number, m: number) => {
  const s = 52 + Math.round(m * 4.345);
  return w >= s && w < s + 4.4;
};

/* ---------- Charts ---------- */
const CW = 300, CH = 170, PL = 34, PR = 8, PT = 10, PB = 24;
const sx = (v: number, a: number, b: number) => PL + ((v - a) / (b - a)) * (CW - PL - PR);
const sy = (v: number, a: number, b: number) => CH - PB - ((v - a) / (b - a)) * (CH - PT - PB);
const k$ = (v: number) => (Math.abs(v) < 1 ? "$0" : `${v > 0 ? "+" : "−"}$${Math.abs(v / 1000).toFixed(1)}k`);

function Axes({ c, xTicks, yTicks, xr, yr, fx, fy }: { c: AnalysisColors; xTicks: number[]; yTicks: number[]; xr: [number, number]; yr: [number, number]; fx: (v: number) => string; fy: (v: number) => string }) {
  return (
    <g fontSize={9} fill={c.mu}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={PL} x2={CW - PR} y1={sy(v, ...yr)} y2={sy(v, ...yr)} stroke={c.bd} strokeWidth={v === 0 ? 1 : 0.6} />
          <text x={PL - 4} y={sy(v, ...yr) + 3} textAnchor="end">{fy(v)}</text>
        </g>
      ))}
      {xTicks.map((v) => <text key={`x${v}`} x={sx(v, ...xr)} y={CH - 8} textAnchor="middle">{fx(v)}</text>)}
    </g>
  );
}

function Scatter({ c, pts, xr, yr, month, xTicks, yTicks, fx, children }: {
  c: AnalysisColors; pts: { x: number; y: number; w: number }[]; xr: [number, number]; yr: [number, number]; month: number;
  xTicks: number[]; yTicks: number[]; fx: (v: number) => string; children: React.ReactNode;
}) {
  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" role="img" aria-hidden>
      <Axes c={c} xTicks={xTicks} yTicks={yTicks} xr={xr} yr={yr} fx={fx} fy={k$} />
      {pts.map((p) => {
        const hot = inMonth(p.w, month);
        return <circle key={p.w} cx={sx(p.x, ...xr)} cy={sy(Math.max(yr[0], Math.min(yr[1], p.y)), ...yr)} r={hot ? 3.6 : 2.2}
          fill={hot ? c.accent : c.dot} opacity={hot ? 1 : 0.45} stroke={hot ? c.ink : "none"} strokeWidth={0.8} />;
      })}
      {children}
    </svg>
  );
}

export function AtlasAnalysis({ c, month, monthLabel }: { c: AnalysisColors; month: number; monthLabel: string }) {
  const yr: [number, number] = [-8000, 5000];
  const yTicks = [-6000, -3000, 0, 3000];
  const rainLine = [0, 4].map((x) => `${sx(x, 0, 4)},${sy(M.b[IX.rain]! * x, ...yr)}`).join(" ");
  const tCurve = Array.from({ length: 40 }, (_, i) => 45 + i * 1.6)
    .map((t) => `${sx(t, 40, 110).toFixed(1)},${sy(tempEffect(t) - tempEffect(PEAK_T), ...yr).toFixed(1)}`).join(" ");
  const liftMax = 34;
  const bw = (CW - PL - PR) / REL.length;
  const maxBeta = Math.max(...cross.rows.map((d) => Math.abs(d.beta)));
  const drive = cross.rows.find((d) => d.name === "Drive time")!;

  return (
    <section className="atl-an" aria-label="Why sales move: illustrative quantitative analysis">
      <header>
        <div>
          <div className="atl-h">The quantitative layer</div>
          <h3>Why sales move</h3>
        </div>
        <p>
          Weekly model: OLS on {M.n} weeks of point-of-sale data, controlling for trend, season, holidays, billboards and a
          competitor opening (R² = {M.r2.toFixed(2)}). Highlighted points are the weeks of <b>{monthLabel}</b>.
        </p>
      </header>
      <div className="atl-an-grid">
        <figure>
          <figcaption><b>Rain vs sales</b><span>r = {R_RAIN.toFixed(2)}</span></figcaption>
          <Scatter c={c} pts={rainPartial} xr={[0, 4]} yr={yr} month={month} xTicks={[0, 1, 2, 3, 4]} yTicks={yTicks} fx={(v) => `${v}"`}>
            <polyline points={rainLine} fill="none" stroke={c.neg} strokeWidth={2} />
          </Scatter>
          <p>Each inch of rain costs <b>{k$(M.b[IX.rain]!)}</b> in weekly sales (t = {M.t[IX.rain]!.toFixed(1)}{stars(M.t[IX.rain]!)}).</p>
        </figure>
        <figure>
          <figcaption><b>Temperature vs sales</b><span>peak {PEAK_T.toFixed(0)}°F</span></figcaption>
          <Scatter c={c} pts={tempPartial} xr={[40, 110]} yr={yr} month={month} xTicks={[50, 70, 90, 100, 110]} yTicks={yTicks} fx={(v) => `${v}°`}>
            <rect x={sx(100, 40, 110)} y={PT} width={sx(110, 40, 110) - sx(100, 40, 110)} height={CH - PT - PB} fill={c.neg} opacity={0.08} />
            <polyline points={tCurve} fill="none" stroke={c.accent} strokeWidth={2} />
          </Scatter>
          <p>Sales peak near <b>{PEAK_T.toFixed(0)}°F</b>. At 104°F they run <b>{HEAT_DROP.toFixed(1)}%</b> below peak.</p>
        </figure>
        <figure>
          <figcaption><b>Holiday lift</b><span>event study · 95% CI</span></figcaption>
          <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" role="img" aria-hidden>
            <Axes c={c} xTicks={[]} yTicks={[-10, 0, 10, 20, 30]} xr={[0, 1]} yr={[-12, liftMax]} fx={String} fy={(v) => `${v}%`} />
            {REL.map((k, i) => {
              const v = HOLIDAY_LIFT_PCT[i]!;
              const e = (1.96 * M.se[IX.rel + i]! / MEAN_SALES) * 100;
              const x = PL + i * bw + bw * 0.2;
              const y0 = sy(0, -12, liftMax), y1 = sy(v, -12, liftMax);
              return (
                <g key={k}>
                  <rect x={x} y={Math.min(y0, y1)} width={bw * 0.6} height={Math.abs(y1 - y0)} rx={2} fill={v >= 0 ? c.accent : c.neg} opacity={k === 0 ? 1 : 0.75} />
                  <line x1={x + bw * 0.3} x2={x + bw * 0.3} y1={sy(v - e, -12, liftMax)} y2={sy(v + e, -12, liftMax)} stroke={c.ink} strokeWidth={1} />
                  <text x={x + bw * 0.3} y={CH - 8} fontSize={9} fill={c.mu} textAnchor="middle">{k === 0 ? "Week of" : `${k > 0 ? "+" : ""}${k} wk`}</text>
                  <text x={x + bw * 0.3} y={Math.min(y1, y0) - 4} fontSize={9} fontWeight={600} fill={c.ink} textAnchor="middle">{v > 0 ? "+" : ""}{v.toFixed(0)}%</text>
                </g>
              );
            })}
          </svg>
          <p>Sales build for three weeks into a holiday (<b>+{HOLIDAY_LIFT_PCT[3]!.toFixed(0)}%</b> the week of), then dip after as demand is pulled forward.</p>
        </figure>
        <figure>
          <figcaption><b>What drives penetration by area</b><span>R² = {cross.r2.toFixed(2)} · n = {cross.n}</span></figcaption>
          <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" role="img" aria-hidden>
            <line x1={190} x2={190} y1={4} y2={CH - 14} stroke={c.bd} />
            {cross.rows.map((d, i) => {
              const y = 10 + i * 25;
              const w = (Math.abs(d.beta) / maxBeta) * 90;
              return (
                <g key={d.name} fontSize={9.5}>
                  <text x={0} y={y + 10} fill={c.ink}>{d.name}</text>
                  <rect x={d.beta >= 0 ? 190 : 190 - w} y={y} width={w} height={13} rx={2} fill={d.beta >= 0 ? c.pos : c.neg} opacity={0.85} />
                  <text x={d.beta >= 0 ? 194 + w : 186 - w} y={y + 10} fill={c.mu} textAnchor={d.beta >= 0 ? "start" : "end"}>
                    {d.beta.toFixed(2)}{stars(d.t)}
                  </text>
                </g>
              );
            })}
          </svg>
          <p>Standardised betas across trade-area hexes. Every 5 extra minutes of drive time cuts penetration by <b>{Math.abs(drive.raw * 5).toFixed(1)} pts</b>.</p>
        </figure>
      </div>
      <div className="atl-an-foot">*** p &lt; .01 · ** p &lt; .05 · * p &lt; .10. Partial-effect plots show each factor after removing the others. Synthetic data for an illustrative client.</div>
    </section>
  );
}

export const ANALYSIS_CSS = `
.atl-an{padding:22px 18px 16px;border-top:1px solid var(--bd)}
.atl-an header{display:flex;gap:24px;align-items:flex-end;justify-content:space-between;margin-bottom:14px}
.atl-an h3{margin:3px 0 0;font-size:18px;font-weight:600}
.atl-an header p{margin:0;max-width:560px;font-size:12px;line-height:1.5;color:var(--mu)}
.atl-an header b{color:var(--tx)}
.atl-an-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.atl-an figure{margin:0;background:var(--pn);border:1px solid var(--bd);border-radius:8px;padding:11px 12px}
.atl-an figcaption{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:12.5px;margin-bottom:6px}
.atl-an figcaption span{font-size:10.5px;color:var(--mu);white-space:nowrap}
.atl-an figure p{margin:6px 0 0;font-size:11.5px;line-height:1.45;color:var(--mu)}
.atl-an figure p b{color:var(--tx)}
.atl-an-foot{margin-top:10px;font-size:10px;color:var(--attrtx)}
@media (max-width:1080px){.atl-an-grid{grid-template-columns:1fr 1fr}.atl-an header{flex-direction:column;align-items:flex-start;gap:6px}}
@media (max-width:620px){.atl-an-grid{grid-template-columns:1fr}.atl-an{padding:18px 10px 12px}}
`;
