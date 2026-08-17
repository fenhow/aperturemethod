/**
 * Pricing: the single source of truth for every fee the site quotes.
 *
 * Three files carried their own hard-coded numbers, and all three were stale: the homepage
 * said "from $2,500", HowItWorks carried a comment reading "PRICES are placeholders. Swap
 * for Fenwick's real numbers", and the onboarding fee schedule still mirrored an Exhibit A
 * that no longer exists. A prospect could read one number on the homepage and sign a
 * contract quoting another.
 *
 * CANONICAL SOURCE: the Engagement Proposal & SOW, ratified 10 August 2026 as the governing
 * schedule (Canonical Architecture Reference §13, decision D1). Exhibit A of the New Customer
 * Contract Agreement was rewritten to match. If you change a number here, change it there
 * too: `scripts/check-lenses.mjs` fails the build if a currency figure is hard-coded
 * anywhere else in `src`, but it cannot read the Word document.
 *
 * REVISED 11 August 2026 (second pass): the Business X-Ray and Aperture Insights were the same
 * product at two prices, collapsed into one $4,500 entry. The deep-component floor rose
 * $8,000 → $8,500 to keep à la carte ($30,000) above the bundle ($25,000). The "credit" is now
 * stated as arithmetic: you bought Phase 1 for $4,500, the rest is $20,500, not a discount.
 *
 * REVISED 11 August 2026 (Fenwick, after the "Where the Money Is" proposal): the X-Ray moved
 * $2,500 → $4,500: the entry fee's job is to QUALIFY, and the free /reality-check quiz is the
 * top-of-funnel, so the X-Ray must not be priced as a lead magnet. It also makes the credit a
 * real closing device ($20,500 rather than $25,000). Atlas was tiered by location count, an
 * annual prepay added, and the Site Selection Study introduced as a value-priced standalone.
 *
 * RESET 10 August 2026 (Fenwick, this file + both Word documents changed together): the
 * schedule was re-based for the $1–20M owner-run ICP: X-Ray $9,500 → $2,500, full Method
 * $41,000 → $25,000, Atlas $2,950 → $900/mo, and the per-component fee, previously withheld,
 * was published at $8,000. The retired set ($9,500 / $41,000 / $34,500 / $2,950) must not
 * reappear anywhere.
 */

/**
 * The Business X-Ray: the deliverable of Aperture Insights, and the fixed-fee way in.
 *
 * IMPORTANT (11 Aug 2026, Fenwick): the X-Ray is NOT a separate SKU sitting outside the five
 * components. **Aperture Insights IS the X-Ray**, priced here. Exhibit A used to carry both a
 * "Business X-Ray, $4,500" row and an "Aperture Insights, from $8,000" row: the same product
 * at two prices, three lines apart. They are now one row.
 *
 * Insights is deliberately BROAD, NOT DEEP, a seven-lens read of where the business stands,
 * with meaningful data but no heavy analysis. It orients and it points; the depth is bought in
 * Analytics, Intelligence and Compass. Price it accordingly, and do not let scope creep in.
 */
export const XRAY_FEE = "$4,500";

/** Alias: Aperture Insights and the Business X-Ray are the same purchase. */
export const INSIGHTS_FEE = XRAY_FEE;

/** The full Method, Insights through Compass. Atlas is billed separately. */
export const FULL_METHOD_FEE = "$25,000";

/** What remains of the full Method once the X-Ray fee is credited. */
export const FULL_METHOD_AFTER_CREDIT = "$20,500";

/**
 * Aperture Atlas, the ongoing platform layer, tiered by location count as of the
 * 11 Aug 2026 decision. ATLAS_FEE is the ENTRY tier and is what "from" copy quotes;
 * never present it as the only price.
 */
export const ATLAS_FEE = "$900/mo";

/** The Atlas tiers. A single-location owner and a five-site scaler get very different
 *  value from the same maps; one price for both left money on the table at the top and
 *  was a barrier at the bottom. */
export const ATLAS_TIERS = [
  { label: "Single location", fee: "$900/mo" },
  { label: "2–4 locations", fee: "$1,500/mo" },
  { label: "5+ locations", fee: "$2,500/mo" },
] as const;

/** Annual prepay: a cash device, and mostly a retention device. */
export const ATLAS_PREPAY_TERMS = "pay annually and get 12 months for the price of 10";

/**
 * The Site Selection Study, sold on the value of the decision, not on effort.
 * An owner signing a ten-year lease is making a six-figure commitment; this is the one
 * capability no CPA or agency in their orbit can offer at all. Deliberately NOT a
 * component fee, and deliberately above one.
 */
export const SITE_SELECTION_FEE = "$18,000";

/**
 * A single DEEP component, taken on its own: Analytics, Intelligence or Compass.
 * Insights is NOT priced from this figure; it is the entry product at INSIGHTS_FEE.
 *
 * THE INEQUALITY THAT MUST HOLD: the Method is Insights + three deep components, so
 * à la carte = INSIGHTS_FEE + 3 × COMPONENT_FEE, and that total must stay comfortably ABOVE
 * FULL_METHOD_FEE; otherwise the bundle costs more than its parts and stops being a bundle.
 *
 *   $4,500 + 3 × $8,500 = $30,000  vs  a $25,000 Method  →  a ~17% reason to take the whole thing.
 *
 * Raised from $8,000 on 11 Aug 2026 precisely to hold that gap once Insights dropped to $4,500.
 * If ANY of the three numbers moves, re-check the inequality before shipping.
 */
export const COMPONENT_FEE: string | null = "$8,500";

/** Terms that must travel with the numbers wherever they are shown. */
export const XRAY_CREDIT_TERMS =
  "counts in full toward the Method if you continue within 60 days";
export const ATLAS_TERMS = "6-month minimum, 30 days' notice thereafter";
export const SITE_SELECTION_TERMS =
  "fixed fee, per site-selection question, scoped to the candidate market before you commit";

/** Shown on the homepage and the How-it-works path. Set a value to null to hide it. */
export const PRICES = {
  xray: XRAY_FEE,
  component: COMPONENT_FEE,
  full: FULL_METHOD_FEE,
  atlas: ATLAS_FEE,
  siteSelection: SITE_SELECTION_FEE,
};

/**
 * Exhibit A of the New Customer Contract Agreement, rendered in the onboarding flow.
 * This MUST stay identical to the Word document the client signs.
 */
export const feeSchedule = [
  {
    phase: "Aperture Insights™ (the way in)",
    deliverable: `Business X-Ray + Aperture Score, a seven-lens read of where the business stands. ${XRAY_CREDIT_TERMS}`,
    fee: `${INSIGHTS_FEE} fixed`,
  },
  { phase: "Aperture Analytics™", deliverable: "Profit Map + scenario model", fee: `from ${COMPONENT_FEE}` },
  { phase: "Aperture Intelligence™", deliverable: "Customer & Market Map + GIS package", fee: `from ${COMPONENT_FEE}` },
  { phase: "Aperture Compass™", deliverable: "Opportunity Matrix + Focus Plan", fee: `from ${COMPONENT_FEE}` },
  {
    phase: "Full Method (bundle)",
    deliverable: "Insights → Compass, end to end (Atlas billed separately, below). À la carte the same four are $30,000",
    fee: `${FULL_METHOD_FEE} (${FULL_METHOD_AFTER_CREDIT} after the X-Ray credit)`,
  },
  {
    phase: "Site Selection Study",
    deliverable: "Candidate-site scoring + trade-area & drive-time modelling (standalone)",
    fee: `${SITE_SELECTION_FEE} fixed`,
  },
  {
    phase: "Aperture Atlas™ (recurring)",
    deliverable: `Live Scoreboard + KPI system, single location: ${ATLAS_TERMS}`,
    fee: `${ATLAS_TIERS[0].fee.replace("/mo", " / month")}`,
  },
  {
    phase: "Aperture Atlas™ · 2–4 locations",
    deliverable: `Live Scoreboard + KPI system, 2–4 locations: ${ATLAS_TERMS}`,
    fee: `${ATLAS_TIERS[1].fee.replace("/mo", " / month")}`,
  },
  {
    phase: "Aperture Atlas™ · 5+ locations",
    deliverable: `Live Scoreboard + KPI system, 5+ locations: ${ATLAS_TERMS}`,
    fee: `${ATLAS_TIERS[2].fee.replace("/mo", " / month")}`,
  },
  {
    phase: "Aperture Atlas™ · annual prepay",
    deliverable: `Any Atlas tier, paid annually in advance: ${ATLAS_PREPAY_TERMS}`,
    fee: "10 × the monthly tier",
  },
];
