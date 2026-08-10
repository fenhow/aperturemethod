import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { primaryCta } from "@/lib/site";

/**
 * "How it works" — the engagement model. Opens with the default door (a
 * fixed-fee Business X-Ray that routes the undecided), then the two ways
 * forward: one result (a single component) or the full path (the Method),
 * with Aperture Atlas as the ongoing layer.
 *
 * Prices come from src/lib/pricing.ts — the ratified SOW schedule. They used to be
 * hard-coded here, and the comment that said "placeholders, swap for Fenwick's real
 * numbers" outlived the real numbers by some months.
 */
import { PRICES } from "@/lib/pricing";

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <Reveal className="max-w-measure">
        <SectionHeading
          eyebrow="How it works"
          title="Start with clarity. Then choose your path."
          lede="Every engagement starts the same way — a low-risk diagnostic that shows you exactly what you need. From there, take one result or the full path. You work with the same senior partner throughout."
        />
      </Reveal>

      {/* Default door — the Business X-Ray */}
      <Reveal variant="up" delay={80} className="mt-10">
        <div className="overflow-hidden rounded-2xl border border-maroon/30 bg-surface">
          <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-2xl">
              <p className="eyebrow">Start here · Step 01</p>
              <h3 className="mt-2 text-h3 font-semibold text-ink">
                Not sure where to start? Begin with a Business X-Ray.
              </h3>
              <p className="mt-3 text-body text-muted">
                A fixed-fee diagnostic that finds your #1 constraint and prescribes exactly which
                components will move the needle — one, a few, or all five. No guessing, no risk.
              </p>
            </div>
            <div className="shrink-0 md:text-right">
              {PRICES.xray && (
                <p className="text-small uppercase tracking-overline text-muted">
                  Fixed fee · from{" "}
                  <span className="text-h4 font-semibold normal-case tracking-normal text-maroon">
                    {PRICES.xray}
                  </span>
                </p>
              )}
              <Link href={primaryCta.href} className="btn mt-4">
                Book your Business X-Ray
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Two paths */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Reveal variant="up" delay={120}>
          <div className="flex h-full flex-col rounded-lg border border-line bg-paper p-8 hover-lift">
            <p className="eyebrow">One result</p>
            <h3 className="mt-2 text-h4 font-semibold text-ink">Take a single component.</h3>
            <p className="mt-3 flex-1 text-body text-muted">
              Engage one component as a fixed-fee project — when you already know the one thing you
              need (the numbers, the market, the plan). Complete on its own.
            </p>
            {PRICES.component && (
              <p className="mt-6 text-small uppercase tracking-overline text-muted">
                From{" "}
                <span className="text-h4 font-semibold normal-case tracking-normal text-ink">
                  {PRICES.component}
                </span>{" "}
                per component
              </p>
            )}
            <Link href="#method" className="link-arrow mt-4">
              Browse the five components
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
        </Reveal>

        <Reveal variant="up" delay={160}>
          <div className="flex h-full flex-col rounded-lg border border-ink bg-ink p-8 text-paper hover-lift">
            <p className="eyebrow eyebrow--on-dark">The full path</p>
            <h3 className="mt-2 text-h4 font-semibold text-paper">Run the whole Method.</h3>
            <p className="mt-3 flex-1 text-body text-white/70">
              All five components in sequence — from the first honest assessment to a living platform
              you run the business from. The complete transformation.
            </p>
            {PRICES.full && (
              <p className="mt-6 text-small uppercase tracking-overline text-white/50">
                Full engagement · from{" "}
                <span className="text-h4 font-semibold normal-case tracking-normal text-paper">
                  {PRICES.full}
                </span>
              </p>
            )}
            <Link href="/the-aperture-method" className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-paper transition-colors hover:text-maroon-onDark">
              See the full Method
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Stay-on layer */}
      <Reveal delay={120} className="mt-6">
        <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-dashed border-line px-6 py-5 sm:flex-row sm:items-center">
          <p className="text-body text-muted">
            <span className="font-semibold text-ink">Then stay on with Aperture Atlas™</span> — your
            live platform of dashboards, Market Maps, and forecasts, yours to keep.
            {PRICES.atlas && <span className="text-muted"> Ongoing, from {PRICES.atlas}.</span>}
          </p>
          <Link href="/method/atlas" className="link-arrow shrink-0">
            See the platform
            <span className="arrow" aria-hidden="true">
              &rarr;
            </span>
          </Link>
        </div>
      </Reveal>

      <p className="mt-6 text-small text-muted">
        Indicative pricing — every engagement is fixed-fee and scoped to your business before you
        commit.
      </p>
    </Section>
  );
}
