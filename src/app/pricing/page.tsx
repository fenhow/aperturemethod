import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/ui/Faq";
import { ProductName } from "@/components/brand/ProductName";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import {
  SNAPSHOT_FEE,
  SNAPSHOT_CEILING,
  SNAPSHOT_CREDIT_TERMS,
  XRAY_FEE,
  XRAY_CREDIT_TERMS,
  COMPONENT_FEE,
  FULL_METHOD_FEE,
  FULL_METHOD_AFTER_CREDIT,
  A_LA_CARTE_TOTAL,
  BUNDLE_SAVING,
  ATLAS_TIERS,
  ATLAS_TERMS,
  ATLAS_PREPAY_TERMS,
  SITE_SELECTION_FEE,
  SITE_SELECTION_TERMS,
} from "@/lib/pricing";

/**
 * /pricing: every fee the firm charges, on one page, in the order a buyer meets them.
 *
 * WHY THIS PAGE EXISTS. The numbers were never secret: they were rendered in the
 * How It Works block far down the homepage, in one FAQ answer, in one sentence on
 * The Intelligence Gap and in one cell of the comparison table. But the word
 * "pricing" appeared nowhere in the navigation, the footer or any page title, and
 * /working-together, the page a serious buyer reads immediately before making
 * contact, said "fixed fee" four times without ever naming one. A firm whose
 * stated differentiator is "a fixed fee agreed before any work starts, no hourly
 * billing, no invoice you did not see coming" cannot make the buyer ask for the
 * figure. Asking is what the firms we are positioned against make you do.
 *
 * TWO RULES THIS PAGE KEEPS, and they are the reason it is safe to publish:
 *   1. The deliverable comes before its price, every time, in reading order. A
 *      cold number with no object attached is what ends a visit.
 *   2. No price appears without the terms that travel with it. The credits and
 *      the Atlas minimum are part of the figure, not footnotes to it.
 *
 * NO CURRENCY FIGURE IS TYPED HERE. Everything is imported from src/lib/pricing.ts,
 * which is the ratified SOW schedule and the source Exhibit A is kept identical to.
 * scripts/check-lenses.mjs fails the build if a fee is hard-coded anywhere in src
 * outside that file, which is what stops this page from ever quoting a number the
 * contract does not. The a la carte total is computed from its own rows for the
 * same reason: it cannot disagree with the parts it sums.
 */

export const metadata: Metadata = pageMeta({
  title: "Pricing: Every Fee, Published",
  description:
    "What an Aperture Method engagement costs, in full: the Aperture Snapshot, the Business X-Ray, a single deep component, the complete Method, Aperture Atlas and the standalone Site Selection Study. Fixed fees, agreed before any work starts. No hourly billing.",
  path: "/pricing",
});

const promises: { h: string; p: string }[] = [
  {
    h: "A fixed fee, agreed first",
    p: "The number is set and signed before any work begins. It is scoped to your business, and it does not move because the work turned out to be harder than expected.",
  },
  {
    h: "No hourly billing",
    p: "You are never buying hours, so there is no meter running when you call, no rounding up, and no invoice arriving with a number you have not seen before.",
  },
  {
    h: "Gated, not locked in",
    p: "Each phase ends with a decision point. You see what the last one produced, then choose whether to continue. Nothing commits you to the whole path up front.",
  },
];

const components: { short: string; product: string; question: string; get: string; href: string }[] = [
  {
    short: "Analytics",
    product: "Aperture Analytics™",
    question: "Why is it happening?",
    get: "Your Profit Map and a scenario model you keep: profit by product, customer, location and segment, the cost structure underneath it, break-even, and the sensitivities that show which lever pays.",
    href: "/profit-map",
  },
  {
    short: "Intelligence",
    product: "Aperture Intelligence™",
    question: "What does it reveal?",
    get: "Your Customer & Market Map and the full GIS layer package: segmentation and lifetime value, trade areas and drive times, penetration against the market, and the white space you are not serving.",
    href: "/market-map",
  },
  {
    short: "Compass",
    product: "Aperture Compass™",
    question: "So what do we do?",
    get: "Your Opportunity Matrix and a one-page Focus Plan: every opportunity scored against value, complexity, risk and the binding constraint, stress-tested, then sequenced Now, Next and Later.",
    href: "/focus-plan",
  },
];

const faqs = [
  {
    q: "Why publish prices at all? Most firms will not.",
    a: "Because the alternative is asking you to book a call to find out whether you can afford the first conversation. A fixed fee agreed before any work starts is the thing that makes this firm different from the ones charging you by the hour, and a promise you have to request is not much of a promise. If a number here is wrong for your business, you will know it in ten seconds rather than three weeks.",
  },
  {
    q: "Is the fee ever different from what is on this page?",
    a: "These are the standard fees and they are what the contract carries. Scope is what moves a number, not negotiation: a business with eight locations and four systems of record is more work to read than one with a single site and clean books. If your situation changes the scope, that is settled in writing before anything starts, never afterwards.",
  },
  {
    q: "How does the credit actually work?",
    a: `It is arithmetic, not a discount. You buy the Business X-Ray for ${XRAY_FEE}. If you continue into the full Method within 60 days, that ${XRAY_FEE} comes off in full, so the balance is ${FULL_METHOD_AFTER_CREDIT} rather than ${FULL_METHOD_FEE}. You are not paying twice for the first phase, and you are not being rewarded for deciding quickly. The same mechanic applies to the Aperture Snapshot, which counts in full toward the X-Ray.`,
  },
  {
    q: "Why is the bundle cheaper than the parts?",
    a: A_LA_CARTE_TOTAL
      ? `Because it genuinely costs less to deliver. Bought one at a time, the X-Ray and the three deep components come to ${A_LA_CARTE_TOTAL}. Taken as the Method, it is ${FULL_METHOD_FEE}, a difference of ${BUNDLE_SAVING}. Each phase feeds the next, so the work done to understand the business is not repeated when the modeling starts, and the model is not rebuilt when the market work begins.`
      : "Because each phase feeds the next. The work done to understand the business is not repeated when the modeling starts, and the model is not rebuilt when the market work begins.",
  },
  {
    q: "What if we stop after the first phase?",
    a: "Then you stop, and you keep everything the phase produced: the Business X-Ray, your Aperture Score, and a ranked read of the constraints holding the business back. It is built to be complete on its own. A fair number of engagements are meant to end there, and saying so is part of the job.",
  },
  {
    q: "Is there anything cheaper than this?",
    a: "The Reality Check is free, takes a few minutes and needs no email to see your score. It will tell you honestly whether any of this is worth your time. Below that there is nothing to sell you, and if the answer is that you do not need a consultant right now, you will be told that rather than sold something smaller.",
  },
];

/** A price, rendered the house way: the label above, the figure in maroon. */
function Fee({ label, value, onDark = false }: { label: string; value: string; onDark?: boolean }) {
  return (
    <p className={`text-small uppercase tracking-overline ${onDark ? "text-white/50" : "text-muted"}`}>
      {label}{" "}
      <span
        className={`text-h4 font-semibold normal-case tracking-normal ${
          onDark ? "text-paper" : "text-maroon"
        }`}
      >
        {value}
      </span>
    </p>
  );
}

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <Section tone="dark" className="pt-28 md:pt-36">
        <Reveal>
          <p className="eyebrow eyebrow--on-dark mb-5">Pricing</p>
          <h1 className="max-w-4xl text-display font-semibold text-paper">
            Every fee, published.
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-white/75">
            You should not have to book a call to find out what something costs. Here is the
            whole schedule: what each piece of work produces, what it costs, and what comes off
            the next number if you continue. Fixed fees, agreed before any work starts, and no
            hourly billing anywhere in it.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="#ladder" className="btn--on-dark">
              See the whole schedule ↓
            </Link>
            <Link href="/reality-check" className="btn--ghost">
              Or take the free Reality Check
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* The promise the numbers sit inside */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="How we charge"
            title="Three things that are true of every number on this page."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {promises.map((p, i) => (
            <Reveal key={p.h} variant="up" delay={i * 80}>
              <div className="hover-lift h-full rounded-lg border border-line bg-paper p-8">
                <h3 className="text-h4 font-semibold text-ink">{p.h}</h3>
                <p className="mt-3 text-body text-muted">{p.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* The ladder */}
      <Section tone="surface" id="ladder">
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="The schedule"
            title="What each step costs."
            lede="In the order you would meet them. Almost everyone starts at the second rung, and a good number stop there on purpose."
          />
        </Reveal>

        {/* The lighter depth, for the smaller business */}
        <Reveal variant="up" className="mt-10">
          <div className="hover-lift rounded-lg border border-dashed border-line bg-paper p-8">
            <p className="eyebrow">
              Under {SNAPSHOT_CEILING} in revenue · <ProductName short="Insights" /> · Snapshot
            </p>
            <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-h3 font-semibold text-ink">The Aperture Snapshot.</h3>
                <p className="mt-3 text-body text-muted">
                  The same seven lenses as the X-Ray, read from the documents you submit. No
                  interview, no triangulation against what the numbers actually show, and the
                  Aperture Score it returns is marked provisional because it has not been tested.
                  It is an honest read for a business that is not yet the size the rest of this
                  schedule is built for.
                </p>
              </div>
              <div className="shrink-0 md:text-right">
                <Fee label="Fixed fee ·" value={SNAPSHOT_FEE} />
                <Link href="/snapshot" className="link-arrow mt-3">
                  What the Snapshot covers
                  <span className="arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
            <p className="mt-5 border-t border-line pt-4 text-small text-muted">
              It {SNAPSHOT_CREDIT_TERMS}. Not offered above {SNAPSHOT_CEILING}: at that size the
              X-Ray is the honest way in.
            </p>
          </div>
        </Reveal>

        {/* The way in */}
        <Reveal variant="up" delay={80} className="mt-6">
          <div className="overflow-hidden rounded-2xl border border-maroon/30 bg-paper">
            <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div className="max-w-2xl">
                <p className="eyebrow">
                  Step 01 · <ProductName short="Insights" /> · Most clients start here
                </p>
                <h3 className="mt-2 text-h3 font-semibold text-ink">The Business X-Ray.</h3>
                <p className="mt-3 text-body text-muted">
                  A seven-lens read of the whole business: the financial position, how it runs day
                  to day, what the owner and the team see, and a ranked list of the constraints
                  holding it back. It names the one to fix first and gives you an Aperture Score to
                  measure from. Broad by design, and complete on its own.
                </p>
              </div>
              <div className="shrink-0 md:text-right">
                <Fee label="Fixed fee ·" value={XRAY_FEE} />
                <Link href="/business-x-ray" className="btn mt-4">
                  Book your Business X-Ray
                </Link>
              </div>
            </div>
            <div className="border-t border-maroon/20 bg-surface px-8 py-4 md:px-10">
              <p className="text-small text-muted">
                It {XRAY_CREDIT_TERMS}, so it is the first payment toward the Method rather than a
                fee on top of it.
              </p>
            </div>
          </div>
        </Reveal>

        {/* One deep component */}
        <Reveal variant="up" delay={120} className="mt-6">
          <div className="rounded-lg border border-line bg-paper p-8 md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow">Step 02 · Go deep on one</p>
                <h3 className="mt-2 text-h3 font-semibold text-ink">A single deep component.</h3>
                <p className="mt-3 text-body text-muted">
                  This is where the depth is. Take one of the three as a fixed-fee project when you
                  already know which question you need answered. Each is complete on its own, and
                  each carries the same fee.
                </p>
              </div>
              {COMPONENT_FEE && (
                <div className="shrink-0 md:text-right">
                  <Fee label="From ·" value={COMPONENT_FEE} />
                  <p className="mt-1 text-small text-muted">per component</p>
                </div>
              )}
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {components.map((c) => (
                <div key={c.short} className="hover-lift flex flex-col rounded-lg border border-line bg-surface p-6">
                  <p className="eyebrow">{c.question}</p>
                  <h4 className="mt-2 text-h4 font-semibold text-ink">{c.product}</h4>
                  <p className="mt-3 flex-1 text-small text-muted">{c.get}</p>
                  <Link href={c.href} className="link-arrow mt-4">
                    See the deliverable
                    <span className="arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* The whole thing */}
        <Reveal variant="up" delay={160} className="mt-6">
          <div className="rounded-2xl border border-ink bg-ink p-8 text-paper md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow eyebrow--on-dark">The full path</p>
                <h3 className="mt-2 text-h3 font-semibold text-paper">The complete Method.</h3>
                <p className="mt-3 text-body text-white/70">
                  Insights through Compass, in sequence: the diagnostic, the profit model, the
                  customer and market work, and the plan that comes out of all three. Each phase
                  feeds the next, which is why it costs less than the same four bought separately.
                  Aperture Atlas is billed separately, below.
                </p>
              </div>
              <div className="shrink-0 md:text-right">
                <Fee label="Fixed fee ·" value={FULL_METHOD_FEE} onDark />
                <p className="mt-1 text-small text-white/60">
                  {FULL_METHOD_AFTER_CREDIT} after the X-Ray credit
                </p>
              </div>
            </div>

            {A_LA_CARTE_TOTAL && (
              <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-small text-white/50">Bought one at a time</p>
                  <p className="mt-1 text-h4 font-semibold text-paper">{A_LA_CARTE_TOTAL}</p>
                </div>
                <div>
                  <p className="text-small text-white/50">Taken as the Method</p>
                  <p className="mt-1 text-h4 font-semibold text-paper">{FULL_METHOD_FEE}</p>
                </div>
                <div>
                  <p className="text-small text-white/50">Difference</p>
                  <p className="mt-1 text-h4 font-semibold text-maroon-onDark">{BUNDLE_SAVING}</p>
                </div>
              </div>
            )}

            <Link
              href="/the-aperture-method"
              className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-paper transition-colors hover:text-maroon-onDark"
            >
              See what the five phases do
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* Atlas: the recurring layer */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="The ongoing layer"
            title={
              <>
                <ProductName short="Atlas" markSize="0.8em" />, billed monthly.
              </>
            }
            lede="A project ends, a system does not. Atlas is the live platform the engagement leaves behind: your Scoreboard, your market maps and trade areas, your KPIs against plan, kept current. Priced by how many places you run, because a single-site owner and a five-site operator get very different value from the same maps."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {ATLAS_TIERS.map((t, i) => (
            <Reveal key={t.label} variant="up" delay={i * 80}>
              <div className="hover-lift h-full rounded-lg border border-line bg-paper p-6">
                <p className="text-small text-muted">{t.label}</p>
                <p className="mt-1 text-h3 font-semibold text-ink">{t.fee}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-lg border border-line bg-surface px-6 py-5 sm:flex-row sm:items-center">
            <p className="text-body text-muted">
              <span className="font-semibold text-ink">{ATLAS_TERMS}.</span> Or {ATLAS_PREPAY_TERMS}.
            </p>
            <Link href="/scoreboard" className="link-arrow shrink-0">
              See the platform
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* The standalone study */}
      <Section tone="surface">
        <Reveal>
          <div className="hover-lift rounded-lg border border-line bg-paper p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow">Standalone · Priced on the decision</p>
                <h3 className="mt-2 text-h3 font-semibold text-ink">The Site Selection Study.</h3>
                <p className="mt-3 text-body text-muted">
                  Opening a location, entering a new city, widening a service area or signing a long
                  lease. Candidate sites and territories scored on real geography: trade areas,
                  drive times, demographics and demand, before you commit. Sold on its own, and
                  priced against the size of the commitment rather than the hours in it.
                </p>
              </div>
              <div className="shrink-0 md:text-right">
                <Fee label="Fixed fee ·" value={SITE_SELECTION_FEE} />
                <Link href="/market-map" className="link-arrow mt-3">
                  How the geography works
                  <span className="arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
            <p className="mt-6 border-t border-line pt-4 text-small text-muted">
              {SITE_SELECTION_TERMS}.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading eyebrow="Straight answers" title="The questions the numbers raise." />
        </Reveal>
        <Reveal delay={80} className="mt-10">
          <Faq items={faqs} />
        </Reveal>
      </Section>

      {/* Close */}
      <Section tone="dark">
        <Reveal className="max-w-measure">
          <SectionHeading
            onDark
            eyebrow="Next"
            title="Not sure which rung you are on?"
            lede="Take the Reality Check. It is free, it takes a few minutes, no email is required to see your score, and it will tell you plainly whether any of this is worth your money right now."
          />
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/reality-check" className="btn--on-dark">
              Take the Reality Check
            </Link>
            <Link href={primaryCta.href} className="btn--ghost">
              {primaryCta.label}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
