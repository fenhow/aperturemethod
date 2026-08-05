import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "The white space" — a 2×2 positioning matrix showing the category-of-one gap
 * Aperture occupies: graduate-level strategy AND spatial/GIS intelligence, built
 * for owner-run businesses. Everyone else sits in a different, crowded quadrant.
 */
const CELLS = [
  {
    // top-left
    k: "Local advisors, CPAs & DIY",
    d: "Close and affordable — but not doing the quantitative or spatial work.",
    aperture: false,
  },
  {
    // top-right: the white space
    k: "Aperture",
    d: "Graduate-level analytics AND spatial intelligence — done for you, at your size.",
    aperture: true,
  },
  {
    // bottom-left
    k: "GIS, marketing & data vendors",
    d: "Maps, demographics, and lists — but no strategy to turn them into decisions.",
    aperture: false,
  },
  {
    // bottom-right: high strategy, low GIS
    k: "Big consultancies",
    d: "Real strategy — but no GIS, and priced and staffed for the enterprise.",
    aperture: false,
  },
];

export function Whitespace() {
  return (
    <Section id="why-different" tone="surface">
      <Reveal className="max-w-measure">
        <SectionHeading
          eyebrow="Why we're different"
          title="The corner no one else occupies."
          lede="Plot the market on two axes — strategic depth and spatial intelligence — and one quadrant sits empty. That's where Aperture lives."
        />
      </Reveal>

      <Reveal variant="up" delay={100} className="mt-10">
        <div className="flex gap-3">
          {/* Y axis */}
          <div className="hidden items-center sm:flex">
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-muted [writing-mode:vertical-rl] rotate-180">
              Spatial &amp; local market intelligence →
            </span>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3">
              {CELLS.map((c) =>
                c.aperture ? (
                  <div
                    key={c.k}
                    className="flex min-h-[150px] flex-col rounded-lg border-2 border-maroon bg-[#f8e7e6] p-6 shadow-[0_0_0_4px_rgba(80,0,0,0.06)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-maroon" aria-hidden="true" />
                      <span className="text-overline font-semibold uppercase tracking-overline text-maroon">
                        The white space
                      </span>
                    </div>
                    <h3 className="mt-2 text-h3 font-semibold text-ink">{c.k}</h3>
                    <p className="mt-2 text-body text-body">{c.d}</p>
                  </div>
                ) : (
                  <div
                    key={c.k}
                    className="flex min-h-[150px] flex-col rounded-lg border border-line bg-paper/60 p-6"
                  >
                    <h3 className="text-h4 font-semibold text-muted">{c.k}</h3>
                    <p className="mt-2 text-small text-muted">{c.d}</p>
                  </div>
                )
              )}
            </div>
            {/* X axis */}
            <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              MBA-grade strategy &amp; analytics →
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={140} className="mt-8">
        <p className="max-w-measure text-body-lg text-body">
          <span className="font-semibold text-ink">Big consultancies don&apos;t do GIS for small firms.
          Marketing and data vendors don&apos;t do MBA-grade strategy.</span>{" "}
          Aperture is the only firm that brings graduate-level analytics and spatial intelligence
          together — and builds it for owner-run businesses.
        </p>
      </Reveal>
    </Section>
  );
}
