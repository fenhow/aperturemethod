import { promises as fs } from "fs";
import path from "path";
import { NextResponse, type NextRequest } from "next/server";
import { METHOD_LAB_FILES, methodLabConfigured } from "@/lib/methodLab";

/**
 * Streams a Method Lab document. The files live in
 * `private/method-lab/downloads/` — never in `public/`, which would make them
 * reachable by anyone who guessed the URL. Access is gated in the middleware;
 * this route also refuses to run when the area is unconfigured.
 *
 * The `f` parameter is a key into a fixed map, so no user input ever reaches
 * the filesystem path.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!methodLabConfigured) {
    return new NextResponse("Not found", { status: 404 });
  }

  const key = request.nextUrl.searchParams.get("f") ?? "";
  const entry = METHOD_LAB_FILES[key];
  if (!entry) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = path.join(process.cwd(), "private", "method-lab", "downloads", entry.file);

  try {
    const data = await fs.readFile(file);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": entry.type,
        "Content-Disposition": `attachment; filename="${entry.name}"`,
        "Content-Length": String(data.byteLength),
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
