import { Fragment } from "react";

/**
 * "The arc": the MBA → GIS → DATA spine, as a prominent three-stage visual.
 * The middle stage carries the spatial/GIS + demographics & human-data story.
 *
 * NO NUMERALS ON THESE CARDS, deliberately.
 *
 * They used to read 01 / 02 / 03, and the section's own lede opens with "One
 * methodology, five components". A reader met "five components" and then, a
 * line later, a numbered sequence that stopped at three, which looks like two
 * cards failed to load. Worse, the five components ARE listed a few hundred
 * pixels below in the same section, also numbered 01 to 05, so one numbering
 * system meant two different things on one screen.
 *
 * These three are not the components. They are the capabilities the method is
 * built ON: the analysis, the geography, and the platform it all lands in. The
 * arrows already carry the sequence, and the MBA / GIS / DATA chips already
 * name each one, so the numerals were adding nothing except the collision.
 *
 * SHADED, not white. The five component cards sit a few hundred pixels below
 * these in the same section, and both were white cards with a hairline border
 * on a white background: two different kinds of thing, rendered identically,
 * which is how a reader ends up counting eight of something. The surface tint
 * says "these are a different axis" before a word is read.
 */
const STAGES = [
  {
    cap: "MBA",
    label: "MBA-grade analytics",
    desc:
      "Profit drivers, forecasting, segmentation, break-even and optimization, applied to your business.",
  },
  {
    cap: "GIS",
    label: "Spatial intelligence",
    desc:
      "Geographic intelligence plus deep demographic & human data, age, sex, income, households, and spending, mapped to trade areas and exactly where your customers are.",
  },
  {
    cap: "DATA",
    label: "A living data platform",
    desc:
      "Every layer brought together on one always-on, visual dashboard you run the business from.",
  },
];

export function TheArc() {
  return (
    <div>
      <p className="eyebrow mb-6">What it is built on: three capabilities</p>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {STAGES.map((s, i) => (
          <Fragment key={s.cap}>
            <div className="flex flex-1 flex-col rounded-lg border border-line bg-surface p-6 hover-lift">
              <div className="flex items-center">
                <span className="rounded-full border border-maroon/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-maroon">
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

      {/* The key.

          The five component cards below this row carry the same MBA / GIS /
          DATA chips, as a pointer back to these three. Without this sentence a
          reader takes "MBA" on a product card as a credential badge rather
          than a cross-reference, which is both the wrong meaning and a boast
          nobody asked for. One line turns three decorations into a legend. */}
      <p className="mt-5 text-small text-muted">
        Each of the five components below draws on one or more of these three. The tags on those
        cards point back here.
      </p>
    </div>
  );
}
