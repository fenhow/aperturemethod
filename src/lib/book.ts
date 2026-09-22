/**
 * The Aperture Method book: one place for the facts the cover, the 3D book and
 * the /book page all read, so a co-author name is typed once.
 *
 * Contributors: Fenwick is writing with three subject-matter experts. Until a
 * name is confirmed, leave `name` as null. The cover then reads "with
 * contributors in Accounting · Marketing · Technology" and /book shows
 * the seat as "to be announced". Nothing invented is ever shown as a person.
 */
export type BookContributor = {
  area: "Accounting" | "Marketing" | "Technology";
  /** Confirmed co-author's name, or null until announced. */
  name: string | null;
  /** One line on what they bring, shown on /book once named. */
  focus: string;
};

export const bookContributors: BookContributor[] = [
  {
    area: "Accounting",
    name: null,
    focus: "Reading the statements, measuring what matters, and trusting the numbers you decide on.",
  },
  {
    area: "Marketing",
    name: null,
    focus: "Knowing who your best customers are, where they come from, and how to find more of them.",
  },
  {
    area: "Technology",
    name: null,
    focus: "The data, dashboards and AI that keep the picture current after the analysis is done.",
  },
];

/** Front-cover art (photo only; all type is live HTML so names can change). */
export const BOOK_COVER_ART = "/book/cover-art.jpg";

/** "with A · B · C" once all are named, otherwise the areas. */
export function contributorLine(): string {
  const named = bookContributors.filter((c) => c.name);
  if (named.length === bookContributors.length) {
    return `with ${named.map((c) => c.name).join(" · ")}`;
  }
  return `with contributors in ${bookContributors.map((c) => c.area).join(" · ")}`;
}

/**
 * The teaser excerpt shown on /book (Chapter One, "The Intelligence Gap").
 * The owner in paragraph three is a hypothetical ("picture the owner"), not a
 * client, and the passage carries no statistics, so nothing here needs a source.
 */
export const bookExcerpt = {
  chapter: "Chapter One",
  title: "The Intelligence Gap",
  lead: "Big companies don't outgrow you because they're smarter. They outgrow you because they can see.",
  paragraphs: [
    "Walk into the headquarters of any national chain and you'll find people whose whole job is to answer questions most owners never get to ask. Which products actually make money once you count the time they take? Which customers cost more to keep than they're worth? Which neighborhoods are full of people who look exactly like your best customers and have never heard your name? They have analysts, finance teams, market data and maps. They make decisions with the lights on.",
    "Now picture the owner down the street. She has been in business eleven years. She knows every regular by name, can tell you which supplier is late before the truck arrives, and has kept the doors open through things that would have closed a lesser operation. She is not short on intelligence. She is short on visibility. Her numbers arrive once a month, a few weeks late, in a format built for her tax return, not her decisions. So she runs on instinct, and instinct is good. It is just not enough anymore.",
    "That is the gap this book is about. Not effort, not talent, not work ethic. Sight.",
    "Here is what I have learned, and it surprised me: the owner-run business usually already has the data. It is sitting in the accounting software, the point-of-sale system, the customer list, the calendar. What it lacks is a method. A way of asking the questions in the right order, so that each answer makes the next question sharper.",
    "The Aperture Method is that order. First, understand where the business really stands, broadly and honestly. Then quantify what is driving the numbers. Then reveal the customers and markets you can't see from behind the counter. Then decide where to focus, which almost always means deciding what not to do. And finally, keep the picture current, so the clarity doesn't fade the week after the work is done.",
  ],
  close: "None of this requires becoming a big company. It requires seeing like one.",
};
