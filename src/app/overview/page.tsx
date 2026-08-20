import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ReadMore } from "@/components/ui/ReadMore";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { MethodAperture } from "@/components/sections/MethodAperture";
import { ApertureDifference } from "@/components/sections/ApertureDifference";
import { MarketMapLive } from "@/components/sections/MarketMapLive";
import { RevenueForecastLive } from "@/components/sections/RevenueForecastLive";
import { HeroRotator } from "@/components/home/HeroRotator";
import { industries } from "@/lib/industries";
import { methodTagline } from "@/lib/content";
import { primaryCta } from "@/lib/site";

/** Homepage: Concept A, composed from the approved Step 6 copy. */

const whyDifferent = [
  {
    h: "The analysis large companies run",
    p: "Regression, forecasting, lifetime value, segmentation, optimization, applied to your business rather than to a textbook.",
  },
  {
    h: "Spatial intelligence (GIS)",
    p: "Where your customers are, where competitors win, and where your next location or market should be, mapped from real data.",
  },
  {
    h: "Market data",
    p: "Demographics, income, growth, traffic, and trade areas that turn hunches into evidence you can act on.",
  },
];

const aiPrinciples = [
  {
    h: "Only where it pays off",
    p: "We don't bolt on AI for its own sake. It goes in when it genuinely beats the alternative, and stays out when it doesn't.",
  },
  {
    h: "No black boxes",
    p: "We favor methods we can explain in plain English. If we can't tell you why it reached an answer, we won't recommend on it.",
  },
  {
    h: "A person decides",
    p: "AI surfaces the signal; you and we make the call. Every output is reviewed by a human before it reaches you.",
  },
  {
    h: "Yours to keep",
    p: "The models and dashboards we build on your data belong to you, never locked inside someone else's platform.",
  },
];

type Outcome =
  | { kind: "count"; value: number; suffix?: string; label: string }
  | { kind: "text"; stat: string; label: string };

const outcomes: Outcome[] = [
  { kind: "count", value: 5, label: "Phases, one clear path" },
  { kind: "text", stat: "$1–20M", label: "The businesses we serve" },
  { kind: "count", value: 1, label: "Senior partner, start to finish" },
  { kind: "text", stat: "Yours", label: "The dashboard you keep" },
];

const problem = [
  {
    h: "Instinct & spreadsheets",
    p: "Got you here, but never designed for bets this size.",
  },
  {
    h: "A big-firm retainer",
    p: "Priced and paced for a company several times larger.",
  },
  {
    h: "There's a better fit for a business like yours.",
    p: "Real analysis, in plain language, a durable tool you keep, and a partner who stays until the plan is working.",
  },
];

const insights = [
  {
    eyebrow: "Know Your Numbers",
    title: "Where do you actually make money?",
    href: "/insights",
    desc: "Most owners can tell you revenue to the dollar; far fewer can rank what actually earns it.",
  },
  {
    eyebrow: "Practical AI",
    title: "What can AI actually do for a business like mine?",
    href: "/insights",
    desc: "Cut through the hype: for a business your size, AI is mostly answers you already have the data for.",
  },
  {
    eyebrow: "Deciding & Growing",
    title: "Too many priorities is the same as none.",
    href: "/insights",
    desc: "When everything is a priority, nothing is: how to choose the few moves that matter.",
  },
];

export default function Home() {
  return (
    <>
      <HeroRotator />

      {/* Executive value proposition */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading title="Know your numbers. Know your customers. Know your business like never before." />
          <p className="mt-6 text-body-lg text-body">
            Most consultants promise to &ldquo;help you grow.&rdquo; We do something different: we bring the
            analytics, spatial intelligence and market data a large company would keep in-house, to
            reveal where your greatest opportunities actually exist, then translate it into plain decisions and stay to
            help you execute. Big-company intelligence, built for a business your size.
          </p>
          <p className="mt-8">
            <LinkArrow href="/what-we-do">What we do</LinkArrow>
          </p>
        </Reveal>
      </Section>

      {/* Problem framing: all-white cards with a red hover effect */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="The moment you're in"
            title="You've outgrown the way you used to decide."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr_1.1fr]">
          {problem.map((b, i) => (
            <Reveal key={b.h} variant="up" delay={i * 90}>
              <div className="group h-full rounded border border-line bg-paper p-6 hover-lift">
                <span className="block h-0.5 w-8 origin-left scale-x-0 bg-maroon transition-transform duration-300 group-hover:scale-x-100" />
                <h3 className="mt-4 text-h4 font-semibold text-ink transition-colors duration-200 group-hover:text-maroon">
                  {b.h}
                </h3>
                <p className="mt-2 text-body text-muted">{b.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Method overview */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="The Aperture Method™"
            title="Five steps, from flying blind to running on evidence."
            lede="A clear path that turns the data your business already has into decisions you can act on, then helps put them to work."
          />
          <p className="mt-5 text-h4 font-semibold text-maroon">{methodTagline}</p>
        </Reveal>
        <Reveal variant="zoom" delay={120} className="mt-12">
          <MethodAperture />
        </Reveal>
        <p className="mt-8">
          <LinkArrow href="/the-aperture-method">Explore the Method</LinkArrow>
        </p>
      </Section>

      {/* The Aperture Difference: positioning statement */}
      <ApertureDifference
        tone="surface"
        cta={{ label: "See it in action", href: "/case-studies/lumina-medical-aesthetics" }}
      />

      {/* Why we're different: the differentiator, shown live */}
      <Section tone="dark">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-5">Why we&apos;re different</p>
          <h2 className="text-h2 font-semibold text-paper">
            We don&apos;t sell dashboards. We sell MBA-level business intelligence.
          </h2>
          <p className="mt-6 text-body-lg text-white/75">
            Every consultant says, &ldquo;We&apos;ll help you grow.&rdquo; We say something different: we
            bring real analytics, spatial intelligence and market data together to reveal where your
            greatest opportunities actually exist. Dashboards, GIS, demographics: those are tools. The value is the thinking that turns them into decisions.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {whyDifferent.map((d, i) => (
            <Reveal key={d.h} variant="up" delay={i * 90}>
              <div className="h-full rounded-lg border border-white/10 bg-white/[0.03] p-8 transition-colors duration-200 hover:border-maroon-soft">
                <h3 className="text-h4 font-semibold text-paper">{d.h}</h3>
                <p className="mt-3 text-body text-white/70">{d.p}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal variant="up" delay={120} className="mt-10">
          <figure className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
            <MarketMapLive tone="dark" className="block" />
            <figcaption className="border-t border-white/10 px-6 py-4 text-small text-white/60">
              A Market Map: trade areas, drive-time rings, and where demand actually clusters.
              Spatial intelligence most consultants don&apos;t offer.
            </figcaption>
          </figure>
        </Reveal>

        <Reveal variant="up" delay={160} className="mt-6">
          <RevenueForecastLive />
          <p className="mt-3 text-small text-white/55">
            A live revenue forecast: we don&apos;t just show your numbers, we continuously project
            where your business is heading.
          </p>
        </Reveal>
      </Section>

      {/* What you get: the demonstrator + the deliverables you keep */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal variant="left" delay={100} className="order-last lg:order-first">
            <Link href="/what-you-get" className="group block overflow-hidden rounded-lg border border-line shadow-card hover-lift">
              <Image
                src="/lumina-v2.jpg"
                alt="Lumina Medical Aesthetics, an illustrative example business"
                width={1600}
                height={1066}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full"
              />
            </Link>
            <p className="mt-3 text-small text-muted">
              Illustrative: Lumina Medical Aesthetics is a fictional company; figures are synthetic.
            </p>
          </Reveal>
          <Reveal variant="right">
            <SectionHeading
              eyebrow="What you get"
              title="Strategy you can see, and everything you keep."
              lede="Meet Lumina Medical Aesthetics, an illustrative med-spa we take through the entire Aperture Method. Every engagement produces a complete, reconciled set of executive deliverables: the Business X-Ray, Profit Map, Customer & Market Map, Opportunity Matrix, and a live Scoreboard, plus the working files behind them. It keeps working after the engagement, and it's yours."
            />
            <p className="mt-8">
              <Link href="/what-you-get" className="btn">
                See what you get
              </Link>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* AI without the black box */}
      <Section tone="dark">
        <Reveal>
          <SectionHeading
            onDark
            eyebrow="Demystifying AI"
            title="AI that earns its place, nothing you can't see inside."
            lede="AI is becoming table stakes, but the black box makes owners nervous, fairly. We help you adopt it deliberately: understand it, implement what fits, and use it to keep pace with your market. Always explainable, always reviewed by a person, always yours to keep."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aiPrinciples.map((a, i) => (
            <Reveal key={a.h} variant="up" delay={(i % 4) * 80}>
              <div className="h-full rounded-lg border border-white/12 bg-white/[0.04] p-6 transition-colors duration-200 hover:border-maroon-soft/50 hover:bg-white/[0.07]">
                <h3 className="text-h4 font-semibold text-paper">{a.h}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/70">{a.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-9">
          <Link href="/ai" className="btn--on-dark">
            Bring AI into your business
          </Link>
        </Reveal>
      </Section>

      {/* Who we help: industries */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Who we help"
            title="Built for businesses like yours."
            lede="A few places the Method fits especially well, examples, not limits. If you don't see your industry, we almost certainly still work with you: the approach adapts to any owner-run business."
          />
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind, i) => (
            <Reveal key={ind.href} variant="up" delay={i * 80}>
              <Link
                href={ind.href}
                className="group flex h-full flex-col overflow-hidden rounded border border-line hover-lift"
              >
                <div className="relative overflow-hidden">
                  <ImagePlaceholder id={`HOME-IND-${ind.slug}`} label={`${ind.name}: photography to be added`} />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/90 via-ink/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <p className="translate-y-2 p-5 text-small leading-snug text-white/95 transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                      {ind.sub}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow">{ind.name}</p>
                  <h3 className="mt-2 text-h4 font-semibold text-ink">{ind.hook}</h3>
                  <ReadMore label="See how we help" className="mt-4" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* By the numbers: the shape of an engagement */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="By the numbers"
            title="Decisions you can act on, and keep."
            className="mx-auto text-center"
          />
        </Reveal>
        <dl className="mt-12 grid grid-cols-2 gap-y-10 border-t border-line pt-12 lg:grid-cols-4">
          {outcomes.map((o, i) => (
            <Reveal
              key={o.label}
              variant="zoom"
              delay={i * 110}
              className="border-line px-4 text-center lg:[&:not(:last-child)]:border-r"
            >
              <dt className="text-display font-semibold leading-none text-maroon">
                {o.kind === "count" ? (
                  <CountUp value={o.value} suffix={o.suffix ?? ""} />
                ) : (
                  o.stat
                )}
              </dt>
              <dd className="mt-4 text-small uppercase tracking-overline text-muted">{o.label}</dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      {/* Founder */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <Reveal variant="right">
            <div className="relative aspect-[4/5] overflow-hidden rounded border border-line">
              <Image
                src="/fen1.jpg"
                alt="Fenwick How, founder of The Aperture Method"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>
          </Reveal>
          <Reveal variant="left" delay={100}>
            <SectionHeading
              eyebrow="Who's behind it"
              title="You work directly with the person doing the work."
            />
            <p className="mt-6 text-body-lg text-body">
              The Aperture Method is led by its founder, Fenwick How, an entrepreneur and operator who has
              created and developed companies and led complex initiatives across a range of industries.
              No junior team and no hand-off: the senior person who does the analysis is the person you
              talk to.
            </p>
            <p className="mt-8">
              <LinkArrow href="/about">About the firm</LinkArrow>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Insights */}
      <Section tone="surface">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Insights"
              title="Plain thinking on running a business by the numbers."
              className="max-w-2xl"
            />
            <LinkArrow href="/insights">Read our insights</LinkArrow>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {insights.map((a, i) => (
            <Reveal key={a.title} variant="up" delay={i * 90}>
              <Link
                href={a.href}
                className="group flex h-full flex-col overflow-hidden rounded border border-line bg-paper hover-lift"
              >
                <div className="relative overflow-hidden">
                  <ImagePlaceholder id={`HOME-INSIGHT-${i + 1}`} label={`${a.eyebrow} article image: to be added`} />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/90 via-ink/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <p className="translate-y-2 p-5 text-small leading-snug text-white/95 transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                      {a.desc}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow">{a.eyebrow}</p>
                  <h3 className="mt-2 text-h4 font-semibold text-ink group-hover:text-maroon">{a.title}</h3>
                  <ReadMore className="mt-4" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                See your business clearly. Then watch the strategy run.
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                Start with the Business X-Ray, a fixed-fee, low-risk first step.
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
