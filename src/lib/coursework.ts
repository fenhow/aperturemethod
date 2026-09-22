/**
 * Graduate coursework that has been built into the Method. Single source for the
 * provenance lines on product pages and the curriculum map on /the-aperture-method.
 *
 * Wording rules (see founder credential notes): the MBA is IN PROGRESS, so copy says
 * "Texas A&M Executive MBA" as the programme, never a conferred degree; no school logos
 * and nothing implying the school endorses the firm. Keep these lines off the homepage,
 * headings and anything next to a price. Add a course here when its work lands.
 */
export type Course = {
  code: string;
  title: string;
  /** `short` names from methodPhases / aperturePractices that this course feeds. */
  products: string[];
  /** What the course built into the Method, in plain language. */
  built: string;
  /** When the work landed on the site (ISO date) — drives the Coursework in Practice log. */
  landed: string;
  /** Concrete things the course added, for the log. Facts only, no course-content claims. */
  highlights: string[];
  /** Where to see it live. */
  seeIt: { label: string; href: string }[];
};

export const PROGRAM = "Texas A&M Executive MBA";
export const CURRICULUM_ANCHOR = "/the-aperture-method#curriculum";
export const COURSEWORK_LOG = "/method-lab/coursework";

export const coursework: Course[] = [
  {
    code: "ACCT 610",
    title: "Financial Accounting",
    products: ["Analytics"],
    built:
      "The Profit Map and the Financial Analysis Workbench: financial statements read the way an analyst reads them, ratio and earnings-quality analysis, and cash conversion.",
    landed: "2026-08-16",
    highlights: [
      "The Financial Analysis Workbench: from a set of statements to a full written analysis, with an evidence grade on every add-back",
      "Two complete worked examples published free: a listed retailer and an owner-managed fabricator, because the analysis has to change when the entity does",
      "Ratio and DuPont analysis, an earnings-quality page (special items, impairments, non-GAAP) and a credit analysis step",
      "A 10-K annotator that ties every footnote back to the figure it explains",
    ],
    seeIt: [
      { label: "The published worked examples", href: "/method-lab/financial-analysis-workbench" },
      { label: "Aperture Analytics", href: "/method/analytics" },
      { label: "The Profit Map", href: "/profit-map" },
    ],
  },
  {
    code: "SCMT 610",
    title: "Business Analytics",
    products: ["Analytics", "Atlas"],
    built:
      "The statistics under both: regression on what moves sales (weather, holidays, drive time, demographics), scenario and sensitivity testing in the Profit Map, and confidence intervals rather than guesses.",
    landed: "2026-09-22",
    highlights: [
      "A weekly sales model (ordinary least squares) controlling for trend, season, holidays, marketing and a competitor opening",
      "Partial-effect plots for rain and temperature, including a curved fit that finds the temperature where sales peak",
      "An event study of holiday lift, week by week, with 95% confidence intervals",
      "A cross-sectional model across trade-area hexes: standardised betas for drive time, income, demographics, new housing and competition",
      "Plain-English explainers on every chart: what it shows, how to read it, why it matters",
    ],
    seeIt: [
      { label: "Aperture Atlas: “Why sales move”", href: "/method/atlas" },
      { label: "Aperture Analytics", href: "/method/analytics" },
    ],
  },
];

/** Single-intent landing pages (the ones the menu opens) mapped to their product. */
export const LANDING_PRODUCT: Record<string, string> = {
  "/business-x-ray": "Insights",
  "/profit-map": "Analytics",
  "/market-map": "Intelligence",
  "/focus-plan": "Compass",
  "/scoreboard": "Atlas",
};
export const courseCodesForHref = (href: string) => {
  const short = LANDING_PRODUCT[href];
  return short ? coursesFor(short).map((c) => c.code) : [];
};

export const coursesFor = (short: string) => coursework.filter((c) => c.products.includes(short));
