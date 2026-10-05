import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { methodLabConfigured } from "@/lib/methodLab";

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

const NO_INDEX = "noindex, nofollow, noarchive, nosnippet";

export async function GET() {
  if (!methodLabConfigured) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = path.join(process.cwd(), "private", "method-lab", "customer-market-map.html");

  try {
    const html = await fs.readFile(file, "utf8");
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": NO_INDEX,
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
