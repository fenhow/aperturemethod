import Link from "next/link";
import { XRAY_FEE, XRAY_CREDIT_TERMS } from "@/lib/pricing";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { MarketMapLive } from "@/components/sections/MarketMapLive";
import { RevenueForecastLive } from "@/components/sections/RevenueForecastLive";
import { ApertureHero } from "@/components/home/ApertureHero";
import { TheArc } from "@/components/home/TheArc";
import { Whitespace } from "@/components/home/Whitespace";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BookSection } from "@/components/home/BookSection";
import { QuickContactCard } from "@/components/forms/QuickContactCard";
import { DocumentLightbox } from "@/components/ui/DocumentLightbox";
import { LookCloserBand } from "@/components/education/LookCloserBand";

const EXAMPLE_REPORT = "/reports/Lumina-Aperture-Method-Example-Report.pdf";
import { aperturePractices } from "@/lib/content";
import { primaryCta } from "@/lib/site";

/**
 * Homepage — the parent front door for The Aperture Method™. The methodology is
 * the parent; its six components (Insights → Analytics → Intelligence → Compass
 * → Live → Atlas) can be engaged one at a time or as the full Method. Leads into
 * the existing site. (The previous marketing homepage is preserved at /overview.)
 */

export default function Home() {
  return (
    <>
      <ApertureHero />

      {/* One methodology, five components — the MBA → GIS → DATA arc + the X-Ray front door */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="The Aperture Method™"
            title="One methodology. Five components."
            lede="The Aperture Method is the whole system — a repeatable path that takes a business from a first honest assessment all the way to a living, visual intelligence platform. Engage a single component when that's all you need, or run the full Method. Either way, you work with the same senior partner throughout."
          />
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <TheArc />
        </Reveal>

        <Reveal delay={120} className="mt-8">
          <div className="rounded-2xl border border-maroon/30 bg-surface p-7 sm:p-9">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
              {/* Left — what the X-Ray is, with ways to explore before booking */}
              <div>
                <p className="eyebrow">Start here · Aperture Insights™</p>
                <p className="mt-2 text-h3 font-semibold text-ink">
                  Not sure where to start? Begin with a Business X-Ray&trade;.
                </p>
                <p className="mt-3 text-body text-muted">
                  A fixed-fee read of your whole business across seven lenses. Broad by design rather
                  than deep: it names your likely #1 constraint and tells you exactly where the digging
                  needs to happen — the numbers, the market, or the plan.
                </p>
                <ul className="mt-5 space-y-2">
                  {[
                    "A seven-lens read of the whole business",
                    "Your #1 constraint, clearly named",
                    "Your Aperture Score™ — a baseline to track",
                  ].map((li) => (
                    <li key={li} className="flex items-start gap-2.5 text-small text-body">
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-maroon"
                        aria-hidden="true"
                      />
                      {li}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-small text-muted">
                  Fixed fee of <span className="font-semibold text-ink">{XRAY_FEE}</span>,
                  {" "}{XRAY_CREDIT_TERMS} · real insight in its first weeks.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link href={primaryCta.href} className="btn">
                    {primaryCta.label}
                  </Link>
                  <LinkArrow href="/deliverables/business-x-ray">What the X-Ray is</LinkArrow>
                </div>
                <div className="mt-4">
                  <DocumentLightbox
                    href={EXAMPLE_REPORT}
                    page={10}
                    title="Example Report · Business X-Ray — Lumina Medical Aesthetics"
                    triggerLabel="See a real Business X-Ray in the example report"
                    triggerClassName="inline-flex items-center gap-2 text-small font-semibold text-maroon transition-colors hover:text-maroon-hover"
                  />
                </div>
              </div>

              {/* Right — the five components it points you to, each linked */}
              <div className="rounded-xl border border-line bg-paper p-6">
                <p className="text-overline font-semibold uppercase tracking-overline text-muted">
                  Where it points you — the five components
                </p>
                <ul className="mt-3 divide-y divide-line">
                  {aperturePractices.map((pr) => (
                    <li key={pr.n}>
                      <Link
                        href={`/method/${pr.short.toLowerCase()}`}
                        className="group flex items-center gap-3 py-3"
                      >
                        <span className="text-small font-semibold tabular-nums text-maroon">
                          {pr.n}
                        </span>
                        <span className="flex-1 text-small font-medium text-ink group-hover:text-maroon">
                          {pr.product}&trade;
                        </span>
                        <span
                          className="translate-x-0 text-maroon opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                          aria-hidden="true"
                        >
                          &rarr;
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-line pt-4">
                  <LinkArrow href="#how-it-works">See how it works</LinkArrow>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Start anywhere — the selectable menu. Carries the #method anchor that the
          hero and How-it-works link to, since the aperture dial above it was removed. */}
      <Section tone="surface" id="method">
        <Reveal>
          <SectionHeading
            eyebrow="Start anywhere"
            title="Take one component, or the whole Method."
            lede="Every component is a complete engagement on its own, and a step in the larger arc. Pick where it hurts most today — or let the Business X-Ray choose for you."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aperturePractices.map((p, i) => (
            <Reveal key={p.n} variant="up" delay={(i % 3) * 80}>
              <Link
                href={`/method/${p.short.toLowerCase()}`}
                className="group flex h-full flex-col rounded-lg border border-line bg-paper p-7 hover-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="text-h4 font-semibold tabular-nums text-maroon">{p.n}</span>
                  {p.cap && (
                    <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {p.cap}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-h4 font-semibold text-ink group-hover:text-maroon">
                  {p.product}&trade;
                </h3>
                <p className="mt-2 flex-1 text-small text-muted">{p.line}</p>
                <span className="link-arrow mt-5 text-[14px]">
                  {p.short === "Atlas" ? "See the platform" : "Explore"}
                  <span className="arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}

          {/* Quick contact — fills the sixth slot in the 3-column grid */}
          <Reveal variant="up" delay={160}>
            <QuickContactCard />
          </Reveal>
        </div>
        <p className="mt-8">
          <LinkArrow href="/the-aperture-method">Explore the full Method</LinkArrow>
        </p>
      </Section>

      {/* The white space — the category-of-one positioning matrix */}
      <Whitespace />

      {/* How it works — the engagement model + pricing */}
      <HowItWorks />

      {/* Aperture Atlas — the living platform (live demos) */}
      <Section tone="dark" id="atlas">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-5">Aperture Atlas™ · the platform</p>
          <h2 className="text-h2 font-semibold text-paper">
            Where the analysis comes alive.
          </h2>
          <p className="mt-6 text-body-lg text-white/75">
            Aperture Atlas is the Geographic Intelligence Platform at the end of the arc — your
            market, customers, competitors, and performance on one live, interactive map, powered by
            SyncPoint AI. When an engagement ends, Atlas keeps running: the dashboards, Market Maps,
            and forecasts stay current, and they&apos;re yours to keep.
          </p>
        </Reveal>

        <Reveal variant="up" delay={120} className="mt-12">
          <figure className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
            <MarketMapLive tone="dark" className="block" />
            <figcaption className="border-t border-white/10 px-6 py-4 text-small text-white/60">
              A Market Map inside Atlas — trade areas, drive-time rings, and where demand actually
              clusters.
            </figcaption>
          </figure>
        </Reveal>

        <Reveal variant="up" delay={160} className="mt-6">
          <RevenueForecastLive />
          <p className="mt-3 text-small text-white/55">
            A live revenue forecast — Atlas doesn&apos;t just show your numbers, it continuously
            projects where the business is heading.
          </p>
        </Reveal>
      </Section>

      {/* The book — in progress */}
      <BookSection />

      {/* Look Closer — the free classroom session (community, not commercial) */}
      <LookCloserBand />

      {/* Final CTA */}
      <Section tone="dark" className="border-t border-white/10">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                See your business clearly. Then watch the strategy run.
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                Start with the Business X-Ray — a fixed-fee, low-risk first step that shows you which
                components you need.
              </p>
            </div>
            <Link href={primaryCta.href} className="btn--on-dark shrink-0">
              {primaryCta.label}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
