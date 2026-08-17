import { feeSchedule } from "@/lib/pricing";

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
  /** Rendered as a separate group so a retainer is never mistaken for a phase. */
  recurring?: boolean;
};

export const scopeOptions: ScopeOption[] = [
  {
    key: "insights",
    label: "Aperture Insights™",
    blurb: "The Business X-Ray and your Aperture Score. Most engagements start here.",
    rows: ["insights"],
  },
  {
    key: "analytics",
    label: "Aperture Analytics™",
    blurb: "Profit Map and scenario model.",
    rows: ["analytics"],
  },
  {
    key: "intelligence",
    label: "Aperture Intelligence™",
    blurb: "Customer and Market Map with the GIS package.",
    rows: ["intelligence"],
  },
  {
    key: "compass",
    label: "Aperture Compass™",
    blurb: "Opportunity Matrix and Focus Plan.",
    rows: ["compass"],
  },
  {
    key: "full",
    label: "Full Method",
    blurb: "Insights through Compass, end to end. Replaces the four selections above.",
    rows: ["full"],
  },
  {
    key: "site",
    label: "Site Selection Study",
    blurb: "Candidate-site scoring with trade-area and drive-time modelling. Standalone.",
    rows: ["site"],
  },
  {
    key: "atlas",
    label: "Aperture Atlas™",
    blurb: "The live Scoreboard and KPI system, billed monthly and cancellable on notice.",
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
  const parts = ["insights", "analytics", "intelligence", "compass"];
  if (selected.includes("full") && parts.some((p) => selected.includes(p))) {
    return "The Full Method already includes Insights, Analytics, Intelligence and Compass. Choose the bundle or the individual phases, not both.";
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
