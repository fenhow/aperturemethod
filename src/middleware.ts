import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseConfigured } from "@/lib/supabase/env";
import { METHOD_LAB_COOKIE, hasMethodLabAccess } from "@/lib/methodLab";

/**
 * Two independent guards.
 *
 * 1. Method Lab (/method-lab and its gated download route) — a passphrase
 *    cookie. Checked FIRST and deliberately not behind the Supabase branch
 *    below, which returns early whenever Supabase isn't configured.
 * 2. Portal + admin — refreshes the Supabase session cookie and sends anyone
 *    without a session to the login page. (Admin authorization itself is
 *    enforced in the page + by Row-Level Security.)
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // --- 1. Method Lab -------------------------------------------------------
  const isMethodLab = path === "/method-lab" || path.startsWith("/method-lab/");
  const isMethodLabApi = path.startsWith("/api/method-lab/");

  if (isMethodLab || isMethodLabApi) {
    // The passphrase form and the endpoint that checks it must stay reachable.
    const isEntry = path === "/method-lab/enter" || path === "/api/method-lab/auth";
    if (isEntry) return NextResponse.next();

    const allowed = await hasMethodLabAccess(request.cookies.get(METHOD_LAB_COOKIE)?.value);
    if (allowed) return NextResponse.next();

    // Never confirm that a gated file exists.
    if (isMethodLabApi) return new NextResponse("Not found", { status: 404 });

    const url = request.nextUrl.clone();
    url.pathname = "/method-lab/enter";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // --- 2. Portal + admin ---------------------------------------------------
  if (!supabaseConfigured) return NextResponse.next();

  try {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isLogin = path === "/portal/login";
    const needsAuth = path.startsWith("/portal") || path.startsWith("/admin");

    if (needsAuth && !isLogin && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/portal/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }

    return response;
  } catch {
    // Never take the site down over an auth hiccup — let the request proceed.
    // The page-level checks and Row-Level Security still protect the data.
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/portal/:path*",
    "/admin/:path*",
    "/method-lab",
    "/method-lab/:path*",
    "/api/method-lab/:path*",
  ],
};
