/**
 * Pricing — the single source of truth for every fee the site quotes.
 *
 * Three files carried their own hard-coded numbers, and all three were stale: the homepage
 * said "from $2,500", HowItWorks carried a comment reading "PRICES are placeholders — swap
 * for Fenwick's real numbers", and the onboarding fee schedule still mirrored an Exhibit A
 * that no longer exists. A prospect could read one number on the homepage and sign a
 * contract quoting another.
 *
 * CANONICAL SOURCE: the Engagement Proposal & SOW, ratified 10 August 2026 as the governing
 * schedule (Canonical Architecture Reference §13, decision D1). Exhibit A of the New Customer
 * Contract Agreement was rewritten to match. If you change a number here, change it there
 * too — `scripts/check-lenses.mjs` fails the build if a currency figure is hard-coded
 * anywhere else in `src`, but it cannot read the Word document.
 *
 * RESET 10 August 2026 (Fenwick, this file + both Word documents changed together): the
 * schedule was re-based for the $1–20M owner-run ICP — X-Ray $9,500 → $2,500, full Method
 * $41,000 → $25,000, Atlas $2,950 → $900/mo — and the per-component fee, previously withheld,
 * was published at $8,000. The retired set ($9,500 / $41,000 / $34,500 / $2,950) must not
 * reappear anywhere.
 */

/** The Business X-Ray — the fixed-fee entry diagnostic. */
export const XRAY_FEE = "$2,500";

/** The full Method, Insights through Compass. Atlas is billed separately. */
export const FULL_METHOD_FEE = "$25,000";

/** What remains of the full Method once the X-Ray fee is credited. */
export const FULL_METHOD_AFTER_CREDIT = "$22,500";

/** Aperture Atlas, the ongoing platform layer. */
export const ATLAS_FEE = "$900/mo";

/**
 * A single component, taken on its own. Published as of the 10 Aug 2026 reset.
 *
 * This figure and FULL_METHOD_FEE are load-bearing on each other: the Method is FOUR
 * components (Insights → Compass), so the à-la-carte total is 4 × this number. It must stay
 * comfortably ABOVE the bundle or the full Method costs more than its parts and the bundle
 * stops being a bundle. At $8,000 the parts total $32,000 against a $25,000 Method — a ~22%
 * reason to take the whole thing. If either number moves, re-check that inequality.
 */
export const COMPONENT_FEE: string | null = "$8,000";

/** Terms that must travel with the numbers wherever they are shown. */
export const XRAY_CREDIT_TERMS =
  "credited toward the full Method if you proceed within 60 days";
export const ATLAS_TERMS = "6-month minimum, 30 days' notice thereafter";

/** Shown on the homepage and the How-it-works path. Set a value to null to hide it. */
export const PRICES = {
  xray: XRAY_FEE,
  component: COMPONENT_FEE,
  full: FULL_METHOD_FEE,
  atlas: ATLAS_FEE,
};

/**
 * Exhibit A of the New Customer Contract Agreement, rendered in the onboarding flow.
 * This MUST stay identical to the Word document the client signs.
 */
export const feeSchedule = [
  {
    phase: "Business X-Ray™",
    deliverable: `Business X-Ray + Aperture Score — ${XRAY_CREDIT_TERMS}`,
    fee: `${XRAY_FEE} fixed`,
  },
  { phase: "Aperture Insights™", deliverable: "X-Ray + engagement baseline", fee: `from ${COMPONENT_FEE}` },
  { phase: "Aperture Analytics™", deliverable: "Profit Map + scenario model", fee: `from ${COMPONENT_FEE}` },
  { phase: "Aperture Intelligence™", deliverable: "Customer & Market Map + GIS package", fee: `from ${COMPONENT_FEE}` },
  { phase: "Aperture Compass™", deliverable: "Opportunity Matrix + Focus Plan", fee: `from ${COMPONENT_FEE}` },
  {
    phase: "Full Method (bundle)",
    deliverable: "Insights → Compass, end to end (Atlas billed separately, below)",
    fee: `${FULL_METHOD_FEE} (${FULL_METHOD_AFTER_CREDIT} after the X-Ray credit)`,
  },
  {
    phase: "Aperture Atlas™ (recurring)",
    deliverable: `Live Scoreboard + KPI system — ${ATLAS_TERMS}`,
    fee: `${ATLAS_FEE.replace("/mo", " / month")}`,
  },
];
