import { NextResponse } from "next/server";

/** Moved to /method-lab/study/export (Oct 2026). */
export function GET(request: Request) {
  return NextResponse.redirect(new URL("/method-lab/study/export", request.url));
}
