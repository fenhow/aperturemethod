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
