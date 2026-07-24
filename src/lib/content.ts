/**
 * Shared content used across pages (CMS-ready shapes). The five-phase method
 * is reused on the homepage (strip), the Method page (explorer), and elsewhere.
 */

export type MethodPhase = {
  n: string;
  name: string;
  title: string; // sub-label, e.g. "Business assessment"
  line: string; // one-liner for the strip
  purpose: string; // fuller sentence for the explorer
  deliverable: string; // "You get"
  decision: string; // the decision it supports
};

export const methodPhases: MethodPhase[] = [
  {
    n: "01",
    name: "Focus",
    title: "Business assessment",
    line: "Get the whole business into focus and name the one thing holding it back.",
    purpose: "We get the whole business into focus — how it runs, how it's doing, and the one thing holding it back most.",
    deliverable: "The Business X-Ray + your Aperture Score",
    decision: "Where to focus first — and whether to proceed to full analysis.",
  },
  {
    n: "02",
    name: "Quantify",
    title: "MBA-level analytics",
    line: "See exactly where you make and lose money.",
    purpose: "We apply graduate-level analytics — forecasting, lifetime value, optimization — so you can see exactly where you make and lose money.",
    deliverable: "The Profit Map + a model you keep",
    decision: "Pricing, and where to invest, cut, or reprice.",
  },
  {
    n: "03",
    name: "Illuminate",
    title: "Customer & spatial intelligence",
    line: "Understand your customers — and, on the map, where to grow.",
    purpose: "We turn your customer and location data into a living picture of value, risk, and — through spatial intelligence (GIS) — exactly where to grow.",
    deliverable: "The Customer Map & Market Map you keep",
    decision: "Retention, targeting, expansion, site selection, and marketing allocation.",
  },
  {
    n: "04",
    name: "Chart",
    title: "Strategy & roadmap",
    line: "Choose the few moves with the biggest payoff, in order.",
    purpose: "We choose the few moves with the biggest payoff and sequence them into a plan you own.",
    deliverable: "The Opportunity Matrix + the Focus Plan",
    decision: "What to do first, what to defer, and what to stop.",
  },
  {
    n: "05",
    name: "Execute",
    title: "Implementation",
    line: "Make it real, track results, and keep the intelligence working.",
    purpose: "We help make it real, track results, and keep the intelligence working long after.",
    deliverable: "The Scoreboard + quarterly Focus Reviews",
    decision: "Course corrections and what to sustain.",
  },
];

// Industry data now lives in "@/lib/industries" (richer, per-page shape).
