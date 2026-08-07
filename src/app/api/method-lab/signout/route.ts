import { NextResponse, type NextRequest } from "next/server";
import { METHOD_LAB_COOKIE } from "@/lib/methodLab";

/**
 * Ends a Method Lab session: clears the access cookie and returns the visitor
 * to the public site. The next visit has to present the passphrase again.
 *
 * A POST (from a plain <form> in the gated page, so it works without
 * JavaScript) rather than a GET, so no link prefetcher or crawler can sign
 * someone out by following a URL.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clear(request: NextRequest) {
  const home = new URL("/", request.nextUrl.origin);
  // 303 makes the browser follow up with a GET, so Back doesn't re-POST.
  const response = NextResponse.redirect(home, 303);
  response.cookies.set({
    name: METHOD_LAB_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function POST(request: NextRequest) {
  return clear(request);
}
