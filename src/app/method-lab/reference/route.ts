import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { methodLabConfigured } from "@/lib/methodLab";

/**
 * Serves the Canonical Architecture Reference as a viewable page.
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

const NO_INDEX = "noindex, nofollow, noarchive, nosnippet";

export async function GET() {
  if (!methodLabConfigured) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = path.join(process.cwd(), "private", "method-lab", "reference.html");

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
