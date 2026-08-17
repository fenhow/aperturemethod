/**
 * The Reality Check, an eleven-question self-assessment of how well an owner
 * actually knows their own business.
 *
 * Design rule: every question must be unanswerable without real knowledge.
 * "Do you understand your customers?" is worthless: everyone says yes. The
 * questions below ask for a number, a name, or a timeframe, so the honest
 * answer is often "I'd have to look it up," and that is the whole point.
 *
 * This measures how well you KNOW the business, not how GOOD the business is.
 * The result is a Clarity Score, deliberately NOT the Aperture Score™, which
 * is evidence-based and has to be earned.
 */

export type RCOption = { label: string; score: 0 | 1 | 2 | 3 | 4 };

export type RCQuestion = {
  id: string;
  /** Short label for the area, shown on the results breakdown. */
  area: string;
  /** The Aperture component that answers this question. */
  component: string;
  prompt: string;
  /** Optional clarifier under the prompt. */
  note?: string;
  options: RCOption[];
  /** Shown when this is the single biggest blind spot. */
  blindSpot: { headline: string; body: string; cost: string };
};

export const MAX_PER_QUESTION = 4;

export const questions: RCQuestion[] = [
  {
    id: "constraint",
    area: "The binding constraint",
    component: "Business X-Ray™",
    prompt:
      "If I asked you the single biggest thing holding back your growth right now, could you name it, and show me the evidence?",
    options: [
      { label: "I can name it, and I could show you the numbers behind it", score: 4 },
      { label: "I can name it, but the evidence is mostly instinct", score: 2 },
      { label: "I have three or four candidates and no clear winner", score: 1 },
      { label: "Honestly, no", score: 0 },
    ],
    blindSpot: {
      headline: "You do not have an agreed constraint.",
      body: "Everything else compounds from this. Without one named, evidenced constraint, effort spreads evenly across problems that do not deserve equal effort, and the things that would actually move the business get the same attention as the things that would not.",
      cost: "This is the cheapest thing on this list to fix, and the one that changes what every other decision is worth.",
    },
  },
  {
    id: "profit-by-line",
    area: "Profit by line",
    component: "Aperture Analytics™",
    prompt:
      "Which of your products or services is your least profitable, after allocating overhead?",
    note: "Not lowest revenue. Lowest profit, with shared costs allocated.",
    options: [
      { label: "I know exactly, and I could show you the math", score: 4 },
      { label: "I know roughly which one it is", score: 2 },
      { label: "I know revenue by line, but not profit", score: 1 },
      { label: "We do not allocate overhead to lines", score: 0 },
    ],
    blindSpot: {
      headline: "You are flying without profit visibility by line.",
      body: "Revenue by product is common. Profit by product, after overhead, is rare, and it is where the surprises live. Most owner-run businesses have at least one line that looks healthy on revenue and is quietly funded by the rest of the business.",
      cost: "Until this is allocated, every pricing, staffing and discontinue decision is being made on the wrong number.",
    },
  },
  {
    id: "concentration",
    area: "Customer concentration",
    component: "Aperture Analytics™",
    prompt: "What share of your revenue comes from your top ten customers?",
    options: [
      { label: "I know the number within a few points", score: 4 },
      { label: "I could estimate it and be close", score: 2 },
      { label: "I would have to pull it together", score: 1 },
      { label: "I have never looked", score: 0 },
    ],
    blindSpot: {
      headline: "You do not know how concentrated your revenue is.",
      body: "Concentration is the single risk a buyer, a lender or a bad quarter finds first. It also quietly dictates how much pricing power you actually have, and owners routinely underestimate their own number by a wide margin.",
      cost: "It is a one-afternoon calculation that changes how you think about risk, pricing and valuation.",
    },
  },
  {
    id: "cash-cycle",
    area: "The cash cycle",
    component: "Aperture Analytics™",
    prompt:
      "How many days pass between paying for something and getting paid for it?",
    note: "Money out to money in: the cash conversion cycle. A number of days, not a feeling about cash flow.",
    options: [
      { label: "I know the number, and I track which way it is moving", score: 4 },
      { label: "I have worked it out at some point", score: 2 },
      { label: "I know when cash is tight, but not the number", score: 1 },
      { label: "I have never calculated it", score: 0 },
    ],
    blindSpot: {
      headline: "You have cash locked in the operating cycle and no measure of how much.",
      body: "Almost every owner knows when cash is tight. Very few know the number of days causing it, which is what makes it fixable: receivables, stock and supplier terms are three separate levers, and they respond to different things. Until the cycle is split into its parts, tight cash looks like one problem instead of three.",
      cost: "Roughly one day of revenue is tied up for each day in the cycle. Pulling fifteen days out of a $5M business releases about a year's profit in cash, with no borrowing and no new customers.",
    },
  },
  {
    id: "retention",
    area: "Repeat business",
    component: "Aperture Intelligence™",
    prompt: "What percentage of your customers buy from you more than once?",
    options: [
      { label: "I track it, and I know the trend", score: 4 },
      { label: "I know it roughly", score: 2 },
      { label: "I could calculate it if I had to", score: 1 },
      { label: "I do not know", score: 0 },
    ],
    blindSpot: {
      headline: "You cannot see whether customers come back.",
      body: "Retention is the most commonly missed constraint in owner-run businesses, because the symptom looks like a marketing problem. Growth stays flat, so more is spent on acquisition, which papers over the fact that the back door is open.",
      cost: "A loyal customer is usually worth several times a one-and-done. If half of yours never return, you are paying to fill a bucket with a hole in it.",
    },
  },
  {
    id: "market",
    area: "Market position",
    component: "Aperture Intelligence™ · GIS",
    prompt:
      "How many direct competitors operate inside your primary trade area, and how much of that area do you actually hold?",
    options: [
      { label: "I know both numbers", score: 4 },
      { label: "I know the competitors, not my share", score: 2 },
      { label: "I have a rough sense of both", score: 1 },
      { label: "Neither, really", score: 0 },
    ],
    blindSpot: {
      headline: "You are competing without a map.",
      body: "Most owners know their competitors by name and almost none know their penetration by area. That gap hides two things at once: where you are already winning and should press, and where demand exists that nobody is serving.",
      cost: "Expansion and marketing spend get aimed by intuition rather than by where the demand actually is.",
    },
  },
  {
    id: "growth",
    area: "The growth plan",
    component: "Aperture Compass™",
    prompt:
      "Where is your next dollar of growth coming from, and why that, rather than three other options you considered?",
    options: [
      { label: "We compared the options with numbers and chose", score: 4 },
      { label: "We have a plan, but the alternatives were not modelled", score: 2 },
      { label: "We have a direction, not really a plan", score: 1 },
      { label: "We mostly take what comes", score: 0 },
    ],
    blindSpot: {
      headline: "Your growth plan has no rejected alternatives.",
      body: "A plan that was never weighed against other options is not a decision, it is a default. The value of a prioritized roadmap is not the item at the top; it is the confidence that the items below it were genuinely considered and set aside for a reason.",
      cost: "Without alternatives on the table, you cannot know whether the plan is the best move or simply the first one anyone suggested.",
    },
  },
  {
    id: "decisions",
    area: "Decision discipline",
    component: "Aperture Analytics™ · Compass™",
    prompt:
      "Before your last significant decision, a hire, a location, a price change, did you model what happens if you are wrong?",
    options: [
      { label: "Yes, including a downside case", score: 4 },
      { label: "We discussed the risk, but did not model it", score: 2 },
      { label: "We went with judgment and moved", score: 1 },
      { label: "We committed and hoped", score: 0 },
    ],
    blindSpot: {
      headline: "Big decisions are being made without a downside case.",
      body: "Experienced owners are often right, which is exactly what makes this dangerous: the one time the instinct is wrong, there is no early warning and no pre-agreed trigger to stop. Modelling the downside is not pessimism; it is knowing in advance what would tell you to change course.",
      cost: "The cost of being wrong is paid in full, months after the decision, when reversing it is most expensive.",
    },
  },
  {
    id: "kpis",
    area: "Operating visibility",
    component: "Aperture Atlas™",
    prompt:
      "How many numbers do you look at every month that have a target attached and an owner responsible for them?",
    options: [
      { label: "Five to ten, each with a target and an owner", score: 4 },
      { label: "A handful, but the targets are informal", score: 2 },
      { label: "Mostly revenue and the bank balance", score: 1 },
      { label: "I check in when something feels off", score: 0 },
    ],
    blindSpot: {
      headline: "You would find out late.",
      body: "A number without a target is a fact, not a signal; it cannot tell you whether things are going well. Without owners and thresholds, drift is only visible once it is large enough to feel, and by then a quarter has usually gone.",
      cost: "The gap between something going wrong and you noticing is where most of the recoverable money is lost.",
    },
  },
  {
    id: "readiness",
    area: "Exit and finance readiness",
    component: "Aperture Analytics™",
    prompt:
      "If a buyer or a lender asked for three years of clean, reconciled financials next week, how long would that take?",
    options: [
      { label: "They are ready now", score: 4 },
      { label: "A few days of tidying", score: 2 },
      { label: "A few weeks, with help", score: 1 },
      { label: "I would rather not find out", score: 0 },
    ],
    blindSpot: {
      headline: "Your numbers are not defensible on demand.",
      body: "This one is not urgent right up until the day it is: an unsolicited offer, a bank covenant, a partner exit. Reconciled financials are also the foundation everything else in this list depends on, so the work is never wasted.",
      cost: "Buyers and lenders discount what they cannot verify quickly. The discount is usually larger than the cost of fixing it.",
    },
  },
  {
    id: "ai",
    area: "AI where it pays",
    component: "AI, without the black box",
    prompt: "Where in your business does AI currently save you measurable time or money?",
    options: [
      { label: "I can name where, and quantify the saving", score: 4 },
      { label: "We use it, but I could not quantify the benefit", score: 2 },
      { label: "We have experimented a little", score: 1 },
      { label: "Nowhere yet", score: 0 },
    ],
    blindSpot: {
      headline: "AI is not yet earning its place.",
      body: "This is the least urgent item on the list and the easiest to get wrong in both directions: spending on tools that do nothing, or avoiding it entirely while competitors compound small advantages. The answer is not more AI; it is AI in the two or three places where the return is measurable.",
      cost: "Low today, compounding quietly. Worth deliberate attention once the items above are settled.",
    },
  },
];

/** Priority order used to break ties when choosing the single blind spot. */
const priority = [
  "constraint",
  "profit-by-line",
  "cash-cycle",
  "retention",
  "concentration",
  "kpis",
  "market",
  "growth",
  "decisions",
  "readiness",
  "ai",
];

export type Band = {
  min: number;
  name: string;
  verdict: string;
  frame: string;
};

export const bands: Band[] = [
  {
    min: 85,
    name: "Running on evidence",
    verdict: "You can answer for your own business with numbers. That is rare.",
    frame:
      "Most of what The Aperture Method does you are already doing. The honest advice is that you probably do not need a full engagement; you need a second set of eyes on one or two specific questions.",
  },
  {
    min: 65,
    name: "Mostly evidence, some instinct",
    verdict: "You know your business well, and there are two or three places you are guessing.",
    frame:
      "This is a good position. The gaps are specific rather than general, which means they are cheap to close, usually a single component rather than a full engagement.",
  },
  {
    min: 45,
    name: "Running on instinct",
    verdict: "You know your business. You cannot yet prove it.",
    frame:
      "This is the most common result, and it is not a criticism: instinct built on years of operating is real information. It just cannot be tested, delegated, or shown to a bank. The fix is putting evidence underneath what you already believe.",
  },
  {
    min: 25,
    name: "Significant blind spots",
    verdict: "There are important things about your own business you cannot currently see.",
    frame:
      "This is normal for a business that grew faster than its reporting did. Nothing here says the business is unhealthy; it says decisions are being made without the information that would make them safer.",
  },
  {
    min: 0,
    name: "Flying blind",
    verdict: "Most of the questions above do not currently have an answer.",
    frame:
      "More common than you would think, especially in businesses that have grown on relationships and hustle rather than reporting. It is also the cheapest situation to improve, because the first pass surfaces so much at once.",
  },
];

export function bandFor(score: number): Band {
  return bands.find((b) => score >= b.min) ?? bands[bands.length - 1]!;
}

export type RCResult = {
  score: number;
  band: Band;
  /** Questions answered with low confidence (score of 0 or 1). */
  gaps: RCQuestion[];
  /** The single biggest blind spot. Null when nothing scored below full marks. */
  blindSpot: RCQuestion | null;
  answered: number;
};

export function scoreAnswers(answers: Record<string, number>): RCResult {
  const answered = questions.filter((q) => answers[q.id] !== undefined);
  const total = answered.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  const max = answered.length * MAX_PER_QUESTION || 1;
  const score = Math.round((total / max) * 100);

  const gaps = answered.filter((q) => (answers[q.id] ?? 0) <= 1);

  const lowest = Math.min(...answered.map((q) => answers[q.id] ?? 0));
  const candidates = answered.filter((q) => (answers[q.id] ?? 0) === lowest);
  // No blind spot to name when every answer was full marks.
  const blindSpot =
    lowest >= MAX_PER_QUESTION
      ? null
      : candidates.sort((a, b) => priority.indexOf(a.id) - priority.indexOf(b.id))[0] ?? null;

  return { score, band: bandFor(score), gaps, blindSpot, answered: answered.length };
}
