import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { Reveal } from "@/components/ui/Reveal";
import { ApertureIris } from "@/components/sections/ApertureIris";
import { MethodFrameworks } from "@/components/sections/MethodFrameworks";
import { MethodFlow } from "@/components/sections/MethodFlow";
import { ApertureDifference } from "@/components/sections/ApertureDifference";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { methodTagline, methodSummary } from "@/lib/content";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "The Method: From Data to Decision",
  description:
    "A clear, five-step framework that turns the data your business already has into confident decisions, then helps you carry them out. Understand. Quantify. Reveal. Navigate. Perform.",
  path: "/the-aperture-method",
});

const differentiators = [
  {
    h: "Large firms",
    p: "Real rigor, but priced and staffed for a much bigger company, and gone when the deck is delivered.",
  },
  {
    h: "Local advisors",
    p: "Close and affordable, but rarely doing the quantitative work or bringing the technology.",
  },
  {
    h: "The Aperture Method",
    p: "Real analysis, in plain language, a durable tool you keep, and a partner who stays until the plan is working.",
    accent: true,
  },
];


const dataPrinciples = [
  { h: "Ownership", p: "Everything we build on your data, models, dashboards, is yours to keep." },
  { h: "Security", p: "Least-access handling, secure storage, clear terms." },
  { h: "No reuse", p: "We never sell, share, or reuse your data." },
  { h: "Compliance", p: "We work within the privacy rules that apply to your business." },
];

const faqs = [
  {
    q: "How long does it take?",
    a: "Aperture Insights and Aperture Analytics typically run a few weeks each; Aperture Intelligence stands up in two to three; Aperture Compass is one to two. Aperture Atlas is ongoing for as long as it's earning its place. The Business X-Ray delivers real insight in its first weeks.",
  },
  {
    q: "How much of my team's time will it take?",
    a: "Very little early on: a few interviews and access to data you already have. Aperture Atlas is a genuine partnership, but even then your team stays focused on running the business.",
  },
  {
    q: "Do we need clean, perfect data?",
    a: "No. We work with what you have and improve it as we go. Messy data is normal and rarely a blocker.",
  },
  {
    q: "What exactly is proprietary?",
    a: "Not the individual techniques. Those are standard. What's ours is the integrated method, the sequencing, the Aperture platform, the judgment we apply, and a delivery model that stays through execution.",
  },
  {
    q: "What do we keep at the end?",
    a: "The models, the live dashboard, the roadmap, and the playbooks, plus the capability to keep using them.",
  },
  {
    q: "Will the AI replace my judgment?",
    a: "No. It informs decisions; you and we make them. A person reviews every output.",
  },
  {
    q: "Can we start small?",
    a: "Yes. Start with the Business X-Ray and continue only if the value is obvious.",
  },
];

export default function TheApertureMethodPage() {
  return (
    <>
      {/* Hero */}
      <Section tone="dark" className="pt-28 md:pt-36">
        <Reveal>
          <p className="eyebrow eyebrow--on-dark mb-5">The Aperture Method™</p>
          <h1 className="max-w-4xl text-display font-semibold text-paper">
            A clear path from data to decision, and from decision to done.
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-white/75">
            Our five-step framework turns the information your business already has into confident
            decisions, then helps you carry them out. The rigor a large company would expect, sized for
            an owner-run business, delivered by the person who does the work.
          </p>
          <p className="mt-7 text-h4 font-semibold text-paper">{methodTagline}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href={primaryCta.href} className="btn--on-dark">
              {primaryCta.label}
            </Link>
            <Link href="#framework" className="btn--ghost">
              See the five steps ↓
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* What it is */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading title="What The Aperture Method is." />
          <p className="mt-6 text-body-lg text-body">{methodSummary}</p>
          <p className="mt-5 text-body-lg text-body">
            Five named phase-products, Aperture Insights, Aperture Analytics, Aperture Intelligence,
            Aperture Compass, and Aperture Atlas, with a continuous intelligence layer, the Aperture
            platform, running through all of it. The whole thing is designed to end not with a report,
            but with decisions in motion and results in your numbers.
          </p>
          <p className="mt-5 text-body-lg text-body">
            The individual techniques are the same ones a top firm would use. What&apos;s ours is how
            they&apos;re integrated and sequenced, the platform that carries them, the judgment applied
            to them, and a delivery model that stays until the work is working.
          </p>
        </Reveal>
      </Section>

      {/* Why the usual options don't fit */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading title="Why the usual options don't fit." />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {differentiators.map((d, i) => (
            <Reveal key={d.h} variant="up" delay={(i % 3) * 90}>
              <div
                className={
                  d.accent
                    ? "h-full rounded bg-maroon p-6 text-paper hover-lift"
                    : "h-full rounded border border-line bg-paper p-6 hover-lift"
                }
              >
                <h3 className={d.accent ? "text-h4 font-semibold text-paper" : "text-h4 font-semibold text-ink"}>
                  {d.h}
                </h3>
                <p className={d.accent ? "mt-2 text-[15px] leading-relaxed text-white/80" : "mt-2 text-body text-muted"}>
                  {d.p}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal variant="up" delay={120}>
          <ComparisonTable />
        </Reveal>
        <p className="mt-8 max-w-measure text-body-lg text-body">
          The Aperture Method is built for the space between: real analysis, in plain language, a
          durable tool you keep, and a partner who stays until the plan is working.
        </p>
      </Section>

      {/* The framework: interactive explorer */}
      <Section id="framework">
        <Reveal>
          <SectionHeading
            eyebrow="The framework"
            title="Five phases. One continuous picture."
            lede="Like the blades of an aperture, each phase opens the view a little more, until the whole business is in focus. Open a blade to see what it is, who it\u2019s for, and what you walk away with."
          />
        </Reveal>
        <Reveal variant="zoom" delay={100} className="mt-12">
          <ApertureIris />
        </Reveal>
        <Reveal className="mt-8">
          <Link href="/what-you-get" className="btn--secondary">
            See what you get →
          </Link>
        </Reveal>
      </Section>

      {/* The Method, end to end: walk-through flow */}
      <MethodFlow />

      {/* Under the hood: the frameworks behind each phase */}
      <MethodFrameworks />

      {/* The Aperture Difference: positioning statement */}
      <ApertureDifference tone="dark" />

      {/* Measured on your numbers */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading title="Measured on your numbers." />
          <p className="mt-6 text-body-lg text-body">
            The targets that matter are set in Aperture Compass and tracked live on the Scoreboard, every
            initiative marked red, amber, or green against its KPI. We review them with you each quarter
            and adjust. We ask to be measured on whether the strategy shows up in your results, not on
            how the deck looked.
          </p>
        </Reveal>
      </Section>

      {/* Where AI fits */}
      <Section tone="surface">
        <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <SectionHeading title="Where AI fits, and where judgment does." />
          <p className="text-body-lg text-body">
            We use AI where it genuinely adds signal: finding patterns, segmenting customers, scoring
            who&apos;s likely to leave or buy more, and improving forecasts. It supports decisions; it
            does not make them. Every output is reviewed by a person before it reaches you. We&apos;re
            honest about the limits of small or imperfect data, and we favor methods you can understand
            over ones you simply have to trust. If we can&apos;t explain why, we won&apos;t recommend on
            it.
          </p>
        </Reveal>
      </Section>

      {/* Your data stays yours */}
      <Section>
        <Reveal>
          <SectionHeading title="Your data stays yours." />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dataPrinciples.map((d, i) => (
            <Reveal key={d.h} variant="up" delay={(i % 4) * 80}>
              <div className="group h-full rounded border border-line bg-paper p-6 hover-lift">
                <h3 className="text-h4 font-semibold text-ink transition-colors duration-200 group-hover:text-maroon">
                  {d.h}
                </h3>
                <p className="mt-2 text-body text-muted">{d.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="surface">
        <Reveal className="max-w-3xl">
          <SectionHeading title="Questions owners usually ask." className="mb-10 max-w-none" />
          <Faq items={faqs} />
        </Reveal>
      </Section>

      {/* Final CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                See your business clearly. Start with the Business X-Ray.
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
