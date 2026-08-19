import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/ui/Faq";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { LastReviewed } from "@/components/ui/LastReviewed";
import { DocumentLightbox } from "@/components/ui/DocumentLightbox";
import { Byline } from "@/components/insights/Byline";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { JsonLd } from "@/components/seo/JsonLd";
import { LENSES } from "@/lib/lenses";
import { XRAY_FEE, XRAY_FEE_NUMBER, XRAY_CREDIT_TERMS, COMPONENT_FEE, FULL_METHOD_FEE } from "@/lib/pricing";
import { pageMeta, ldService, ldWebPage, ldBreadcrumb } from "@/lib/seo";

/**
 * The Business X-Ray landing page.
 *
 * This page has one job and answers one question. Everything on the homepage
 * that serves a second audience, the book, the schools programme, the five
 * components, the platform demos, is deliberately absent: a landing page that
 * offers a reader six things to do is a page that measures six ways to leave.
 *
 * The order is fixed and is not a matter of taste: question, who is answering,
 * the outcome, the short answer, the problem with its cost, the solution, the
 * proof, the comparison, the price, the objections, the date. A reader can stop
 * at any point and have got something, and anything summarising the page can
 * lift a clean answer from each block.
 *
 * The one thing this page will not do is imply a result it cannot evidence. The
 * worked example is labelled illustrative in the copy and in the link, because
 * a landing page that overstates is a landing page that has to be taken down.
 */

const PAGE_REVIEWED = "2026-08-19";
const REPORT = "/reports/Lumina-Aperture-Method-Example-Report.pdf";

const ANSWER =
  "A Business X-Ray is a fixed-fee read of your whole business across seven lenses: finance, operations, customers, market, leadership, processes and technology. It takes about three weeks, costs " +
  XRAY_FEE +
  ", and ends by naming one thing plainly: the single constraint holding your profit back, and where the digging needs to happen next.";

export const metadata: Metadata = pageMeta({
  title: "Where is your business actually making money?",
  description:
    `A Business X-Ray is a fixed-fee, seven-lens read of an owner-run business that names your single biggest constraint in about three weeks, for ${XRAY_FEE}. Senior-led, in plain language, with nothing hidden in a dashboard.`,
  path: "/business-x-ray",
});

const faqs = [
  {
    q: "What exactly do I get at the end?",
    a: "A written Business X-Ray covering all seven lenses, your Aperture Score as a baseline you can track, a prioritised list of findings, risks and opportunities, and your single biggest constraint named in one sentence. It is a document you can hand to a partner, a lender or a board, not a slide deck that only makes sense while someone is narrating it.",
  },
  {
    q: "What do you need from me to start?",
    a: "Financial statements you already have, a few operational reports, and three to five short conversations with people who know how the business really runs. No lengthy questionnaire and no project team. If a document does not exist, that is information too, and it usually turns out to be part of the answer.",
  },
  {
    q: "What if my books are a mess?",
    a: "That is normal and it is not a blocker. We work with what exists and improve it as we go. Messy books, a spreadsheet somebody built two years ago and a point-of-sale system nobody has ever exported are the usual starting point, not the exception.",
  },
  {
    q: "How long does it take?",
    a: "About three weeks from the point the data arrives. You see findings as they land rather than waiting for a final presentation, so if something urgent surfaces in week one you hear about it in week one.",
  },
  {
    q: "What if the X-Ray says I do not need anything else?",
    a: "Then it says so, and that is a good outcome for both of us. The X-Ray is deliberately broad rather than deep: its job is to tell you where the real problem is, including the case where the answer is that you are running the business well and the constraint is outside it. It is not a qualifying call dressed up as a deliverable.",
  },
  {
    q: "Does the fee count toward more work?",
    a: `Yes. The ${XRAY_FEE} ${XRAY_CREDIT_TERMS}. A single deep component afterwards is ${COMPONENT_FEE}, and the full Method is ${FULL_METHOD_FEE}. You are never asked to decide on the rest before you have seen the first piece of work.`,
  },
  {
    q: "Who sees my financial information?",
    a: "Fenwick How, and nobody else. Data is handled on a least-access basis, stored securely, and covered by written terms signed before anything is sent. It is never sold, shared, or reused for another client, and everything built on it is yours to keep.",
  },
];

export default function BusinessXRayPage() {
  return (
    <>
      <JsonLd
        data={[
          ldService({
            name: "Business X-Ray",
            description: ANSWER,
            path: "/business-x-ray",
            price: XRAY_FEE_NUMBER,
            includes: [
              "Seven-lens business assessment",
              "Aperture Score baseline",
              "Prioritised findings, risks and opportunities",
              "Your single biggest constraint, named",
            ],
          }),
          ldWebPage({
            title: "Where is your business actually making money?",
            description: ANSWER,
            path: "/business-x-ray",
            dateModified: PAGE_REVIEWED,
          }),
          ldBreadcrumb([
            { name: "What you get", path: "/what-you-get" },
            { name: "Business X-Ray", path: "/business-x-ray" },
          ]),
        ]}
      />

      {/* 1 H1 · 3 subheadline · 2 byline · 5 answer block */}
      <Section className="pt-28 md:pt-36">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-5">Aperture Insights&trade; · the Business X-Ray</p>
            <h1 className="heading-gradient text-display font-semibold">
              Where is your business actually making money?
            </h1>
            <p className="mt-6 text-body-lg text-body">
              A Business X-Ray tells you, in about three weeks, for a fixed fee of {XRAY_FEE}, and
              names the one constraint holding everything else back.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <Byline blurb="BBA in Project Management, certified PMP, currently pursuing an MBA at Texas A&M. He runs every X-Ray himself, start to finish." />
          </Reveal>

          <Reveal delay={120} className="mt-8">
            <div className="rounded-lg border-l-2 border-maroon bg-surface p-6">
              <h2 className="text-h4 font-semibold text-ink">What is a Business X-Ray?</h2>
              <p className="mt-3 text-body text-body">{ANSWER}</p>
            </div>
          </Reveal>

          <Reveal delay={160} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/onboarding" className="btn">
              Book your Business X-Ray
            </Link>
            <span className="text-small text-muted">
              {XRAY_FEE} fixed fee · it {XRAY_CREDIT_TERMS}
            </span>
          </Reveal>
        </div>
      </Section>

      {/* 7 The problem block: their words, then what it costs */}
      <Section tone="surface">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The problem</p>
            <h2 className="heading-gradient text-h2 font-semibold">
              What is it costing you not to know?
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-6 text-body-lg text-body">
              You can tell me last month&apos;s revenue to the dollar. Now rank your products, your
              customers and your locations from most profitable to least, after the real cost of
              serving each one. Most owners cannot, and it has nothing to do with ability. Nobody
              ever built them the view.
            </p>
            <p className="mt-5 text-body text-body">
              That gap is expensive in a specific and predictable way. A few products carry the
              margin while a long tail quietly loses money once you count the labour to make them. A
              handful of customers cost more to serve than they pay, and they are often the ones
              getting the most attention. The busiest location is frequently not the most profitable
              one, and it is usually the one the next expansion gets modelled on.
            </p>
            <p className="mt-5 text-body text-body">
              None of this shows up in revenue. Most of it does not show up in the profit line at the
              bottom of the P&amp;L either, because the winners and the losers are added together
              before you ever see them. The business stays profitable overall, which is exactly why
              the parts that are bleeding stay invisible.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 border-l-2 border-maroon pl-6 text-h4 font-light leading-snug text-ink">
              A business can be profitable overall and still be profitable in spite of itself.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* 9 The solution block: outcome first, one next step */}
      <Section>
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The solution</p>
            <h2 className="heading-gradient text-h2 font-semibold">
              How does a Business X-Ray fix that?
            </h2>
            <p className="mt-6 text-body-lg text-body">
              It gives you the view nobody built. Seven lenses are read across the whole business,
              scored against the same published rubric every time, and pulled into one executive
              picture that ends with a single named constraint rather than a list of forty things to
              improve.
            </p>
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-10">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LENSES.map((lens, i) => (
              <li
                key={lens.name}
                className="rounded-lg border border-line bg-paper p-5"
              >
                <span className="text-small font-semibold tabular-nums text-maroon">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-body font-semibold text-ink">{lens.name}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="max-w-measure">
          <Reveal delay={120} className="mt-10">
            <h3 className="text-h4 font-semibold text-ink">What you walk away with</h3>
            <ul className="mt-4 space-y-2.5">
              {[
                "A written Business X-Ray across all seven lenses",
                "Your Aperture Score, a baseline you can measure progress against",
                "Prioritised findings, risks and opportunities",
                "Your single biggest constraint, named in one sentence",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-body text-body">
                  <span
                    className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-maroon"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160} className="mt-8">
            <p className="text-body text-muted">
              It runs on data you already have plus three to five short conversations. About three
              weeks. One person does the work and signs their name to it.
            </p>
            <p className="mt-6">
              <Link href="/onboarding" className="btn">
                Book your Business X-Ray
              </Link>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* 11 The proof block */}
      <Section tone="surface">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The proof</p>
            <h2 className="heading-gradient text-h2 font-semibold">
              What does this look like on a real business?
            </h2>
            <p className="mt-6 text-body-lg text-body">
              Here is a complete worked example, with the full report attached so you can check the
              arithmetic rather than take the summary on trust.
            </p>
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-8">
          <div className="max-w-measure rounded-lg border border-line bg-paper p-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-maroon" aria-hidden="true" />
              Illustrative example
            </span>
            <h3 className="mt-4 text-h3 font-semibold text-ink">Lumina Medical Aesthetics</h3>
            <p className="mt-3 text-body text-body">
              A growing three-clinic med-spa. Revenue climbed 61% in three years while profit stayed
              essentially flat. The X-Ray read all seven lenses and named the constraint that
              explained it: new-patient retention, not pricing, and not demand.
            </p>
            <p className="mt-3 text-small text-muted">
              Lumina is a worked example built to demonstrate the method, not a client engagement,
              and it is labelled that way everywhere it appears. No client work is published without
              written permission.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <DocumentLightbox
                href={REPORT}
                page={10}
                title="Example Report · Business X-Ray: Lumina Medical Aesthetics"
                triggerLabel="Read the full example report"
                triggerClassName="btn--secondary"
              />
              <LinkArrow href="/case-studies/lumina-medical-aesthetics">
                See the whole engagement
              </LinkArrow>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-8">
          <div className="max-w-measure rounded-lg border border-line bg-paper p-7">
            <h3 className="text-h4 font-semibold text-ink">The instrument, published</h3>
            <p className="mt-3 text-body text-body">
              The Aperture Score is not a number somebody felt their way to. It comes from a
              ratified rubric: seven lenses, twenty-nine sub-criteria, written anchor descriptions
              at 20, 50 and 80, and a coverage floor below which a lens cannot be scored at all.
              That is what stops a score drifting between two engagements, and it is why the
              baseline still means something when it is re-scored a year later.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* 12 The comparison table */}
      <Section>
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The alternatives</p>
            <h2 className="heading-gradient text-h2 font-semibold">
              Why not just ask my accountant?
            </h2>
            <p className="mt-6 text-body-lg text-body">
              Because a good accountant is telling you what happened, accurately, and that is a
              different job from telling you which part of the business is holding the rest back.
              Here is the whole landscape, side by side.
            </p>
          </Reveal>
        </div>
        <Reveal delay={80}>
          <ComparisonTable />
        </Reveal>
      </Section>

      {/* 13 The pricing CTA */}
      <Section tone="dark">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-4">The price</p>
          <h2 className="text-h2 font-semibold text-paper">What does it cost?</h2>
          <p className="mt-5 text-h3 font-semibold text-paper">
            {XRAY_FEE}, fixed, agreed before anything starts.
          </p>
          <p className="mt-5 text-body-lg text-white/75">
            No hourly billing, no change orders you did not agree to, and no invoice you did not see
            coming. It {XRAY_CREDIT_TERMS}, so if you go further, you are not paying for the same
            ground twice.
          </p>
          <p className="mt-8">
            <Link href="/onboarding" className="btn--on-dark">
              Book your Business X-Ray
            </Link>
          </p>
          <p className="mt-4 text-small text-white/55">
            Not ready to book? <Link href="/contact" className="underline hover:text-white">Ask a
            question first</Link>. Asking does not begin an engagement.
          </p>
        </Reveal>
      </Section>

      {/* 8 The FAQ block · 14 the last-updated stamp */}
      <Section tone="surface">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">Before you book</p>
            <h2 className="heading-gradient text-h2 font-semibold">
              Questions owners ask about the X-Ray.
            </h2>
          </Reveal>
        </div>
        <Reveal delay={80} className="mt-10">
          <Faq items={faqs} />
        </Reveal>
        <Reveal delay={120} className="mt-8">
          <LastReviewed date={PAGE_REVIEWED} />
        </Reveal>
      </Section>
    </>
  );
}
