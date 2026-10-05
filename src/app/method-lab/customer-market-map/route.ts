import { serveMethodLabDocument } from "@/lib/methodLabChrome";

/**
 * Serves the web edition of 03 · The Aperture Customer and Market Map
 * (the Aperture Data Intelligence Engine's screens).
 *
 * The page holds no data. It talks only to the engine running on the visitor's
 * own computer at http://127.0.0.1:8765, and the engine accepts requests from
 * aperturemethod.com and refuses every other website. Open it on any other
 * machine, or with the engine off, and it says so instead of working.
 *
 * Regenerate the file from the engine, never by hand:
 *   python3 aperture_data_intelligence_engine.py --export-web private/method-lab/customer-market-map.html
 *
 * Gated upstream in `src/middleware.ts` like the rest of the Method Lab.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The shared Method Lab bar and footer are added by serveMethodLabDocument, so
 * every document in the Lab opens with the same chrome and the same wording.
 */
export async function GET() {
  return serveMethodLabDocument("customer-market-map.html");
}
