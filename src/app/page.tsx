import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { MethodAperture } from "@/components/sections/MethodAperture";
import { MarketMapLive } from "@/components/sections/MarketMapLive";
import { RevenueForecastLive } from "@/components/sections/RevenueForecastLive";
import { ApertureHero } from "@/components/home/ApertureHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BookSection } from "@/components/home/BookSection";
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

      {/* One methodology. Six components. */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="The Aperture Method™"
            title="One methodology. Five components."
            lede="The Aperture Method is the whole system — a repeatable path that takes a business from a first honest assessment all the way to a living, visual intelligence platform. Engage a single component when that's all you need, or run the full Method. Either way, you work with the same senior partner throughout."
          />
        </Reveal>

        <Reveal delay={80} className="mt-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-small text-muted">
            <span className="font-semibold text-ink">The arc:</span>
            <span className="rounded-full border border-line px-3 py-1 font-semibold uppercase tracking-[0.1em] text-body">
              MBA analytics
            </span>
            <span aria-hidden="true">→</span>
            <span className="rounded-full border border-line px-3 py-1 font-semibold uppercase tracking-[0.1em] text-body">
              Spatial · GIS
            </span>
            <span aria-hidden="true">→</span>
            <span className="rounded-full border border-line px-3 py-1 font-semibold uppercase tracking-[0.1em] text-body">
              Live data platform
            </span>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-6">
          <p className="max-w-measure text-body text-muted">
            <span className="font-semibold text-ink">Not sure which you need?</span> Start with a{" "}
            <span className="font-semibold text-ink">Business X-Ray</span> — a fixed-fee diagnostic
            that pinpoints your #1 constraint and prescribes exactly which components will move the
            needle. One, a few, or all five.
          </p>
        </Reveal>
      </Section>

      {/* The six components — the aperture dial */}
      <Section tone="surface" id="method">
        <Reveal>
          <SectionHeading
            eyebrow="The five components"
            title="See how the Method works."
            lede="Each component answers one executive question and produces a tangible deliverable — and each is powered by MBA-grade analytics, spatial intelligence, or live data. Run them in sequence and it becomes The Aperture Method™."
          />
        </Reveal>
        <Reveal variant="zoom" delay={120} className="mt-12">
          <MethodAperture phases={aperturePractices} />
        </Reveal>
      </Section>

      {/* Start anywhere — the selectable menu */}
      <Section>
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
        </div>
        <p className="mt-8">
          <LinkArrow href="/the-aperture-method">Explore the full Method</LinkArrow>
        </p>
      </Section>

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
