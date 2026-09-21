import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "How it works": the engagement model, and the only place on the homepage
 * that carries fees.
 *
 * Its lede used to repeat two lines that the Method section above already
 * makes: "take one result or the full path", which is that section's whole
 * premise, and "the same senior partner throughout", which is the last
 * sentence of its lede. Said once, higher up, they set expectations; said
 * again here they read as a page that has lost track of what it has told you. Opens with the default door (a
 * fixed-fee Business X-Ray that routes the undecided), then the two ways
 * forward: one result (a single component) or the full path (the Method),
 * with Aperture Atlas as the ongoing layer.
 *
 * NO FEES IN THIS SECTION as of Sept 2026. It carried six of them, including a
 * three-column Atlas price table, and together with the FAQ the homepage was
 * quoting ten figures. They live on /pricing now, which puts the deliverable
 * above its price and keeps the terms attached. The only figure left on the
 * homepage is the X-Ray fee in the Method section above, which is there to
 * qualify the reader rather than to sell. What remains here is the shape of
 * the offer: what each step is, and what it is priced by.
 */
import { ProductName } from "@/components/brand/ProductName";
import { SNAPSHOT_CEILING, SNAPSHOT_CREDIT_TERMS, ATLAS_TIERS, ATLAS_TERMS } from "@/lib/pricing";

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <Reveal className="max-w-measure">
        <SectionHeading
          eyebrow="How it works"
          title="How does an engagement actually work?"
          lede="You start with clarity and end with a system you run the business from. Every engagement starts the same way: a low-risk diagnostic that shows you exactly what you need, and finishes in the same place: Aperture Atlas, your live intelligence platform."
        />
      </Reveal>

      {/* Default door: the Business X-Ray */}
      <Reveal variant="up" delay={80} className="mt-10">
        <div className="overflow-hidden rounded-2xl border border-maroon/30 bg-surface">
          <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-2xl">
              <p className="eyebrow">Step 01 · Aperture Insights™ · Start here</p>
              <h3 className="mt-2 text-h3 font-semibold text-ink">
                Start with the Business X-Ray.
              </h3>
              <p className="mt-3 text-body text-muted">
                A seven-lens read of where your business stands today, broad by design, not deep.
                It names your likely #1 constraint, gives you an Aperture Score to measure from,
                and tells you exactly where the digging needs to happen. The way in, and the whole
                of Step 01.
              </p>
            </div>
            <div className="shrink-0 md:text-right">
              {/* Named after the product, so it points at the product's page
                  rather than at the general booking form. */}
              <Link href="/business-x-ray" className="btn mt-4">
                Book your Business X-Ray
              </Link>
            </div>
          </div>

        </div>
      </Reveal>

      {/* The lighter depth, given its own card.

          It used to be one grey line at the foot of the X-Ray card, on the
          argument that a smaller visitor needed an honest answer but not a
          competing offer. That was too quiet. A business under the ceiling
          reading this section had no product it could actually buy, and a
          footnote does not read as an offer; it reads as a disclaimer. This is
          the same card the pricing page shows, deliberately subordinate to the
          X-Ray above it: dashed border rather than solid, no button, and a link
          rather than a booking action.

          Every figure comes from lib/pricing.ts, including the ceiling, so this
          card and the fee schedule can never quote different numbers. */}
      <Reveal variant="up" delay={100} className="mt-6">
        <div className="hover-lift rounded-lg border border-dashed border-line bg-paper p-8 md:p-10">
          <p className="eyebrow">
            Under {SNAPSHOT_CEILING} in revenue · <ProductName short="Insights" /> · Snapshot
          </p>
          <div className="mt-2 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-h3 font-semibold text-ink">
                Smaller than that, and still want the analysis?
              </h3>
              <p className="mt-3 text-body text-muted">
                The Aperture Snapshot is the same seven lenses as the X-Ray, read from the
                documents you submit. No interview, no triangulation against what the numbers
                actually show, and the Aperture Score it returns is marked provisional because it
                has not been tested. It is an honest read for a business that is not yet the size
                the rest of this page is built for.
              </p>
            </div>
            <div className="shrink-0 md:text-right">
              <Link href="/snapshot" className="link-arrow">
                What the Snapshot covers
                <span className="arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
          <p className="mt-6 border-t border-line pt-4 text-small text-muted">
            It {SNAPSHOT_CREDIT_TERMS}. Not offered above {SNAPSHOT_CEILING}: at that size the
            X-Ray is the honest way in.
          </p>
        </div>
      </Reveal>

      {/* Two paths */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Reveal variant="up" delay={120}>
          <div className="flex h-full flex-col rounded-lg border border-line bg-paper p-8 hover-lift">
            <p className="eyebrow">Step 02 · Go deep on one</p>
            <h3 className="mt-2 text-h4 font-semibold text-ink">Take a single component.</h3>
            <p className="mt-3 flex-1 text-body text-muted">
              This is where the depth lives. Engage Analytics, Intelligence or Compass as a
              fixed-fee project, the numbers, the market, or the plan, when you already know
              which one you need. Complete on its own.
            </p>
            <Link href="#method" className="link-arrow mt-6">
              Browse the five components
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
        </Reveal>

        <Reveal variant="up" delay={160}>
          <div className="flex h-full flex-col rounded-lg border border-ink bg-ink p-8 text-paper hover-lift">
            <p className="eyebrow eyebrow--on-dark">Step 02 · The full path</p>
            <h3 className="mt-2 text-h4 font-semibold text-paper">Run the whole Method.</h3>
            <p className="mt-3 flex-1 text-body text-white/70">
              All five components in sequence, from the first honest assessment to a living platform
              you run the business from. The complete transformation.
            </p>
            <Link href="/the-aperture-method" className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-paper transition-colors hover:text-maroon-onDark">
              See the full Method
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Step 03: the destination */}
      <Reveal variant="up" delay={140} className="mt-6">
        <div className="overflow-hidden rounded-2xl border border-maroon/30 bg-surface">
          <div className="flex flex-col gap-8 p-8 md:p-10">
            <div className="max-w-2xl">
              <p className="eyebrow">Step 03 · Where it ends up</p>
              <h3 className="mt-2 text-h3 font-semibold text-ink">
                Then you run the business from Aperture Atlas™.
              </h3>
              <p className="mt-3 text-body text-muted">
                A project ends. A system doesn&apos;t. Atlas is your live platform: the Scoreboard,
                your Market Maps, drive-time trade areas and forecasts, always current. It is where
                the whole engagement stays alive, and it is the point of the exercise.
              </p>
            </div>

            {/* Tier names, no fees. This was a three-column price table sitting
                in the middle of a narrative section, which is what made the
                homepage read like a menu. What a reader needs here is that
                Atlas is priced by how many places they run; what it costs is
                one click away and better presented there. */}
            <div className="grid gap-4 sm:grid-cols-3">
              {ATLAS_TIERS.map((t) => (
                <div key={t.label} className="hover-lift rounded-lg border border-line bg-paper p-5">
                  <p className="text-h4 font-semibold text-ink">{t.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-small text-muted">
                Priced by location count, on a {ATLAS_TERMS}.
              </p>
              <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2">
                <Link href="/pricing" className="link-arrow">
                  See Atlas pricing
                  <span className="arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
                <Link href="/method/atlas" className="link-arrow">
                  See the platform
                  <span className="arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Standalone: the high-stakes spatial question.

          The trigger deliberately covers any commitment to a place, not just a
          lease: owners buy, build, franchise and widen service areas too, and a
          lease-only hook was invisible to all of them. It still says "scores
          candidate sites and territories", which is what keeps the boundary
          with the Market Map intact. The Map answers "where should we look";
          this answers "which of these", and is priced on the size of that
          decision. See the FAQ copy in landing.ts and industries.ts, which
          draws the same line. */}
      {true && (
        <Reveal delay={160} className="mt-6">
          <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-dashed border-line px-6 py-5 sm:flex-row sm:items-center">
            <p className="text-body text-muted">
              <span className="font-semibold text-ink">
                Opening a location or entering a new market?
              </span>{" "}
              A standalone <span className="font-semibold text-ink">Site Selection Study</span>{" "}
              scores candidate sites and territories on real geography, trade areas, drive times
              and demand, before you commit. A second location, a new city, a wider service area.{" "}
              <span className="text-muted">A standalone fixed-fee study.</span>
            </p>
            <Link href="/method/intelligence" className="link-arrow shrink-0">
              How we do it
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
        </Reveal>
      )}

      {/* One route to the schedule, at the foot of the section.

          The homepage used to carry ten separate fee figures across this
          section and the FAQ. They are all on /pricing now, where the
          deliverable sits above its price and the terms travel with it. The
          single figure left on this page is the X-Ray fee, up in the Method
          section, because that one qualifies the reader rather than selling
          to them. */}
      <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
        <p className="text-small text-muted">
          Every engagement is a fixed fee, agreed and scoped before any work starts. No hourly
          billing.
        </p>
        <Link href="/pricing" className="link-arrow shrink-0">
          See every fee
          <span className="arrow" aria-hidden="true">
            &rarr;
          </span>
        </Link>
      </div>
    </Section>
  );
}
