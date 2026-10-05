import { serveMethodLabDocument } from "@/lib/methodLabChrome";

/**
 * Serves the Aperture Analytics Financial Analysis Workbench, the tool itself.
 *
 * This is the delivery IP: it is what turns a set of statements into a 44-page
 * analysis in hours rather than days, and anyone holding the file can reproduce
 * that without us. So it sits in `private/method-lab/` and is gated upstream in
 * `src/middleware.ts`, exactly like the Agent Workflow Map.
 *
 * The two worked examples it produced ARE public, at
 * /method-lab/financial-analysis-workbench: the proof is published, the press
 * is not.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The shared Method Lab bar and footer are added by serveMethodLabDocument, so
 * every document in the Lab opens with the same chrome and the same wording.
 */
export async function GET() {
  return serveMethodLabDocument("financial-analysis-workbench-tool.html", "/method-lab/workbench");
}
