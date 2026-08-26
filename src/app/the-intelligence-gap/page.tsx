import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { LastReviewed } from "@/components/ui/LastReviewed";
import { Byline } from "@/components/insights/Byline";
import { Citation } from "@/components/market/Citation";
import { SegmentContrast } from "@/components/market/SegmentContrast";
import { MarketFigures } from "@/components/market/MarketFigures";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, ldWebPage, ldBreadcrumb } from "@/lib/seo";
import { FIGURES, BIG_COMPANY_CAPABILITIES, SEGMENT } from "@/lib/marketContext";
import { XRAY_FEE } from "@/lib/pricing";

/**
 * The market-context page: why a firm like this exists at all.
 *
 * It is the one page on the site that argues from published data rather than
 * from what we can do, which makes it the page most likely to be quoted by
 * something summarising the question for somebody else. So every figure is
 * cited inline, dated, and links to the source document.
 *
 * The discipline that matters here is restraint. The temptation with a page
 * like this is to reach for the largest number available and imply the whole
 * small-business economy is the addressable market. It is not, and the page
 * says so explicitly: the segment this firm serves is a narrow slice, and
 * naming the slice honestly is more persuasive than claiming the whole.
 */

const REVIEWED = "2026-08-20";

const ANSWER =
  "Large companies pay for strategy, financial planning, business intelligence and market research as standing departments. A business doing a few million in revenue often needs the same answers and cannot justify the same headcount. The Aperture Method brings those disciplines together as one engagement instead, run by one senior person.";

export const metadata: Metadata = pageMeta({
  title: "How does a private business get big-company intelligence?",
  description:
    "Large companies run strategy, FP&A, business intelligence and market research as departments. Established privately held businesses need the same answers without the headcount. The published data on the gap, and what fills it.",
  path: "/the-intelligence-gap",
});

export default function IntelligenceGapPage() {
  return (
    <>
      <JsonLd
        data={[
          ldWebPage({
            title: "How does a private business get big-company intelligence?",
            description: ANSWER,
            path: "/the-intelligence-gap",
            dateModified: REVIEWED,
          }),
          ldBreadcrumb([
            { name: "Who it's for", path: "/who-its-for" },
            { name: "The intelligence gap", path: "/the-intelligence-gap" },
          ]),
        ]}
      />

      <Section className="pt-28 md:pt-36">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-5">Market context</p>
            <h1 className="heading-gradient text-display font-semibold">
              How does a private business get big-company intelligence?
            </h1>
            <p className="mt-6 text-body-lg text-body">
              Not by building the departments. By buying the disciplines once, as a piece of work,
              from someone senior enough to do them.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <Byline blurb="BBA in Project Management, certified PMP, currently pursuing an MBA at Texas A&M. He leads the work himself, start to finish." />
          </Reveal>

          <Reveal delay={120} className="mt-8">
            <div className="rounded-lg border-l-2 border-maroon bg-surface p-6">
              <h2 className="text-h4 font-semibold text-ink">The short answer</h2>
              <p className="mt-3 text-body text-body">{ANSWER}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* The economy these businesses sit in */}
      <Section tone="surface">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The economy</p>
            <h2 className="heading-gradient text-h2 font-semibold">
              How much of the economy runs without a finance department?
            </h2>
            <p className="mt-6 text-body-lg text-body">
              More of it than most people assume. On the federal government&apos;s own count, small
              businesses are not a segment of the American economy so much as the shape of it.
            </p>
          </Reveal>
        </div>

        <MarketFigures className="mt-10" />

        <Reveal delay={120} className="mt-8">
          <div className="max-w-measure">
            <p className="text-body text-body">
              They account for {FIGURES.shareOfWorkers.value} {FIGURES.shareOfWorkers.label} and{" "}
              {FIGURES.shareOfPayroll.value} {FIGURES.shareOfPayroll.label}. Over the three decades
              to 2024 they produced {FIGURES.netNewJobs.value}{" "}
              {FIGURES.netNewJobs.label}: 20.7 million against 13.2 million from large business.
            </p>
            <div className="mt-4">
              <Citation figures={["shareOfWorkers", "shareOfPayroll", "netNewJobs"]} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={160} className="mt-8">
          <div className="max-w-measure rounded-lg border border-line bg-paper p-6">
            <h3 className="text-h4 font-semibold text-ink">
              A note on what these numbers do not say
            </h3>
            <p className="mt-3 text-body text-body">
              None of this makes 36.2 million businesses potential clients, and this firm does not
              claim them. The figures describe the economy an established private business operates
              in. They are not a market size, and anyone presenting them as one is selling you the
              wrong thing.
            </p>
            <p className="mt-3 text-small text-muted">
              You may also see it said that small businesses create close to nine in ten net new
              jobs. That is accurate for the year to March 2024 and is not the long-run figure,
              which is {FIGURES.netNewJobs.value}. Where a number only works with its window
              attached, the window belongs with it.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* The specific segment */}
      <SegmentContrast tone="paper" />

      {/* What large companies buy, and how it gets bought at this size */}
      <Section tone="surface">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The disciplines</p>
            <h2 className="heading-gradient text-h2 font-semibold">
              What does a large company actually buy?
            </h2>
            <p className="mt-6 text-body-lg text-body">
              Not magic, and not better instincts. It buys a set of ordinary disciplines, staffed
              permanently, each with someone whose whole job is to run it.
            </p>
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-10">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BIG_COMPANY_CAPABILITIES.map((c) => (
              <li key={c} className="rounded-lg border border-line bg-paper px-5 py-4 text-body text-ink">
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="mt-8">
          <div className="max-w-measure">
            <p className="text-body-lg text-body">
              A business between {SEGMENT.floor} and {SEGMENT.ceiling} frequently needs the answers
              those functions produce, and just as frequently cannot justify the eight salaries that
              produce them. The usual response is to do without, or to buy one piece of it, a
              dashboard or a market report, and find that a piece on its own does not decide
              anything.
            </p>
            <p className="mt-5 text-body text-body">
              The alternative is to buy the disciplines as a piece of work rather than as
              headcount. That is what this is: one structured engagement that runs the same
              sequence a large company would run continuously, sized to a business that needs it
              periodically.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* The arc */}
      <Section>
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The sequence</p>
            <h2 className="heading-gradient text-h2 font-semibold">
              What does that look like in practice?
            </h2>
            <p className="mt-6 text-body-lg text-body">
              One continuous arc, in the same order every time, because each step needs the one
              before it to be worth anything.
            </p>
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-10">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { n: "01", verb: "Understand", body: "Build a picture of the whole business and find what matters." },
              { n: "02", verb: "Quantify", body: "Turn financial and operating information into measurable performance." },
              { n: "03", verb: "Reveal", body: "Expose the customer, market and geographic patterns not visible today." },
              { n: "04", verb: "Navigate", body: "Turn findings into priorities and a roadmap you can act on." },
              { n: "05", verb: "Perform", body: "Put the measurement in place to see whether it is working." },
            ].map((step) => (
              <li key={step.n} className="rounded-lg border border-line bg-paper p-5">
                <span className="text-small font-semibold tabular-nums text-maroon">{step.n}</span>
                <p className="mt-2 text-body font-semibold text-ink">{step.verb}</p>
                <p className="mt-1.5 text-small text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <div className="max-w-measure">
            <p className="border-l-2 border-maroon pl-6 text-h4 font-light leading-snug text-ink">
              You already know the business. This is about seeing the whole of it at once.
            </p>
            <p className="mt-6 text-body text-body">
              The judgment stays yours. It was built on years of knowing your customers, your
              industry and your people, and no analysis replaces that. What analysis does is give
              that judgment better information to work with.
            </p>
            <p className="mt-6">
              <LinkArrow href="/the-aperture-method">See how the five phases work</LinkArrow>
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Close */}
      <Section tone="dark">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-4">Where to start</p>
          <h2 className="text-h2 font-semibold text-paper">
            The first step is deliberately small.
          </h2>
          <p className="mt-6 text-body-lg text-white/75">
            A Business X-Ray is a fixed fee of {XRAY_FEE} and reads the whole business across seven
            lenses, so you find out which of these disciplines your business actually needs before
            you commit to any of them.
          </p>
          <p className="mt-8">
            <Link href="/business-x-ray" className="btn--on-dark">
              See what an X-Ray covers
            </Link>
          </p>
        </Reveal>
      </Section>

      <Section tone="surface" className="py-section-sm">
        <Reveal className="max-w-measure">
          <LastReviewed date={REVIEWED} />
        </Reveal>
      </Section>
    </>
  );
}
