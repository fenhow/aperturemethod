import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { Reveal } from "@/components/ui/Reveal";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Working Together — What the Engagement Looks Like",
  description:
    "A step-by-step walk through what it's like to run The Aperture Method on your business — each phase, what happens in it, how long it takes, what you get, and exactly what's asked of you.",
  path: "/working-together",
});

type Step = {
  n: string;
  name: string;
  sub: string;
  duration: string;
  what: string;
  get: string;
  your: string;
};

const journey: Step[] = [
  {
    n: "01",
    name: "Aperture Insights",
    sub: "Understand the business",
    duration: "2–3 weeks",
    what: "We get the whole business into focus — how it runs, how it's performing, and the single constraint holding it back most. This is the Business X-Ray, and it's where most clients begin.",
    get: "Your Business X-Ray and Aperture Score, plus a clear read on the #1 thing to fix first.",
    your: "Two or three short interviews (a couple of hours total) and access to financials and reports you already have. No prep, no new spreadsheets.",
  },
  {
    n: "02",
    name: "Aperture Analytics",
    sub: "Quantify the business",
    duration: "2–4 weeks",
    what: "We apply advanced analysis, financial modeling, forecasting, and scenario planning to show exactly where you make and lose money — and what really drives profitability.",
    get: "Your Profit Map and a scenario model you keep and can re-run as things change.",
    your: "One working session to validate assumptions, plus sales and cost data exports. We handle the analysis; you sanity-check the story it tells.",
  },
  {
    n: "03",
    name: "Aperture Intelligence",
    sub: "Reveal customer & market intelligence",
    duration: "2–3 weeks, then continuous",
    what: "We combine customer analytics, demographics, geographic intelligence (GIS), market trends, and competitive insight to reveal who your customers are, where they are, and where the greatest growth opportunities exist.",
    get: "Your Customer & Market Map, with GIS trade-area analysis, standing up as a live dashboard you keep watching.",
    your: "A customer and location data export and one review session to confirm what rings true on the ground.",
  },
  {
    n: "04",
    name: "Aperture Compass",
    sub: "Determine the strategic direction",
    duration: "1–2 weeks",
    what: "We convert the analysis into a prioritized roadmap — evaluating opportunities by value, complexity, risk, and impact, and sequencing them Now, Next, Later into a plan you own.",
    get: "Your Opportunity Matrix and Focus Plan, with targets set against real numbers.",
    your: "One or two decision workshops. This is where your judgment matters most — you make the calls; we bring the evidence and the trade-offs.",
  },
  {
    n: "05",
    name: "Aperture Live",
    sub: "Manage & improve performance",
    duration: "Ongoing · 3–12 months",
    what: "We stand up executive dashboards, KPIs, and automated reporting so leadership can monitor performance in real time, measure progress against the plan, and keep improving.",
    get: "Your Scoreboard and KPI system tracking every initiative red / amber / green, quarterly performance reviews, and a re-scored Aperture Score to prove progress.",
    your: "A monthly steering conversation and a quarterly review. Your team runs the business; we keep the plan on course and the tools sharp.",
  },
];

const xrayParts: { h: string; p: string }[] = [
  { h: "A financial read", p: "margin, cash, revenue mix, and the unit economics underneath them." },
  { h: "An operating review", p: "how the business actually runs day to day, and where the friction is." },
  { h: "Owner and team interviews", p: "the context the numbers alone don't show." },
  { h: "A ranked list of constraints", p: "every bottleneck, scored and put in order." },
  { h: "The verdict", p: "your single #1 constraint and a clear recommendation on where to focus first." },
];

const scoreParts: string[] = [
  "A single 0–100 read on how well-positioned your business is right now.",
  "Built from a handful of dimensions — profitability, customers, operations, market position, and readiness to grow.",
  "A baseline you can re-measure at any point, so progress is visible, not just felt.",
];

const faqs = [
  {
    q: "How long does the whole thing take?",
    a: "The analysis phases — Aperture Insights through Aperture Compass — typically run about six to ten weeks end to end, and the Business X-Ray delivers real insight in its first couple of weeks. Aperture Live then continues for as long as it's earning its place.",
  },
  {
    q: "How much of my team's time will it cost?",
    a: "Very little early on — a few interviews and access to data you already have. Aperture Compass asks for a bit more of your judgment in the decision workshops, and Aperture Live is a genuine partnership, but even then your team stays focused on running the business.",
  },
  {
    q: "Do I have to do all five steps?",
    a: "No. Each phase is gated — you see what you'll get and decide whether to continue. Most clients start with the Business X-Ray and keep going because the value is obvious, but you're never locked into the whole path up front.",
  },
  {
    q: "Is it really a straight line?",
    a: "It's a loop, not a line. Fresh data from Aperture Live re-opens Aperture Insights on the next constraint, so the method keeps compounding rather than ending at a report.",
  },
  {
    q: "Do we need clean, perfect data?",
    a: "No. We work with what you have and improve it as we go. Messy data is normal and rarely a blocker.",
  },
];

export default function WorkingTogetherPage() {
  return (
    <>
      {/* Hero */}
      <Section tone="dark" className="pt-28 md:pt-36">
        <Reveal>
          <p className="eyebrow eyebrow--on-dark mb-5">Working together</p>
          <h1 className="max-w-4xl text-display font-semibold text-paper">
            What it&apos;s like to run The Aperture Method&trade; on your business.
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-white/75">
            Here&apos;s the whole path, step by step — what happens in each phase, how long it takes,
            what you walk away with, and exactly what&apos;s asked of you. No mystery, no open-ended
            commitment. You&apos;ll always know where you are and what comes next.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href={primaryCta.href} className="btn--on-dark">
              {primaryCta.label}
            </Link>
            <Link href="#journey" className="btn--ghost">
              Walk the path ↓
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* The shape of an engagement */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading title="The shape of an engagement." />
          <p className="mt-6 text-body-lg text-body">
            Every engagement follows the same five phases — Understand, Quantify, Reveal, Navigate,
            Perform — with the Aperture platform running underneath the whole way. Each phase is
            fixed-fee and phase-gated: you see the value, then decide whether to continue. Almost
            everyone starts small, with the Business X-Ray, and keeps going because the picture keeps
            getting clearer.
          </p>
        </Reveal>
      </Section>

      {/* Start here — the two things everyone begins with */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="Where it starts"
            title="Two things you'll hear us mention first."
            lede="Almost every engagement opens with the Business X-Ray, and it produces your Aperture Score. Here's exactly what each one is."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal variant="up">
            <div className="h-full rounded border border-line bg-paper p-8">
              <div className="flex items-baseline gap-3">
                <h3 className="text-h3 font-semibold text-ink">The Business X-Ray</h3>
                <span className="rounded-full bg-maroon/10 px-2.5 py-1 text-small font-medium text-maroon">
                  2–3 weeks · fixed fee
                </span>
              </div>
              <p className="mt-4 text-body text-body">
                A structured diagnostic of the whole business — the low-risk way most clients start. It
                consists of five things:
              </p>
              <ul className="mt-5 space-y-3">
                {xrayParts.map((p) => (
                  <li key={p.h} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" aria-hidden="true" />
                    <span className="text-body text-body">
                      <span className="font-semibold text-ink">{p.h}</span> — {p.p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal variant="up" delay={90}>
            <div className="h-full rounded border border-line bg-paper p-8">
              <div className="flex items-baseline gap-3">
                <h3 className="text-h3 font-semibold text-ink">The Aperture Score</h3>
                <span className="rounded-full bg-maroon/10 px-2.5 py-1 text-small font-medium text-maroon">
                  Your baseline
                </span>
              </div>
              <p className="mt-4 text-body text-body">
                The single number the X-Ray produces — a plain-language read you can track over time:
              </p>
              <ul className="mt-5 space-y-3">
                {scoreParts.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" aria-hidden="true" />
                    <span className="text-body text-body">{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 rounded bg-surface p-5">
                <p className="text-small text-muted">
                  Think of it as a credit score for how well-positioned your business is — one number
                  everyone can rally around, and the number the whole engagement is designed to move.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* At a glance */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="At a glance"
            title="Roughly six to ten weeks to a plan — then partnership."
            lede="The analysis phases move quickly. Aperture Live is where the work becomes results, and it lasts as long as it keeps earning its place."
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line lg:grid-cols-5">
          {journey.map((s) => (
            <div key={s.n} className="group bg-paper p-5 transition-colors duration-200 hover:bg-maroon">
              <p className="text-small font-semibold text-maroon transition-colors group-hover:text-white/80">
                {s.n}
              </p>
              <h3 className="mt-1 text-h4 font-semibold text-ink transition-colors group-hover:text-paper">
                {s.name}
              </h3>
              <p className="mt-1.5 text-small text-muted transition-colors group-hover:text-white/80">
                {s.duration}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* The journey */}
      <Section id="journey" tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="The path, step by step"
            title="Five phases. One clear walk from data to done."
            lede="Like the blades of an aperture, each phase opens the view a little more — until the whole business is in focus."
          />
        </Reveal>

        <div className="mt-14 space-y-8">
          {journey.map((s, i) => (
            <Reveal key={s.n} variant="up" delay={(i % 2) * 80}>
              <div className="group grid gap-8 rounded-lg border border-line bg-paper p-7 transition-colors duration-200 hover:border-maroon/40 md:grid-cols-[13rem_1fr] md:gap-10 md:p-10">
                {/* Number + name rail */}
                <div className="md:border-r md:border-line md:pr-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-line bg-surface text-h2 font-semibold text-maroon transition-colors duration-200 group-hover:border-maroon group-hover:bg-maroon group-hover:text-paper">
                    {s.n}
                  </div>
                  <h3 className="mt-5 text-h3 font-semibold text-ink">{s.name}&trade;</h3>
                  <p className="mt-1 text-small text-muted">{s.sub}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-small font-medium text-ink">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {s.duration}
                  </span>
                </div>

                {/* Detail */}
                <div>
                  <p className="eyebrow mb-2.5 text-maroon">What happens</p>
                  <p className="text-body-lg leading-relaxed text-body">{s.what}</p>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <div className="rounded-lg bg-surface p-5">
                      <p className="eyebrow mb-2.5 flex items-center gap-2 text-maroon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        What you get
                      </p>
                      <p className="text-body leading-relaxed text-body">{s.get}</p>
                    </div>
                    <div className="rounded-lg bg-surface p-5">
                      <p className="eyebrow mb-2.5 flex items-center gap-2 text-maroon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" />
                          <path d="M5.5 19a6.5 6.5 0 0113 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Your part
                      </p>
                      <p className="text-body leading-relaxed text-body">{s.your}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 max-w-measure">
          <p className="text-body-lg text-body">
            And then it loops. Fresh data from Aperture Live re-opens Aperture Insights on the next constraint, so the
            method keeps compounding — each pass a little sharper than the last.
          </p>
        </Reveal>
      </Section>

      {/* What stays true throughout */}
      <Section>
        <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <SectionHeading title="What stays true the whole way." />
          <div className="space-y-5">
            <p className="text-body-lg text-body">
              It&apos;s senior-led from start to finish — the person who scopes the work does the work.
              You see the price before each phase and decide whether to continue, so you&apos;re never
              locked into an open-ended commitment.
            </p>
            <p className="text-body-lg text-body">
              Everything we build on your data — models, dashboards, playbooks — is yours to keep. We
              deliberately hand it over, along with the ability to keep using it, so you finish stronger
              and more self-sufficient than you started.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section tone="surface">
        <Reveal className="max-w-3xl">
          <SectionHeading title="What clients ask before starting." className="mb-10 max-w-none" />
          <Faq items={faqs} />
        </Reveal>
      </Section>

      {/* Final CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                Start where it&apos;s easiest — the Business X-Ray.
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                A fixed-fee, low-risk first step that shows you where the opportunity is — before you
                commit to the rest of the path.
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
