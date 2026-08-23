import { feeSchedule, SNAPSHOT_FEE, SNAPSHOT_CEILING, INSIGHTS_FEE, COMPONENT_FEE, FULL_METHOD_FEE, SITE_SELECTION_FEE, ATLAS_TIERS } from "@/lib/pricing";

/**
 * What the client is actually engaging, chosen before they sign.
 *
 * The agreement describes the whole Method, because the clauses are the same
 * whichever phases are bought. That is fine for the clauses and misleading for
 * Exhibit A, where an unedited fee schedule reads as though every line has been
 * purchased. So the client ticks what they are engaging, and only those lines
 * are printed into the executed document.
 *
 * Keys match `key` on the fee schedule rows in lib/pricing.ts, so the two
 * cannot drift: `assertScopeKeys` fails loudly if one is renamed.
 */

export type ScopeOption = {
  key: string;
  label: string;
  blurb: string;
  /** Fee-schedule keys this option prints into Exhibit A. */
  rows: string[];
  /**
   * The published starting figure, shown on the card so nobody ticks a box
   * without seeing what it costs. This is the list price, not a quote: a
   * separately agreed figure overrides it, which the form says out loud.
   */
  price: string;
  /** Rendered as a separate group so a retainer is never mistaken for a phase. */
  recurring?: boolean;
};

const COMPONENT = COMPONENT_FEE ?? "on application";

export const scopeOptions: ScopeOption[] = [
  {
    key: "insights",
    label: "Aperture Insights™",
    blurb: "The Business X-Ray and your Aperture Score. Most engagements start here.",
    price: `${INSIGHTS_FEE} fixed`,
    rows: ["insights"],
  },
  {
    /**
     * The lighter depth of Insights, not a sixth component. It sits directly
     * under Insights so the two read as one choice at two depths, which is what
     * they are, and `scopeConflict` stops both being ticked at once.
     */
    key: "snapshot",
    label: "Aperture Snapshot™",
    blurb: `The lighter depth of Insights: the same seven lenses scored from your documents, with a provisional Aperture Score. For businesses under ${SNAPSHOT_CEILING}.`,
    price: `${SNAPSHOT_FEE} fixed`,
    rows: ["snapshot"],
  },
  {
    key: "analytics",
    label: "Aperture Analytics™",
    blurb: "Profit Map and scenario model.",
    price: `from ${COMPONENT}`,
    rows: ["analytics"],
  },
  {
    key: "intelligence",
    label: "Aperture Intelligence™",
    blurb: "Customer and Market Map with the GIS package.",
    price: `from ${COMPONENT}`,
    rows: ["intelligence"],
  },
  {
    key: "compass",
    label: "Aperture Compass™",
    blurb: "Opportunity Matrix and Focus Plan.",
    price: `from ${COMPONENT}`,
    rows: ["compass"],
  },
  {
    key: "full",
    label: "Full Method",
    blurb: "Insights through Compass, end to end. Replaces the four selections above.",
    price: `${FULL_METHOD_FEE}`,
    rows: ["full"],
  },
  {
    key: "site",
    label: "Site Selection Study",
    blurb: "Candidate-site scoring with trade-area and drive-time modelling. Standalone.",
    price: `${SITE_SELECTION_FEE} fixed`,
    rows: ["site"],
  },
  {
    key: "atlas",
    label: "Aperture Atlas™",
    blurb: "The live Scoreboard and KPI system, billed monthly and cancellable on notice.",
    price: `from ${ATLAS_TIERS[0].fee.replace("/mo", " / month")}`,
    rows: ["atlas1", "atlas24", "atlas5"],
    recurring: true,
  },
];

export const scopeByKey = Object.fromEntries(scopeOptions.map((o) => [o.key, o]));

/** Fee-schedule rows for a selection, in schedule order, de-duplicated. */
export function feeRowsForScope(selected: string[]) {
  const wanted = new Set(
    selected.flatMap((k) => scopeByKey[k]?.rows ?? []),
  );
  return feeSchedule.filter((r) => wanted.has((r as { key?: string }).key ?? ""));
}

export function scopeLabels(selected: string[]): string[] {
  return scopeOptions.filter((o) => selected.includes(o.key)).map((o) => o.label);
}

/**
 * Selecting the bundle and its parts at the same time is a contradiction, and
 * an executed Exhibit A that contains both invites an argument later.
 */
export function scopeConflict(selected: string[]): string | null {
  const parts = ["insights", "snapshot", "analytics", "intelligence", "compass"];
  if (selected.includes("full") && parts.some((p) => selected.includes(p))) {
    return "The Full Method already includes Insights, Analytics, Intelligence and Compass. Choose the bundle or the individual phases, not both.";
  }
  // The Snapshot and the X-Ray are one component at two depths. Ticking both
  // would print two entry fees into Exhibit A for the same piece of work.
  if (selected.includes("snapshot") && selected.includes("insights")) {
    return "The Aperture Snapshot and Aperture Insights are the same component at two depths, so only one applies. If you start with the Snapshot it counts in full toward Insights should you decide to go deeper.";
  }
  return null;
}

/** Throws if a fee-schedule key referenced here no longer exists. */
export function assertScopeKeys(): void {
  const have = new Set(feeSchedule.map((r) => (r as { key?: string }).key));
  const missing = scopeOptions.flatMap((o) => o.rows).filter((k) => !have.has(k));
  if (missing.length) {
    throw new Error(`scope.ts references unknown fee-schedule keys: ${missing.join(", ")}`);
  }
}

/**
 * Shown wherever prices are: on the cards, in the live Exhibit A preview, and
 * in the executed PDF. The figures on this page are the published schedule, and
 * a client who negotiated something else needs to see that their number wins
 * before they sign, not after.
 */
export const NEGOTIATED_TERMS_NOTE =
  "These are the published starting figures. If you have agreed different terms with Fenwick How directly, a quoted fee, a bundled price, a discount or a payment schedule, those agreed terms apply instead and are written into your Exhibit A before signature. If what you see here does not match what was discussed, stop and tell me rather than signing.";
