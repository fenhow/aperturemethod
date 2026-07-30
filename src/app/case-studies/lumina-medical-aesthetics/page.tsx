import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Case Study — Lumina Medical Aesthetics",
  description:
    "A full Aperture Method engagement, start to finish: how we found the constraint holding a growing med-spa's profit flat, what each phase produced, and the plan that followed. Illustrative example with the complete report.",
  path: "/case-studies/lumina-medical-aesthetics",
});

const REPORT = "/reports/Lumina-Aperture-Method-Example-Report.pdf";

const metrics = [
  { v: "+61%", l: "Revenue growth over three years" },
  { v: "~Flat", l: "Profit over the same period" },
  { v: "~50%", l: "New patients who never return" },
  { v: "$200–400K", l: "Estimated annual profit left on the table" },
];

type Phase = {
  n: string;
  product: string;
  verb: string;
  question: string;
  found: string;
  deliverable: string;
  img: string;
  alt: string;
};

const phases: Phase[] = [
  {
    n: "01",
    product: "Aperture Insights",
    verb: "Understand",
    question: "What is happening?",
    found:
      "Lumina is a strong, growing business that isn't getting healthier. Revenue climbed 61% in three years while profit stayed essentially flat. The Business X-Ray read the whole business across seven lenses, and the Aperture Score named the single biggest constraint: new-patient retention.",
    deliverable: "Business X-Ray™ + Aperture Score™",
    img: "/deliverables/02_insights_aperture_score.jpg",
    alt: "The Business X-Ray and Aperture Score report page for Lumina Medical Aesthetics",
  },
  {
    n: "02",
    product: "Aperture Analytics",
    verb: "Quantify",
    question: "Why is it happening?",
    found:
      "The Profit Map showed the profit is real but concentrated — a few services and the flagship location carry the business, while margin leaks into winning new patients who don't come back. A live scenario model then weighed the real choice on the table: fix retention, or open a fourth location.",
    deliverable: "Profit Map™ + scenario model",
    img: "/deliverables/03_analytics_scenario_model.jpg",
    alt: "The Profit Map and scenario model report page for Lumina Medical Aesthetics",
  },
  {
    n: "03",
    product: "Aperture Intelligence",
    verb: "Reveal",
    question: "What opportunities does it reveal?",
    found:
      "Mapping Lumina's own patients revealed where the best customers cluster and where demand goes unmet. The newest clinic is still building its base, and the strongest untapped trade area is the Energy Corridor — a data-backed answer to 'where do we grow next?'",
    deliverable: "Customer & Market Map™ + GIS package",
    img: "/deliverables/04_intelligence_site_selection.jpg",
    alt: "The Customer & Market Map and site-selection analysis for Lumina Medical Aesthetics",
  },
  {
    n: "04",
    product: "Aperture Compass",
    verb: "Navigate",
    question: "Where should we go next?",
    found:
      "Every opportunity from the diagnostic, the Profit Map, and the map was scored on impact, effort, cost, and confidence, then sequenced into a Now / Next / Later plan — retention first, expansion only once the numbers support it. Not a list of ideas; a board-ready order of operations.",
    deliverable: "Opportunity Matrix™ + Focus Plan™",
    img: "/deliverables/05_compass_opportunity_matrix.jpg",
    alt: "The Opportunity Matrix and Focus Plan for Lumina Medical Aesthetics",
  },
  {
    n: "05",
    product: "Aperture Live",
    verb: "Perform",
    question: "How do we sustain and improve results?",
    found:
      "A live executive Scoreboard tracks the few numbers that actually move the business, and a re-scored Aperture Score proves the strategy is showing up in the P&L — quarter after quarter, not just in a one-time report.",
    deliverable: "Scoreboard™ + KPI system",
    img: "/deliverables/06_live_scoreboard.jpg",
    alt: "The Scoreboard and KPI dashboard for Lumina Medical Aesthetics",
  },
];

function IllustrativeTag() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-maroon" aria-hidden="true" />
      Illustrative
    </span>
  );
}

function ReportButton({ onDark = false }: { onDark?: boolean }) {
  return (
    <a
      href={REPORT}
      target="_blank"
      rel="noopener noreferrer"
      className={onDark ? "btn--on-dark inline-flex items-center gap-2.5" : "btn inline-flex items-center gap-2.5"}
    >
      <svg
        className="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
        <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
      </svg>
      Read the full report
    </a>
  );
}

export default function LuminaCaseStudyPage() {
  return (
    <>
      {/* Hero */}
      <Section tone="dark" className="pt-28 md:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <p className="eyebrow eyebrow--on-dark mb-5">Case study · Illustrative</p>
            <h1 className="text-display font-semibold text-paper">Lumina Medical Aesthetics</h1>
            <p className="mt-6 max-w-xl text-body-lg text-white/75">
              A complete Aperture Method™ engagement, start to finish — how we found the one thing
              holding a fast-growing med-spa&apos;s profit flat, what each phase produced, and the plan that
              followed.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ReportButton onDark />
              <span className="text-small text-white/50">41-page PDF · illustrative</span>
            </div>
          </Reveal>
          <Reveal variant="left">
            <figure className="relative overflow-hidden rounded-lg ring-1 ring-white/10">
              <Image
                src="/lumina-v2.jpg"
                alt="Lumina Medical Aesthetics — an illustrative med-spa"
                width={1120}
                height={745}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-auto w-full"
                priority
              />
              <figcaption className="absolute right-3 top-3">
                <IllustrativeTag />
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      {/* The situation */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="The situation"
            title="Growing fast — and no more profitable for it."
            lede="Lumina had done the hard part: demand was strong and revenue was climbing. But the owner couldn't see why all that growth wasn't reaching the bottom line — or whether the answer was to expand."
          />
        </Reveal>
        <Reveal className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.l} className="bg-paper p-6">
              <p className="text-h2 font-semibold text-maroon">{m.v}</p>
              <p className="mt-2 text-small text-muted">{m.l}</p>
            </div>
          ))}
        </Reveal>
        <p className="mt-6 text-small italic text-muted">
          Figures are synthetic and internally consistent — an illustrative example, not an actual
          client result.
        </p>
      </Section>

      {/* Phase by phase */}
      <Section tone="surface">
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="The work, phase by phase"
            title="One continuous arc — Understand, Quantify, Reveal, Navigate, Perform."
            lede="Each phase produced a real deliverable and handed off to the next, so the whole engagement reads as one story rather than five separate reports."
          />
        </Reveal>
        <div className="mt-14 space-y-20 md:space-y-28">
          {phases.map((p, i) => (
            <Reveal key={p.n} variant="up">
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? "lg:[&>figure]:order-first" : ""
                }`}
              >
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-h2 font-semibold leading-none text-maroon/30">{p.n}</span>
                    <div>
                      <p className="eyebrow">{p.verb}</p>
                      <h2 className="mt-1 text-h2 font-semibold text-ink">{p.product}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-body-lg italic text-muted">&ldquo;{p.question}&rdquo;</p>
                  <p className="mt-5 text-body-lg text-body">{p.found}</p>
                  <p className="mt-5 border-l-2 border-maroon pl-4 text-body font-medium text-ink">
                    Deliverable: {p.deliverable}
                  </p>
                </div>
                <figure className="relative">
                  <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-card ring-1 ring-black/[0.03]">
                    <Image
                      src={p.img}
                      alt={p.alt}
                      width={1150}
                      height={1489}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="h-auto w-full"
                    />
                  </div>
                  <figcaption className="absolute right-3 top-3">
                    <IllustrativeTag />
                  </figcaption>
                </figure>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* The recommendation */}
      <Section tone="dark">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-5">The recommendation</p>
          <h2 className="text-h2 font-semibold text-paper">
            Fix retention first — then expand, where the data points.
          </h2>
          <p className="mt-6 text-body-lg text-white/75">
            The single highest-return move wasn&apos;t a new location — it was keeping the patients Lumina
            already wins. Closing the retention gap is worth an estimated $200K–$400K in additional
            annual profit and de-risks everything that follows. And when the time comes to grow,
            Lumina&apos;s own patients point clearly to one place: the Energy Corridor.
          </p>
        </Reveal>
        <Reveal className="mt-8">
          <ReportButton onDark />
        </Reveal>
      </Section>

      {/* Cross-links */}
      <Section tone="surface">
        <Reveal className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <SectionHeading title="See the deliverables up close." />
          <div>
            <p className="text-body-lg text-body">
              This engagement is shown end to end on the What You Get page — every report and working
              file the five phases produce, with the same Lumina example.
            </p>
            <p className="mt-6">
              <Link
                href="/what-you-get"
                className="text-[15px] font-semibold text-ink transition-colors hover:text-maroon"
              >
                See what you get &rarr;
              </Link>
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Final CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                Curious what your business&apos;s version of this looks like?
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                It starts with a single low-risk step — the Business X-Ray. Everything above follows
                from it, only as the value becomes obvious.
              </p>
            </div>
            <Link href={primaryCta.href} className="btn--on-dark shrink-0">
              {primaryCta.label}
            </Link>
          </div>
          <p className="mt-10 text-small text-white/45">
            Illustrative — Lumina Medical Aesthetics is a fictional company created to demonstrate The
            Aperture Method. All figures are synthetic; nothing here represents a real client or real
            results.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
