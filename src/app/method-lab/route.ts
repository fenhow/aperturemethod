import { serveMethodLabDocument } from "@/lib/methodLabChrome";

/**
 * Serves the confidential Agent Workflow Map.
 *
 * The file lives in `private/method-lab/`, NOT in `public/`, which is served
 * statically and cannot be protected by middleware. Access is gated upstream
 * in `src/middleware.ts`; by the time a request reaches here it has already
 * presented a valid passphrase cookie.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The shared Method Lab bar and footer are added by serveMethodLabDocument, so
 * every document in the Lab opens with the same chrome and the same wording.
 */
export async function GET() {
  return serveMethodLabDocument("index.html");
}
