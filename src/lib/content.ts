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
  verb: string; // the signature verb, e.g. "Understand"
  heading: string; // full heading, e.g. "Understand the Business"
  question: string; // the executive mindset question
  line: string; // short one-liner for strips/cards
  description: string; // the full executive description
  deliverable: string; // the tangible artifact(s) inside the product — "what you get"
};

export const methodPhases: MethodPhase[] = [
  {
    n: "01",
    product: "Aperture Insights",
    verb: "Understand",
    heading: "Understand the Business",
    question: "What is happening?",
    line: "A comprehensive executive assessment of where your business stands today.",
    description:
      "Every successful transformation begins with clarity. Aperture Insights provides a comprehensive assessment of your organization by examining operations, financial performance, leadership, customers, processes, technology, and market position. The result is an executive-level understanding of where your business stands today, what is working, and where the greatest opportunities and risks exist.",
    deliverable: "The Business X-Ray™ + Aperture Score™",
  },
  {
    n: "02",
    product: "Aperture Analytics",
    verb: "Quantify",
    heading: "Quantify the Business",
    question: "Why is it happening?",
    line: "Turn financial and operational data into decision-ready intelligence.",
    description:
      "Data becomes valuable when it informs decisions. Aperture Analytics transforms financial and operational information into meaningful business intelligence through advanced analysis, financial modeling, forecasting, and scenario planning. This phase identifies the key drivers of profitability, operational efficiency, and long-term value creation.",
    deliverable: "The Profit Map™ + scenario model",
  },
  {
    n: "03",
    product: "Aperture Intelligence",
    verb: "Reveal",
    heading: "Reveal Customer & Market Intelligence",
    question: "What opportunities does it reveal?",
    line: "See who your customers are, where they are, and where to grow.",
    description:
      "Understanding your customers is essential to sustainable growth. Aperture Intelligence combines customer analytics, demographic data, geographic intelligence (GIS), market trends, and competitive insights to reveal who your customers are, where they are, how they behave, and where the greatest growth opportunities exist. This transforms raw data into actionable strategic intelligence.",
    deliverable: "The Customer & Market Map™ + GIS trade-area analysis",
  },
  {
    n: "04",
    product: "Aperture Compass",
    verb: "Navigate",
    heading: "Determine the Strategic Direction",
    question: "Where should we go next?",
    line: "Convert analysis into a prioritized, board-ready strategic roadmap.",
    description:
      "Insights only create value when they become action. Aperture Compass converts analysis into a prioritized strategic roadmap that aligns business objectives with measurable initiatives. Opportunities are evaluated based on value, complexity, risk, and organizational impact, creating a clear execution plan focused on the initiatives that will deliver the greatest return.",
    deliverable: "The Opportunity Matrix™ + Focus Plan™ (Now / Next / Later)",
  },
  {
    n: "05",
    product: "Aperture Live",
    verb: "Perform",
    heading: "Manage & Improve Performance",
    question: "How do we sustain and improve results?",
    line: "Executive dashboards and KPIs that keep performance improving.",
    description:
      "Business improvement is a continuous process, not a one-time project. Aperture Live provides executive dashboards, key performance indicators, automated reporting, and ongoing business intelligence that allow leadership to monitor performance in real time, measure progress against strategic objectives, and make informed decisions with confidence.",
    deliverable: "The Scoreboard™ + KPI system, plus a re-scored Aperture Score™ to prove progress",
  },
];

// Industry data now lives in "@/lib/industries" (richer, per-page shape).
