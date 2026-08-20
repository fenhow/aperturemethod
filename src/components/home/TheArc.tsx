import { Fragment } from "react";

/**
 * "The arc": the MBA → GIS → DATA spine, as a prominent three-stage visual.
 * The middle stage carries the spatial/GIS + demographics & human-data story.
 */
const STAGES = [
  {
    n: "01",
    cap: "MBA",
    label: "MBA-grade analytics",
    desc:
      "Profit drivers, forecasting, segmentation, break-even and optimization, applied to your business.",
  },
  {
    n: "02",
    cap: "GIS",
    label: "Spatial intelligence",
    desc:
      "Geographic intelligence plus deep demographic & human data, age, sex, income, households, and spending, mapped to trade areas and exactly where your customers are.",
  },
  {
    n: "03",
    cap: "DATA",
    label: "A living data platform",
    desc:
      "Every layer brought together on one always-on, visual dashboard you run the business from.",
  },
];

export function TheArc() {
  return (
    <div>
      <p className="eyebrow mb-6">The arc: from analysis to a living platform</p>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {STAGES.map((s, i) => (
          <Fragment key={s.n}>
            <div className="flex flex-1 flex-col rounded-lg border border-line bg-paper p-6 hover-lift">
              <div className="flex items-center justify-between">
                <span className="text-h4 font-semibold tabular-nums text-maroon">{s.n}</span>
                <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                  {s.cap}
                </span>
              </div>
              <h3 className="mt-3 text-h4 font-semibold text-ink">{s.label}</h3>
              <p className="mt-2 text-small text-muted">{s.desc}</p>
            </div>
            {i < STAGES.length - 1 && (
              <div className="flex items-center justify-center lg:px-1" aria-hidden="true">
                <span className="text-h3 font-semibold text-maroon lg:rotate-0">→</span>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
