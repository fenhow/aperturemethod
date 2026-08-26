/**
 * Landing page content.
 *
 * Every landing page on this site is the same page with different words. The
 * order of the blocks is not a matter of taste, it is what makes the page work:
 * the question, who is answering it, the outcome, a short answer, the problem
 * with its cost attached, the solution, the proof, the alternatives, the price,
 * the objections, the date. A reader can stop at any block and have got
 * something, and anything summarising the page can lift a clean answer from
 * each one.
 *
 * Holding that in data rather than in five page files means the structure
 * cannot drift between pages, a new page is a content decision rather than a
 * layout decision, and a change to the shape happens once.
 *
 * Two rules for anyone adding to this file:
 *
 *  1. Prices come from src/lib/pricing.ts. Never type a figure here.
 *  2. Nothing in `proof` may imply a client result. Worked examples are
 *     labelled as worked examples, in the copy a person reads, not in a
 *     footnote. Published analysis of public filings is fair to cite as our
 *     own work because it is.
 */

import {
  SNAPSHOT_FEE,
  SNAPSHOT_FEE_NUMBER,
  SNAPSHOT_CREDIT_TERMS,
  SNAPSHOT_CEILING,
  XRAY_FEE,
  XRAY_FEE_NUMBER,
  XRAY_CREDIT_TERMS,
  COMPONENT_FEE,
  FULL_METHOD_FEE,
  ATLAS_FEE,
  ATLAS_TIERS,
  ATLAS_TERMS,
  ATLAS_PREPAY_TERMS,
  SITE_SELECTION_FEE,
  SITE_SELECTION_TERMS,
  COMPONENT_FEE_NUMBER,
} from "@/lib/pricing";
import { LENSES } from "@/lib/lenses";



export type LandingFaq = { q: string; a: string };

export type LandingPage = {
  /** Path, without a trailing slash. */
  slug: string;
  eyebrow: string;
  /** The H1. A question, in the words a buyer would use. */
  h1: string;
  /** One line naming what they walk away with. */
  sub: string;
  bylineBlurb: string;
  answerHeading: string;
  /** 40 to 60 words. The thing that gets quoted. */
  answer: string;
  ctaLabel: string;
  /**
   * Where the one button goes. The booking form, not the onboarding agreement:
   * a stranger who has just read a landing page is ready for a conversation,
   * not for a signature page, and pointing them at a contract reads as a firm
   * that wants the deal more than the fit.
   */
  ctaHref: string;
  /** Sits beside the first call to action. */
  priceNote: string;
  meta: { title: string; description: string };
  service: {
    name: string;
    price: number;
    billingPeriod?: "monthly";
    includes: string[];
  };
  problem: { heading: string; paras: string[]; pull: string };
  solution: {
    heading: string;
    lede: string;
    cardsHeading: string;
    cards: { label: string; note?: string }[];
    walkAwayHeading: string;
    walkAway: string[];
    howItRuns: string;
  };
  proof: {
    heading: string;
    lede: string;
    blocks: {
      tag?: string;
      title: string;
      body: string;
      note?: string;
      report?: { page: number; label: string };
      link?: { href: string; label: string };
    }[];
  };
  comparison: { heading: string; lede: string };
  price: { headline: string; body: string; footnote?: string };
  /** The FAQ section heading. Named, because "about this" persuades nobody. */
  faqHeading: string;
  faqs: LandingFaq[];
  reviewed: string;
  breadcrumbParent: { name: string; path: string };
};

const REVIEWED = "2026-08-19";
const BYLINE =
  "BBA in Project Management, certified PMP, currently pursuing an MBA at Texas A&M. He leads the work himself, start to finish.";

const lensCards = LENSES.map((l) => ({ label: l.name }));

/**
 * The small door.
 *
 * Aperture Insights at its lighter depth, for businesses below SNAPSHOT_CEILING.
 * This page exists to be forwarded by an accountant or a bookkeeper, not to be
 * found from the homepage, so it opens by acknowledging how the reader most
 * likely arrived and it does not compete for the $5M-$20M visitor.
 *
 * Two things in this copy are load-bearing and must not soften:
 *   1. The score is PROVISIONAL, and the page says so in the reader's own
 *      language rather than in a footnote. It is scored from documents as
 *      submitted, and nothing in it has been tested against an interview.
 *   2. The X-Ray's premium is TESTED lenses, not more lenses. If this page ever
 *      implies the Snapshot is a smaller number of lenses, the upgrade stops
 *      making sense and the rubric comparison breaks.
 */
export const apertureSnapshot: LandingPage = {
  slug: "/snapshot",
  eyebrow: "Aperture Insights\u2122 \u00b7 the Snapshot",
  h1: "Is your business as healthy as you think it is?",
  sub: `An Aperture Snapshot scores all seven lenses of your business from the documents you already have, for a fixed ${SNAPSHOT_FEE}, in about a week.`,
  bylineBlurb:
    "BBA in Project Management, certified PMP, currently pursuing an MBA at Texas A&M. He reviews and signs every Snapshot himself.",
  answerHeading: "What is an Aperture Snapshot?",
  answer: `An Aperture Snapshot is a fixed-fee read of your whole business across the same seven lenses a Business X-Ray uses: finance, operations, customers, market, leadership, processes and technology. It is scored from the documents you already have, costs ${SNAPSHOT_FEE}, takes about a week, and ends by naming the area most likely to be holding your profit back.`,
  ctaLabel: "Start a Snapshot",
  ctaHref: "/contact#book",
  priceNote: `${SNAPSHOT_FEE} fixed fee \u00b7 it ${SNAPSHOT_CREDIT_TERMS}`,
  meta: {
    title: "Aperture Snapshot: a seven-lens read of your business",
    description: `A fixed-fee, seven-lens read of an owner-run business scored from documents you already have, for ${SNAPSHOT_FEE}, in about a week. Built for businesses under ${SNAPSHOT_CEILING}. It counts in full toward a full Business X-Ray.`,
  },
  service: {
    name: "Aperture Snapshot",
    price: SNAPSHOT_FEE_NUMBER,
    includes: [
      "All seven lenses, scored from your documents",
      "A provisional Aperture Score",
      "The area most likely holding profit back",
      "What it would take to test that properly",
    ],
  },
  problem: {
    heading: "Nobody ever built you the view.",
    paras: [
      "A business under five million dollars gets the same advice everyone else gets, and almost none of the analysis. The large consultancies will not take the engagement. The software wants a subscription and a person to run it. Your accountant is telling you what happened last year, accurately, which is a different job from telling you which part of the business is holding the rest back.",
      "So you run it the way most owners do, on the numbers you can see and a very good instinct for the rest. That works, right up until the moment it does not, and the moment it stops working is rarely announced. It shows up as a year of hard work that did not move the profit line.",
      "The honest problem is not that the answers are hidden. It is that nobody has ever sat down with your own documents and read them across the whole business at once.",
    ],
    pull: "You do not need a consultant on retainer. You need somebody to read your own numbers properly, once.",
  },
  solution: {
    heading: "What a Snapshot actually does",
    lede:
      "It runs the same seven lenses, against the same published rubric, as a full Business X-Ray. The difference is not how much of your business gets looked at. It is how far the reading gets tested.",
    cardsHeading: "The seven lenses, all of them",
    cards: lensCards,
    walkAwayHeading: "What you walk away with",
    walkAway: [
      "A written read across all seven lenses",
      "A provisional Aperture Score, scored from your documents as submitted",
      "The area most likely to be holding profit back, named plainly",
      "An honest note on what a Snapshot cannot settle, and what it would take to settle it",
    ],
    howItRuns:
      "You send the documents you already have. Financial statements, a sales export, whatever exists. About a week later you get the written read. No interview, no project, no software to learn.",
  },
  proof: {
    heading: "How do I know the score means anything?",
    lede:
      "Because it is not a number somebody felt their way to, and because the page tells you plainly what it is not.",
    blocks: [
      {
        title: "The instrument is published",
        body:
          "The Aperture Score comes from a ratified rubric: seven lenses, twenty-nine sub-criteria, written anchor descriptions at 20, 50 and 80, and a coverage floor below which a lens cannot be scored at all. A Snapshot uses that same rubric, unchanged, which is why your score stays comparable if you go further later.",
      },
      {
        tag: "What it is not",
        title: "The score is provisional, and we say so on the report",
        body:
          "A Snapshot is scored from your documents as submitted. Nothing in it has been tested against an interview, checked for what the documents leave out, or argued against. That matters, because what a business measures and what a business believes are often two different things, and the gap between them is usually where the real constraint is hiding. A Snapshot can show you the gap. It cannot yet tell you which side of it is true.",
      },
      {
        tag: "Illustrative example",
        title: "Lumina Medical Aesthetics",
        body:
          "A worked example of the full engagement, so you can see where the ladder leads. Revenue climbed 61% in three years while profit stayed flat, and the tested reading named the constraint: new-patient retention, not pricing and not demand.",
        note:
          "Lumina is a worked example built to demonstrate the method, not a client engagement, and it is labelled that way everywhere it appears.",
        link: {
          href: "/case-studies/lumina-medical-aesthetics",
          label: "See the whole engagement",
        },
      },
    ],
  },
  comparison: {
    heading: "Snapshot or Business X-Ray?",
    lede:
      "The Snapshot is for a business under five million dollars that wants an honest read without a project. The X-Ray tests that read: an interview, the contradictions between what the numbers say and what the business believes, an evidence ledger, and ranked constraints with the case against each one. Same seven lenses either way.",
  },
  price: {
    headline: `${SNAPSHOT_FEE}, fixed, agreed before anything starts.`,
    body: `No hourly billing and no invoice you did not see coming. It ${SNAPSHOT_CREDIT_TERMS}, so if you decide you want the tested version, you pay the difference and not a penny more. The Business X-Ray is ${XRAY_FEE} in total.`,
    footnote: `The Snapshot is built for businesses under ${SNAPSHOT_CEILING}. Above that, the Business X-Ray is the way in, and we will say so rather than sell you the smaller thing.`,
  },
  faqHeading: "Questions owners ask about the Snapshot.",
  faqs: [
    {
      q: "My accountant sent me here. What are they getting out of it?",
      a: "Usually the report and a seat at the conversation, because it makes their own advice better. Where a referral fee is paid it is disclosed to you in writing, and many accountants cannot accept one at all under their professional rules. Either way, you pay the same fixed fee, and nothing about the work changes.",
    },
    {
      q: "What do you need from me?",
      a: "Financial statements you already have, a customer or sales export if one exists, and anything else you would show a bank. If a document does not exist, that is information too, and it is often part of the answer. There is no questionnaire to fill in and no meeting to schedule.",
    },
    {
      q: "What if my books are a mess?",
      a: "That is the normal starting point, not the exception. Messy books, a spreadsheet somebody built two years ago and a point-of-sale system nobody has ever exported are what most businesses this size actually have. We work with what exists and tell you where the gaps changed what we could say.",
    },
    {
      q: "How is this different from the Business X-Ray?",
      a: `Not in coverage. Both read all seven lenses against the same rubric. The X-Ray adds the testing: an interview, triangulation of what management believes against what the evidence shows, a written evidence ledger, and constraint candidates ranked with the case against each one. That is the part that needs a person rather than a tool, and it is the difference between ${SNAPSHOT_FEE} and ${XRAY_FEE}.`,
    },
    {
      q: "Does the fee count toward more work?",
      a: `Yes, in full. The ${SNAPSHOT_FEE} ${SNAPSHOT_CREDIT_TERMS}, so an X-Ray afterwards costs you the difference rather than the whole fee again. You are never asked to decide about the bigger piece of work before you have seen the smaller one.`,
    },
    {
      q: "Who sees my financial information?",
      a: "Fenwick How, and nobody else. Data is handled on a least-access basis, stored securely, and covered by written terms signed before anything is sent. It is never sold, shared, or reused for another client. If an accountant referred you, they see the report only if you say so.",
    },
    {
      q: "What if the Snapshot says I am fine?",
      a: "Then it says so, and you have paid a small fixed fee to stop wondering. That is a legitimate outcome and it happens. This is not a qualifying call dressed up as a deliverable.",
    },
  ],
  reviewed: REVIEWED,
  breadcrumbParent: { name: "What you get", path: "/what-you-get" },
};

export const businessXRay: LandingPage = {
  slug: "/business-x-ray",
  eyebrow: "Aperture Insights™ · the Business X-Ray",
  h1: "Where is your business actually making money?",
  sub: `A Business X-Ray tells you, in about three weeks, for a fixed fee of ${XRAY_FEE}, and names the one constraint holding everything else back.`,
  bylineBlurb:
    "BBA in Project Management, certified PMP, currently pursuing an MBA at Texas A&M. He runs every X-Ray himself, start to finish.",
  answerHeading: "What is a Business X-Ray?",
  answer: `A Business X-Ray is a fixed-fee read of your whole business across seven lenses: finance, operations, customers, market, leadership, processes and technology. It takes about three weeks, costs ${XRAY_FEE}, and ends by naming one thing plainly: the single constraint holding your profit back, and where the digging needs to happen next.`,
  ctaLabel: "Book your Business X-Ray",
  ctaHref: "/contact#book",
  priceNote: `${XRAY_FEE} fixed fee · it ${XRAY_CREDIT_TERMS}`,
  meta: {
    title: "Where is your business actually making money?",
    description: `A Business X-Ray is a fixed-fee, seven-lens read of an owner-run business that names your single biggest constraint in about three weeks, for ${XRAY_FEE}. Senior-led, in plain language, with nothing hidden in a dashboard.`,
  },
  service: {
    name: "Business X-Ray",
    price: XRAY_FEE_NUMBER,
    includes: [
      "Seven-lens business assessment",
      "Aperture Score baseline",
      "Prioritised findings, risks and opportunities",
      "Your single biggest constraint, named",
    ],
  },
  problem: {
    heading: "What is it costing you not to know?",
    paras: [
      "You can tell me last month's revenue to the dollar. Now rank your products, your customers and your locations from most profitable to least, after the real cost of serving each one. Most owners cannot, and it has nothing to do with ability. Nobody ever built them the view.",
      "That gap is expensive in a specific and predictable way. A few products carry the margin while a long tail quietly loses money once you count the labour to make them. A handful of customers cost more to serve than they pay, and they are often the ones getting the most attention. The busiest location is frequently not the most profitable one, and it is usually the one the next expansion gets modelled on.",
      "None of this shows up in revenue. Most of it does not show up in the profit line at the bottom of the P&L either, because the winners and the losers are added together before you ever see them. The business stays profitable overall, which is exactly why the parts that are bleeding stay invisible.",
    ],
    pull: "A business can be profitable overall and still be profitable in spite of itself.",
  },
  solution: {
    heading: "How does a Business X-Ray fix that?",
    lede:
      "It gives you the view nobody built. Seven lenses are read across the whole business, scored against the same published rubric every time, and pulled into one executive picture that ends with a single named constraint rather than a list of forty things to improve.",
    cardsHeading: "The seven lenses",
    cards: lensCards,
    walkAwayHeading: "What you walk away with",
    walkAway: [
      "A written Business X-Ray across all seven lenses",
      "Your Aperture Score, a baseline you can measure progress against",
      "Prioritised findings, risks and opportunities",
      "Your single biggest constraint, named in one sentence",
    ],
    howItRuns:
      "It runs on data you already have plus three to five short conversations. About three weeks. One person does the work and signs their name to it.",
  },
  proof: {
    heading: "What does this look like on a real business?",
    lede:
      "Here is a complete worked example, with the full report attached so you can check the arithmetic rather than take the summary on trust.",
    blocks: [
      {
        tag: "Illustrative example",
        title: "Lumina Medical Aesthetics",
        body:
          "A growing three-clinic med-spa. Revenue climbed 61% in three years while profit stayed essentially flat. The X-Ray read all seven lenses and named the constraint that explained it: new-patient retention, not pricing, and not demand.",
        note:
          "Lumina is a worked example built to demonstrate the method, not a client engagement, and it is labelled that way everywhere it appears. No client work is published without written permission.",
        report: { page: 10, label: "Read the full example report" },
        link: {
          href: "/case-studies/lumina-medical-aesthetics",
          label: "See the whole engagement",
        },
      },
      {
        title: "The instrument, published",
        body:
          "The Aperture Score is not a number somebody felt their way to. It comes from a ratified rubric: seven lenses, twenty-nine sub-criteria, written anchor descriptions at 20, 50 and 80, and a coverage floor below which a lens cannot be scored at all. That is what stops a score drifting between two engagements, and it is why the baseline still means something when it is re-scored a year later.",
      },
    ],
  },
  comparison: {
    heading: "Why not just ask my accountant?",
    lede:
      "Because a good accountant is telling you what happened, accurately, and that is a different job from telling you which part of the business is holding the rest back. Here is the whole landscape, side by side.",
  },
  price: {
    headline: `${XRAY_FEE}, fixed, agreed before anything starts.`,
    body: `No hourly billing, no change orders you did not agree to, and no invoice you did not see coming. It ${XRAY_CREDIT_TERMS}, so if you go further, you are not paying for the same ground twice.`,
  },
  faqHeading: "Questions owners ask about the X-Ray.",
  faqs: [
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
      q: `My business is smaller than ${SNAPSHOT_CEILING}. Is this still the right thing?`,
      a: `Probably not, and there is a better answer than talking you into it. Below ${SNAPSHOT_CEILING} the way in is the Aperture Snapshot at ${SNAPSHOT_FEE}: the same seven lenses against the same rubric, scored from documents you already have, returning a provisional Aperture Score and the area most likely holding your profit back. What it does not include is the testing, which is the interview, the evidence ledger and the ranked constraint candidates. If you later want that, the ${SNAPSHOT_FEE} ${SNAPSHOT_CREDIT_TERMS}.`,
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
  ],
  reviewed: REVIEWED,
  breadcrumbParent: { name: "What you get", path: "/what-you-get" },
};

export const profitMap: LandingPage = {
  slug: "/profit-map",
  eyebrow: "Aperture Analytics™ · the Profit Map",
  h1: "Which products and customers actually make you money?",
  sub: `The Profit Map ranks every product, customer and location by what it genuinely earns, after the real cost of serving it. Fixed fee of ${COMPONENT_FEE}.`,
  bylineBlurb: BYLINE,
  answerHeading: "What is a Profit Map?",
  answer:
    "A Profit Map is a financial model of your business that reconciles to your own P&L, then breaks profit down by product, customer and location after the true cost of serving each one. It comes with a scenario model you keep and can re-run yourself, so a price change or a new hire can be tested before you commit to it.",
  ctaLabel: "Book a Profit Map",
  ctaHref: "/contact#book",
  priceNote: `${COMPONENT_FEE} fixed fee · about four weeks`,
  meta: {
    title: "Which products and customers actually make you money?",
    description: `The Profit Map is a fixed-fee financial analysis that reconciles to your own accounts and ranks profitability by product, customer and location, with a scenario model you keep. ${COMPONENT_FEE}, senior-led, in plain language.`,
  },
  service: {
    name: "Profit Map",
    price: COMPONENT_FEE_NUMBER,
    includes: [
      "Profitability by product, customer and location",
      "Cost structure and 80/20 analysis",
      "Break-even and sensitivity analysis",
      "A multi-year scenario model, yours to keep",
    ],
  },
  problem: {
    heading: "Why is the profit not showing up?",
    paras: [
      "Revenue is up. Everyone is busy. The bank balance says something else, and nobody in the business can tell you exactly why. That is the most common conversation we have, and it almost never turns out to be a mystery. It turns out to be arithmetic nobody has done.",
      "In practice one part of the business is quietly subsidising another. A few products earn most of the margin while a long tail earns almost nothing once you count the labour to make and handle them. A handful of customers are genuinely profitable, and others consume discounts, rush jobs and hand-holding until they cost more than they pay. A location looks like the flagship right up until you account for the rent, the labour and the manager's time it really takes to run.",
      "None of it shows up in a single profit line, because the P&L adds everything together. The winners and the losers are blended into one comfortable number at the bottom, and the parts that are bleeding stay invisible for years.",
    ],
    pull:
      "Most owners have plenty of numbers. What they do not have is anyone who turns them into a decision.",
  },
  solution: {
    heading: "How does a Profit Map fix that?",
    lede:
      "By building the view properly, once, and leaving you the model. Every headline figure reconciles back to your own accounts, so nothing in it is arguable on the grounds that it does not tie. Then profitability is separated by the unit your business is actually made of, and the decisions you are weighing are run through a model rather than a conversation.",
    cardsHeading: "The analysis behind it",
    cards: [
      { label: "Profitability analysis", note: "Where you make and lose money, by service, location or customer." },
      { label: "Cost-structure evaluation", note: "What scales profitably and what does not." },
      { label: "Pareto (80/20)", note: "The vital few customers, products and costs that drive the result." },
      { label: "Break-even & sensitivity", note: "The point a decision starts paying off, and the room you have." },
      { label: "Financial modelling & forecasting", note: "Test a decision before you make it." },
      { label: "Regression analysis", note: "Which factors actually move the outcome." },
      { label: "Scenario planning", note: "Best, worst and likely, played out." },
    ],
    walkAwayHeading: "What you walk away with",
    walkAway: [
      "The Profit Map report: profitability ranked by product, customer and location",
      "Your cost structure separated into what scales and what does not",
      "Break-even and sensitivity, so you know the room you have",
      "A multi-year scenario model in Excel, yours to keep and re-run",
    ],
    howItRuns:
      "It runs on your statements, a transaction-level export and your payroll by role. About four weeks. Every number reconciles to your own accounts before anything is concluded from it.",
  },
  proof: {
    heading: "Can I see the analysis before I buy it?",
    lede:
      "Yes, in full, on real companies, with nothing held back and no email required. This is the part of the work most firms will only show you after you have signed.",
    blocks: [
      {
        tag: "Published in full",
        title: "Three companies. One method. Completely different questions.",
        body:
          "Two complete analyses, published from public filings: a listed retailer with forty billion in revenue and an audited 10-K, and an owner-managed fabricator with eighteen million and a set of reviewed accounts. Read side by side they make a point that is hard to make in the abstract. It is not public versus private that breaks a comparison, it is tax status: a pass-through pays no entity-level tax, so its net margin sits structurally higher than an identical C corporation's, and nothing in either set of statements warns you the comparison has already failed.",
        note:
          "Built from the companies' own public filings. Neither company is a client, and neither was involved in or reviewed the analysis.",
        link: {
          href: "/method-lab/financial-analysis-workbench",
          label: "Read all three reports: 43 to 44 pages each, free, no email",
        },
      },
      {
        tag: "Illustrative example",
        title: "Lumina Medical Aesthetics",
        body:
          "A growing three-clinic med-spa. Revenue climbed 61% in three years while profit stayed essentially flat. Separating the numbers showed why, and the scenario model let the owner test the fix before committing to it.",
        note:
          "Lumina is a worked example built to demonstrate the method, not a client engagement, and it is labelled that way everywhere it appears.",
        report: { page: 18, label: "Read the full example report" },
      },
    ],
  },
  comparison: {
    heading: "Why not just ask my accountant?",
    lede:
      "Because a good accountant is telling you what happened, accurately and on time, and that is a different job from telling you which product line is losing money. Here is the whole landscape, side by side.",
  },
  price: {
    headline: `${COMPONENT_FEE}, fixed, agreed before anything starts.`,
    body: `No hourly billing and no invoice you did not see coming. If you are not certain this is the right place to start, the ${XRAY_FEE} Business X-Ray will tell you which component you actually need, and it ${XRAY_CREDIT_TERMS}.`,
    footnote: `Taking three deep components plus the X-Ray separately comes to more than the full Method at ${FULL_METHOD_FEE}. If you are likely to want all of it, say so and we will price it as the Method.`,
  },
  faqHeading: "Questions owners ask about the Profit Map.",
  faqs: [
    {
      q: "What data do you actually need?",
      a: "Profit and loss statements for three years plus year to date, four balance sheet dates, cash flow statements, revenue broken out by product or service, payroll or headcount by role, and a transaction-level export if one exists. The full list is generated for you when you fill in the intake, and it adapts to how your business is taxed and whether you hold inventory.",
    },
    {
      q: "Do I need a transaction-level export?",
      a: "It is the single most useful file you can send, because it is what makes repeat rate, lifetime value and seasonality measurable rather than estimated. If your systems cannot produce one, the analysis still runs, and the report says plainly which conclusions were derived and which were estimated.",
    },
    {
      q: "What if my numbers do not tie?",
      a: "Then we find out why before we analyse anything, and that is often the first finding. Nothing gets built on figures that do not reconcile, because a model that disagrees with your own accounts is a model you will never trust or use.",
    },
    {
      q: "Do I keep the model?",
      a: "Yes. The scenario model is an Excel file that is yours, with the formulas visible and no locked cells. You can re-run it next quarter without calling anybody, which is the point of building it rather than presenting from it.",
    },
    {
      q: "How is this different from what my bookkeeper produces?",
      a: "Your bookkeeper is recording what happened, which is a job that has to be done correctly and usually is. This is the layer above it: allocating the real cost of serving each product and customer, ranking them, and testing what happens if you change one. Almost nobody is asked to do that, so almost nobody does.",
    },
    {
      q: "Do I have to start with the Business X-Ray?",
      a: `No. If you already know the question is financial, start here. The X-Ray exists for the case where you are not sure, and at ${XRAY_FEE} it is the cheaper way to find out than buying the wrong component.`,
    },
  ],
  reviewed: REVIEWED,
  breadcrumbParent: { name: "What you get", path: "/what-you-get" },
};

export const marketMap: LandingPage = {
  slug: "/market-map",
  eyebrow: "Aperture Intelligence™ · the Customer & Market Map",
  h1: "Where are your best customers, and where are the next ones?",
  sub: `The Customer & Market Map answers both on real geography, so a second location or a marketing budget stops being a guess. Fixed fee of ${COMPONENT_FEE}.`,
  bylineBlurb: BYLINE,
  answerHeading: "What is a Customer & Market Map?",
  answer:
    "A Customer & Market Map segments your existing customers by what they are actually worth, then puts them on real geography: trade areas, drive times, demographics and competitive pressure. It shows where your demand concentrates, where it is going unmet, and which candidate site is the defensible one before you sign a lease.",
  ctaLabel: "Book a Market Map",
  ctaHref: "/contact#book",
  priceNote: `${COMPONENT_FEE} fixed fee · two to three weeks`,
  meta: {
    title: "Where are your best customers, and where are the next ones?",
    description: `The Customer & Market Map is a fixed-fee customer, market and geographic analysis: segmentation, lifetime value, trade areas, drive times and white space, delivered as a report and a GIS package you keep. ${COMPONENT_FEE}.`,
  },
  service: {
    name: "Customer & Market Map",
    price: COMPONENT_FEE_NUMBER,
    includes: [
      "Customer segmentation and lifetime value",
      "Trade-area and drive-time analysis",
      "Market penetration and competitive pressure",
      "White space: where demand is going unmet",
    ],
  },
  problem: {
    heading: "What is the marketing budget actually buying?",
    paras: [
      "Most owner-run businesses can tell you what they spend on marketing and roughly what came in. Very few can tell you which postcodes their best customers come from, which of them ever came back, or how far someone will realistically drive to reach them. So the budget gets spread evenly across a map that is not evenly worth anything.",
      "The same blind spot decides much larger questions. A second location gets chosen because a site became available, a rent looked reasonable, or the owner knows the area. It is a six-figure commitment on a ten-year lease, made on the strength of familiarity, when the data to test it already exists and is mostly public.",
      "And underneath both sits the quieter one. Businesses routinely spend to acquire more of the customers who cost them the most to serve, because the customer list has never been separated by what each group is actually worth over time.",
    ],
    pull:
      "You cannot spend your way to the right customers if nobody has worked out where they are.",
  },
  solution: {
    heading: "How does a Market Map fix that?",
    lede:
      "By putting your own customers on a map before anything is recommended. Your addresses become coordinates, the coordinates become trade areas and drive times, and the result is laid against demographics, competitors and demand so you can see the gap rather than argue about it.",
    cardsHeading: "The analysis behind it",
    cards: [
      { label: "Customer segmentation", note: "Grouped by what they actually value, not by what you sell." },
      { label: "Lifetime value & cohorts", note: "What a customer is worth over time, and which groups repeat." },
      { label: "Trade area & drive time", note: "How far people really travel to reach you." },
      { label: "Market penetration", note: "How much of each area you already hold." },
      { label: "TAM / SAM / SOM sizing", note: "The whole market, the servable slice, the winnable slice." },
      { label: "Competitive benchmarking", note: "Where you stand against the businesses nearest you." },
      { label: "Porter's Five Forces", note: "Where power and profit sit in your market." },
      { label: "Site-selection modelling", note: "Candidate sites scored before a lease is signed." },
    ],
    walkAwayHeading: "What you walk away with",
    walkAway: [
      "The Market Map report: who your customers are and where they come from",
      "Trade areas and drive-time rings for every location you run",
      "White space: the areas with demand you are not serving",
      "The GIS package and layer guide, yours to keep",
    ],
    howItRuns:
      "It runs on a customer list with addresses or postcodes and your marketing spend by channel. Two to three weeks. Addresses are converted to map coordinates and then deleted: the analysis holds no personal details.",
  },
  proof: {
    heading: "What does this look like on a real business?",
    lede:
      "A worked example, with the mapping and the site-selection analysis shown in full inside the report.",
    blocks: [
      {
        tag: "Illustrative example",
        title: "Lumina Medical Aesthetics",
        body:
          "Mapping Lumina's own patients showed where the best customers cluster and where demand was going unmet. The newest clinic turned out to still be building its base rather than underperforming, and the strongest untapped trade area was the Energy Corridor: a data-backed answer to where do we grow next, rather than an opinion about it.",
        note:
          "Lumina is a worked example built to demonstrate the method, not a client engagement, and it is labelled that way everywhere it appears.",
        report: { page: 26, label: "Read the full example report" },
        link: {
          href: "/case-studies/lumina-medical-aesthetics",
          label: "See the whole engagement",
        },
      },
      {
        title: "Where the maps end up",
        body:
          "The analysis does not stop at a PDF. The same trade areas, drive-time rings and demand layers carry into Aperture Atlas, the live platform, where they stay current instead of describing the market as it was on the day the report was written.",
        link: { href: "/scoreboard", label: "See how the platform works" },
      },
    ],
  },
  comparison: {
    heading: "Why not just buy a demographics report?",
    lede:
      "Because a demographics report describes an area, and it will do that accurately for a few hundred dollars. What it cannot do is tell you which of your customers are worth having, or which candidate site wins once your own demand is on the map. Here is the whole landscape, side by side.",
  },
  price: {
    headline: `${COMPONENT_FEE}, fixed, agreed before anything starts.`,
    body: `That covers the full customer, market and geographic analysis and the GIS package you keep. If you are weighing one specific site rather than mapping the whole market, the Site Selection Study is ${SITE_SELECTION_FEE}, ${SITE_SELECTION_TERMS}.`,
    footnote: `Not sure this is the right component? The ${XRAY_FEE} Business X-Ray will tell you, and it ${XRAY_CREDIT_TERMS}.`,
  },
  faqHeading: "Questions owners ask about the Market Map.",
  faqs: [
    {
      q: "Do you need my customer list?",
      a: "Addresses or postcodes, yes, because that is what makes the mapping possible. Names are not needed. Addresses are converted to map coordinates and then deleted, so the analysis itself holds no personal details, and the terms covering that are signed before anything is sent.",
    },
    {
      q: "What if I do not track where customers come from?",
      a: "Most do not, and the data usually exists anyway, in the point-of-sale system, the booking system or the invoices. Finding it is part of the work. If it genuinely does not exist, that is a finding in itself and the first thing worth fixing.",
    },
    {
      q: "Can this tell me where to open next?",
      a: `The Market Map identifies the trade areas with unmet demand, which is the honest answer to where should we look. If you are choosing between specific sites and about to commit to a lease, the Site Selection Study at ${SITE_SELECTION_FEE} scores the candidates properly. That is a bigger decision and it is priced on the decision, not on the effort.`,
    },
    {
      q: "Do I keep the maps?",
      a: "Yes. You get the report, the GIS package and a layer guide explaining what every layer is and where the data came from. If you later run Aperture Atlas, the same layers carry into the live platform.",
    },
    {
      q: "Does this work if I only have one location?",
      a: "Yes, and it is often more useful. A single-site business is making the same decisions about catchment, marketing spend and expansion with less internal data to go on, so the outside data does more of the work.",
    },
    {
      q: "How long does it take?",
      a: "Two to three weeks once the customer data arrives. Geocoding is quick; the analysis and the honest reading of it are what take the time.",
    },
  ],
  reviewed: REVIEWED,
  breadcrumbParent: { name: "What you get", path: "/what-you-get" },
};

export const focusPlan: LandingPage = {
  slug: "/focus-plan",
  eyebrow: "Aperture Compass™ · the Focus Plan",
  h1: "You have more ideas than time. Which ones actually matter?",
  sub: `The Focus Plan scores every opportunity against value, complexity and risk, then sequences the few that move the business. Fixed fee of ${COMPONENT_FEE}.`,
  bylineBlurb: BYLINE,
  answerHeading: "What is a Focus Plan?",
  answer:
    "A Focus Plan is a one-page roadmap that comes out of scoring every opportunity in front of you against value, complexity, risk and impact on the thing actually holding the business back. The winners are stress-tested against different futures and sequenced into Now, Next and Later, so the plan says what to stop as clearly as what to start.",
  ctaLabel: "Book a Focus Plan",
  ctaHref: "/contact#book",
  priceNote: `${COMPONENT_FEE} fixed fee · one to two weeks`,
  meta: {
    title: "You have more ideas than time. Which ones actually matter?",
    description: `The Focus Plan scores every opportunity against value, complexity, risk and impact, stress-tests the winners and sequences them into Now, Next and Later. A one-page plan you can defend to a bank, a board or your family. ${COMPONENT_FEE}.`,
  },
  service: {
    name: "Focus Plan",
    price: COMPONENT_FEE_NUMBER,
    includes: [
      "The Opportunity Matrix: every option scored",
      "Scenario stress-testing of the shortlist",
      "A one-page Focus Plan: Now, Next, Later",
      "What to stop, stated as clearly as what to start",
    ],
  },
  problem: {
    heading: "Why does the list keep growing and the needle not move?",
    paras: [
      "Ask an owner what they could be doing and you will get twenty answers inside ten minutes, most of them good. That is the problem. Twenty good ideas competing for the attention of one management team is not a strategy, it is a queue, and the things that get done are the ones with the loudest advocate rather than the largest return.",
      "It gets harder when people disagree, because there is usually no shared way to compare a pricing change against a new hire against a second location. Each is argued on its own merits by whoever cares most about it, so the argument is settled by seniority or by fatigue.",
      "And then there is the version of this that costs the most: a plan that cannot be defended. A bank, a board or a family member asks why this and not that, and the honest answer is that it felt right. Which may well be true, and is not a reason anyone can fund.",
    ],
    pull:
      "Strategy is mostly subtraction. The hard part is not finding opportunities, it is choosing which ones to refuse.",
  },
  solution: {
    heading: "How does a Focus Plan fix that?",
    lede:
      "By making the comparison explicit. Every opportunity on the table, including the ones already underway, is scored against the same criteria in the same matrix, weighted by what matters to you rather than what matters in general. The shortlist is then run against downside scenarios, because a plan that only works in the good case is not a plan.",
    cardsHeading: "The analysis behind it",
    cards: [
      { label: "Strategic option generation", note: "Widen the set before narrowing it." },
      { label: "Weighted decision matrices", note: "Scored against what matters to you, and defensible afterwards." },
      { label: "Risk assessment", note: "What could go wrong, and how likely." },
      { label: "Scenario analysis", note: "How each option holds up in a downturn." },
      { label: "Hypothesis-driven validation", note: "Test a big bet cheaply before scaling it." },
      { label: "Now / Next / Later roadmapping", note: "A clear order of operations." },
    ],
    walkAwayHeading: "What you walk away with",
    walkAway: [
      "The Opportunity Matrix: every option scored on the same criteria",
      "Scenario stress-testing of the shortlist, including the downside",
      "A one-page Focus Plan: Now, Next and Later, with owners and dates",
      "A written rationale you can hand to a lender, a board or a partner",
    ],
    howItRuns:
      "It runs on the findings from earlier phases plus a working session with the people who will actually have to do the work. One to two weeks. The plan fits on one page on purpose.",
  },
  proof: {
    heading: "What does this look like on a real business?",
    lede:
      "A worked example, with the matrix and the resulting plan shown in full inside the report.",
    blocks: [
      {
        tag: "Illustrative example",
        title: "Lumina Medical Aesthetics",
        body:
          "Every option on Lumina's list was scored, including the one the owner arrived wanting: a fourth clinic. The plan that came out sequenced it differently. Fix retention first, then expand, and expand where the mapping pointed rather than where the opportunity happened to appear. The expansion was not refused, it was ordered.",
        note:
          "Lumina is a worked example built to demonstrate the method, not a client engagement, and it is labelled that way everywhere it appears.",
        report: { page: 32, label: "Read the full example report" },
        link: {
          href: "/case-studies/lumina-medical-aesthetics",
          label: "See the whole engagement",
        },
      },
      {
        title: "Why the plan fits on one page",
        body:
          "Because a roadmap nobody can hold in their head is a roadmap nobody follows. The matrix behind it runs to as many pages as the analysis needs, and it is included in full so the reasoning can be checked. The plan itself is one page, and it names what to stop as explicitly as what to start.",
      },
    ],
  },
  comparison: {
    heading: "Why not just run a planning offsite?",
    lede:
      "Because an offsite surfaces opinions, which is genuinely valuable, and then asks the same room to rank them without a shared basis for comparison. Here is the whole landscape, side by side.",
  },
  price: {
    headline: `${COMPONENT_FEE}, fixed, agreed before anything starts.`,
    body: `That covers the full Opportunity Matrix, the scenario testing and the Focus Plan. Compass works best after the numbers and the market have been looked at properly, because scoring opportunities against guesses produces a confident-looking plan built on nothing.`,
    footnote: `Not sure this is the right component? The ${XRAY_FEE} Business X-Ray will tell you, and it ${XRAY_CREDIT_TERMS}.`,
  },
  faqHeading: "Questions owners ask about the Focus Plan.",
  faqs: [
    {
      q: "Can I do this without the earlier phases?",
      a: "You can, and sometimes it is right: if you already have solid numbers and a clear read of your market, Compass is the piece that turns them into a decision. What it cannot do is manufacture the evidence. Scoring opportunities against assumptions produces a plan that looks rigorous and is not.",
    },
    {
      q: "Who needs to be in the room?",
      a: "The people who will have to do the work, and anyone who can veto it. That is usually three to six people. The session is short and structured, and the point of it is disagreement surfacing early rather than after the plan is published.",
    },
    {
      q: "What if we do not agree at the end?",
      a: "Then the matrix shows exactly where the disagreement is, which is more useful than a consensus nobody believes. Usually it turns out people are weighting the criteria differently rather than reading the evidence differently, and that is a conversation you can actually finish.",
    },
    {
      q: "Is this just a prioritisation workshop?",
      a: "No. A workshop ranks the ideas in the room on the day. This scores them against evidence gathered beforehand, stress-tests the shortlist against downside scenarios, and produces a written rationale you can hand to someone who was not there.",
    },
    {
      q: "What if the plan says do nothing new?",
      a: "That happens, and it is a legitimate result. A business already at the edge of its capacity does not need another initiative, it needs the constraint removed first. A plan that says finish what you started is worth as much as one that says start something.",
    },
    {
      q: "Will it hold up with a bank?",
      a: "That is one of the things it is built for. Every option carries its score, its assumptions and its downside case, so the question why this and not that has a written answer rather than a recollection.",
    },
  ],
  reviewed: REVIEWED,
  breadcrumbParent: { name: "What you get", path: "/what-you-get" },
};

export const scoreboard: LandingPage = {
  slug: "/scoreboard",
  eyebrow: "Aperture Atlas™ · the Scoreboard",
  h1: "Is the strategy actually working?",
  sub: `Aperture Atlas keeps your numbers, your map and your forecast live, so the answer is on a screen rather than in next month's accounts. From ${ATLAS_FEE}.`,
  bylineBlurb: BYLINE,
  answerHeading: "What is Aperture Atlas?",
  answer:
    "Aperture Atlas is a live platform carrying the KPIs that matter, your market and trade areas on an interactive map, and a rolling forecast. It watches for variance against plan, escalates what deserves your attention in a monthly one-page brief, and re-scores your Aperture Score so progress is measured rather than asserted.",
  ctaLabel: "Set up your Scoreboard",
  ctaHref: "/contact#book",
  priceNote: `From ${ATLAS_FEE} · ${ATLAS_TERMS}`,
  meta: {
    title: "Is the strategy actually working?",
    description: `Aperture Atlas is a live intelligence platform: your KPIs, Scoreboard, Market Maps and forecasts in one always-current view, with a monthly one-page brief and a re-scored Aperture Score. From ${ATLAS_FEE}.`,
  },
  service: {
    name: "Aperture Atlas",
    price: 900,
    billingPeriod: "monthly",
    includes: [
      "A live Scoreboard of the KPIs that matter",
      "Market Maps and trade areas, kept current",
      "Rolling forecasts and variance detection",
      "A monthly one-page Signal Brief",
    ],
  },
  problem: {
    heading: "How would you know if the plan stopped working?",
    paras: [
      "Most owner-run businesses find out late. The month closes, the accounts arrive two or three weeks after that, and by the time anyone reads them the thing that went wrong has been going wrong for six weeks. Nobody is being careless. The reporting cycle simply was not built to catch anything quickly.",
      "So the business gets run on a mixture of gut feel and month-old reports, and the numbers that would actually answer the question live in five different places. The point-of-sale system knows one part. The accounting package knows another. A spreadsheet somebody maintains by hand knows the third, and only they know how it works.",
      "The expensive version of this is what happens to a strategy after it is agreed. A good plan gets delivered, everyone means it, and within two quarters nobody can say which parts were done or whether they worked. Not because the plan was wrong, but because nothing was watching.",
    ],
    pull:
      "A strategy that nobody is measuring is a strategy that quietly becomes a memory of a meeting.",
  },
  solution: {
    heading: "How does Atlas fix that?",
    lede:
      "By making the answer permanent rather than periodic. The KPIs are defined once with their source, target, cadence, owner and thresholds, then wired to the systems you already run so the Scoreboard updates itself. When something moves outside its band, it is flagged and escalated to a person, not buried in a dashboard nobody opens.",
    cardsHeading: "What runs inside it",
    cards: [
      { label: "The live Scoreboard", note: "The metrics that matter, in one always-current view." },
      { label: "OKRs & KPI management", note: "Clear objectives and the few numbers that prove them." },
      { label: "Market Maps, kept live", note: "Trade areas and demand, current rather than historical." },
      { label: "Rolling forecasts", note: "Where the business is heading, not just where it has been." },
      { label: "Variance & anomaly detection", note: "Flagged against baseline and plan, and escalated." },
      { label: "The monthly Signal Brief", note: "One page: what changed, what it means, what to do." },
      { label: "Aperture Score, re-scored", note: "Measurable before-and-after, not an assertion." },
    ],
    walkAwayHeading: "What you get, every month",
    walkAway: [
      "A live Scoreboard your team can open any day of the month",
      "Market Maps and forecasts that stay current on their own",
      "Anything outside its threshold flagged and escalated to a person",
      "A one-page Signal Brief: what changed, what it means, what to do",
    ],
    howItRuns:
      "It runs on read-only access to the systems you already have, so nothing can be changed and nobody has to upload anything monthly. Standing it up takes two to three weeks. After that it is yours to run the business from.",
  },
  proof: {
    heading: "What does it actually look like?",
    lede:
      "Two of the components are running live on this site, with real map data and a real forecast, rather than a screenshot of a dashboard.",
    blocks: [
      {
        title: "The live components, on this site",
        body:
          "The Market Map on the homepage is the real thing: trade areas, drive-time rings and where demand clusters, rendered live rather than captured as an image. The revenue forecast beside it is a working projection, not a picture of one. What you see there is what sits inside your Atlas, with your data in it.",
        link: { href: "/#atlas", label: "See the live map and forecast" },
      },
      {
        tag: "Illustrative example",
        title: "Lumina Medical Aesthetics",
        body:
          "The full worked example runs all five phases through to the Scoreboard, showing the KPIs that were chosen, why those and not others, and how the Aperture Score was re-scored at the end to prove the movement rather than claim it.",
        note:
          "Lumina is a worked example built to demonstrate the method, not a client engagement, and it is labelled that way everywhere it appears.",
        report: { page: 38, label: "Read the full example report" },
      },
    ],
  },
  comparison: {
    heading: "Why not just buy a dashboard tool?",
    lede:
      "Because the tool is the easy part and it is not the part that fails. What fails is deciding which fifteen numbers out of two hundred actually matter for your business, wiring them to sources that will not break, and having someone read them every month. Here is the whole landscape, side by side.",
  },
  price: {
    headline: `From ${ATLAS_FEE}, tiered by how many locations you run.`,
    body: `${ATLAS_TIERS.map((t) => `${t.label}, ${t.fee}`).join(". ")}. Terms are a ${ATLAS_TERMS}, and you can ${ATLAS_PREPAY_TERMS}.`,
    footnote:
      "Atlas is the one part of the Method that is ongoing, and it is the one part you should be able to cancel easily. The dashboards, models and Market Maps built during the engagement are yours to keep either way.",
  },
  faqHeading: "Questions owners ask about Atlas.",
  faqs: [
    {
      q: "What does it connect to?",
      a: "Read-only access to your accounting system, and to your point-of-sale, CRM or marketing platforms where they exist. Read-only means nothing in those systems can be changed by us. Where a connection genuinely is not possible, that source runs on a scheduled export instead, and the Scoreboard says which is which.",
    },
    {
      q: "Who decides which KPIs go on it?",
      a: "We propose them from what the earlier analysis found, and you approve them. Every KPI carries a source, a target, a cadence, an owner and the thresholds that turn it red. A metric nobody owns is a metric nobody acts on, so it does not go on.",
    },
    {
      q: "Do I need the rest of the Method first?",
      a: "It works far better afterwards, because the KPIs then come from evidence about your business rather than from a template. If you want to start here, we would want to run at least the Business X-Ray first so the Scoreboard is measuring the right things.",
    },
    {
      q: "What happens if I cancel?",
      a: `The terms are a ${ATLAS_TERMS}, so it is genuinely cancellable. Everything built during the engagement, the models, the reports, the Market Maps and the working files, is yours and stays yours. What stops is the live platform and the monthly brief.`,
    },
    {
      q: "Is this just automated reporting?",
      a: "No, and the difference matters. Automated reporting sends you a number. Atlas compares the number to a baseline and a plan, flags what has moved outside its band, and a person decides whether it matters before it reaches you. The agents produce findings; only a person produces conclusions.",
    },
    {
      q: "How is progress actually proved?",
      a: "Your Aperture Score is re-scored against the same published rubric used at the start: same seven lenses, same twenty-nine sub-criteria, same anchors. That is what turns better into a number, and it is why the baseline taken during the X-Ray is worth having.",
    },
  ],
  reviewed: REVIEWED,
  breadcrumbParent: { name: "What you get", path: "/what-you-get" },
};

/** Every landing page, in Method order. */
export const landingPages: LandingPage[] = [
  businessXRay,
  profitMap,
  marketMap,
  focusPlan,
  scoreboard,
];
