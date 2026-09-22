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
};

export const PROGRAM = "Texas A&M Executive MBA";
export const CURRICULUM_ANCHOR = "/the-aperture-method#curriculum";

export const coursework: Course[] = [
  {
    code: "ACCT 610",
    title: "Financial Accounting",
    products: ["Analytics"],
    built:
      "The Profit Map and the Financial Analysis Workbench: financial statements read the way an analyst reads them, ratio and earnings-quality analysis, and cash conversion.",
  },
  {
    code: "SCMT 610",
    title: "Business Analytics",
    products: ["Atlas"],
    built:
      "The quantitative layer in Atlas: regression on what moves sales (weather, holidays, drive time, demographics), with confidence intervals rather than guesses.",
  },
];

export const coursesFor = (short: string) => coursework.filter((c) => c.products.includes(short));
