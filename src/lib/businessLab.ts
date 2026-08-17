/**
 * Aperture Business Lab, the free guest-speaker session Fenwick runs for schools.
 *
 * Deliberately NOT part of the commercial content model. It is given away: no
 * fee, nothing sold to students, no student data collected. Content lives here
 * so the page, the homepage band and the About card all read from one source.
 *
 * Note on voice: this page speaks as "I", not "we". A teacher is deciding
 * whether to let a specific person into a room, and a firm cannot walk through
 * a classroom door.
 *
 * Naming: the programme is Aperture Business Lab, powered by The Aperture
 * Method. The classroom exercise inside it has its own name, "Think Like a
 * CEO. Make the Call.", so a teacher can put the activity on a lesson plan
 * without putting a firm's brand on it.
 */

export const businessLab = {
  slug: "/business-lab",
  name: "Aperture Business Lab",
  /** Rendered with the trademark where the brand is being introduced. */
  nameTm: "Aperture Business Lab\u2122",
  /** The parent it inherits its method from. */
  poweredBy: "Powered by The Aperture Method\u2122",
  /** The three-beat promise. Used under the name, never as body copy. */
  promise: "See the Business. Find the Opportunity. Make the Decision.",
  /** The classroom exercise itself, the thing a teacher writes on the plan. */
  exercise: "Think Like a CEO. Make the Call.",
  eyebrow: "A free guest-speaker session \u00b7 grades 8\u201312",
  tagline: "One class period. Your students find what a business owner can't see.",
  grades: "Grades 8\u201312",
  minutes: 50,
  workingMinutes: 23,
  /** The one thing a student leaves with, in their own voice. */
  takeaway: "I could actually do this.",
  /** Where it slots into a school's timetable. */
  fits: "Economics \u00b7 Principles of Business, Marketing & Finance \u00b7 Entrepreneurship \u00b7 Money Matters and personal financial literacy \u00b7 career exploration and advisory \u00b7 DECA and FBLA chapters",
} as const;

/** The three ideas the session teaches. Never more than three. */
export const businessLabIdeas: { label: string; title: string; body: string }[] = [
  {
    label: "The bottleneck",
    title: "Every business has one thing holding it back.",
    body: "Find that one thing and you can fix the whole business. It is as true of a lemonade stand as it is of a company with four thousand employees.",
  },
  {
    label: "Busy is not paid",
    title: "Being busy and making money are not the same thing.",
    body: "Most adults have never separated these two. One card in the set does nothing but take that idea apart, slowly, with a lawn mower.",
  },
  {
    label: "Counting beats talent",
    title: "You find it by counting, not by being a genius.",
    body: "Counting is free, it takes no talent, and almost nobody does it. That is the whole trade, and a fifteen-year-old can start today.",
  },
];

/** The 50 minutes, as a teacher would want to see them. */
export const businessLabRunOfShow: { time: string; title: string; body: string }[] = [
  {
    time: "0–5",
    title: "The hook",
    body: "Two coffee shops on the same street. One made $240,000 last year; the other closed in March. Standing on the sidewalk, could you tell which was which?",
  },
  {
    time: "5–12",
    title: "The five lenses",
    body: "Who · Money · The Thing · Who Does the Work · Where & When. Plus the idea the whole hour turns on: a second cashier does not help if there is only one fryer.",
  },
  {
    time: "12–27",
    title: "The work",
    body: "Teams of three get a business card and fifteen minutes. Name ONE thing holding that business back, and point to the fact that proves it.",
  },
  {
    time: "27–35",
    title: "The share-out",
    body: "Sixty seconds a team, timed out loud. Bottleneck, evidence, fix. Six teams, six different answers on the board.",
  },
  {
    time: "35–45",
    title: "The payoff",
    body: "What each fix is actually worth, per year, in dollars. This is where numbers stop being homework.",
  },
  {
    time: "45–50",
    title: "The close",
    body: "It is a real job that real people get paid for, and three things students can start doing this week without permission from anyone.",
  },
];

/**
 * The six businesses. Every one is invented. The originals are set in The
 * Woodlands, and they get rewritten for whatever town the class is in.
 */
export const businessLabCards: { name: string; where: string; teaser: string }[] = [
  {
    name: "Waterway Waffle Co.",
    where: "A walk-up window downtown",
    teaser: "4.7 stars, a line out to the sidewalk, and forty people who gave up and walked away last Saturday.",
  },
  {
    name: "Creekside Cuts",
    where: "A barbershop in a strip center",
    teaser: "Two thousand four hundred customers last year. Sixteen hundred of them came exactly once.",
  },
  {
    name: "Panther Creek Lawn Crew",
    where: "Two seniors and a trailer",
    teaser: "Eight yards, a full Saturday, and $5.50 an hour each. Nobody has ever said the price was too high.",
  },
  {
    name: "Alden Bridge Bakehouse",
    where: "A bakery off the main road",
    teaser: "Fourteen cake orders turned down last month. The reason written on every one: “Maria didn't have time.”",
  },
  {
    name: "Town Green Smoothie Bar",
    where: "Beside the concert venue",
    teaser: "Twelve thousand people walk past on a concert night. The shop is dark and locked.",
  },
  {
    name: "Kickback Sneakers",
    where: "Second floor, no sign at street level",
    teaser: "4.9 stars, an owner who knows more about sneakers than anyone in the county, and nobody has heard of it.",
  },
];

export type PacketItem = {
  file: string;
  title: string;
  blurb: string;
  pages: string;
  /**
   * Gated items ask for name, school and email before the link appears. Set to
   * `false` to open a file to everyone. The download UI reads this and nothing
   * else, so opening the whole set up later is a one-word edit.
   */
  gated: boolean;
};

const DIR = "/business-lab";

export const businessLabPacket: PacketItem[] = [
  {
    file: `${DIR}/business-lab-overview.pdf`,
    title: "Program overview",
    blurb: "Two pages to forward to a principal, department head or CTE director: what the session teaches, how the period runs, who I am, and what I'll need from you.",
    pages: "2 pages · PDF",
    gated: false,
  },
  {
    file: `${DIR}/business-lab-business-cards.pdf`,
    title: "The six business cards",
    blurb: "One business per page: exactly what your students are handed. Everything a team needs is on the card; there is no missing information and no trick.",
    pages: "8 pages · PDF",
    gated: true,
  },
  {
    file: `${DIR}/business-lab-student-worksheet.pdf`,
    title: "Student worksheet",
    blurb: "The five lenses, room to work the arithmetic, and the three sentences every team has to be able to say out loud.",
    pages: "4 pages · PDF",
    gated: true,
  },
  {
    file: `${DIR}/business-lab-facilitator-guide.pdf`,
    title: "The lesson plan I run from",
    blurb: "Minute by minute, what goes on the board, the wrong answers I expect and what I say back, so you know how the period will go before you hand it to me.",
    pages: "12 pages · PDF",
    gated: true,
  },
  {
    file: `${DIR}/business-lab-answer-key.pdf`,
    title: "Answer key",
    blurb: "What each card is really about, the arithmetic behind it, and what the fix is worth per year, so you can follow along, or push a team further than I do.",
    pages: "10 pages · PDF",
    gated: true,
  },
];
