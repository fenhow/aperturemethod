import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/adminGuard";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { questions } from "@/lib/realityCheck";
import { exclusionReason, type StudyRow } from "@/lib/realityStudyStats";

/**
 * /admin/study/export — every study row as a CSV, one column per question,
 * with a `counted` column and the reason when a row is left out. Admin only.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLS = [
  "created_at", "source", "medium", "campaign", "score", "band", "gaps", "blind_spot",
  "self_rating", "duration_s", "repeat_taker", "profile_done", "revenue", "employees",
  "industry", "role", "years", "region", "zip3", "analysis_source", "wtp",
] as const;

const cell = (v: unknown) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET() {
  const auth = await checkAdmin();
  if (auth.state !== "ok") return NextResponse.json({ ok: false }, { status: 403 });
  if (!serviceRoleConfigured) return NextResponse.json({ ok: false, message: "Service key not set." }, { status: 503 });

  const { data, error } = await createAdminClient()
    .from("reality_check_responses")
    .select("*")
    .eq("cohort", "study")
    .order("created_at", { ascending: true })
    .limit(10000);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });

  const header = ["counted", "excluded_reason", ...COLS, ...questions.map((q) => `q_${q.id}`)];
  const lines = [header.join(",")];
  for (const r of (data ?? []) as StudyRow[]) {
    const why = exclusionReason(r);
    lines.push(
      [
        why ? "no" : "yes",
        why ?? "",
        ...COLS.map((c) => (r as unknown as Record<string, unknown>)[c]),
        ...questions.map((q) => r.answers?.[q.id]),
      ].map(cell).join(",")
    );
  }
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reality-check-study-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
