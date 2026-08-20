import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "What We Do",
  description:
    "Business assessment, financial and quantitative analysis, customer and market intelligence, growth strategy, AI and modernization, and hands-on implementation, the depth of a big firm, in plain business terms.",
  path: "/what-we-do",
});

type Capability = {
  n: string;
  arc: string;
  headline: string;
  overview: string;
  problems: string;
  work: string;
  deliverables: string;
  outcomes: string;
  meta: string;
  cta: string;
};

const capabilities: Capability[] = [
  {
    n: "01",
    arc: "Understand",
    headline: "Know exactly where your business stands.",
    overview:
      "A clear-eyed read of how your business really runs and what's holding it back, the honest baseline every good decision starts from.",
    problems:
      "Decisions made on instinct; no objective view of the business; uncertainty about the real constraint on growth.",
    work:
      "Executive and staff interviews; an operational, financial, and competitive review; a growth-maturity assessment.",
    deliverables:
      "The Business X-Ray, the Aperture Score, and a one-page statement of your single biggest constraint.",
    outcomes:
      "A shared, honest baseline; the one problem that matters most, named; clear priorities before you spend on anything else.",
    meta: "Aperture Insights · Relevant to every industry",
    cta: "Start with a Business X-Ray",
  },
  {
    n: "02",
    arc: "Understand",
    headline: "See exactly where you make and lose money.",
    overview:
      "The analytical backbone of a good strategy: proper analytics applied to your numbers, so the big decisions rest on math rather than on opinion.",
    problems:
      "Profit hidden beneath revenue; pricing that hasn't kept pace with costs; major decisions taken on a hunch.",
    work:
      "Regression and forecasting; unit-economics and contribution-margin analysis; customer lifetime value; cohort and retention analysis; pricing and elasticity; sensitivity, break-even, and optimization; predictive modeling, applied to your data rather than described in a proposal.",
    deliverables:
      "The Profit Map, a financial and scenario model you keep, and a quantified opportunity summary.",
    outcomes:
      "Clarity on profit by product, customer, channel, and location; every opportunity sized in dollars.",
    meta: "Aperture Analytics · Distribution, retail, trades, professional services",
    cta: "Put numbers behind your decisions",
  },
  {
    n: "03",
    arc: "Understand",
    headline: "Understand your customers, and where the next ones are.",
    overview:
      "Turning the customer data you already have into a living picture: who's valuable, who's leaving, who's ready to buy more, and where to grow, delivered as intelligence you keep.",
    problems:
      "No clear view of customers; marketing spread thin; expansion and site decisions made on instinct.",
    work:
      "Segmentation; lifetime-value modeling; churn and propensity scoring; geographic, demographic, and trade-area analysis; a live dashboard on the Aperture platform.",
    deliverables:
      "The Customer & Market Map, a live dashboard you keep, and the models behind it.",
    outcomes:
      "Sharper retention and marketing; evidence-based expansion and site selection; an asset that keeps working.",
    meta: "Aperture Intelligence · Retail, healthcare, trades, distribution",
    cta: "See your customers clearly",
  },
  {
    n: "04",
    arc: "Understand",
    headline: "See where your opportunity lives on the map.",
    overview:
      "Spatial intelligence (GIS) turns location into strategy, revealing where your customers are, where competitors win, and where your next location or market should be. Most consultants don't do this; it's one of the tools that sets us apart.",
    problems:
      "Expansion and site decisions made on gut; no view of trade areas, drive-times, or where demand actually clusters.",
    work:
      "Trade-area and drive-time analysis; ZIP- and block-level demographics, income, and growth; competitor and traffic mapping; hot-spot and market-penetration analysis; site-selection modeling.",
    deliverables:
      "The GIS trade-area analysis: trade areas, opportunity zones, and site scores you can act on.",
    outcomes:
      "Expansion and marketing aimed where the opportunity is, not where it feels busy; site decisions backed by evidence.",
    meta: "Aperture Intelligence · Retail, healthcare, trades, professional services",
    cta: "See where the opportunity is",
  },
  {
    n: "05",
    arc: "Decide",
    headline: "A prioritized plan for your next stage of growth.",
    overview:
      "Translating the evidence into the few moves that matter most: growth, market, pricing, and commercial strategy, sequenced into a plan your team actually owns.",
    problems:
      "Too many options and no way to choose; no clear sequence; strategy that never gets executed.",
    work:
      "Opportunity prioritization; growth and market-entry strategy; pricing and go-to-market strategy; a roadmap with owners, targets, and KPIs.",
    deliverables:
      "The Opportunity Matrix and the Focus Plan, a plain Now/Next/Later roadmap, board-ready.",
    outcomes:
      "A short, sequenced, owned plan; aligned leadership; confidence about what to do first, defer, or stop.",
    meta: "Aperture Compass · Relevant to every industry",
    cta: "Build your roadmap",
  },
  {
    n: "06",
    arc: "Enable",
    headline: "Bring modern tools to a business that's never had them.",
    overview:
      "Practical AI, automation, and sensible digital upgrades, used where they genuinely pay off, framed by what they do rather than the technology. This is what makes big-company intelligence affordable at your size.",
    problems:
      "AI that feels like hype or out of reach; manual, repetitive work; data trapped in tools; systems that have fallen behind.",
    work:
      "AI and machine learning where they add real signal; workflow automation; data integration; dashboard and BI setup; pragmatic system modernization.",
    deliverables:
      "The Aperture platform and dashboards, working automations, and a practical modernization roadmap.",
    outcomes:
      "Less manual work; better forecasts and decisions surfaced where your team already works. AI supports decisions; people make them. Every output is reviewed.",
    meta: "Across Aperture Intelligence and Aperture Atlas · Especially trades, healthcare, distribution",
    cta: "Modernize with a plan",
  },
  {
    n: "07",
    arc: "Perform",
    headline: "We stay until the strategy is working.",
    overview:
      "Hands-on execution, operational improvement, and ongoing senior counsel, the part where most consulting stops and most value quietly leaks.",
    problems:
      "Strategy that dies in execution; no internal bandwidth; operational strain; the need for a trusted senior sounding board.",
    work:
      "Embedded delivery on a light cadence; operational improvement; live KPI tracking; change support; quarterly reviews; capability handoff. Where a plan requires commercial or digital execution, brand, web, or marketing operations, we coordinate it in service of the strategy.",
    deliverables:
      "The Scoreboard, a steady operating rhythm, quarterly performance reviews, and playbooks that outlast the engagement.",
    outcomes:
      "Results that show up in your numbers, and the capability to sustain them without us.",
    meta: "Aperture Atlas · Relevant to every industry",
    cta: "Make the plan real",
  },
];

const arc = [
  { h: "Understand", p: "How it runs, where the money is, and who your customers are, through evidence." },
  { h: "Decide", p: "The few moves with the biggest payoff, sequenced into a plan you own." },
  { h: "Perform", p: "We stay until it shows up in your numbers, and leave you the tools." },
];

function Detail({ label, text, accent }: { label: string; text: string; accent?: boolean }) {
  return (
    <div className="group bg-paper p-6 transition-colors duration-200 hover:bg-maroon/[0.06]">
      <p
        className={`mb-2 text-overline font-bold uppercase tracking-overline transition-colors duration-200 ${
          accent ? "text-maroon" : "text-muted group-hover:text-maroon"
        }`}
      >
        {label}
      </p>
      <p className={accent ? "text-body font-medium text-ink" : "text-body text-body"}>{text}</p>
    </div>
  );
}

export default function WhatWeDoPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <Reveal className="max-w-measure">
          <p className="eyebrow mb-5">What we do</p>
          <h1 className="heading-gradient text-display font-semibold">
            The depth of a big firm, put into plain business terms.
          </h1>
          <p className="mt-6 text-body-lg text-body">
            We help owner-run companies understand where they stand, decide what to do next, and carry
            it out, using real analysis and practical technology, in language you&apos;ll actually
            understand.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href={primaryCta.href} className="btn">
              {primaryCta.label}
            </Link>
            <Link href="/the-aperture-method" className="btn--secondary">
              See The Aperture Method™
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* The arc */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading eyebrow="How we work" title="Understand. Decide. Perform." />
        </Reveal>
        <Reveal variant="up" delay={100}>
          <div className="mt-10 grid gap-px overflow-hidden rounded border border-line bg-line md:grid-cols-3">
            {arc.map((a, i) => (
              <div
                key={a.h}
                className="group bg-paper p-8 transition-colors duration-200 hover:bg-surface"
              >
                <span className="text-h3 font-semibold text-maroon">{String(i + 1)}</span>
                <h3 className="mt-3 text-h4 font-semibold text-ink transition-colors group-hover:text-maroon">
                  {a.h}
                </h3>
                <p className="mt-2 text-body text-muted">{a.p}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center rounded bg-dark px-6 py-4 text-[15px] font-semibold text-paper">
            <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-maroon-soft" aria-hidden="true" />
            Modern analytics and AI run through all of it, and everything we build is yours to keep.
          </div>
        </Reveal>
      </Section>

      {/* The six capability areas */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Capabilities"
            title="Seven capabilities, one coherent firm."
            lede="Not a menu of disconnected services, the parts of a single method, from a first assessment to hands-on execution."
            className="mb-4"
          />
        </Reveal>
        <div className="mt-12 space-y-16">
          {capabilities.map((c) => (
            <Reveal key={c.n} variant="up" className="border-t border-line pt-10">
              <article>
              <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
                <div>
                  <p className="eyebrow">
                    {c.n} · {c.arc}
                  </p>
                  <h2 className="mt-3 text-h3 font-semibold text-ink">{c.headline}</h2>
                  <p className="mt-4 text-body text-muted">{c.overview}</p>
                  <p className="mt-5 text-small text-muted">{c.meta}</p>
                  <p className="mt-4">
                    <LinkArrow href={primaryCta.href}>{c.cta}</LinkArrow>
                  </p>
                </div>
                <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                  <Detail label="Problems we solve" text={c.problems} />
                  <Detail label="Typical work" text={c.work} />
                  <Detail label="What you get" text={c.deliverables} accent />
                  <Detail label="Business outcomes" text={c.outcomes} />
                </div>
              </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-14 max-w-measure text-small italic text-muted">
          A note on scope: brand, website, and marketing work are downstream implementation
          capabilities we coordinate when a strategy calls for them. They are not the center of the
          firm, and they never lead an engagement; the strategy does.
        </p>
        {/* The people boundary, stated plainly. Saying what we will not do makes the analytical
            claim sharper, and an owner reading this knows exactly what they are buying. */}
        <p className="mt-4 max-w-measure text-small italic text-muted">
          And on people: we assess how the business depends on its people, which roles only one
          person can do, what revenue rides on them, who could cover, and what is written down. We
          do not appraise individuals, benchmark pay, or advise on hiring and firing. That is HR and
          employment-law territory, and it is not ours. Every finding we write about your team is
          one you could read aloud to the person it concerns.
        </p>
      </Section>

      {/* How it fits together */}
      <Section tone="surface">
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="How it fits together"
            title="One method. One continuous picture."
            lede="Most engagements move through these in order, from a first assessment to hands-on execution, with the Aperture platform carrying the intelligence throughout. You can start small, with a Business X-Ray, and continue only as the value becomes obvious."
          />
          <p className="mt-8">
            <LinkArrow href="/the-aperture-method">See how the Method works</LinkArrow>
          </p>
        </Reveal>
      </Section>

      {/* Final CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                Not sure where to start? Start with a Business X-Ray.
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                A fixed-fee, low-risk first step that shows you where the opportunity is, before you
                commit to anything more.
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
