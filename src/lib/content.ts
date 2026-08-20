/**
 * Shared content used across pages (CMS-ready shapes). The five named
 * phase-products of The Aperture Method™ are reused on the homepage (strip),
 * the Method page (explorer), and elsewhere.
 */

import { lensNamesSentence } from "./lenses";

/** The method's signature one-liner. */
export const methodTagline = "Understand. Quantify. Reveal. Navigate. Perform.";

/** The framework summary, used on the Method page / hero as needed. */
export const methodSummary =
  "The Aperture Method™ is a structured business transformation framework that combines executive consulting, advanced analytics, geographic intelligence, and performance management into a single, integrated methodology. Each phase builds on the previous one, a clear path from understanding the current state to achieving measurable, sustainable improvement.";

export type MethodPhase = {
  n: string; // "01".."05"
  product: string; // the phase-product name, e.g. "Aperture Insights"
  short: string; // the distinct word used with the mark, e.g. "Insights"
  verb: string; // the signature verb, e.g. "Understand"
  heading: string; // full heading, e.g. "Understand the Business"
  question: string; // the executive mindset question
  line: string; // short one-liner for strips/cards
  description: string; // the full executive description
  deliverable: string; // the tangible artifact(s) inside the product, "what you get"
  truth?: string; // optional plain-language pull-quote, the owner-level truth this component answers
  forYou?: string[]; // "this is you if…", symptoms in the owner's own words, not benefits
  frameworks: Framework[]; // the named techniques/frameworks applied in this phase (depth layer)
  cap?: string; // capability tag shown on the parent landing, "MBA", "GIS", "DATA", or a blend
  /**
   * Published proof for this phase, work anyone can read in full, rather than a
   * description of work. Optional, because most phases do not have it yet.
   */
  proof?: {
    eyebrow: string;
    title: string;
    lead: string;
    points: { label: string; what: string }[];
    href: string;
    linkLabel: string;
  };
};

/**
 * Component 05: Aperture Atlas™, the platform the methodology culminates in.
 * Declared separately so it can be exported by name as well as sitting in the arc.
 */
const componentFive: MethodPhase = {
    n: "05",
    product: "Aperture Atlas",
    short: "Atlas",
    verb: "Perform",
    heading: "The Living Intelligence Platform",
    question: "How do we run and keep improving the business?",
    line: "Your performance and your market on one live, visual platform, always current, and yours to keep.",
    description:
      "The methodology culminates in a living system. Aperture Atlas is the Geographic Intelligence Platform where the whole engagement stays alive: your KPIs and Scoreboard, your Market Maps, drive-time trade areas, and forecasts on one interactive, always-current dashboard. It is where performance management meets geographic intelligence: the tool you run the business from long after the engagement ends. Improvement is continuous, not a one-time project: the platform carries the executive dashboards, KPIs and automated reporting that let leadership see performance in real time and measure progress against the plan.",
    deliverable: "The Aperture Atlas™ platform: a live Scoreboard, Market Maps & forecasts, plus a re-scored Aperture Score™ to prove progress",
    forYou: [
      "The strategy is set and you need to know whether it's actually working",
      "You're running the business on gut feel and month-old reports",
      "You want the numbers in one live place instead of five spreadsheets",
    ],
    frameworks: [
      { name: "Aperture Atlas™ dashboard", what: "Your always-on executive dashboard: the metrics that matter, pulled into one live view so you can see performance in real time and act on it." },
      { name: "OKRs & KPI management", what: "Sets clear objectives and the few numbers that prove you're hitting them." },
      { name: "Executive dashboards & scorecards", what: "A live, at-a-glance view of the metrics that matter, so you always know where you stand." },
      { name: "Project governance", what: "Light structure to keep initiatives on track, on time, and accountable." },
      { name: "Agile (Scrum / Kanban)", what: "Delivers in small, steady increments so you see progress fast and can adjust course." },
      { name: "Lean & Six Sigma", what: "Proven methods to cut waste and reduce errors in how the work actually gets done." },
      { name: "Continuous improvement", what: "A habit of small, ongoing refinements so performance keeps climbing after the project ends." },
    ],
  };

/** A named technique plus a plain-language note on what it does for the client. */
export type Framework = { name: string; what: string };

export const methodPhases: MethodPhase[] = [
  {
    n: "01",
    product: "Aperture Insights",
    short: "Insights",
    verb: "Understand",
    heading: "Understand the Business",
    question: "What is happening?",
    line: "A seven-lens read of where your business stands today, broad by design, and the way in.",
    description:
      `Every successful transformation begins with clarity. Aperture Insights reads your whole business through the same seven lenses in the same order every time: ${lensNamesSentence}. It is deliberately broad rather than deep: enough to show you what is working, name your likely biggest constraint, and give you an honest score to measure from. What it does not do is the heavy analysis; it tells you precisely where that digging is warranted, and the depth is bought in the components that follow.`,
    deliverable: "The Business X-Ray™ + Aperture Score™",
    forYou: [
      "You know something is off, but not what is actually causing it",
      "You're about to invest, hire or expand and want an honest read first",
      "It has been a while since anyone looked at the whole business at once",
    ],
    truth:
      "You don\u2019t need a hundred-page report to start. You need to know which problem is the one actually holding you back, and where to look next.",
    frameworks: [
      { name: "Seven-lens Business X-Ray", what: `A structured look at your whole business across all seven lenses, ${lensNamesSentence}, so nothing important gets missed.` },
      { name: "MECE problem structuring", what: "Breaking a messy problem into clear, non-overlapping parts, so every piece gets addressed and nothing is double-counted." },
      { name: "SCQA framing", what: "A simple way to pin down the real question, Situation, Complication, Question, Answer, so we solve the actual problem, not a symptom." },
      { name: "SWOT analysis", what: "An honest inventory of your strengths, weaknesses, opportunities, and threats: the clear starting picture." },
      { name: "Root-cause analysis", what: "Tracing a problem back to what's actually causing it, so you fix the source instead of the symptom." },
      { name: "Operational diagnostics", what: "A health check of how the business runs day to day, surfacing where time and money quietly leak." },
      { name: "KPI decomposition", what: "Breaking a big number like profit into the smaller drivers you can actually move." },
    ],
  },
  {
    n: "02",
    product: "Aperture Analytics",
    short: "Analytics",
    verb: "Quantify",
    heading: "Quantify the Business",
    question: "Why is it happening?",
    line: "Turn financial and operational data into decision-ready intelligence.",
    description:
      "Data becomes valuable when it informs decisions. Aperture Analytics transforms financial and operational information into meaningful business intelligence through advanced analysis, financial modeling, forecasting, and scenario planning. This phase identifies the key drivers of profitability, operational efficiency, and long-term value creation.",
    deliverable: "The Profit Map™ + scenario model",
    forYou: [
      "You're busy and growing, but the profit isn't showing up",
      "You want to know which products, locations and customers actually make money, ranked",
      "You want to test a price, a hire or an expansion before you commit to it",
    ],
    truth:
      "Most owners have plenty of numbers. What they don\u2019t have is anyone who turns them into a decision. That\u2019s the job.",
    proof: {
      eyebrow: "Published in full",
      title: "Three companies. One method. Completely different questions.",
      lead:
        "Two complete analyses, published with nothing held back: a listed retailer with forty billion in revenue and an audited 10-K, and an owner-managed fabricator with eighteen million and a set of reviewed accounts. Read side by side they make a point that is hard to make in the abstract: the analysis has to change when the entity does, and most financial analysis quietly refuses to.",
      points: [
        {
          label: "It is not public versus private that breaks a comparison",
          what:
            "It is tax status. A pass-through pays no entity-level tax, so its net margin sits structurally higher than an identical C corporation\u2019s. Compare on operating margin and EBITDA, or not at all. Nothing in either set of statements warns you the comparison has already failed.",
        },
        {
          label: "What reported earnings actually represent",
          what:
            "In an owner-managed business the owner sets their own pay and rents the building to themselves. Reported earnings reflect a personal tax decision as much as the cost of running the business, so the analysis normalises them, with an evidence grade on every add-back.",
        },
        {
          label: "How value gets established",
          what:
            "Observed for a listed company: market capitalisation and multiples read off the market. Constructed for a private one: normalised earnings times an evidenced multiple range, less net debt, and the range is the answer, not the midpoint.",
        },
      ],
      href: "/method-lab/financial-analysis-workbench",
      linkLabel: "Read all three reports: 43 to 44 pages each, free, no email",
    },
    frameworks: [
      { name: "Profitability analysis", what: "Shows exactly where you make and lose money: by service, location, or customer." },
      { name: "Cost-structure evaluation", what: "Maps your fixed and variable costs, so you know what scales profitably and what doesn't." },
      { name: "Pareto (80/20) analysis", what: "Finds the vital few things, customers, products, costs, that drive most of your results." },
      { name: "Break-even & sensitivity", what: "Tells you the point where a decision starts paying off, and how much room you have if things change." },
      { name: "Financial modeling & forecasting", what: "Turns your numbers into a forward-looking model so you can test decisions before you make them." },
      { name: "Regression analysis", what: "Measures which factors actually move an outcome, like what really drives your sales." },
      { name: "Scenario planning", what: "Plays out best, worst, and likely cases so you're ready for more than one future." },
    ],
  },
  {
    n: "03",
    product: "Aperture Intelligence",
    short: "Intelligence",
    verb: "Reveal",
    heading: "Reveal Customer & Market Intelligence",
    question: "What opportunities does it reveal?",
    line: "See who your customers are, where they are, and where to grow.",
    description:
      "Understanding your customers is essential to sustainable growth. Aperture Intelligence combines customer analytics, demographic data, geographic intelligence (GIS), market trends, and competitive insights to reveal who your customers are, where they are, how they behave, and where the greatest growth opportunities exist. This transforms raw data into actionable strategic intelligence.",
    deliverable: "The Customer & Market Map™ + GIS trade-area analysis",
    forYou: [
      "You want your best customers identified, and a map of where the next ones are",
      "You're considering a second location and don't want to guess",
      "You're spending on marketing without knowing where the demand actually is",
    ],
    frameworks: [
      { name: "Porter's Five Forces", what: "A read on the competitive pressures in your market, so you know where power and profit really sit." },
      { name: "PESTLE analysis", what: "Scans the outside forces, economic, tech, legal, and more, that could help or hurt you." },
      { name: "TAM / SAM / SOM sizing", what: "Sizes your market realistically: the whole pie, the slice you can serve, and the slice you can actually win." },
      { name: "Customer segmentation", what: "Groups your customers by what they actually value, so you can serve and market to each better." },
      { name: "CLV & cohort analysis", what: "Measures what a customer is worth over time and how different groups behave, so you invest where it pays." },
      { name: "Competitive benchmarking", what: "Compares your performance to rivals and best-in-class, so you know exactly where you stand." },
      { name: "Value-chain analysis", what: "Examines each step you take to deliver value, to find where you can cut cost or stand out." },
      { name: "Geographic intelligence (GIS)", what: "Maps your customers and market on real geography to see where demand and opportunity concentrate." },
      { name: "Site-selection modeling", what: "Uses data to pick the best location for a new site, before you sign a lease." },
    ],
  },
  {
    n: "04",
    product: "Aperture Compass",
    short: "Compass",
    verb: "Navigate",
    heading: "Determine the Strategic Direction",
    question: "Where should we go next?",
    line: "Convert analysis into a prioritized, board-ready strategic roadmap.",
    description:
      "Insights only create value when they become action. Aperture Compass converts analysis into a prioritized strategic roadmap that aligns business objectives with measurable initiatives. Opportunities are evaluated based on value, complexity, risk, and organizational impact, creating a clear execution plan focused on the initiatives that will deliver the greatest return.",
    deliverable: "The Opportunity Matrix™ + Focus Plan™ (Now / Next / Later)",
    forYou: [
      "You have more ideas than you have time or money",
      "Your team disagrees on what matters most right now",
      "You need a plan you can defend to a bank, a board or your family",
    ],
    frameworks: [
      { name: "Strategic option generation", what: "Deliberately widens the set of moves you could make, so you're not choosing from just one or two." },
      { name: "Weighted decision matrices", what: "Scores options against what matters most to you, so the best choice is clear and defensible." },
      { name: "Risk assessment", what: "Names what could go wrong and how likely it is, so you plan with eyes open." },
      { name: "Scenario analysis", what: "Tests how each option holds up under different futures before you commit." },
      { name: "Hypothesis-driven validation", what: "Treats a big bet as a testable assumption and checks it cheaply before you scale it." },
      { name: "Now / Next / Later roadmapping", what: "Sequences the work into what to do now, next, and later: a clear order of operations." },
    ],
  },
  componentFive,
];

/**
 * Capability tags (MBA → GIS → DATA arc) shown on the parent landing page.
 */
const CAP: Record<string, string> = {
  Insights: "MBA",
  Analytics: "MBA",
  Intelligence: "MBA · GIS",
  Compass: "MBA · GIS",
  Atlas: "GIS · DATA",
};

/**
 * Aperture Atlas™, the fifth component and the platform. Performance management
 * (formerly marketed as "Aperture Live") and geographic intelligence are one thing:
 * a living, visual Geographic Intelligence Platform carrying the Scoreboard, the KPIs,
 * the Market Maps and the forecasts. This is the home of the platform (formerly
 * discoveraperture.com / SyncPoint AI) and the culmination of the methodology. It keeps
 * the "Perform" verb, so the signature tagline is unchanged.
 *
 * "Aperture Live" is RETIRED as of 2026-08-10: one name, used internally and with
 * clients. `scripts/check-lenses.mjs` fails the build if it reappears in `src`.
 */
export const atlasPractice: MethodPhase = { ...componentFive, cap: CAP.Atlas };

/**
 * The FIVE components of The Aperture Method™, in arc order, tagged with the
 * capability that powers each (MBA → GIS → DATA).
 */
export const aperturePractices: MethodPhase[] = methodPhases.map((p) => ({
  ...p,
  cap: CAP[p.short],
}));

export const apertureDifference = {
  eyebrow: "The Aperture Difference",
  them: "Most consulting firms deliver recommendations.",
  us: "The Aperture Method™ delivers executive intelligence.",
  body:
    "By integrating quantitative analytics, financial modeling, geographic intelligence, customer insights, operational diagnostics, and MBA-level strategic frameworks into a single methodology, you gain a living understanding of your business, not simply another report.",
  result:
    "The result: better decisions, faster execution, measurable performance improvement, and a durable competitive advantage.",
  pillars: ["Executive intelligence", "Strategic clarity", "Measurable results"],
  verbsLine:
    "Understand your business. Quantify performance. Reveal opportunity. Navigate what's next. Perform with confidence.",
};

// Industry data now lives in "@/lib/industries" (richer, per-page shape).
