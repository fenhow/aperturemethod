"use client";

import { useState } from "react";

/**
 * The study dashboard's two interactive charts.
 *
 * Both are hand-drawn SVG rather than a charting library: the page already
 * computes every number server-side, the shapes are simple, and a library would
 * add weight to a page three people read.
 *
 * House rules followed here: one hue (the brand maroon) because each chart shows
 * a single series, so no legend is needed; recessive grid and axes; labels on
 * the few points that carry meaning rather than on every mark; and a hover
 * tooltip on every mark, because a chart on a screen should answer "what is
 * that?" without the reader counting gridlines.
 */

const MAROON = "#500000";
const INK = "#1a1a1a";
const MUTED = "#6b6b6b";
const LINE = "#e2e0e0";

type Tip = { x: number; y: number; lines: string[] } | null;

/** The shared floating label. Positioned in percentages of the plot box. */
function Tooltip({ tip }: { tip: Tip }) {
  if (!tip) return null;
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-line bg-paper px-2.5 py-1.5 text-[11px] leading-[1.35] text-ink shadow-lg"
      style={{ left: `${tip.x}%`, top: `${tip.y}%` }}
    >
      {tip.lines.map((l, i) => (
        <div key={l + i} className={i === 0 ? "font-semibold" : "text-muted"}>
          {l}
        </div>
      ))}
    </div>
  );
}

export type ScatterPoint = {
  self: number;
  score: number;
  gap: number;
  band: string | null;
  revenue: string | null;
  role: string | null;
  gaps: number;
  when: string | null;
};

/**
 * Self-rating against Clarity Score, one dot per respondent.
 *
 * The diagonal is "score matches self-rating": a dot below it is someone who
 * rated themselves higher than the evidence supported, which is the whole
 * overconfidence story in one picture.
 */
export function ScoreScatter({ points }: { points: ScatterPoint[] }) {
  const [tip, setTip] = useState<Tip>(null);
  const W = 640, H = 340, L = 48, B = 36, T = 12, R = 12;
  const x = (v: number) => L + (v / 100) * (W - L - R);
  const y = (v: number) => T + (1 - v / 100) * (H - T - B);
  // Deterministic jitter so identical answers do not hide behind each other.
  const jitter = (i: number) => ((i * 7919) % 11) - 5;

  return (
    <div className="relative mt-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Self-rating against Clarity Score">
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={LINE} />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill={MUTED}>{v}</text>
          </g>
        ))}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
          <text key={v} x={x(v * 10)} y={H - B + 18} textAnchor="middle" fontSize="11" fill={MUTED}>{v}</text>
        ))}
        <line x1={x(0)} y1={y(0)} x2={x(100)} y2={y(100)} stroke={MUTED} strokeDasharray="4 4" />
        <text x={x(96)} y={y(100) + 14} textAnchor="end" fontSize="11" fill={MUTED}>score matches self-rating</text>

        {points.map((p, i) => {
          const cx = x(p.self * 10) + jitter(i);
          const cy = y(p.score) + jitter(i + 3) / 2;
          const on = tip?.lines[0] === pointTitle(p) && tip.x === (cx / W) * 100;
          return (
            <g key={i}>
              {/* Visible mark, with a surface ring so overlapping dots stay countable. */}
              <circle cx={cx} cy={cy} r={on ? 7 : 5} fill={MAROON} fillOpacity={on ? 0.95 : 0.55} stroke="#fff" strokeWidth={1} />
              {/* Hit target, deliberately bigger than the mark. */}
              <circle
                cx={cx}
                cy={cy}
                r={14}
                fill="transparent"
                onMouseEnter={() => setTip({ x: (cx / W) * 100, y: (cy / H) * 100 - 2, lines: tipLines(p) })}
                onMouseLeave={() => setTip(null)}
                tabIndex={0}
                onFocus={() => setTip({ x: (cx / W) * 100, y: (cy / H) * 100 - 2, lines: tipLines(p) })}
                onBlur={() => setTip(null)}
              >
                <title>{tipLines(p).join(" · ")}</title>
              </circle>
            </g>
          );
        })}
        <text x={(L + W - R) / 2} y={H - 2} textAnchor="middle" fontSize="11" fill={MUTED}>Self-rating before the quiz (1–10)</text>
        <text x={12} y={(T + H - B) / 2} textAnchor="middle" fontSize="11" fill={MUTED} transform={`rotate(-90 12 ${(T + H - B) / 2})`}>Clarity Score</text>
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
}

const pointTitle = (p: ScatterPoint) => `Scored ${p.score}, rated themselves ${p.self * 10}`;

function tipLines(p: ScatterPoint): string[] {
  const gap = p.gap > 0 ? `+${p.gap} overconfident` : p.gap < 0 ? `${p.gap} underconfident` : "Dead on";
  return [
    pointTitle(p),
    `Gap ${gap}`,
    [p.band, `${p.gaps} unanswered`].filter(Boolean).join(" · "),
    [p.role, p.revenue].filter(Boolean).join(" · ") || "No profile given",
    p.when ?? "",
  ].filter(Boolean);
}

/**
 * A histogram with a normal curve of the same mean and standard deviation drawn
 * over it, plus the markers that make the statistics legible: the mean, ±1 SD,
 * and the 95% confidence interval of the mean.
 *
 * The curve is a comparison, not a claim. At these sample sizes the data is not
 * going to look normal, and the caption says so: the point of the curve is to
 * show how far the real distribution sits from the bell the statistics assume.
 */
export function DistributionChart({
  values,
  min,
  max,
  binWidth,
  mean,
  sd,
  ci,
  zeroLine = false,
  unit = "",
  xLabel,
}: {
  values: number[];
  min: number;
  max: number;
  binWidth: number;
  mean: number | null;
  sd: number | null;
  ci: { lo: number; hi: number } | null;
  /** Draw a reference line at zero (used by the overconfidence gap). */
  zeroLine?: boolean;
  unit?: string;
  xLabel: string;
}) {
  const [tip, setTip] = useState<Tip>(null);
  const W = 640, H = 300, L = 42, B = 40, T = 16, R = 14;
  const bins: { lo: number; hi: number; n: number }[] = [];
  for (let lo = min; lo < max; lo += binWidth) {
    const hi = lo + binWidth;
    const last = hi >= max;
    bins.push({
      lo,
      hi,
      n: values.filter((v) => v >= lo && (last ? v <= hi : v < hi)).length,
    });
  }
  const peakCount = Math.max(1, ...bins.map((b) => b.n));
  // The curve is scaled to expected counts (n × binWidth × density) so it sits
  // on the same axis as the bars rather than floating on an invisible second one.
  const density = (v: number) =>
    mean === null || !sd ? 0 : Math.exp(-((v - mean) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));
  const curvePeak = mean === null || !sd ? 0 : values.length * binWidth * density(mean);
  const top = Math.max(peakCount, curvePeak) * 1.15 || 1;

  const x = (v: number) => L + ((v - min) / (max - min)) * (W - L - R);
  const y = (count: number) => T + (1 - count / top) * (H - T - B);

  const curve =
    mean !== null && sd
      ? Array.from({ length: 121 }, (_, i) => {
          const v = min + ((max - min) * i) / 120;
          return `${i ? "L" : "M"}${x(v).toFixed(1)},${y(values.length * binWidth * density(v)).toFixed(1)}`;
        }).join(" ")
      : "";

  const ticks = Array.from({ length: Math.floor((max - min) / (binWidth * 2)) + 1 }, (_, i) => min + i * binWidth * 2);

  return (
    <div className="relative mt-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={xLabel}>
        {/* 95% CI of the mean, behind everything: the band the true mean sits in. */}
        {ci ? (
          <rect x={x(ci.lo)} y={T} width={Math.max(1, x(ci.hi) - x(ci.lo))} height={H - T - B} fill={MAROON} fillOpacity={0.07} />
        ) : null}

        {bins.map((b) => {
          const bx = x(b.lo) + 1;
          const bw = Math.max(1, x(b.hi) - x(b.lo) - 2);
          const on = tip?.lines[0] === binTitle(b, unit);
          return (
            <g key={b.lo}>
              <rect
                x={bx}
                y={y(b.n)}
                width={bw}
                height={Math.max(b.n ? 2 : 0, H - B - y(b.n))}
                rx={3}
                fill={MAROON}
                fillOpacity={on ? 0.9 : 0.55}
              />
              {/* The count sits inside a tall bar and above a short one, so it
                  never lands on the mean or SD markers at the top of the plot. */}
              {b.n ? (
                (() => {
                  const inside = H - B - y(b.n) > 34;
                  return (
                    <text
                      x={bx + bw / 2}
                      y={inside ? y(b.n) + 14 : y(b.n) - 5}
                      textAnchor="middle"
                      fontSize="10"
                      fill={inside ? "#fff" : MUTED}
                      {...(inside ? {} : { stroke: "#fff", strokeWidth: 3, paintOrder: "stroke" })}
                      className="tabular-nums"
                    >
                      {b.n}
                    </text>
                  );
                })()
              ) : null}
              <rect
                x={bx}
                y={T}
                width={bw}
                height={H - T - B}
                fill="transparent"
                onMouseEnter={() =>
                  setTip({ x: ((bx + bw / 2) / W) * 100, y: (y(b.n) / H) * 100 - 2, lines: binLines(b, values.length, unit) })
                }
                onMouseLeave={() => setTip(null)}
              >
                <title>{binLines(b, values.length, unit).join(" · ")}</title>
              </rect>
            </g>
          );
        })}

        {/* The fitted normal curve. */}
        {curve ? <path d={curve} fill="none" stroke={INK} strokeWidth={2} strokeOpacity={0.75} /> : null}

        {/* Reference lines: zero, the mean, and one standard deviation either side. */}
        {zeroLine ? (
          <g>
            <line x1={x(0)} x2={x(0)} y1={T} y2={H - B} stroke={MUTED} strokeDasharray="4 4" />
            <text x={x(0)} y={T - 4} textAnchor="middle" fontSize="10" fill={MUTED} stroke="#fff" strokeWidth={3} paintOrder="stroke">no gap</text>
          </g>
        ) : null}
        {mean !== null ? (
          <g>
            <line x1={x(mean)} x2={x(mean)} y1={T} y2={H - B} stroke={MAROON} strokeWidth={2} />
            <text x={x(mean)} y={T + 10} textAnchor="middle" fontSize="10" fontWeight="700" fill={MAROON} stroke="#fff" strokeWidth={3} paintOrder="stroke">
              mean {Math.round(mean)}{unit}
            </text>
          </g>
        ) : null}
        {mean !== null && sd
          ? [-1, 1].map((k) => {
              const v = mean + k * sd;
              if (v < min || v > max) return null;
              return (
                <g key={k}>
                  <line x1={x(v)} x2={x(v)} y1={T + 26} y2={H - B} stroke={MAROON} strokeOpacity={0.5} strokeDasharray="3 3" />
                  <text x={x(v)} y={T + 22} textAnchor="middle" fontSize="9" fill={MUTED} stroke="#fff" strokeWidth={3} paintOrder="stroke">
                    {k > 0 ? "+" : "−"}1 SD
                  </text>
                </g>
              );
            })
          : null}

        {/* Axes. */}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={LINE} />
        {ticks.map((t) => (
          <text key={t} x={x(t)} y={H - B + 16} textAnchor="middle" fontSize="11" fill={MUTED}>
            {t}{unit}
          </text>
        ))}
        <text x={(L + W - R) / 2} y={H - 4} textAnchor="middle" fontSize="11" fill={MUTED}>{xLabel}</text>
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
}

const binTitle = (b: { lo: number; hi: number }, unit: string) => `${b.lo}${unit} to ${b.hi}${unit}`;

function binLines(b: { lo: number; hi: number; n: number }, total: number, unit: string): string[] {
  return [
    binTitle(b, unit),
    `${b.n} ${b.n === 1 ? "response" : "responses"}`,
    total ? `${Math.round((100 * b.n) / total)}% of ${total}` : "",
  ].filter(Boolean);
}

/**
 * The sampling distribution behind a single proportion, small enough to sit in
 * a hypothesis card.
 *
 * It answers the question the big number cannot: given this many answers, where
 * could the true share actually be? The curve is the normal approximation
 * centred on what we measured, the shaded tail is the side of the falsification
 * line that would support the hypothesis, and the bracket underneath is the
 * 95% confidence interval.
 *
 * The curve is a picture, not the test. The p-value on the card comes from an
 * exact binomial, which is what you should quote at these sample sizes; the
 * normal curve is drawn because a shape communicates uncertainty in a way a pair
 * of numbers does not. The caption on the card says so.
 */
export function ProportionCurve({
  pct,
  n,
  ci,
  threshold,
}: {
  pct: number;
  n: number;
  ci: { lo: number; hi: number } | null;
  threshold: number;
}) {
  const W = 320, H = 108, T = 10, B = 26, L = 6, R = 6;
  const p = Math.min(0.999, Math.max(0.001, pct / 100));
  // Standard error of the proportion, floored so a 0% or 100% reading still
  // draws a curve with visible width rather than a spike.
  const se = Math.max(0.045, Math.sqrt((p * (1 - p)) / Math.max(1, n)));
  const x = (v: number) => L + (v / 100) * (W - L - R);
  const dens = (v: number) => Math.exp(-(((v / 100 - p) / se) ** 2) / 2);
  const yTop = T + 4;
  const base = H - B;
  const y = (d: number) => base - d * (base - yTop);

  const pts = Array.from({ length: 161 }, (_, i) => (100 * i) / 160);
  const line = pts.map((v, i) => `${i ? "L" : "M"}${x(v).toFixed(1)},${y(dens(v)).toFixed(1)}`).join(" ");
  const tail = pts.filter((v) => v >= threshold);
  const fill = tail.length
    ? `M${x(tail[0]!).toFixed(1)},${base} ` +
      tail.map((v) => `L${x(v).toFixed(1)},${y(dens(v)).toFixed(1)}`).join(" ") +
      ` L${x(tail[tail.length - 1]!).toFixed(1)},${base} Z`
    : "";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img"
      aria-label={`Where the true share could sit: measured ${Math.round(pct)}%, falsification line ${threshold}%`}>
      {fill ? <path d={fill} fill={MAROON} fillOpacity={0.14} /> : null}
      <path d={line} fill="none" stroke={MAROON} strokeWidth={1.75} />
      <line x1={L} x2={W - R} y1={base} y2={base} stroke={LINE} />

      {/* The falsification line: above it supports the hypothesis, below it does not. */}
      <line x1={x(threshold)} x2={x(threshold)} y1={yTop - 4} y2={base} stroke={INK} strokeDasharray="4 3" />
      <text x={x(threshold)} y={yTop - 6} textAnchor="middle" fontSize="9" fill={INK} stroke="#fff" strokeWidth={3} paintOrder="stroke">
        line {threshold}%
      </text>

      {/* What we measured. */}
      <line x1={x(pct)} x2={x(pct)} y1={y(1)} y2={base} stroke={MAROON} strokeWidth={2} />

      {/* The 95% interval, as a bracket under the axis. */}
      {ci ? (
        <g>
          <line x1={x(ci.lo)} x2={x(ci.hi)} y1={base + 9} y2={base + 9} stroke={MAROON} strokeWidth={2} />
          <line x1={x(ci.lo)} x2={x(ci.lo)} y1={base + 5} y2={base + 13} stroke={MAROON} strokeWidth={2} />
          <line x1={x(ci.hi)} x2={x(ci.hi)} y1={base + 5} y2={base + 13} stroke={MAROON} strokeWidth={2} />
          <text x={x(ci.lo)} y={base + 24} textAnchor="start" fontSize="9" fill={MUTED}>{Math.round(ci.lo)}%</text>
          <text x={x(ci.hi)} y={base + 24} textAnchor="end" fontSize="9" fill={MUTED}>{Math.round(ci.hi)}%</text>
        </g>
      ) : null}
    </svg>
  );
}
