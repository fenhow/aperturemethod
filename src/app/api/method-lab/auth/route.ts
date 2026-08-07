import { NextResponse, type NextRequest } from "next/server";
import {
  METHOD_LAB_COOKIE,
  METHOD_LAB_MAX_AGE,
  isValidPassphrase,
  methodLabConfigured,
  methodLabToken,
  methodLabPassword,
} from "@/lib/methodLab";

/**
 * Checks a Method Lab passphrase and, on success, sets the access cookie.
 * The cookie holds a hash derived from the passphrase, so rotating
 * METHOD_LAB_PASSWORD invalidates every cookie already issued.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!methodLabConfigured) {
    return new NextResponse("Not found", { status: 404 });
  }

  let passphrase = "";
  try {
    const body = (await request.json()) as { passphrase?: unknown };
    passphrase = typeof body.passphrase === "string" ? body.passphrase : "";
  } catch {
    passphrase = "";
  }

  if (!(await isValidPassphrase(passphrase))) {
    // A deliberate small delay blunts trivial guessing without adding a store.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: METHOD_LAB_COOKIE,
    value: await methodLabToken(methodLabPassword),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: METHOD_LAB_MAX_AGE,
  });
  return response;
}
