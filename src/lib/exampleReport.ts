/**
 * The bound example report, and where each section starts inside it.
 *
 * WHY THIS FILE EXISTS. Five files carried their own copy of the PDF path and
 * their own hard-coded page numbers, and when the report was rebuilt, growing
 * from roughly forty pages to eighty as the analytics were deepened, every one
 * of them silently went stale. "See a real Business X-Ray in the example
 * report" opened page 10, which is in the middle of the Company Profile. A
 * prospect clicking the single most important proof link on the site landed on
 * the wrong document.
 *
 * VERIFIED 18 September 2026 against the report's own contents page, and then
 * each target page was opened and its heading checked. Do not edit these by
 * hand from memory. Rebuild the bundle, read its contents page, and copy the
 * numbers across.
 *
 *   Section                              Page
 *   What this engagement delivers           3
 *   Company Profile                         7
 *   Business X-Ray                         13
 *   Profit Map                             23
 *   Customer & Market Map                  49
 *   GIS Layer Guide                        57
 *   Opportunity Matrix & Focus Plan        67
 *   Scoreboard & KPI System                74
 */

export const EXAMPLE_REPORT = "/reports/Lumina-Aperture-Method-Example-Report.pdf";

/** Total pages in the bound volume. Quoted in copy, so it lives here too. */
export const EXAMPLE_REPORT_PAGES = 80;

/**
 * First page of each section, 1-indexed, as the PDF viewer counts them.
 *
 * `contents` is the landing spot for a general "read the whole report" link:
 * page one is a cover with nothing to act on, and the contents page lets a
 * reader choose where to go.
 */
export const reportPages = {
  contents: 2,
  overview: 3,
  companyProfile: 7,
  businessXRay: 13,
  profitMap: 23,
  marketMap: 49,
  gisLayerGuide: 57,
  opportunityMatrix: 67,
  focusPlan: 67,
  scoreboard: 74,
} as const;
