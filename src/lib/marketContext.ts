/**
 * The market context: who this firm is for, and the published data behind it.
 *
 * Every figure here was checked against the source document before it was
 * written down, and each one carries its citation and its reference year. That
 * is not pedantry. A statistic attributed to a federal agency is the easiest
 * thing on a website for a sceptical reader to look up, and the fastest way to
 * lose them is a number that does not match the source it names.
 *
 * Two rules for anyone adding to this file:
 *
 *  1. No figure goes in without a source and a data year. If it cannot be
 *     cited, it is an opinion and belongs in prose, not in this file.
 *  2. Do not reach for a bigger number than the one the source supports.
 *     There is a widely repeated claim that small businesses create close to
 *     nine in ten net new jobs. That is true of one measured year and is not
 *     the long-run figure, which is 61 percent. Both are below, labelled.
 */

export type Source = {
  id: string;
  publisher: string;
  title: string;
  url: string;
  /** When the document was published. */
  published: string;
  /** The year the underlying data describes, which is usually earlier. */
  dataYear: string;
};

export const SOURCES = {
  faq2026: {
    id: "faq2026",
    publisher: "U.S. Small Business Administration, Office of Advocacy",
    title: "Frequently Asked Questions About Small Business, 2026",
    url: "https://advocacy.sba.gov/2026/02/03/frequently-asked-questions-about-small-business-2026/",
    published: "February 2026",
    dataYear: "2022",
  },
  advocacy2025: {
    id: "advocacy2025",
    publisher: "U.S. Small Business Administration, Office of Advocacy",
    title: "New Advocacy Report Shows the Number of Small Businesses in the U.S. Exceeds 36 Million",
    url: "https://advocacy.sba.gov/2025/06/30/new-advocacy-report-shows-the-number-of-small-businesses-in-the-u-s-exceeds-36-million/",
    published: "June 2025",
    dataYear: "March 2023 to March 2024",
  },
  bea2q26: {
    id: "bea2q26",
    publisher: "U.S. Bureau of Economic Analysis",
    title: "Gross Domestic Product, 2nd Quarter 2026 (Advance Estimate)",
    url: "https://www.bea.gov/news/2026/gdp-advance-estimate-2nd-quarter-2026",
    published: "July 30, 2026",
    dataYear: "second quarter 2026",
  },
} satisfies Record<string, Source>;

export type Figure = {
  /** The number as it should be printed. */
  value: string;
  /** What it measures, in a phrase that can follow the number. */
  label: string;
  source: keyof typeof SOURCES;
  /** Overrides the source's data year where the figure is measured differently. */
  dataYear?: string;
};

export const FIGURES = {
  count: {
    value: "36.2 million",
    label: "small businesses operating in the United States",
    source: "faq2026",
  },
  shareOfBusinesses: {
    value: "99.9%",
    label: "of all American firms",
    source: "faq2026",
  },
  employees: {
    value: "62.3 million",
    label: "people employed by them",
    source: "faq2026",
  },
  shareOfWorkers: {
    value: "45.9%",
    label: "of private-sector employees",
    source: "faq2026",
  },
  /**
   * The level, at a seasonally adjusted annual rate. Printed to three
   * significant figures because the fourth moves with every revision and a
   * website that quotes it to the decimal is claiming a precision it will not
   * maintain. The exact release figure lives in GDP_RUN_RATE below.
   */
  gdp: {
    value: "$32.5 trillion",
    label: "of gross domestic product a year",
    source: "bea2q26",
  },
  shareOfGdp: {
    value: "43.5%",
    label: "of gross domestic product",
    source: "faq2026",
  },
  shareOfPayroll: {
    value: "38.7%",
    label: "of private-sector payroll, some $3.5 trillion",
    source: "faq2026",
  },
  /**
   * The long-run figure, and the one to use by default. Measured January 1995
   * to December 2024: 20.7 million net new jobs from small business against
   * 13.2 million from large.
   */
  netNewJobs: {
    value: "61%",
    label: "of net new jobs created since 1995",
    source: "faq2026",
    dataYear: "1995 to 2024",
  },
  /**
   * The single-year figure. Accurate, frequently quoted without its window,
   * and misleading the moment that window is dropped. If it is used, the year
   * must travel with it.
   */
  netNewJobsSingleYear: {
    value: "roughly nine in ten",
    label: "net new jobs, in the year to March 2024",
    source: "advocacy2025",
    dataYear: "March 2023 to March 2024",
  },
  /*
   * `satisfies` rather than an annotation: it type-checks every entry against
   * Figure while keeping the individual keys known, so FIGURES.count is a
   * property rather than a lookup that might miss.
   */
} satisfies Record<string, Figure>;

/**
 * The GDP run rate, which is not a live reading and must never be dressed as
 * one.
 *
 * There is no real-time measurement of American economic output. BEA publishes
 * GDP quarterly; the figure below is the Q2 2026 advance estimate at a
 * seasonally adjusted annual rate, and it will be revised. Dividing it by the
 * seconds in a year gives a rate of production. That is arithmetic on a
 * published number and nothing more.
 *
 * Anything on this site that moves against this figure has to say so in those
 * words. A counter that implies it is watching the economy tick would be the
 * same offence this file exists to prevent: an estimate wearing the clothes of
 * a measurement, on a site whose whole argument is that the analysis is honest.
 */
export const GDP_RUN_RATE = {
  /** Current-dollar GDP, seasonally adjusted annual rate, in dollars. */
  annualUsd: 32_475_210_000_000,
  /** Small business share of GDP. Same source as FIGURES.shareOfGdp. */
  smallBusinessShare: 0.435,
  /** Mean Gregorian year, so the divisor does not drift on leap years. */
  secondsPerYear: 31_556_952,
  source: "bea2q26",
  quarter: "second quarter 2026",
} as const;

/** All US output, dollars per second, at the published annual rate. */
export const GDP_PER_SECOND = GDP_RUN_RATE.annualUsd / GDP_RUN_RATE.secondsPerYear;

/** The small business share of that, dollars per second. */
export const SMALL_BUSINESS_GDP_PER_SECOND =
  GDP_PER_SECOND * GDP_RUN_RATE.smallBusinessShare;

/** The citation line for a figure, ready to print. */
export function citationFor(key: keyof typeof FIGURES): string {
  const figure: Figure = FIGURES[key];
  const source = SOURCES[figure.source as keyof typeof SOURCES];
  return `${source.publisher}, ${source.title}. Data year ${figure.dataYear ?? source.dataYear}.`;
}

// ---------------------------------------------------------------------------
// The segment
// ---------------------------------------------------------------------------

/**
 * Deliberately no count of businesses in the $1M to $20M band.
 *
 * The published business counts are built on employment size, not revenue,
 * and the Census receipts brackets do not line up with this range. A figure
 * could be constructed, but it would be an estimate wearing the clothes of a
 * statistic, and this file does not do that.
 */
export const SEGMENT = {
  floor: "$1 million",
  ceiling: "$20 million",
  range: "$1M to $20M",
  descriptor: "established privately held businesses",
} as const;

/** What a business at this size has already built. */
export const ALREADY_HAS: string[] = [
  "Employees, and the payroll to prove it",
  "Customers, and years of history with them",
  "Financial statements and an operating record",
  "Multiple products, services or locations",
  "Vendors, supply chains and real logistics",
  "Processes and systems that work",
  "More business data than anyone has time to read",
];

/** What it has usually not built, because the size does not yet justify it. */
export const USUALLY_LACKS: string[] = [
  "A chief financial officer",
  "A chief strategy officer",
  "Financial planning and analysis",
  "Business intelligence staff or data scientists",
  "Dedicated market analysts",
  "Integrated dashboards and KPI systems",
  "Formal strategic planning resources",
];

/** What a large company buys as departments, and this firm brings as one system. */
export const BIG_COMPANY_CAPABILITIES: string[] = [
  "Strategic planning",
  "Financial planning and analysis",
  "Business intelligence",
  "Market research",
  "Data analytics",
  "Geographic intelligence",
  "Performance management",
  "Executive dashboards",
];
