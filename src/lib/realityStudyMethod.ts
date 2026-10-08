import { ALPHA, MIN_N_FOR_SHARE, MIN_N_FOR_VERDICT } from "@/lib/stats";
import { H1_THRESHOLD, H2_THRESHOLD, MIN_SECONDS } from "@/lib/realityStudyStats";

/**
 * How each headline figure is worked out, in plain words.
 *
 * Written here rather than in the page so the dashboard, the PDF and anyone
 * asking "where does that number come from?" all read the same answer, and so
 * the thresholds quoted are the constants the arithmetic actually uses. If a
 * rule changes in realityStudyStats.ts, change the matching sentence here in
 * the same commit.
 */

export type MethodNote = { h: string; p: string }[];

/** The sample rules, identical for every figure on the dashboard. */
const SAMPLE: MethodNote[number] = {
  h: "Who is counted",
  p: `Completed runs of the study version of the Clarity Check. Removed before anything is calculated: runs tagged as a test, repeat attempts, anything finished in under ${MIN_SECONDS} seconds, and any response excluded by hand on this dashboard with a reason attached. The count of what was removed, and why, is listed under the progress bar.`,
};

const CI: MethodNote[number] = {
  h: "What the confidence interval means",
  p: "The 95% interval is the range the true share could plausibly sit in, given this many answers (Wilson method, which behaves sensibly at small samples and near 0% or 100%). A wide interval is not a mistake; it is the honest width at this sample size, and it narrows as answers come in.",
};

const P: MethodNote[number] = {
  h: "What p means",
  p: `p is the chance of seeing a result at least this far from the falsification line if the line were exactly true. Below ${ALPHA} counts as statistically significant here. No verdict is given at all until ${MIN_N_FOR_VERDICT} answers, and no percentage is shown under ${MIN_N_FOR_SHARE}, because one or two answers read as 0% or 100% and mean neither.`,
};

export const VERDICT_NOTE: MethodNote = [
  {
    h: "What the tag means",
    p: `No data yet: nobody has answered. Early signal: fewer than ${MIN_N_FOR_VERDICT} answers, so the figure is reported but no verdict is drawn. Not yet conclusive: enough answers, but the interval still straddles the falsification line. Statistically supported: we can be 95% confident the true share is above the line. Statistically rejected: 95% confident it is below.`,
  },
  {
    h: "Why a verdict waits",
    p: `A handful of answers can sit anywhere. Holding the verdict until ${MIN_N_FOR_VERDICT} answers, and holding the percentage itself until ${MIN_N_FOR_SHARE}, stops an early run of agreeable respondents from reading as proof. The tag moves on its own as answers arrive; nobody sets it by hand.`,
  },
  {
    h: "The test behind it",
    p: `One-sided exact binomial against the registered falsification line, at ${ALPHA}. Exact rather than normal-approximate, because at these sample sizes the approximation is not trustworthy. The curve on the card is the normal approximation, drawn to show the spread; the p-value is not taken from it.`,
  },
];

export const H1_NOTE: MethodNote = [
  {
    h: "The question behind it",
    p: "“Who analyses your numbers today?”, asked in the profile after the result. Counted as a yes: no one, only my bookkeeper or CPA, or software alone. Counted as a no: an in-house analyst or finance lead, or an outside analyst or consultant.",
  },
  {
    h: "Who is in the pool",
    p: "Respondents whose revenue band is $1M–20M. Everyone else is left out of this figure entirely rather than counted as a no.",
  },
  {
    h: "The arithmetic",
    p: `Yes answers divided by everyone in the pool who answered the question. H1 is falsified if fewer than ${H1_THRESHOLD}% report no access, so the test asks whether the true share is above ${H1_THRESHOLD}% (one-sided exact binomial).`,
  },
  SAMPLE,
  CI,
  P,
];

export const H2_NOTE: MethodNote = [
  {
    h: "The question behind it",
    p: "“How much would an outside view of these numbers help your business right now?”, asked after the result, with no brand and no price attached. Counted as a yes: Somewhat, or A lot. Counted as a no: Not at all, or A little.",
  },
  {
    h: "Who is in the pool",
    p: "Only the people the service is for: owners and founders, or co-owners and partners, at businesses of $1M or more. A respondent outside that group is not counted as a no; they are not counted at all. Their answers appear in the “all respondents” line underneath, which is context, not the test.",
  },
  {
    h: "The arithmetic",
    p: `Yes answers divided by everyone in that pool who answered. The measure is not supported if ${H2_THRESHOLD}% or fewer say an outside view would help, so the test asks whether the true share is above ${H2_THRESHOLD}% (one-sided exact binomial).`,
  },
  {
    h: "What this does not measure",
    p: "Willingness to pay. This figure is about need, not money. Payment is tested in real sales conversations, where H2 is falsified if fewer than 1 in 8 qualified conversations convert. The retired price question is reported separately and never pooled into this number.",
  },
  SAMPLE,
  CI,
  P,
];
