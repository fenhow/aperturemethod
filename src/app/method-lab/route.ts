import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { methodLabConfigured } from "@/lib/methodLab";

/**
 * Serves the confidential Agent Workflow Map.
 *
 * The file lives in `private/method-lab/` — NOT in `public/`, which is served
 * statically and cannot be protected by middleware. Access is gated upstream
 * in `src/middleware.ts`; by the time a request reaches here it has already
 * presented a valid passphrase cookie.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_INDEX = "noindex, nofollow, noarchive, nosnippet";

export async function GET() {
  if (!methodLabConfigured) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = path.join(process.cwd(), "private", "method-lab", "index.html");

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
