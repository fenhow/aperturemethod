/**
 * The seven lenses: the single source of truth for the site.
 *
 * The Business X-Ray is the wedge, and the seven-lens diagnostic *is* the product. Before
 * this file the phrase "seven lenses" appeared in nine places across the site and the seven
 * were enumerated in two: once as a list, once as "operations, finance, customers, and
 * more." Three artifacts carried three different lens sets.
 *
 * Everything that names a lens now imports from here.
 *
 * CANONICAL SOURCE: Canonical Architecture Reference §2.2, which matches SOP 01 and the
 * ratified scoring rubric (`rubric.json`, v1.1.0). The id, name and weight below MUST equal
 * the rubric's. `scripts/check-lenses.mjs` fails the build if they drift: the site and the
 * instrument cannot disagree without someone being told.
 *
 * ON THE PEOPLE LENS: Leadership & Team assesses the system that holds capability, dependency,
 * cover, documentation, structure. It does not assess individuals. We do not appraise, benchmark
 * pay, or advise on hiring and firing; see Canonical Architecture Reference §2.3. The test a
 * finding has to pass is whether it would survive being read aloud to the person it is about.
 *
 * Order is by weight, descending. That is deliberate: it is the honest order of what the
 * Method believes matters in an owner-run business, and reading it top-to-bottom is itself
 * an argument.
 */

export type Lens = {
  /** Rubric key. Must match `lenses` in rubric.json exactly. */
  id: string;
  /** Client-facing name. */
  name: string;
  /** Weight in the Aperture Score. Must match rubric.json. */
  weight: number;
  /** The executive question this lens answers, in the owner's words. */
  question: string;
  /** What we actually look at. Plain language, no jargon. */
  lookAt: string;
  /** Why it carries the weight it does: the reasoning, not a restatement. */
  why: string;
  /** What we need from the client to score it honestly. */
  evidence: string;
};

export const LENSES: Lens[] = [
  {
    id: "finance",
    name: "Finance",
    weight: 0.2,
    question: "Do we actually make money, and will we still be here in a year?",
    lookAt:
      "Margin by product and location, the cash cycle through a full year, unit economics, how costs have moved, and whether the books can be trusted for decisions.",
    why: "Cash and unit economics are what actually end businesses of this size. It is also the most reliably evidenced lens: the P&L exists whether or not anything else does.",
    evidence: "Profit & loss and balance sheet, three years plus year-to-date. Payment terms and debt.",
  },
  {
    id: "operations",
    name: "Operations",
    weight: 0.18,
    question: "If demand doubled tomorrow, what breaks first?",
    lookAt:
      "The physical ceiling on volume, where work backs up, whether the bottleneck is measured or merely felt, whether the supply of licensed or qualified people caps what you can bill, and whether capacity is planned against demand or absorbed by overtime.",
    why: "In a place-based business the constraint usually binds physically: chairs, bays, rooms, vehicles, staffed hours. Someone can point at it.",
    evidence: "Capacity and utilisation, monthly volume, seasonality, how the work actually flows, and any licence or qualification that limits who can do it.",
  },
  {
    id: "customers-retention",
    name: "Customers & Retention",
    weight: 0.18,
    question: "Who pays us, why, and are they coming back?",
    lookAt:
      "Where customers come from and what each channel costs, repeat behaviour measured rather than assumed, how concentrated revenue is, and why customers leave when they leave.",
    why: "Retention is the highest-leverage and most commonly mismeasured area in an owner-run business. Owners routinely believe their repeat rate is far higher than it is, and it is usually cheaper to fix than acquisition.",
    evidence: "Transaction history by customer, marketing spend by channel, and what you know about churn.",
  },
  {
    id: "market-competition",
    name: "Market & Competition",
    weight: 0.14,
    question: "Why does anyone choose us over the alternative?",
    lookAt:
      "Whether there is a defensible reason to choose you, who you actually lose to and on what, where the market is heading, and how much of your catchment you hold.",
    why: "This sets the ceiling on everything else. A well-run business in a shrinking market has a strategy problem that no operational fix reaches.",
    evidence: "Who costs you business and where, how far customers travel, and what is changing around you.",
  },
  {
    id: "leadership-team",
    name: "Leadership & Team",
    weight: 0.12,
    question: "What happens if you take a month off?",
    lookAt:
      "Which jobs only one person can do and what revenue rides on them, whether anyone could cover them tomorrow, whether the work is written down well enough to hand over, how much reports directly to you, and whether decisions get made or quietly stall.",
    why: "Key-person risk is existential at this size, and it is the single most common reason an owner-run business cannot be sold. We put a number on it, the revenue exposed if a role goes dark for ninety days, because that is the version of the problem a buyer, a lender and a tired owner all understand. Weighted above Processes for that reason.",
    evidence: "Roles rather than names: who does what, what would stop, who could cover, and what is written down. A staff list by role, and an initiative that stalled.",
  },
  {
    id: "processes",
    name: "Processes",
    weight: 0.1,
    question: "Does the work survive the person doing it?",
    lookAt:
      "What is documented and actually followed, what still runs on memory, a spreadsheet or a piece of paper, and whether broken processes ever get fixed.",
    why: "Weighted lower on purpose. Weak process is usually a symptom of Operations or Leadership rather than a root constraint; treating it as the disease is a common and expensive mistake.",
    evidence: "How work gets done today, and which process would change the most if it ran properly.",
  },
  {
    id: "technology-data",
    name: "Technology & Data",
    weight: 0.08,
    question: "Can you see what you need to see, when you need to see it?",
    lookAt:
      "Whether systems cover the core without manual re-entry, whether the numbers are trusted and rightly so, and whether decision-makers can answer their own questions.",
    why: "Weighted lowest, deliberately. Technology is almost never the binding constraint in a business this size; it is an enabler. Weighting it higher produces 'buy software' recommendations, which is the failure mode of this entire industry.",
    evidence: "Your systems, where you do not trust your own numbers, and what you wish you could see.",
  },
];

/** Formatted for prose: "operations, finance, customers … and market". */
export const lensNamesSentence = LENSES.map((l) => l.name.toLowerCase()).join(", ");

/** Guard: the Aperture Score is a weighted composite, so these must total 1. */
export const lensWeightTotal = LENSES.reduce((t, l) => t + l.weight, 0);
