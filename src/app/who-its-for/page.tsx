import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { FitChecks } from "@/components/who/FitChecks";
import { SegmentContrast } from "@/components/market/SegmentContrast";
import { MarketFigures } from "@/components/market/MarketFigures";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { FIGURES } from "@/lib/marketContext";

export const metadata: Metadata = pageMeta({
  title: "Who It's For",
  description:
    "The Aperture Method gives owner-run businesses the analytics, market intelligence, and strategy big companies take for granted, senior-led and in plain language. See if it's a fit and what you'll walk away with.",
  path: "/who-its-for",
});

const entryPoints: { q: string; a: string; href: string; label: string }[] = [
  {
    q: "“I just want the truth about my business.”",
    a: "Start with a Business X-Ray, a fixed-fee diagnostic that names your #1 constraint.",
    href: "/the-aperture-method",
    label: "See how it works",
  },
  {
    q: "“I need the numbers behind a big decision.”",
    a: "Analytics turns the data you already have into a clear picture of profit and risk.",
    href: "/what-we-do",
    label: "What we do",
  },
  {
    q: "“I need to understand my market and customers.”",
    a: "Intelligence maps who your customers are and where the next ones are.",
    href: "/what-we-do",
    label: "What we do",
  },
  {
    q: "“I know the goal; I need the plan and a way to track it.”",
    a: "Compass sets the direction; Atlas keeps it live on a scoreboard you own.",
    href: "/what-you-get",
    label: "What you get",
  },
];

const fit: { title: string; body: string }[] = [
  {
    title: "Owner-run and founder-led",
    body: "The person who makes the calls is still in the building. Decisions happen fast, and they matter.",
  },
  {
    title: "Real operations, real data",
    body: "Roughly $1M to $20M in revenue, from one strong location to many. You already generate data, even if it's messy.",
  },
  {
    title: "Any industry",
    body: "Retail, professional services, healthcare practices, manufacturing, trades, distribution, and plenty we haven't listed. We don't sort clients by sector, because the constraint holding a business back rarely cares what the business sells.",
  },
  {
    title: "Ready to act",
    body: "You don't want a report that gathers dust. You want to know what to do, and then do it.",
  },
];

export default function WhoItsForPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <Reveal className="max-w-measure">
          <p className="eyebrow mb-4">Who it&apos;s for</p>
          <h1 className="text-h1 font-semibold heading-gradient">
            If you run the business, this is built for you.
          </h1>
          <p className="mt-6 text-body-lg text-body">
            The Aperture Method is built for established privately held businesses doing roughly $1
            million to $20 million in revenue: large enough that the decisions carry real money,
            and rarely large enough to have built a finance and strategy function to inform them.
          </p>
          <p className="mt-5 text-body text-muted">
            You already know your business better than any outsider will. This is about seeing the
            whole of it at once, in plain language, senior-led, and done for you.
          </p>
        </Reveal>
      </Section>

      {/* The published scale of the economy these businesses run */}
      <Section tone="surface">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The context</p>
            <h2 className="heading-gradient text-h2 font-semibold">
              You are not an edge case. You are most of the economy.
            </h2>
            <p className="mt-6 text-body-lg text-body">
              Privately held businesses are not a niche the professional firms have chosen to skip
              because it is small. On the federal government&apos;s own count, they are the larger
              part of American commerce, and the advisory market is simply built around the other
              part.
            </p>
          </Reveal>
        </div>

        <MarketFigures className="mt-10" />

        <Reveal delay={120} className="mt-8">
          <p className="max-w-measure text-body text-body">
            They employ {FIGURES.shareOfWorkers.value} {FIGURES.shareOfWorkers.label} and account for{" "}
            {FIGURES.shareOfPayroll.value} {FIGURES.shareOfPayroll.label}. None of which makes all
            36.2 million of them a fit for this firm, and we do not pretend otherwise. The Aperture
            Method is built for a narrow slice of that number: established businesses at roughly $1
            million to $20 million.
          </p>
          <p className="mt-6">
            <LinkArrow href="/the-intelligence-gap">
              The full picture, with every figure sourced
            </LinkArrow>
          </p>
        </Reveal>
      </Section>

      {/* The position an established private business is actually in */}
      <SegmentContrast tone="paper" />

      {/* The big wins, each with a self-check */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="What you're here to do"
            title="You came for one of these, probably a few."
            lede="Pick a goal and take the quick self-check. Every question you can't answer is an insight we can give you."
          />
        </Reveal>
        <div className="mt-10">
          <FitChecks />
        </div>
      </Section>

      {/* Start anywhere */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Wherever you are"
            title="You don't have to start at the beginning."
            lede="Most clients begin with a Business X-Ray, then choose how far to go. Every step is senior-led and phase-gated; you decide whether to continue. Start where it hurts most:"
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {entryPoints.map((e, i) => (
            <Reveal key={e.q} delay={(i % 2) * 80}>
              <div className="rounded-lg border border-line bg-paper p-6">
                <p className="text-body-lg font-semibold text-ink">{e.q}</p>
                <p className="mt-2 text-body text-muted">{e.a}</p>
                <div className="mt-4">
                  <LinkArrow href={e.href}>{e.label}</LinkArrow>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Who we do our best work with */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading eyebrow="The right fit" title="The businesses we do our best work with." />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {fit.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 80}>
              <div className="rounded-lg border border-line bg-paper p-6">
                <h3 className="text-h4 font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-body text-muted">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <p className="mt-8 max-w-measure text-body text-muted">
            <span className="font-semibold text-ink">Straight talk:</span> if you&apos;re looking only
            for the cheapest dashboard, or a deck to raise money without the substance behind it,
            we&apos;re probably not your best fit. If you want to genuinely understand your business
            and grow it, we are.
          </p>
        </Reveal>
      </Section>

      {/* Closing CTA */}
      <Section tone="dark">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-4">Not sure if it&apos;s you?</p>
          <h2 className="text-h2 font-semibold text-paper">
            Start with a Business X-Ray™, and find out.
          </h2>
          <p className="mt-5 text-body-lg text-white/70">
            A fixed-fee, senior-led diagnostic that reads your whole business, names your #1
            constraint, and shows exactly which next steps will move the needle. No obligation to go
            further.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={primaryCta.href} className="btn--on-dark">
              {primaryCta.label}
            </Link>
            <Link href="/onboarding" className="btn--ghost">
              New client onboarding
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
