import { serveMethodLabDocument } from "@/lib/methodLabChrome";

/**
 * Serves "Working from Public Filings" as a viewable page.
 *
 * Same posture as the Canonical Architecture Reference: the file lives in
 * `private/method-lab/` rather than `public/`, so it cannot be reached by
 * guessing a URL, and access is gated upstream in `src/middleware.ts`.
 *
 * This one is gated for a different reason from the others. It is not secret,
 * it is unfinished thinking about how illustrative examples get built, and a
 * half-formed working procedure read by a prospect as a published standard is
 * worse than no procedure at all.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The shared Method Lab bar and footer are added by serveMethodLabDocument, so
 * every document in the Lab opens with the same chrome and the same wording.
 */
export async function GET() {
  return serveMethodLabDocument("filings.html");
}
