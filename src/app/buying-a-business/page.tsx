import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { Reveal } from "@/components/ui/Reveal";
import { pageMeta } from "@/lib/seo";

/**
 * /buying-a-business — the pre-offer acquisition review (Oct 2026).
 *
 * Not a sixth phase of the Method: it is Phases 01-02 (Insights + Analytics)
 * pointed at a target instead of the client. Proven on Project Whetstone.
 *
 * Guardrails that shaped every line, do not soften them:
 *  - BUY SIDE ONLY. Selling the exit process competes with the exit-planning
 *    advisers the partner channel depends on (see go-to-market).
 *  - Never "Quality of Earnings" or "valuation": those imply a CPA attestation
 *    or a credentialed appraisal. Say "pre-offer financial review" and
 *    "indicative value range".
 *  - Fixed fee only. No success fees and no introducing buyers to sellers:
 *    that strays into broker territory.
 *  - No fee shown yet: it is quoted per deal until there is a published one in
 *    src/lib/pricing.ts.
 */

export const metadata: Metadata = pageMeta({
  title: "Buying a Business? A Pre-Offer Financial Review",
  description:
    "Before you sign the offer, know what you are actually buying. A fixed-fee, senior-led review of a target's real earnings, risks and value, in three business days from a complete data package.",
  path: "/buying-a-business",
});

const bookHref = "/contact?ref=buying-a-business#book";

const lenses: { h: string; p: string }[] = [
  {
    h: "What it really earns",
    p: "The seller's profit, rebuilt. Every add-back is tested and graded by the evidence behind it, so you see which adjustments hold up and which are hope.",
  },
  {
    h: "How good those earnings are",
    p: "One-off gains, timing tricks, owner perks and anything that will not repeat once the business is yours, separated from the profit that will.",
  },
  {
    h: "Who it depends on",
    p: "Customer and supplier concentration, and how much of the business walks out the door with the current owner.",
  },
  {
    h: "Where the cash goes",
    p: "Working capital, the cash cycle and what the business needs to keep running on day one, so the cash you inherit is not a surprise.",
  },
  {
    h: "What will hold it back",
    p: "The one constraint that will limit growth after you own it, named with the evidence, before it becomes your problem.",
  },
  {
    h: "What it is worth to you",
    p: "An indicative value range built on the earnings that survived the review, with the assumptions shown, so you can see what moves the number.",
  },
];

const deliverables: string[] = [
  "A written review of the target's normalized earnings, with an evidence grade on every adjustment",
  "A risk register, red, amber and green, ranked by what it could cost you",
  "An indicative value range, with the sensitivities that move it",
  "The questions to put to the seller before you sign, in priority order",
  "If you proceed, the first 100 days: what to fix, protect and measure first",
];

const steps: { n: string; h: string; p: string }[] = [
  {
    n: "01",
    h: "Scope and confidentiality",
    p: "A short call about the deal. We work under your NDA, agree what data the seller needs to provide, and fix the fee before anything starts.",
  },
  {
    n: "02",
    h: "The review",
    p: "The target's financials and operating data go through the same analytical engine used on every Aperture engagement: normalization, earnings quality, concentration, cash and constraint.",
  },
  {
    n: "03",
    h: "The readout",
    p: "A working session before you make or finalize your offer: what we found, what it means for price and terms, and what to ask next.",
  },
];

const notThis: { h: string; p: string }[] = [
  {
    h: "Not an audit or an attestation",
    p: "This is independent analysis to inform your decision. Where your lender or deal needs a CPA's quality-of-earnings report or an audit, we work alongside that firm, not instead of it.",
  },
  {
    h: "Not a formal valuation",
    p: "You get an indicative range and the reasoning behind it. Where a credentialed appraisal is required, for SBA lending, a partner buyout or a tax matter, we will say so.",
  },
  {
    h: "Not a broker",
    p: "We do not find deals, introduce buyers to sellers or take a percentage. One fixed fee, so the only interest we have is in telling you the truth about the business.",
  },
];

const faqs = [
  {
    q: "Who is this for?",
    a: "Owners buying a competitor, a supplier or a second location, and individual buyers acquiring their first business. If you are about to put real money behind a seller's numbers, it is for you.",
  },
  {
    q: "When should I bring you in?",
    a: "Before you sign a letter of intent, or as soon as the seller agrees to share financials. That is when what we find can still change the price and the terms. Afterwards it can still shape your first 100 days.",
  },
  {
    q: "What do you need from me and the seller?",
    a: "Three years of financial statements and tax returns if available, the most recent year-to-date figures, and the data behind revenue: customers, products, locations. We send a precise list at the start, and we work with what exists. Messy is normal.",
  },
  {
    q: "How is this different from a Quality of Earnings report?",
    a: "A Quality of Earnings report is a formal engagement by an accounting firm, often required by lenders, and priced accordingly. This review asks many of the same questions earlier and at a fraction of the cost, so you know whether the deal deserves that spend. It does not replace a formal report where one is required.",
  },
  {
    q: "How long does it take, and what does it cost?",
    a: "Three business days once we have the complete data package. If records arrive in pieces, the clock starts when the last piece lands. The fee is fixed and agreed before any work starts, quoted on the size and complexity of the deal.",
  },
  {
    q: "Do you help people sell their business?",
    a: "No. We work for buyers. Owners preparing to sell are better served by an exit-planning adviser, and we are glad to point you to one.",
  },
  {
    q: "Is everything kept confidential?",
    a: "Yes. We work under your NDA, the seller's data is used only for your review, and nothing about the deal is ever published or used as an example without permission.",
  },
];

function Dot() {
  return <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" aria-hidden="true" />;
}

export default function BuyingABusinessPage() {
  return (
    <>
      {/* Hero */}
      <Section tone="dark" className="pt-28 md:pt-36">
        <Reveal>
          <p className="eyebrow eyebrow--on-dark mb-5">Buying a business</p>
          <h1 className="max-w-4xl text-display font-semibold text-paper">
            Before you sign the offer, know what you are actually buying.
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-white/75">
            A seller&apos;s numbers are prepared to sell the business. A pre-offer review rebuilds
            them from the evidence: what the business really earns, what it depends on, what will
            hold it back, and what it is worth to you. Fixed fee, senior-led, three business days from complete data.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href={bookHref} className="btn--on-dark">
              Talk about a deal
            </Link>
            <Link href="#what-you-get" className="btn--ghost">
              What you get ↓
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* The problem */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading title="The price is set on numbers you did not prepare." />
          <p className="mt-6 text-body-lg text-body">
            Most small acquisitions are priced as a multiple of earnings, and the earnings come from
            the seller. Every add-back for the owner&apos;s car, a one-time repair or a relative on
            payroll raises the number you multiply. Some are fair. Some are not. Large buyers pay
            accounting firms tens of thousands of dollars to find out which. Owner-run buyers usually
            find out after closing.
          </p>
          <p className="mt-4 text-body-lg text-body">
            This review gives you the same questions, answered from the evidence, before your money
            is committed.
          </p>
        </Reveal>
      </Section>

      {/* Six lenses */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="What we look at"
            title="Six questions every buyer should be able to answer."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lenses.map((l, i) => (
            <Reveal key={l.h} variant="up" delay={(i % 3) * 70}>
              <div className="h-full rounded-lg border border-line bg-paper p-7">
                <p className="text-small font-semibold text-maroon">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-h4 font-semibold text-ink">{l.h}</h3>
                <p className="mt-3 text-body text-body">{l.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Deliverables */}
      <Section id="what-you-get">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="What you get"
              title="A decision you can defend, before you sign."
              lede="Written for a buyer, not an accountant: plain findings, what they mean for price and terms, and what to do about them."
            />
          </Reveal>
          <Reveal variant="up">
            <ul className="space-y-4">
              {deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-body-lg text-body">
                  <Dot />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* How it works */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps, three business days."
            lede="The same analytical engine that runs every Aperture engagement, pointed at the business you are about to buy."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} variant="up" delay={i * 80}>
              <div className="h-full rounded-lg border border-line bg-paper p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-maroon text-h4 font-semibold text-paper">
                  {s.n}
                </div>
                <h3 className="mt-5 text-h4 font-semibold text-ink">{s.h}</h3>
                <p className="mt-3 text-body text-body">{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-8 max-w-measure text-body text-muted">
            The fee is fixed and agreed before any work starts, quoted on the size and complexity of
            the deal. No success fee, ever.
          </p>
        </Reveal>
      </Section>

      {/* After you buy */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading eyebrow="After you buy" title="The review becomes your starting point." />
          <p className="mt-6 text-body-lg text-body">
            If the deal closes, the work is not wasted. The review is the baseline for{" "}
            <Link href="/the-aperture-method" className="link-inline font-semibold">
              The Aperture Method
            </Link>
            : the constraint is already named, the numbers are already rebuilt, and the first 100
            days are already planned. You can carry straight on into the scoreboard that tracks
            whether the acquisition delivers what it promised.
          </p>
        </Reveal>
      </Section>

      {/* What this is not */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading eyebrow="To be clear" title="What this review is not." />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {notThis.map((n, i) => (
            <Reveal key={n.h} variant="up" delay={i * 70}>
              <div className="h-full rounded-lg border border-line border-l-4 border-l-maroon bg-paper p-7">
                <h3 className="text-h4 font-semibold text-ink">{n.h}</h3>
                <p className="mt-3 text-body text-body">{n.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <Reveal className="max-w-3xl">
          <SectionHeading title="What buyers ask first." className="mb-10 max-w-none" />
          <Faq items={faqs} />
        </Reveal>
      </Section>

      {/* CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">Looking at a business right now?</h2>
              <p className="mt-4 text-body-lg text-white/70">
                Tell us about the deal. A short, confidential conversation is enough to know whether
                a review is worth it, and what it would cost.
              </p>
            </div>
            <Link href={bookHref} className="btn--on-dark shrink-0">
              Talk about a deal
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
