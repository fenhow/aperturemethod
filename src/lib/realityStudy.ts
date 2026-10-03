/**
 * The Reality Check research study (Oct 2026).
 *
 * Fenwick's EMBA capstone needs evidence from at least 100 owner-run businesses.
 * The study runs the SAME quiz as /reality-check, at /reality-check/study, and
 * adds two things the public quiz does not ask:
 *
 *   1. A self-rating BEFORE question one ("how well do you know your business,
 *      1 to 10"). Asked first so the quiz cannot colour it. The gap between this
 *      and the Clarity Score is the headline statistic.
 *   2. A short, optional profile AFTER the last question and before the score,
 *      so the score cannot colour it either.
 *
 * Everything here is a closed list. The server accepts only these values, so the
 * data comes out clean enough to count without cleaning.
 *
 * Anonymity is a promise made on the page. Nothing here identifies a person or a
 * company: bands, not figures; three ZIP digits, not five. If you add a field,
 * change the page copy first and keep it unidentifying.
 *
 * @illustrative-figures — the dollar amounts in the "wtp" question are survey
 * answer ranges for measuring willingness to pay (capstone H2), not our fees.
 * Our fees still live only in src/lib/pricing.ts.
 */

export type StudyOption = { value: string; label: string };
export type StudyField = {
  id: StudyFieldId;
  prompt: string;
  /** Why we ask, shown small under the prompt. Keep it honest and short. */
  why?: string;
  options: StudyOption[];
};

export type StudyFieldId =
  | "revenue"
  | "employees"
  | "industry"
  | "role"
  | "years"
  | "region"
  | "analysis_source"
  | "wtp";

/** The target for the capstone sample. Used on the page and in the counter. */
export const STUDY_TARGET = 100;

/** Below this many responses the page does not show a running count. */
export const STUDY_COUNT_FLOOR = 20;

export const studyFields: StudyField[] = [
  {
    id: "revenue",
    prompt: "Roughly what are your annual revenues?",
    why: "So results can be compared between businesses of a similar size.",
    options: [
      { value: "under-1m", label: "Under $1M" },
      { value: "1-5m", label: "$1M to $5M" },
      { value: "5-20m", label: "$5M to $20M" },
      { value: "20m-plus", label: "Over $20M" },
      { value: "prefer-not", label: "Prefer not to say" },
    ],
  },
  {
    id: "employees",
    prompt: "How many people work in the business?",
    options: [
      { value: "1-9", label: "1 to 9" },
      { value: "10-24", label: "10 to 24" },
      { value: "25-49", label: "25 to 49" },
      { value: "50-99", label: "50 to 99" },
      { value: "100-plus", label: "100 or more" },
    ],
  },
  {
    id: "industry",
    prompt: "Which best describes your industry?",
    options: [
      { value: "industrial-manufacturing", label: "Industrial or manufacturing" },
      { value: "construction-trades", label: "Construction or trades" },
      { value: "energy", label: "Energy or oilfield services" },
      { value: "healthcare", label: "Healthcare or wellness" },
      { value: "professional-services", label: "Professional services" },
      { value: "retail-consumer", label: "Retail or consumer" },
      { value: "hospitality-food", label: "Hospitality or food" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    id: "role",
    prompt: "What is your role?",
    options: [
      { value: "owner-founder", label: "Owner or founder" },
      { value: "co-owner-partner", label: "Co-owner or partner" },
      { value: "executive-manager", label: "Executive or manager, not an owner" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "years",
    prompt: "How long has the business been operating?",
    options: [
      { value: "under-3", label: "Under 3 years" },
      { value: "3-10", label: "3 to 10 years" },
      { value: "11-25", label: "11 to 25 years" },
      { value: "25-plus", label: "More than 25 years" },
    ],
  },
  {
    id: "region",
    prompt: "Where is the business based?",
    options: [
      { value: "houston-area", label: "Greater Houston" },
      { value: "other-texas", label: "Elsewhere in Texas" },
      { value: "other-us", label: "Elsewhere in the US" },
      { value: "outside-us", label: "Outside the US" },
    ],
  },
  {
    id: "analysis_source",
    prompt: "Today, who gives you financial or strategic analysis of the business?",
    why: "Meaning analysis you make decisions from, not bookkeeping or tax filing.",
    options: [
      { value: "no-one", label: "No one. I work it out myself" },
      { value: "bookkeeper-cpa", label: "My bookkeeper or CPA" },
      { value: "in-house", label: "Someone in-house (controller, CFO, analyst)" },
      { value: "outside-advisor", label: "An outside advisor or consultant" },
      { value: "software-only", label: "Software dashboards, no person" },
    ],
  },
  /*
   * Band edges are deliberate (Oct 2026): $3,000 is H2's falsification line and
   * $4,500 is the actual Business X-Ray fee (src/lib/pricing.ts XRAY_FEE), so
   * both can be read straight off the answers. Change them only with H2.
   */
  {
    id: "wtp",
    prompt:
      "What is the most you would pay for an independent, fixed-fee diagnostic that answered the questions you just could not?",
    options: [
      { value: "would-not-pay", label: "I would not pay for this" },
      { value: "under-1500", label: "Under $1,500" },
      { value: "1500-3000", label: "$1,500 to $3,000" },
      { value: "3000-4500", label: "$3,000 to $4,499" },
      { value: "4500-7500", label: "$4,500 to $7,500" },
      { value: "over-7500", label: "Over $7,500" },
    ],
  },
];

/**
 * "How did you hear about this study?" (Oct 2026). One shared link replaced the
 * tagged links, so the channel is asked instead. Stored in the existing
 * `source` column, which is what the dashboard and PDF already break down by.
 * A URL tag starting "test" still wins, so test runs stay excluded.
 */
export const heardFromOptions: StudyOption[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "email", label: "An email from Fenwick" },
  { value: "chamber", label: "A chamber or business group" },
  { value: "colleague", label: "A colleague or friend" },
  { value: "event", label: "An event or talk" },
  { value: "emba", label: "Texas A&M EMBA network" },
  { value: "other", label: "Somewhere else" },
];

export function cleanHeardFrom(v: unknown): string | null {
  return typeof v === "string" && heardFromOptions.some((o) => o.value === v) ? v : null;
}

/** Display name for a stored source value (answer, URL tag, or none). */
export function sourceLabel(v: string | null | undefined): string {
  if (!v || v === "direct") return "Not stated";
  return heardFromOptions.find((o) => o.value === v)?.label ?? v;
}

export type StudyProfile = Partial<Record<StudyFieldId, string>> & { zip3?: string; heard_from?: string };

/** Server-side whitelist. Unknown keys and values are dropped silently. */
export function cleanProfile(input: unknown): StudyProfile {
  const out: StudyProfile = {};
  if (!input || typeof input !== "object") return out;
  const raw = input as Record<string, unknown>;
  for (const f of studyFields) {
    const v = raw[f.id];
    if (typeof v === "string" && f.options.some((o) => o.value === v)) out[f.id] = v;
  }
  if (typeof raw.zip3 === "string" && /^\d{3}$/.test(raw.zip3)) out.zip3 = raw.zip3;
  return out;
}

/** Self-rating before the quiz: whole numbers 1 to 10. */
export function cleanSelfRating(v: unknown): number | null {
  return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 10 ? v : null;
}

/** UTM-style tags: lower-case slugs only, short. Anything else is dropped. */
export function cleanTag(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().toLowerCase().slice(0, 40);
  return /^[a-z0-9._-]+$/.test(s) ? s : null;
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
