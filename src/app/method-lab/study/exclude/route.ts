import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { METHOD_LAB_COOKIE, hasMethodLabAccess } from "@/lib/methodLab";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { UUID_RE } from "@/lib/realityStudy";
import { EXCLUDE_REASONS } from "@/lib/realityStudyStats";

/**
 * /method-lab/study/exclude — mark one response as removed from the study, or
 * restore it. Excluding keeps the row, with excluded_reason set, so the report
 * can say exactly what was left out and why.
 *
 * { action: "delete" } removes the row permanently. Fenwick asked for it
 * (Oct 2026) for his own tests and junk; the dashboard confirms first. Deleted
 * rows are not counted anywhere, including the exclusions list.
 * Method Lab passphrase only (middleware, and checked again here).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await hasMethodLabAccess(cookies().get(METHOD_LAB_COOKIE)?.value))) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  if (!serviceRoleConfigured) {
    return NextResponse.json({ ok: false, message: "Service key not set." }, { status: 503 });
  }
  let body: { runId?: string; reason?: string | null; action?: "delete" };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  if (typeof body.runId !== "string" || !UUID_RE.test(body.runId)) {
    return NextResponse.json({ ok: false, message: "Unknown response." }, { status: 422 });
  }
  if (body.action === "delete") {
    const { error } = await createAdminClient()
      .from("reality_check_responses")
      .delete()
      .eq("run_id", body.runId);
    if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const reason =
    body.reason === null
      ? null
      : (EXCLUDE_REASONS as readonly string[]).includes(body.reason ?? "")
        ? body.reason!
        : null;
  if (body.reason !== null && !reason) {
    return NextResponse.json({ ok: false, message: "Choose a reason." }, { status: 422 });
  }

  const { error } = await createAdminClient()
    .from("reality_check_responses")
    .update({ excluded_reason: reason, updated_at: new Date().toISOString() })
    .eq("run_id", body.runId);
  if (error) {
    const missing = /excluded_reason/.test(error.message);
    return NextResponse.json(
      {
        ok: false,
        message: missing
          ? "One-time setup needed: run the excluded_reason line from migration 0005 in Supabase."
          : error.message,
      },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
