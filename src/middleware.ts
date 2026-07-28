import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseConfigured } from "@/lib/supabase/env";

/**
 * Refreshes the Supabase session cookie on each request and guards the portal
 * and admin areas: anyone without a session is sent to the login page. (Admin
 * authorization itself is enforced in the page + by Row-Level Security.)
 */
export async function middleware(request: NextRequest) {
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

    const path = request.nextUrl.pathname;
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
  matcher: ["/portal/:path*", "/admin/:path*"],
};
