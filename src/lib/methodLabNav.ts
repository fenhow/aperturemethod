/**
 * What is in the Method Lab, and how it is labelled.
 *
 * Plain data with no server imports, so the Lab's React chrome (a client
 * component) and the injector that wraps the gated HTML documents (server only)
 * can both read it. One list, one wording, one order.
 */

/** The stamp on everything behind the passphrase. */
export const METHOD_LAB_NOTICE =
  "Confidential · Internal & invited viewers only · Not for distribution";

/**
 * The stamp on the Lab pages that are public on purpose. They live in the Lab
 * and keep its header, but marking a page you hand to the cohort or to a
 * prospect "confidential" is a lie that makes the real stamp worthless.
 */
export const METHOD_LAB_PUBLIC_NOTICE = "Method Lab · Public page · Free to share";

/** Lab paths anyone may open. Mirrors PUBLIC_METHOD_LAB in src/middleware.ts. */
export const PUBLIC_METHOD_LAB_PATHS = [
  "/method-lab/financial-analysis-workbench",
  "/method-lab/coursework",
];

export function isPublicMethodLabPath(pathname: string): boolean {
  return PUBLIC_METHOD_LAB_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** The Lab's own navigation. Everything in here, nothing outside it. */
export const METHOD_LAB_NAV: { label: string; href: string }[] = [
  { label: "Workflow map", href: "/method-lab" },
  { label: "Coursework", href: "/method-lab/coursework" },
  { label: "Workbench", href: "/method-lab/workbench" },
  { label: "Published examples", href: "/method-lab/financial-analysis-workbench" },
  { label: "Customer & market map", href: "/method-lab/customer-market-map" },
  { label: "Study", href: "/method-lab/study" },
  { label: "Website check", href: "/method-lab/website" },
  { label: "Architecture", href: "/method-lab/architecture" },
  { label: "Reference", href: "/method-lab/reference" },
  { label: "Filings", href: "/method-lab/filings" },
];
