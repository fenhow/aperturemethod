import { serveMethodLabDocument } from "@/lib/methodLabChrome";

/**
 * Serves the Master Process Architecture as a viewable page.
 *
 * Same posture as the Agent Workflow Map at /method-lab: the file lives in
 * `private/method-lab/` rather than `public/`, so it cannot be reached by
 * guessing a URL, and access is gated upstream in `src/middleware.ts`.
 *
 * The document is a single self-contained HTML file with its diagrams already
 * rendered to inline SVG: no external scripts, no CDN, nothing to load.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The shared Method Lab bar and footer are added by serveMethodLabDocument, so
 * every document in the Lab opens with the same chrome and the same wording.
 */
export async function GET() {
  return serveMethodLabDocument("architecture.html");
}
