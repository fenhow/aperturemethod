import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { JsonLd } from "@/components/seo/JsonLd";
import { primaryCta } from "@/lib/site";
import { pageMeta, ldPerson, ldBreadcrumb } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Fenwick How — Founder",
  description:
    "Fenwick How is the founder of The Aperture Method — an entrepreneur and operator bringing big-company analytics and strategy to owner-run businesses. BBA in Project Management, certified PMP, and pursuing an MBA at Texas A&M.",
  path: "/founder",
  type: "article",
});

const philosophy = [
  { h: "Evidence before instinct.", p: "Good decisions start from what the data actually shows." },
  { h: "Clarity over complexity.", p: "If the client can't understand it, it isn't finished." },
  { h: "Execution is the point.", p: "A recommendation no one acts on is worthless." },
  { h: "The principal does the work.", p: "The person who does the analysis should be in the room." },
  { h: "Build things people keep.", p: "Leave a business stronger and more capable than you found it." },
  { h: "Honest about limits.", p: "Say plainly what the numbers can and can't tell you." },
];

const background = [
  { h: "Entrepreneurial track record", p: "Has created and developed companies and led complex initiatives." },
  { h: "Cross-functional range", p: "Consulting, operations, projects, analytics, technology, and business development." },
  { h: "Cross-sector experience", p: "Including energy and water." },
  {
    h: "Credentials & education",
    p: "BBA in Project Management, certified Project Management Professional (PMP), and currently pursuing an MBA at Texas A&M.",
  },
  { h: "Founder-led delivery", p: "The principal, not a pyramid." },
];

export default function FounderPage() {
  return (
    <>
      <JsonLd
        data={[
          ldPerson(),
          ldBreadcrumb([
            { name: "About", path: "/about" },
            { name: "Fenwick How", path: "/founder" },
          ]),
        ]}
      />
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <Reveal variant="right">
            <div className="relative aspect-[4/5] overflow-hidden rounded border border-line">
              <Image
                src="/fenwick-how.jpg"
                alt="Fenwick How, founder of The Aperture Method"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>
          </Reveal>
          <Reveal variant="left" delay={100}>
            <p className="eyebrow mb-4">Founder</p>
            <h1 className="heading-gradient text-h1 font-semibold">Fenwick How</h1>
            <p className="mt-2 text-body-lg text-muted">Founder, The Aperture Method™</p>
            <p className="mt-6 text-body-lg text-body">
              Fenwick How is the founder of The Aperture Method. An entrepreneur and operator, he has focused
              his work on creating and developing companies and leading complex initiatives — the kind
              that require turning an ambitious idea into a structured, working plan. His experience
              spans consulting, operations, projects, analytics, technology, and business development,
              across sectors including energy and water. He is a practical problem-solver, drawn to the
              point where strategy meets execution. He holds a Bachelor of Business Administration in
              Project Management, is a certified Project Management Professional (PMP), and is currently
              pursuing an MBA at Texas A&amp;M — pairing that hands-on experience with formal quantitative
              and strategic training. He
              founded The Aperture Method to bring the analytics and rigor larger companies take for granted
              to the owner-run businesses that need them most — and to stay until the work is working.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={primaryCta.href} className="btn">
                {primaryCta.label}
              </Link>
              <Link href="/the-aperture-method" className="btn--secondary">
                See how the Method works
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Leadership philosophy */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading eyebrow="How he works" title="How Fenwick works." />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {philosophy.map((pr, i) => (
            <Reveal key={pr.h} variant="up" delay={(i % 3) * 90}>
              <div className="group h-full rounded border border-line bg-paper p-6 hover-lift">
                <h3 className="text-h4 font-semibold text-ink transition-colors duration-200 group-hover:text-maroon">
                  {pr.h}
                </h3>
                <p className="mt-2 text-body text-muted">{pr.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Why I created it */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading title="Why I created The Aperture Method." />
          <p className="mt-6 text-body-lg text-body">
            Capable, established businesses — often family-owned — were making their most important
            decisions with far less than they deserved. The analytics, customer intelligence, and
            technology that large companies treat as ordinary were out of reach: too expensive, too
            complex, or aimed at a company several sizes larger. I created The Aperture Method to bring that
            capability down to them — in plain language, at a fair and fixed price, delivered by a senior
            partner — and to stay through execution, because a strategy that never gets implemented helps
            no one.
          </p>
        </Reveal>
      </Section>

      {/* Quote */}
      <Section tone="dark">
        <Reveal variant="zoom" className="mx-auto max-w-4xl">
        <figure>
          <blockquote className="border-l-2 border-maroon-soft pl-6 text-h2 font-light leading-tight text-paper">
            “Owner-run businesses don&apos;t lack ambition or ability. They lack access to the kind of
            analysis larger companies take for granted. That&apos;s what we exist to change.”
          </blockquote>
          <figcaption className="mt-8 pl-6">
            <Image
              src="/fenwick-signature-v2.png"
              alt="Fenwick How"
              width={640}
              height={201}
              className="h-14 w-auto opacity-90"
            />
            <span className="mt-2 block text-small font-semibold text-white/55">
              Fenwick How, Founder
            </span>
          </figcaption>
        </figure>
        </Reveal>
      </Section>

      {/* Background */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading eyebrow="Background" title="Where the judgment comes from." />
        </Reveal>
        <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {background.map((b, i) => (
            <Reveal key={b.h} variant="up" delay={(i % 3) * 90}>
              <div className="group h-full rounded border border-line bg-paper p-6 hover-lift">
                <dt className="text-h4 font-semibold text-ink transition-colors duration-200 group-hover:text-maroon">
                  {b.h}
                </dt>
                <dd className="mt-2 text-body text-muted">{b.p}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Section>

      {/* Look Closer */}
      <Section>
        <Reveal className="max-w-measure">
          <p className="eyebrow mb-4">Outside the work</p>
          <h2 className="text-h2 font-semibold heading-gradient">
            Fifty minutes, thirty students, one real business.
          </h2>
          <p className="mt-6 text-body-lg text-body">
            I teach a free session in local schools called{" "}
            <span className="font-semibold text-ink">Look Closer</span>. Students get a card
            describing a business a few streets away and fifteen minutes to work out the one thing
            holding it back — the same question I get paid to answer, handed to grades 8–12 for
            nothing. No fee, nothing sold, and the whole packet is free for any teacher to run
            without me in the room.
          </p>
          <p className="mt-8">
            <LinkArrow href="/look-closer">See the session</LinkArrow>
          </p>
        </Reveal>
      </Section>

      {/* Final CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">Work with the person doing the work.</h2>
              <p className="mt-4 text-body-lg text-white/70">
                Start with the Business X-Ray — a fixed-fee, low-risk first step.
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
