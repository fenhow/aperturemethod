/**
 * The Reality Check, a fifteen-question self-assessment of how well an owner
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
 *
 * SEPT 2026, the growth-plan question was retired. It asked whether the chosen
 * growth path had been weighed against alternatives, which is the same test the
 * decision-discipline question applies, and applies more sharply: one asks
 * whether you compared options, the other asks whether you modeled being wrong.
 * Compass is still represented. Do not re-add it without removing something.
 *
 * SEPT 2026, four questions added from the financial-statement analysis work:
 * margin of safety, owner-adjusted earnings, the price/volume trade-off, and
 * where the return actually comes from. They are here because each one is a
 * thing an owner can answer in a sentence, cannot fake, and usually has not
 * calculated. They are also the four that separate a real diagnostic from a
 * quiz: the rest of the list asks whether you have looked, these ask whether
 * the number you are looking at means what you think it means.
 *
 * The count is NOT written into copy anywhere. Three places used to state it
 * in words and two of them said "ten" while the array held eleven. Every
 * surface now reads QUESTION_COUNT / APPROX_MINUTES from this file.
 */

export type RCOption = { label: string; score: 0 | 1 | 2 | 3 | 4 };

/**
 * The teaching layer: the textbook metric sitting behind a plain-language question.
 *
 * SPLIT ON PURPOSE. `what` and `how` are shown ON the question, and they are
 * deliberately neutral: they define the metric and give the arithmetic, and say
 * nothing about what a good number looks like. `reading` is shown ONLY on the
 * results screen, because it is the part that would tell someone which answer to
 * pick. A Clarity Score that can be coached upward is not a mirror, and the
 * whole value of this instrument is that the honest answer is often "I would
 * have to look it up".
 */
export type RCExplainer = {
  /** What an accountant would call this. */
  metric: string;
  /** What the metric is, in plain language. Neutral. */
  what: string;
  /** How it is calculated. Neutral. */
  how: string;
  /** What the number tells you once you have it. Results screen only. */
  reading: string;
};

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
  /** The metric behind the question, for the "What is this?" panel. */
  explainer: RCExplainer;
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
    explainer: {
      metric: "The binding constraint",
      what:
        "The single limit that sets the pace of the whole business. Every operation has one. Until it moves, improvements made anywhere else do not show up in the result.",
      how:
        "Not a ratio. You find it by testing candidates against evidence: if this were lifted, what would measurably change, and does the data support that it is what is holding output down?",
      reading:
        "Naming it with evidence is the difference between a plan and a list. A business that cannot name its constraint tends to spread effort evenly across problems that do not deserve equal effort.",
    },
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
    explainer: {
      metric: "Segment profitability and operating profit margin",
      what:
        "Profit by product, service, location or customer group once shared overhead is allocated to each. Its whole-business cousin is operating profit margin, which measures what is left from revenue after the costs of actually running the business.",
      how:
        "For a line: its revenue, less its direct costs, less its fair share of overhead. For the business: operating profit margin = operating income \u00f7 revenue.",
      reading:
        "Revenue by line is common. Profit by line, after overhead, is rare, and it is where the surprises live. Most owner-run businesses carry at least one line that looks healthy on revenue and is quietly funded by the rest.",
    },
    blindSpot: {
      headline: "You are flying without profit visibility by line.",
      body: "Revenue by product is common. Profit by product, after overhead, is rare, and it is where the surprises live. Most owner-run businesses have at least one line that looks healthy on revenue and is quietly funded by the rest of the business.",
      cost: "Until this is allocated, every pricing, staffing and discontinue decision is being made on the wrong number.",
    },
  },
  {
    id: "owner-earnings",
    area: "What the profit really is",
    component: "Aperture Analytics™",
    prompt:
      "If you paid yourself a market salary, charged market rent on any property you own, and stripped out the one-off items, what would last year's profit be?",
    note: "In a private company, reported profit reflects tax decisions as much as performance.",
    options: [
      { label: "I know that number, and I could defend every adjustment", score: 4 },
      { label: "I have a sense of it, but I have never written it down", score: 2 },
      { label: "I know the adjustments exist; I have not quantified them", score: 1 },
      { label: "Profit is whatever the P&L says", score: 0 },
    ],
    explainer: {
      metric: "EBITDA, adjusted EBITDA and the effective tax rate",
      what:
        "EBITDA is earnings before interest, tax, depreciation and amortization: operating performance with financing and accounting choices stripped out. Adjusted EBITDA goes one step further and removes owner-specific items, so the number can be compared to another business.",
      how:
        "Start at net income, add back interest, tax, depreciation and amortization. Then normalize: owner pay to a market salary, related-party rent to market rent, one-off items out. Effective tax rate = tax expense \u00f7 pre-tax income, and in a pass-through it is close to zero, which is exactly why EBITDA rather than net income is the comparable figure.",
      reading:
        "This is the number a business is valued against and lent against, usually as a multiple of it. An owner who has not built it themselves ends up negotiating against a version somebody else constructed.",
    },
    blindSpot: {
      headline: "Your reported profit is not your real profit.",
      body: "In an owner-run company you set your own pay, you may rent the building to yourself, and some personal cost almost always runs through the business. Every one of those can be legitimate and every one moves the number. A buyer, a lender and a partner will each rebuild it their own way, and the owner who has not done it first ends up negotiating against a figure someone else constructed.",
      cost: "This is the number a business is bought against and lent against. Arriving at it late means somebody else decides what it is.",
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
    explainer: {
      metric: "Revenue concentration",
      what:
        "How much of your revenue depends on a small number of customers. The standard cuts are the top ten and the single largest.",
      how:
        "Revenue from the top ten customers \u00f7 total revenue. Repeat for the largest one on its own.",
      reading:
        "It is the first risk a buyer or a lender looks for, and it quietly sets how much pricing power you actually have. Owners routinely underestimate their own figure by a wide margin.",
    },
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
    explainer: {
      metric: "Cash conversion cycle, DSO and receivables turnover",
      what:
        "The number of days between paying for something and being paid for it. Days sales outstanding is the receivables half of it: how long your customers take to pay.",
      how:
        "Cash conversion cycle = DSO + days inventory outstanding \u2212 days payable outstanding. Receivables turnover = revenue \u00f7 average accounts receivable, and DSO is 365 divided by that, or equivalently (accounts receivable \u00f7 revenue) \u00d7 365.",
      reading:
        "Roughly one day of revenue is tied up for every day in the cycle. Splitting it into three parts matters because receivables, inventory and supplier terms are separate levers that respond to entirely different things.",
    },
    blindSpot: {
      headline: "You have cash locked in the operating cycle and no measure of how much.",
      body: "Almost every owner knows when cash is tight. Very few know the number of days causing it, which is what makes it fixable: receivables, stock and supplier terms are three separate levers, and they respond to different things. Until the cycle is split into its parts, tight cash looks like one problem instead of three.",
      cost: "Roughly one day of revenue is tied up for each day in the cycle. Pulling fifteen days out of a $5M business releases about a year's profit in cash, with no borrowing and no new customers.",
    },
  },
  {
    id: "margin-of-safety",
    area: "Margin of safety",
    component: "Aperture Analytics™",
    prompt: "How far could revenue fall before this business stops making money?",
    note: "Your break-even point, and the distance between it and where you are now.",
    options: [
      { label: "I know the number, in dollars and as a percentage", score: 4 },
      { label: "I know roughly where break-even sits", score: 2 },
      { label: "I know my costs, but I have never worked out the point", score: 1 },
      { label: "I have never calculated it", score: 0 },
    ],
    explainer: {
      metric: "Break-even and margin of safety",
      what:
        "Break-even is the revenue at which you make neither a profit nor a loss. Margin of safety is how far above that point you are sitting today.",
      how:
        "Break-even revenue = fixed costs \u00f7 contribution margin ratio, where the contribution margin ratio is (revenue \u2212 variable costs) \u00f7 revenue. Margin of safety = (current revenue \u2212 break-even revenue) \u00f7 current revenue.",
      reading:
        "It turns \u201ccash feels tight\u201d into a measured distance. It also prices every fixed commitment you take on: each one raises break-even and shortens the runway by an amount you can calculate in advance.",
    },
    blindSpot: {
      headline: "You do not know how much room you have.",
      body: "Break-even is fixed costs divided by the margin each sale contributes, and the gap between that point and today's revenue is your margin of safety. Without it, a slow quarter is just a feeling. With it, you know whether the quarter is uncomfortable or actually dangerous, and you know what each new fixed cost does to the distance.",
      cost: "It is an afternoon's arithmetic from a P&L you already have, and it changes how you judge every fixed commitment you take on.",
    },
  },
  {
    id: "pricing-power",
    area: "Pricing power",
    component: "Aperture Analytics™",
    prompt:
      "If you raised prices five percent, how much volume could you afford to lose before you were worse off?",
    note: "The answer depends on the margin each sale contributes, not on revenue.",
    options: [
      { label: "I know the percentage, and we have tested a rise against it", score: 4 },
      { label: "I could work it out if I sat down with the numbers", score: 2 },
      { label: "I know a rise would help, but not by how much or what it would cost", score: 1 },
      { label: "We price off our costs, or off what competitors charge", score: 0 },
    ],
    explainer: {
      metric: "Contribution margin and the price/volume trade-off",
      what:
        "How much volume you could lose after raising prices before you are worse off than you were. It turns on contribution margin, not on revenue.",
      how:
        "Tolerable volume loss = price rise \u00f7 (contribution margin ratio + price rise). At a forty percent contribution margin, a five percent rise tolerates 0.05 \u00f7 0.45, which is 11.1 percent.",
      reading:
        "A price change carries almost no cost to deliver, so nearly all of it reaches the bottom line, which is why a few points of price usually beats a large volume win. The arithmetic is counterintuitive, and owners consistently assume the tolerable loss is far smaller than it is.",
    },
    blindSpot: {
      headline: "Price is your strongest lever and it is the one you are not measuring.",
      body: "A price rise carries almost no cost to deliver, so nearly all of it reaches the bottom line. The arithmetic is genuinely counterintuitive: at a forty percent contribution margin, a five percent rise can lose more than eleven percent of volume and still leave you ahead. Owners consistently guess that the tolerable loss is far smaller than it is, and price too low as a result.",
      cost: "Underpricing compounds on every invoice, quietly, and it is the fastest thing on this list to reverse.",
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
    explainer: {
      metric: "Repeat rate and customer lifetime value",
      what:
        "The share of customers who buy more than once, and what a customer is worth across the whole relationship rather than on a single sale.",
      how:
        "Repeat rate = customers with more than one purchase \u00f7 total customers in the period. Lifetime value \u2248 average order value \u00d7 purchases per year \u00d7 years retained \u00d7 contribution margin.",
      reading:
        "Retention is the most commonly missed constraint in owner-run businesses, because the symptom looks like a marketing problem. Growth flattens, more is spent on acquisition, and the open back door stays hidden.",
    },
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
    explainer: {
      metric: "Market penetration and trade area",
      what:
        "How much of the demand inside the area you actually serve belongs to you, and how many direct competitors are sharing it.",
      how:
        "Penetration = your customers \u00f7 qualified households or businesses inside the trade area. The trade area itself is normally drawn by drive time rather than by radius, because that is how people actually travel.",
      reading:
        "Most owners know their competitors by name and almost none know their penetration by area. That gap hides two things at once: where you are already winning and should press, and where demand exists that nobody is serving.",
    },
    blindSpot: {
      headline: "You are competing without a map.",
      body: "Most owners know their competitors by name and almost none know their penetration by area. That gap hides two things at once: where you are already winning and should press, and where demand exists that nobody is serving.",
      cost: "Expansion and marketing spend get aimed by intuition rather than by where the demand actually is.",
    },
  },
  {
    id: "return-drivers",
    area: "Where the return comes from",
    component: "Aperture Analytics™",
    prompt:
      "Your return on the money tied up in this business comes from three places: the margin on each sale, how hard the assets work, and how much borrowing is amplifying both. Which one is doing the work?",
    options: [
      { label: "I know which of the three drives my return, and which has slipped", score: 4 },
      { label: "I watch margin closely; the other two much less", score: 2 },
      { label: "I look at profit, not at return on what is invested", score: 1 },
      { label: "I have never thought about it that way", score: 0 },
    ],
    explainer: {
      metric: "DuPont: return on assets, profit margin, asset turnover",
      what:
        "Return on assets splits into two things you control separately: the margin you earn on each sale, and how many sales you generate from each dollar of assets. Add borrowing and it extends to return on equity.",
      how:
        "ROA = profit margin \u00d7 asset turnover, where profit margin = net income \u00f7 revenue and asset turnover = revenue \u00f7 average total assets. ROE = ROA \u00d7 (average assets \u00f7 average equity), the last term being the leverage multiplier.",
      reading:
        "Two businesses can report the same return while one earns it on margin and the other borrows its way there. Separating the three tells you which, and that decides whether you have a pricing problem, an idle-asset problem or a balance-sheet problem.",
    },
    blindSpot: {
      headline: "You cannot tell a good year from a borrowed one.",
      body: "Two businesses can report the same return while one earns it on margin and the other borrows its way there. Split the return into margin, asset productivity and leverage and the difference is obvious, and so is the fix: a pricing problem, an idle-asset problem and a balance-sheet problem look identical until they are separated. Leverage flatters the result every year until the one where it does not.",
      cost: "Improvement effort goes to the wrong lever, and the business looks healthier than it is for as long as rates and lenders stay friendly.",
    },
  },
  {
    id: "asset-reinvestment",
    area: "Replacing what wears out",
    component: "Aperture Analytics\u2122",
    prompt:
      "Are you spending enough on equipment, vehicles and premises to replace what is wearing out, or has that spending fallen behind?",
    note: "What you spend on assets each year, set against the depreciation you book against them.",
    options: [
      { label: "I track it against depreciation, and I know how much life is left in what we own", score: 4 },
      { label: "I know roughly whether we are keeping up", score: 2 },
      { label: "We spend when something breaks, or when an opportunity comes up", score: 1 },
      { label: "I have never looked at it that way", score: 0 },
    ],
    explainer: {
      metric: "CAPEX-to-depreciation, PP&E percent used up, average useful life",
      what:
        "Whether you are replacing equipment, vehicles and premises as fast as they wear out, and how much life is left in what you already own.",
      how:
        "CAPEX-to-depreciation = capital expenditure \u00f7 depreciation expense. Percent used up = accumulated depreciation \u00f7 gross PP&E. Average useful life \u2248 gross PP&E \u00f7 annual depreciation expense.",
      reading:
        "A CAPEX-to-depreciation ratio held below 1.0 for several years means the asset base is shrinking, and it shows up as strong cash flow long before it shows up as a problem. Read it alongside percent used up: a base that is both heavily depreciated and under-replaced has a bill coming.",
    },
    blindSpot: {
      headline: "Your asset base may be quietly running down.",
      body: "When capital spending sits below depreciation year after year, the business is consuming equipment it is not replacing. That does not look like a problem while it is happening. It looks like unusually strong cash flow, for several years, until the replacement cycle arrives all at once. The matching figure is how used up the assets already are: accumulated depreciation measured against what they originally cost.",
      cost: "It is the most common reason a profitable business cannot fund its own replacement cycle, and it is discovered in the year it can least afford to be.",
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
    explainer: {
      metric: "Sensitivity and scenario analysis",
      what:
        "Testing a decision against the possibility of being wrong, before you commit: what happens to profit and to cash if volume, price or cost move against you.",
      how:
        "Move one input at a time to find which ones the answer is most sensitive to, then build a downside case around the worst two or three together, and set in advance the trigger that would tell you to stop.",
      reading:
        "Experienced owners are usually right, which is what makes this dangerous. The one time the instinct is wrong there is no early warning and no agreed trigger, so the cost is paid in full months later, when reversing is at its most expensive.",
    },
    blindSpot: {
      headline: "Big decisions are being made without a downside case.",
      body: "Experienced owners are often right, which is exactly what makes this dangerous: the one time the instinct is wrong, there is no early warning and no pre-agreed trigger to stop. Modeling the downside is not pessimism; it is knowing in advance what would tell you to change course.",
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
    explainer: {
      metric: "KPI targets and variance",
      what:
        "Numbers watched every month that each carry a target, a named owner and a threshold, so the number can say whether things are going well rather than only what happened.",
      how:
        "Variance = actual less target, judged against a threshold that turns it red, amber or green. Five to ten measures is usually the right count; more than that and none of them get watched.",
      reading:
        "A number without a target is a fact, not a signal. Without owners and thresholds, drift is only visible once it is large enough to feel, and by then a quarter has usually gone.",
    },
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
    explainer: {
      metric: "Quality of earnings and reconciled financials",
      what:
        "Whether three years of your financials would survive an outsider checking them: tied to the bank, consistent between periods, and supported by the records underneath.",
      how:
        "Not a ratio. The test is whether every balance traces to a source, whether the accounting policies are the same across all three years, and whether every adjustment is documented and explainable.",
      reading:
        "Not urgent right up until the day it is: an unsolicited offer, a covenant test, a partner exit. Buyers and lenders discount what they cannot verify quickly, and that discount is almost always larger than the cost of fixing it.",
    },
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
    explainer: {
      metric: "Measurable return on tooling",
      what:
        "Whether AI is producing a saving you can point at in hours or dollars, rather than being present in the business but unquantified.",
      how:
        "Name the task, measure the time or cost before and after, and net off the licence and setup cost. If it cannot be measured, it is not yet earning its place.",
      reading:
        "The answer is never simply more AI; it is AI in the two or three places where the return is measurable. It is easy to get wrong in both directions: spending on tools that do nothing, or avoiding it entirely while competitors compound small advantages.",
    },
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
  "margin-of-safety",
  "cash-cycle",
  "owner-earnings",
  "pricing-power",
  "retention",
  "concentration",
  "kpis",
  "return-drivers",
  "asset-reinvestment",
  "market",
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

/**
 * How many questions there are, and roughly how long that takes.
 *
 * Both are DERIVED. Before this existed the homepage said "11 questions", the
 * quiz itself said "Ten questions" and the page description said "Ten
 * questions you cannot bluff", while the array held eleven. Three surfaces,
 * three different claims, none of them checked by anything. Import these
 * rather than typing a number or a word into copy.
 */
export const QUESTION_COUNT = questions.length;

/** About fifteen seconds a question, rounded to the nearest minute, floor of three. */
export const APPROX_MINUTES = Math.max(3, Math.round((QUESTION_COUNT * 15) / 60));
