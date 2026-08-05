/**
 * Shared content used across pages (CMS-ready shapes). The five named
 * phase-products of The Aperture Method™ are reused on the homepage (strip),
 * the Method page (explorer), and elsewhere.
 */

/** The method's signature one-liner. */
export const methodTagline = "Understand. Quantify. Reveal. Navigate. Perform.";

/** The framework summary — used on the Method page / hero as needed. */
export const methodSummary =
  "The Aperture Method™ is a structured business transformation framework that combines executive consulting, advanced analytics, geographic intelligence, and performance management into a single, integrated methodology. Each phase builds on the previous one — a clear path from understanding the current state to achieving measurable, sustainable improvement.";

export type MethodPhase = {
  n: string; // "01".."05"
  product: string; // the phase-product name, e.g. "Aperture Insights"
  short: string; // the distinct word used with the mark, e.g. "Insights"
  verb: string; // the signature verb, e.g. "Understand"
  heading: string; // full heading, e.g. "Understand the Business"
  question: string; // the executive mindset question
  line: string; // short one-liner for strips/cards
  description: string; // the full executive description
  deliverable: string; // the tangible artifact(s) inside the product — "what you get"
  frameworks: Framework[]; // the named techniques/frameworks applied in this phase (depth layer)
  cap?: string; // capability tag shown on the parent landing — "MBA", "GIS", "DATA", or a blend
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
    line: "A comprehensive executive assessment of where your business stands today.",
    description:
      "Every successful transformation begins with clarity. Aperture Insights provides a comprehensive assessment of your organization by examining operations, financial performance, leadership, customers, processes, technology, and market position. The result is an executive-level understanding of where your business stands today, what is working, and where the greatest opportunities and risks exist.",
    deliverable: "The Business X-Ray™ + Aperture Score™",
    frameworks: [
      { name: "Seven-lens Business X-Ray", what: "A structured look at your whole business across seven angles — operations, finance, customers, and more — so nothing important gets missed." },
      { name: "MECE problem structuring", what: "Breaking a messy problem into clear, non-overlapping parts, so every piece gets addressed and nothing is double-counted." },
      { name: "SCQA framing", what: "A simple way to pin down the real question — Situation, Complication, Question, Answer — so we solve the actual problem, not a symptom." },
      { name: "SWOT analysis", what: "An honest inventory of your strengths, weaknesses, opportunities, and threats — the clear starting picture." },
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
    frameworks: [
      { name: "Profitability analysis", what: "Shows exactly where you make and lose money — by service, location, or customer." },
      { name: "Cost-structure evaluation", what: "Maps your fixed and variable costs, so you know what scales profitably and what doesn't." },
      { name: "Pareto (80/20) analysis", what: "Finds the vital few things — customers, products, costs — that drive most of your results." },
      { name: "Break-even & sensitivity", what: "Tells you the point where a decision starts paying off, and how much room you have if things change." },
      { name: "Financial modeling & forecasting", what: "Turns your numbers into a forward-looking model so you can test decisions before you make them." },
      { name: "Regression analysis", what: "Measures which factors actually move an outcome — like what really drives your sales." },
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
    frameworks: [
      { name: "Porter's Five Forces", what: "A read on the competitive pressures in your market, so you know where power and profit really sit." },
      { name: "PESTLE analysis", what: "Scans the outside forces — economic, tech, legal, and more — that could help or hurt you." },
      { name: "TAM / SAM / SOM sizing", what: "Sizes your market realistically: the whole pie, the slice you can serve, and the slice you can actually win." },
      { name: "Customer segmentation", what: "Groups your customers by what they actually value, so you can serve and market to each better." },
      { name: "CLV & cohort analysis", what: "Measures what a customer is worth over time and how different groups behave — so you invest where it pays." },
      { name: "Competitive benchmarking", what: "Compares your performance to rivals and best-in-class, so you know exactly where you stand." },
      { name: "Value-chain analysis", what: "Examines each step you take to deliver value, to find where you can cut cost or stand out." },
      { name: "Geographic intelligence (GIS)", what: "Maps your customers and market on real geography to see where demand and opportunity concentrate." },
      { name: "Site-selection modeling", what: "Uses data to pick the best location for a new site — before you sign a lease." },
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
    frameworks: [
      { name: "Strategic option generation", what: "Deliberately widens the set of moves you could make, so you're not choosing from just one or two." },
      { name: "Weighted decision matrices", what: "Scores options against what matters most to you, so the best choice is clear and defensible." },
      { name: "Risk assessment", what: "Names what could go wrong and how likely it is, so you plan with eyes open." },
      { name: "Scenario analysis", what: "Tests how each option holds up under different futures before you commit." },
      { name: "Hypothesis-driven validation", what: "Treats a big bet as a testable assumption and checks it cheaply before you scale it." },
      { name: "Now / Next / Later roadmapping", what: "Sequences the work into what to do now, next, and later — a clear order of operations." },
    ],
  },
  {
    n: "05",
    product: "Aperture Live",
    short: "Live",
    verb: "Perform",
    heading: "Manage & Improve Performance",
    question: "How do we sustain and improve results?",
    line: "Executive dashboards and KPIs that keep performance improving.",
    description:
      "Business improvement is a continuous process, not a one-time project. Aperture Live provides executive dashboards, key performance indicators, automated reporting, and ongoing business intelligence that allow leadership to monitor performance in real time, measure progress against strategic objectives, and make informed decisions with confidence.",
    deliverable: "The Scoreboard™ + KPI system, plus a re-scored Aperture Score™ to prove progress",
    frameworks: [
      { name: "Aperture Dashboard™ Live", what: "Your always-on executive dashboard — the metrics that matter, pulled into one live view so you can see performance in real time and act on it." },
      { name: "OKRs & KPI management", what: "Sets clear objectives and the few numbers that prove you're hitting them." },
      { name: "Executive dashboards & scorecards", what: "A live, at-a-glance view of the metrics that matter, so you always know where you stand." },
      { name: "Project governance", what: "Light structure to keep initiatives on track, on time, and accountable." },
      { name: "Agile (Scrum / Kanban)", what: "Delivers in small, steady increments so you see progress fast and can adjust course." },
      { name: "Lean & Six Sigma", what: "Proven methods to cut waste and reduce errors in how the work actually gets done." },
      { name: "Continuous improvement", what: "A habit of small, ongoing refinements so performance keeps climbing after the project ends." },
    ],
  },
];

/**
 * Capability tags (MBA → GIS → DATA arc) shown on the parent landing page.
 */
const CAP: Record<string, string> = {
  Insights: "MBA",
  Analytics: "MBA",
  Intelligence: "MBA · GIS",
  Compass: "MBA · GIS",
};

/**
 * Aperture Atlas™ — the fifth component and the platform. Aperture Live
 * (performance management) is now MERGED into Atlas: one living, visual
 * Geographic Intelligence Platform that carries both your ongoing performance
 * (Scoreboard/KPIs) and your market/geographic intelligence. This is the home
 * of the platform (formerly discoveraperture.com / SyncPoint AI) and the
 * culmination of the methodology. Keeps the "Perform" verb so the signature
 * tagline is unchanged.
 */
export const atlasPractice: MethodPhase = {
  n: "05",
  product: "Aperture Atlas",
  short: "Atlas",
  verb: "Perform",
  heading: "The Living Intelligence Platform",
  question: "How do we run — and keep improving — the business?",
  line: "Your performance and your market on one live, visual platform — always current, and yours to keep.",
  description:
    "The methodology culminates in a living system. Aperture Atlas is the Geographic Intelligence Platform where the whole engagement stays alive — your KPIs and Scoreboard, your Market Maps, drive-time trade areas, and forecasts on one interactive, always-current dashboard. It is where performance management meets geographic intelligence: the tool you run the business from long after the engagement ends.",
  deliverable: "The Aperture Atlas™ platform — a live Scoreboard, Market Maps & forecasts, yours to keep",
  frameworks: [],
  cap: "GIS · DATA",
};

/**
 * The FIVE components of The Aperture Method™, in arc order, tagged with the
 * capability that powers each (MBA → GIS → DATA). Used by the parent landing
 * page. Aperture Live has been merged into Aperture Atlas (component 05). The
 * core `methodPhases` above is left untouched for the existing Method pages
 * (which still reference the pre-merge "Aperture Live" — rename later).
 */
export const aperturePractices: MethodPhase[] = [
  ...methodPhases.slice(0, 4).map((p) => ({ ...p, cap: CAP[p.short] })),
  atlasPractice,
];

/**
 * "The Aperture Difference" — positioning block (Fenwick-supplied, July 2026).
 * Verbs corrected to the approved tagline (Reveal / Navigate / Perform).
 */
export const apertureDifference = {
  eyebrow: "The Aperture Difference",
  them: "Most consulting firms deliver recommendations.",
  us: "The Aperture Method™ delivers executive intelligence.",
  body:
    "By integrating quantitative analytics, financial modeling, geographic intelligence, customer insights, operational diagnostics, and MBA-level strategic frameworks into a single methodology, you gain a living understanding of your business — not simply another report.",
  result:
    "The result: better decisions, faster execution, measurable performance improvement, and a durable competitive advantage.",
  pillars: ["Executive intelligence", "Strategic clarity", "Measurable results"],
  verbsLine:
    "Understand your business. Quantify performance. Reveal opportunity. Navigate what's next. Perform with confidence.",
};

// Industry data now lives in "@/lib/industries" (richer, per-page shape).
