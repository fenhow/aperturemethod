import Link from "next/link";
import { EXAMPLE_REPORT, reportPages } from "@/lib/exampleReport";
import { XRAY_FEE, XRAY_CREDIT_TERMS } from "@/lib/pricing";
import { FIGURES } from "@/lib/marketContext";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { AtlasMarketMap } from "@/components/sections/AtlasMarketMap";
import { RevenueForecastLive } from "@/components/sections/RevenueForecastLive";
import { ApertureHero } from "@/components/home/ApertureHero";
import { TheArc } from "@/components/home/TheArc";
import { Whitespace } from "@/components/home/Whitespace";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BookSection } from "@/components/home/BookSection";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeProblem } from "@/components/home/HomeProblem";
import { HomeProof } from "@/components/home/HomeProof";
import { DocumentLightbox } from "@/components/ui/DocumentLightbox";
import { ThirtySeconds } from "@/components/home/ThirtySeconds";
import { GdpRunRate } from "@/components/market/GdpRunRate";

import { aperturePractices } from "@/lib/content";
import { primaryCta, siteConfig, HOME_REVIEWED } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { ldWebPage } from "@/lib/seo";

/**
 * Homepage: the parent front door for The Aperture Method™. The methodology is
 * the parent; its six components (Insights → Analytics → Intelligence → Compass
 * → Live → Atlas) can be engaged one at a time or as the full Method. Leads into
 * the existing site. (The previous marketing homepage is preserved at /overview.)
 */

export default function Home() {
  return (
    <>
      <JsonLd
        data={ldWebPage({
          title: siteConfig.name,
          description: siteConfig.description,
          path: "/",
          dateModified: HOME_REVIEWED,
        })}
      />
      <ApertureHero />

      {/* The stakes: the share, and the same share as money moving.

          This was a thin dark band with no heading, wedged between the dark
          hero and the white page, and it read as hero overflow rather than an
          idea of its own. The counter is the single thing on this site nobody
          else could build, and it was being spent as a ticker.

          It is a section now, with an argument stated out loud. It sits here
          rather than at the close on purpose: the problem section directly
          below is personal and small-scale, so this is the macro frame that
          makes it land. Big economy, underserved, and then "you cannot see
          your own corner of it."

          NOT using <Section>: globals.css collapses the top padding of a dark
          section that follows another dark section, which is the rule that made
          this hug the hero in the first place. The padding lives on the inner
          container instead, where that rule cannot reach it, and a hairline top
          border does the separating.

          A percentage is an argument; money moving is a feeling. The run rate
          is that share of the last published quarter divided by the seconds in
          a year, and it says so plainly. Read the note above GDP_RUN_RATE in
          marketContext.ts before changing a word of it. */}
      <section className="border-t border-white/10 bg-dark text-paper">
        <Container>
          <div className="py-14 md:py-20">
            <Reveal className="max-w-measure">
              <p className="eyebrow eyebrow--on-dark mb-5">The stakes</p>
              <h2 className="text-h2 font-semibold text-paper">
                {FIGURES.shareOfGdp.value} of the US economy runs on businesses like yours.
              </h2>
              <p className="mt-5 text-body-lg text-white/75">
                Almost none of it gets the analysis a listed company takes for granted. Not because
                the work does not apply at your size, but because nobody has been selling it to you.
                That is the gap this firm exists to close.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-10">
              <div className="flex flex-col gap-6 border-t border-white/15 pt-8 lg:flex-row lg:items-end lg:justify-between">
                <GdpRunRate onDark />
                <div className="shrink-0 lg:text-right">
                  <p className="text-small text-white/45">
                    Run rate from BEA, Q2 2026. Not a live reading.
                  </p>
                  <Link
                    href="/the-intelligence-gap"
                    className="group mt-2 inline-flex items-center gap-1.5 text-[15px] font-semibold text-paper transition-colors hover:text-maroon-onDark"
                  >
                    See why that matters
                    <span
                      className="inline-block transition-transform duration-fast group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* The problem, before the solution. Short here; the full version is on
          the Business X-Ray landing page, which this links to. */}
      <HomeProblem />

      {/* One methodology, five components: the arc, the five components, and the
          X-Ray front door. Carries the #method anchor that the header and
          How-it-works link to, inherited from the section merged into it. */}
      <Section id="method">
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="The Aperture Method™"
            title="What is The Aperture Method™?"
            lede="We dig into your numbers, your customers and your market, tell you where the money actually is, and give you a live dashboard to run the business from. One methodology, five components: take a single one when that is all you need, or run the whole arc. Either way you work with the same senior partner throughout."
          />
          {/* The contrast hook, kept from the band that used to sit under the
              hero. One line, and it is the hinge the rest of the section turns
              on, so it stays even though its old home did not. */}
          <p className="mt-6 border-l-2 border-maroon pl-4 text-base text-body">
            Every consultant says they&rsquo;ll help you grow.{" "}
            <span className="font-semibold text-ink">We show you exactly where</span>, using
            graduate-level analytics, spatial intelligence and real market data.
          </p>
          {/* Who it is for, and the door for everyone else. Both lines moved
              here from the deleted band rather than being lost with it. */}
          <p className="mt-5 text-small text-muted">
            Built for owner-run companies doing{" "}
            <span className="font-semibold text-ink">$5M&ndash;$20M</span>, usually with more than
            one location or territory. Smaller than that?{" "}
            <Link href="/snapshot" className="link-inline font-semibold">
              Start with an Aperture Snapshot
            </Link>
            .
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <TheArc />
        </Reveal>

        {/* The five components, moved here from the "Do I have to buy the whole
            thing?" section that used to follow. That section's whole answer was
            "no, take one or take all", which the lede above now says once, and
            its cards were the same five products already listed inside the
            X-Ray panel below. One place, one list, one answer. */}
        <div className="mt-8">
        {/*
              Five cards, three columns, so the last row holds two. That is
              deliberate. A contact form used to fill the sixth slot, and
              because it is far taller than a product card the grid row
              stretched to match it: cards 04 and 05 carried a block of dead
              space under their text for no reason other than to square off a
              grid. Asking for an email address in the middle of explaining
              what the products are was also the wrong moment; the page has a
              booking CTA above and below this. A short last row is nothing.
            */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aperturePractices.map((p, i) => (
              <Reveal key={p.n} variant="up" delay={(i % 3) * 80}>
                <Link
                  href={`/method/${p.short.toLowerCase()}`}
                  className="group flex h-full flex-col rounded-lg border border-line bg-paper p-7 hover-lift"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-h4 font-semibold tabular-nums text-maroon">{p.n}</span>
                    {/* A reference, not a title.

                        The same three letters name a card in the arc above and
                        point back at it from here. Rendered identically they
                        read as a credential stamped on the product. Prefixed
                        and un-bordered, they read as what they are: a note
                        about which capabilities power this component. */}
                    {p.cap && (
                      <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                        <span className="opacity-60">Draws on </span>
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
        </div>

        <p className="mt-8">
          <LinkArrow href="/the-aperture-method">Explore the full Method</LinkArrow>
        </p>

        <Reveal delay={120} className="mt-8">
          {/* One column, not two.

              The right-hand column used to list the five components again,
              under "Where it points you". The cards directly above this panel
              are now that list, with descriptions, so the column was the same
              five product names twice within one screen. */}
          <div className="rounded-2xl border border-maroon/30 bg-surface p-7 sm:p-9">
            <div className="max-w-measure">
              <div>
                <p className="eyebrow">Start here · Aperture Insights™</p>
                <p className="mt-2 text-h3 font-semibold text-ink">
                  Not sure where to start? Begin with a Business X-Ray&trade;.
                </p>
                <p className="mt-3 text-body text-muted">
                  A fixed-fee read of your whole business across seven lenses. Broad by design rather
                  than deep: it names your likely #1 constraint and tells you exactly where the digging
                  needs to happen: the numbers, the market, or the plan.
                </p>
                <ul className="mt-5 space-y-2">
                  {[
                    "A seven-lens read of the whole business",
                    "Your #1 constraint, clearly named",
                    "Your Aperture Score™, a baseline to track",
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
                    page={reportPages.businessXRay}
                    title="Example Report · Business X-Ray: Lumina Medical Aesthetics"
                    triggerLabel="See a real Business X-Ray in the example report"
                    triggerClassName="inline-flex items-center gap-2 text-small font-semibold text-maroon transition-colors hover:text-maroon-hover"
                  />
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </Section>

      {/* The white space: the category-of-one positioning matrix */}
      <Whitespace />

      {/* How it works: the engagement model + pricing */}
      <HowItWorks />

      {/* Aperture Atlas: the living platform (live demos) */}
      <Section tone="dark" id="atlas">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-5">Aperture Atlas™ · the platform</p>
          <h2 className="text-h2 font-semibold text-paper">
            What do I still have when the engagement ends?
          </h2>
          <p className="mt-6 text-body-lg text-white/75">
            Where the analysis comes alive. Aperture Atlas is the Geographic Intelligence Platform at the end of the arc, your
            market, customers, competitors, and performance on one live, interactive map, powered by
            SyncPoint AI. When an engagement ends, Atlas keeps running: the dashboards, Market Maps,
            and forecasts stay current, and they&apos;re yours to keep.
          </p>
        </Reveal>

        <Reveal variant="up" delay={120} className="mt-12">
          <figure className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
            <AtlasMarketMap className="block" showAnalysis={false} />
            <figcaption className="border-t border-white/10 px-6 py-4 text-small text-white/60">
              A Market Map inside Atlas: customers and competitors alongside what moves buyers,
              including weather, traffic, billboards and new housing. Press play to watch a year of
              growth, or select any hex or billboard for its numbers.
            </figcaption>
          </figure>
          <div className="mt-5">
            <LinkArrow href="/method/atlas" onDark>
              See the analysis behind it
            </LinkArrow>
          </div>
        </Reveal>

        <Reveal variant="up" delay={160} className="mt-6">
          <RevenueForecastLive />
          <p className="mt-3 text-small text-white/55">
            A live revenue forecast: Atlas doesn&apos;t just show your numbers, it continuously
            projects where the business is heading.
          </p>
        </Reveal>
      </Section>

      {/* Proof, with the worked example named and labeled */}
      <HomeProof />

      {/* The book, in progress */}
      <BookSection />

      {/* The questions that come up before a first call, answered on the page
          people land on rather than four clicks away. Emits FAQPage schema. */}
      <HomeFaq />

      {/* Final CTA */}
      <Section tone="dark" className="border-t border-white/10">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                See your business clearly. Then watch the strategy run.
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                Start with the Business X-Ray, a fixed-fee, low-risk first step that shows you which
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
