import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { FitChecks } from "@/components/who/FitChecks";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Who It's For",
  description:
    "The Aperture Method gives owner-run businesses the analytics, market intelligence, and strategy big companies take for granted — senior-led and in plain language. See if it's a fit and what you'll walk away with.",
  path: "/who-its-for",
});

const entryPoints: { q: string; a: string; href: string; label: string }[] = [
  {
    q: "“I just want the truth about my business.”",
    a: "Start with a Business X-Ray — a fixed-fee diagnostic that names your #1 constraint.",
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
    q: "“I know the goal — I need the plan and a way to track it.”",
    a: "Compass sets the direction; Atlas keeps it live on a scoreboard you own.",
    href: "/what-you-get",
    label: "What you get",
  },
];

const fit: { title: string; body: string }[] = [
  {
    title: "Owner-run and founder-led",
    body: "The person who makes the calls is still in the building. Decisions happen fast — and they matter.",
  },
  {
    title: "Real operations, real data",
    body: "Roughly $1M to $20M in revenue, from one strong location to many. You already generate data — even if it's messy.",
  },
  {
    title: "Across industries",
    body: "Retail & consumer, professional services, healthcare practices, industrial & manufacturing, trades, and distribution — and if you don't see yours, we very likely still work with you.",
  },
  {
    title: "Ready to act",
    body: "You don't want a report that gathers dust. You want to know what to do — and then do it.",
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
          <p className="mt-6 text-body-lg text-muted">
            The Aperture Method gives owner-run businesses the analytics, market intelligence, and
            strategy that big companies take for granted — senior-led, in plain language, and done for
            you. If any of the goals below sound like yours, you&apos;re in the right place.
          </p>
        </Reveal>
      </Section>

      {/* The big wins — each with a self-check */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="What you're here to do"
            title="You came for one of these — probably a few."
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
            lede="Most clients begin with a Business X-Ray, then choose how far to go. Every step is senior-led and phase-gated — you decide whether to continue. Start where it hurts most:"
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
            and grow it — we are.
          </p>
        </Reveal>
      </Section>

      {/* Closing CTA */}
      <Section tone="dark">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-4">Not sure if it&apos;s you?</p>
          <h2 className="text-h2 font-semibold text-paper">
            Start with a Business X-Ray™ — and find out.
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
