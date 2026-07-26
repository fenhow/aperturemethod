import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { methodTagline } from "@/lib/content";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "What You Get — The Deliverables",
  description:
    "See the tangible deliverables of an Aperture Method engagement — the Business X-Ray, Profit Map, Customer & Market Map, Opportunity Matrix, and live Scoreboard — shown end to end with an illustrative example.",
  path: "/what-you-get",
});

type Deliverable = {
  n: string;
  product: string;
  question: string;
  get: React.ReactNode;
  outcome: string;
  img: string;
  alt: string;
};

const deliverables: Deliverable[] = [
  {
    n: "01",
    product: "Aperture Insights™",
    question: "What is happening?",
    get: (
      <>
        the Business X-Ray&trade; + Aperture Score&trade; — a whole-business diagnostic that names your
        single biggest constraint.
      </>
    ),
    outcome: "You know exactly where you stand, and the one thing to fix first.",
    img: "/deliverables/02_insights_aperture_score.jpg",
    alt: "Aperture Insights deliverable — the Business X-Ray and Aperture Score report page for Lumina Medical Aesthetics",
  },
  {
    n: "02",
    product: "Aperture Analytics",
    question: "Why is it happening?",
    get: (
      <>
        the Profit Map&trade; + a live scenario model showing where every dollar is made and lost, and
        which move pays off most.
      </>
    ),
    outcome: "You see profit by service, provider, and location — and what to do about it.",
    img: "/deliverables/03_analytics_scenario_model.jpg",
    alt: "Aperture Analytics deliverable — the Profit Map and scenario model report page for Lumina Medical Aesthetics",
  },
  {
    n: "03",
    product: "Aperture Intelligence",
    question: "What opportunities does it reveal?",
    get: (
      <>
        the Customer &amp; Market Map&trade; + a full ArcGIS layer package — your patients mapped, trade
        areas, and a data-backed answer to &ldquo;where do we grow next?&rdquo;
      </>
    ),
    outcome: "You know who your best customers are — and where the next ones live.",
    img: "/deliverables/04_intelligence_site_selection.jpg",
    alt: "Aperture Intelligence deliverable — the Customer & Market Map and site-selection analysis for Lumina Medical Aesthetics",
  },
  {
    n: "04",
    product: "Aperture Compass",
    question: "Where should we go next?",
    get: (
      <>
        the Opportunity Matrix&trade; + a Now / Next / Later Focus Plan&trade; — every opportunity scored
        and sequenced.
      </>
    ),
    outcome: "You have a prioritized, board-ready plan — not a list of ideas.",
    img: "/deliverables/05_compass_opportunity_matrix.jpg",
    alt: "Aperture Compass deliverable — the Opportunity Matrix and Focus Plan for Lumina Medical Aesthetics",
  },
  {
    n: "05",
    product: "Aperture Live",
    question: "How do we sustain and improve results?",
    get: (
      <>
        the Scoreboard&trade; + KPI system — a live executive dashboard and a re-scored Aperture Score
        that proves progress.
      </>
    ),
    outcome: "You watch the strategy show up in your numbers, quarter after quarter.",
    img: "/deliverables/06_live_scoreboard.jpg",
    alt: "Aperture Live deliverable — the Scoreboard and KPI dashboard for Lumina Medical Aesthetics",
  },
];

const exampleReport = {
  href: "/reports/Lumina-Aperture-Method-Example-Report.pdf",
  pages: 41,
};

const techniques = [
  "Regression",
  "Forecasting",
  "CLV & cohort analysis",
  "Break-even & sensitivity",
  "Site-selection modeling",
  "Optimization",
];

function IllustrativeTag() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-maroon" aria-hidden="true" />
      Illustrative
    </span>
  );
}

export default function WhatYouGetPage() {
  return (
    <>
      {/* Hero */}
      <Section tone="dark" className="pt-28 md:pt-36">
        <Reveal>
          <p className="eyebrow eyebrow--on-dark mb-5">What you get</p>
          <h1 className="max-w-4xl text-display font-semibold text-paper">
            Strategy you can see. Deliverables you can use.
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-white/75">
            Every Aperture Method&trade; engagement produces a complete, reconciled set of executive
            deliverables — not a slide deck of opinions. Here&apos;s exactly what lands on your desk.
          </p>
          <p className="mt-7 text-h4 font-semibold text-paper">{methodTagline}</p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href={exampleReport.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn--on-dark inline-flex items-center gap-2.5"
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
              See the example report
            </a>
            <span className="text-small text-white/50">PDF · {exampleReport.pages} pages · illustrative</span>
          </div>
          <p className="mt-6 text-small text-white/55">
            Shown with Lumina Medical Aesthetics, an illustrative example.
          </p>
        </Reveal>
      </Section>

      {/* The five deliverables */}
      <Section>
        <div className="space-y-20 md:space-y-28">
          {deliverables.map((d, i) => (
            <Reveal key={d.n} variant="up">
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? "lg:[&>figure]:order-first" : ""
                }`}
              >
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-h2 font-semibold leading-none text-maroon/30">{d.n}</span>
                    <h2 className="text-h2 font-semibold text-ink">{d.product}</h2>
                  </div>
                  <p className="mt-3 text-body-lg italic text-muted">&ldquo;{d.question}&rdquo;</p>
                  <p className="mt-6 text-body-lg text-body">
                    <span className="font-semibold text-ink">You get:</span> {d.get}
                  </p>
                  <p className="mt-4 border-l-2 border-maroon pl-4 text-body-lg font-medium text-ink">
                    {d.outcome}
                  </p>
                </div>

                <figure className="relative">
                  <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-card ring-1 ring-black/[0.03]">
                    <Image
                      src={d.img}
                      alt={d.alt}
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

      {/* Differentiator band */}
      <Section tone="dark">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-5">Why it&apos;s different</p>
          <h2 className="text-h2 font-semibold text-paper">
            The difference is the analysis, not the dashboard.
          </h2>
          <p className="mt-6 text-body-lg text-white/75">
            Marketing companies optimize ad clicks. Bookkeepers record the past. We apply graduate-level
            (MBA) business science — financial modeling, marketing science, spatial econometrics,
            forecasting, optimization — to reveal where the profit and opportunities truly are. The tools
            are commodities; the thinking is the product.
          </p>
        </Reveal>
        <Reveal className="mt-8 flex flex-wrap gap-2.5">
          {techniques.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-small font-medium text-white/80"
            >
              {t}
            </span>
          ))}
        </Reveal>
      </Section>

      {/* Companion assets */}
      <Section tone="surface">
        <Reveal className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <SectionHeading title="And the working files, not just the reports." />
          <div>
            <p className="text-body-lg text-body">
              Alongside the reports you receive the working files: reconciled financial statements, the live
              Profit Map workbook, the ArcGIS map layers, and a 36-month KPI feed to drive your dashboard.
              The intelligence is yours to keep and keep using.
            </p>
            <a
              href={exampleReport.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-medium text-maroon underline-offset-4 hover:underline"
            >
              See the full example report ({exampleReport.pages}-page PDF)
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </Reveal>
      </Section>

      {/* Closing / CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                This is one engagement, shown end to end.
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                Yours starts with a single low-risk step — the Business X-Ray. Everything above follows
                from it, only as the value becomes obvious.
              </p>
              <p className="mt-5">
                <Link
                  href="/case-studies/lumina-medical-aesthetics"
                  className="text-[15px] font-semibold text-paper underline-offset-4 hover:underline"
                >
                  Read the full Lumina case study &rarr;
                </Link>
              </p>
            </div>
            <Link href={primaryCta.href} className="btn--on-dark shrink-0">
              Book a consultation
            </Link>
          </div>
          <p className="mt-10 text-small text-white/45">
            Illustrative — Lumina Medical Aesthetics is a fictional company; figures are synthetic. Not a
            representation of actual client results.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
