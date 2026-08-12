import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "What We Believe",
  description:
    "The beliefs behind The Aperture Method — that clarity creates better decisions, strategy should lead to action, data should create understanding, and technology should support judgment.",
  path: "/what-we-believe",
});

const beliefs = [
  {
    h: "Clarity creates better decisions.",
    p: "Businesses rarely fail because leaders don't care. They struggle because complexity obscures opportunity. Growth slows, margins tighten, customers change, operations turn reactive, and data accumulates faster than it can be understood. The answers often already exist inside the business — they simply haven't been brought into focus.",
  },
  {
    h: "Strategy should lead to action.",
    p: "A strategy that never leaves the boardroom has little value. Our work is designed to move beyond recommendations: every engagement should produce practical decisions, measurable priorities, and an executable roadmap leadership can confidently implement. Ideas matter. Execution matters more.",
  },
  {
    h: "Data should create understanding.",
    p: "Businesses have never had more information available, yet many leaders have never felt less certain. Analytics should reduce complexity, not create it. Data is valuable only when it helps people make better decisions — our responsibility is to transform information into insight leaders can actually use.",
  },
  {
    h: "Technology should support judgment.",
    p: "AI, automation, and business intelligence are changing how organizations operate. They are powerful tools — but they remain tools. Technology should enhance executive judgment, not replace it. We use modern analytical capability where it improves understanding and strengthens decisions, while recognizing that lasting success still depends on experienced leadership.",
  },
  {
    h: "Every business has untapped potential.",
    p: "Every organization has opportunities that remain unseen — sometimes operational, sometimes financial, sometimes strategic, sometimes hidden inside customer behavior or buried in years of historical data. Our work is to uncover those opportunities, evaluate them objectively, and help leadership turn them into measurable results.",
  },
];

const builtFor = [
  "Companies preparing for growth",
  "Leadership teams navigating complexity",
  "Entrepreneurs scaling their businesses",
  "Family-owned companies planning for the future",
  "Organizations seeking better visibility into performance",
  "Executives who know tomorrow's decisions depend on today's understanding",
];

const commitments = [
  "generic recommendations",
  "overwhelming clients with unnecessary complexity",
  "one-size-fits-all solutions",
];

export default function WhatWeBelievePage() {
  return (
    <>
      {/* Hero / intro */}
      <Section className="pt-28 md:pt-36">
        <Reveal className="max-w-measure">
          <p className="eyebrow mb-5">About The Aperture Method™</p>
          <h1 className="heading-gradient text-display font-semibold">Bringing business into focus.</h1>
          <p className="mt-8 text-body-lg text-body">
            Every organization generates information — financial reports, customer behavior,
            operational metrics, market trends, employee insight, competitive pressures. The challenge
            isn&apos;t collecting more data. The challenge is understanding what it means.
          </p>
          <p className="mt-5 text-body-lg text-body">
            We believe better businesses are built through clarity. Before strategy can succeed, leaders
            must clearly understand where they are, what the evidence is telling them, and where the
            greatest opportunities exist. Our role is to help leadership teams see their business with
            greater precision — connecting information, experience, analytics, and practical judgment
            into a clear path forward. Because when the picture becomes clear, better decisions follow.
          </p>
        </Reveal>
      </Section>

      {/* What we believe */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="What we believe"
            title="Clarity creates better decisions."
            lede="Five beliefs shape every engagement — the foundation of how we work."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {beliefs.map((b, i) => (
            <Reveal
              key={b.h}
              variant="up"
              delay={(i % 2) * 90}
              className={i === beliefs.length - 1 && beliefs.length % 2 === 1 ? "lg:col-span-2" : ""}
            >
              <div className="group h-full rounded-lg border border-line bg-paper p-8 hover-lift">
                <div className="flex items-baseline gap-4">
                  <span className="text-h3 font-semibold text-maroon">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-h4 font-semibold text-ink transition-colors duration-200 group-hover:text-maroon">
                    {b.h}
                  </h3>
                </div>
                <p className="mt-4 text-body leading-relaxed text-muted">{b.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Our approach */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal variant="right">
            <SectionHeading eyebrow="Our approach" title="Understand the business before improving it." />
          </Reveal>
          <Reveal variant="left" delay={100}>
            <p className="text-body-lg text-body">
              The Aperture Method is more than a consulting engagement. It is a structured methodology
              for understanding a business before attempting to improve it. Rather than beginning with
              assumptions, we begin with evidence — studying the organization, its customers, operations,
              financial performance, market position, and strategic objectives to build a complete
              picture of the business.
            </p>
            <ul className="mt-8 space-y-3">
              {["Only then do we develop recommendations.", "Only then do we build the roadmap.", "Only then do we help execute it."].map(
                (line) => (
                  <li key={line} className="flex items-start gap-3 text-body-lg font-medium text-ink">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-6 shrink-0 rounded-full bg-maroon" />
                    {line}
                  </li>
                )
              )}
            </ul>
            <p className="mt-8">
              <LinkArrow href="/the-aperture-method">See how The Aperture Method works</LinkArrow>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Built for leaders who want clarity */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="Who it's for"
            title="Built for leaders who want clarity."
            lede="We work with organizations facing meaningful business decisions."
          />
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {builtFor.map((item, i) => (
            <Reveal key={item} variant="up" delay={(i % 3) * 80}>
              <div className="group flex h-full items-start gap-3 bg-paper p-6 transition-colors duration-200 hover:bg-surface">
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-maroon" />
                <p className="text-body font-medium text-ink">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Founder */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading eyebrow="About the founder" title="Fenwick How." />
          <p className="mt-6 text-body-lg text-body">
            The Aperture Method was founded by Fenwick How after years of leading businesses, developing
            companies, managing complex initiatives, and solving operational challenges across multiple
            industries — spanning entrepreneurship, operations, project leadership, analytics,
            technology, energy, and water infrastructure. He holds a Bachelor of Business Administration
            in Project Management, is a certified Project Management Professional (PMP), and is currently
            pursuing an MBA at Texas A&amp;M University&apos;s Mays Business School.
          </p>
          <p className="mt-5 border-l-2 border-maroon pl-6 text-h4 font-light leading-snug text-ink">
            &ldquo;The best decisions come from seeing the business clearly before trying to change
            it.&rdquo;
          </p>
          <Image
            src="/fenwick-signature-black.png"
            alt="Fenwick How"
            width={640}
            height={201}
            className="mt-6 h-14 w-auto"
          />
          <p className="mt-2 text-small font-semibold text-muted">Fenwick How, Founder</p>
          <p className="mt-8">
            <LinkArrow href="/founder">Read more about the founder</LinkArrow>
          </p>
        </Reveal>
      </Section>

      {/* Our commitment */}
      <Section tone="dark">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow eyebrow--on-dark mb-5">Our commitment</p>
          <h2 className="text-h2 font-semibold text-paper">What we don&apos;t believe — and what we do.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {commitments.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/20 px-4 py-2 text-small text-white/60 line-through decoration-maroon-soft"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-body-lg text-white/80">
            We believe every engagement deserves careful analysis, honest conversation, objective
            evidence, and practical execution. Because when leaders can clearly see their business, they
            can confidently shape its future.
          </p>
        </Reveal>
      </Section>

      {/* Look Closer — belief, put into practice */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-4">Belief, put into practice</p>
            <h2 className="text-h2 font-semibold heading-gradient">
              We teach this free to teenagers.
            </h2>
          </Reveal>
          <Reveal variant="left" delay={100}>
            <div className="space-y-5 text-body-lg text-body">
              <p>
                We believe the ability to look at a business and see what is actually holding it back
                is a skill, not a gift — which means it can be taught, and it should be taught to
                people long before they own anything.
              </p>
              <p>
                So we built <span className="font-semibold text-ink">Look Closer</span>, a
                fifty-minute session for grades 8–12. Students get a card describing a real-looking
                business in The Woodlands and fifteen minutes to find the one thing holding it back.
                There is no fee, nothing is sold to students, and the entire packet is free for any
                teacher to download and run without us.
              </p>
              <p className="text-body text-muted">
                It is not aimed only at future founders. Almost every student in that room will spend
                their life inside a business — working in one, managing one, buying from one. They
                should all know how one works.
              </p>
            </div>
            <p className="mt-8">
              <LinkArrow href="/look-closer">See the session</LinkArrow>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 rounded-lg border border-line bg-surface p-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="heading-gradient text-h2 font-semibold">Let&apos;s bring your business into focus.</h2>
              <p className="mt-4 text-body-lg text-muted">
                Start with a Business X-Ray — a fixed-fee, low-risk first step.
              </p>
            </div>
            <Link href={primaryCta.href} className="btn shrink-0">
              {primaryCta.label}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
