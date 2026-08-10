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
 */

/** The Business X-Ray — the fixed-fee entry diagnostic. */
export const XRAY_FEE = "$9,500";

/** The full Method, Insights through Compass. Atlas is billed separately. */
export const FULL_METHOD_FEE = "$41,000";

/** What remains of the full Method once the X-Ray fee is credited. */
export const FULL_METHOD_AFTER_CREDIT = "$34,500";

/** Aperture Atlas, the ongoing platform layer. */
export const ATLAS_FEE = "$2,950/mo";

/**
 * Individual phases are quoted per engagement. The SOW has never published a per-phase
 * figure, and inventing one would imply a bundle discount that has not been decided — four
 * phases summing to the bundle balance would mean no discount at all. Left honest until set.
 */
export const COMPONENT_FEE: string | null = null;

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
  { phase: "Aperture Insights™", deliverable: "X-Ray + engagement baseline", fee: "quoted per engagement" },
  { phase: "Aperture Analytics™", deliverable: "Profit Map + scenario model", fee: "quoted per engagement" },
  { phase: "Aperture Intelligence™", deliverable: "Customer & Market Map + GIS package", fee: "quoted per engagement" },
  { phase: "Aperture Compass™", deliverable: "Opportunity Matrix + Focus Plan", fee: "quoted per engagement" },
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
