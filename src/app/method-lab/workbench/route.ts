import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { methodLabConfigured } from "@/lib/methodLab";

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

const NO_INDEX = "noindex, nofollow, noarchive, nosnippet";

export async function GET() {
  if (!methodLabConfigured) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = path.join(
    process.cwd(),
    "private",
    "method-lab",
    "financial-analysis-workbench-tool.html"
  );

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
