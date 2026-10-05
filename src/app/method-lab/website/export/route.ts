import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { METHOD_LAB_COOKIE, hasMethodLabAccess } from "@/lib/methodLab";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { questions } from "@/lib/realityCheck";
import { parseRange, siteExclusion, type SiteRow } from "@/lib/websiteCheckStats";

/**
 * /method-lab/website/export — every website Clarity Check row (cohort 'site')
 * as a CSV, one column per question, with a `counted` column and the reason a
 * row is left out. Method Lab passphrase only (middleware, and checked here).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLS = ["source", "medium", "campaign", "score", "band", "gaps", "blind_spot", "duration_s"] as const;

const cell = (v: unknown) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const ct = (iso: string | undefined | null, part: "date" | "time" | "both") => {
  if (!iso) return "";
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  const time = d.toLocaleTimeString("en-GB", { timeZone: "America/Chicago", hour12: false });
  return part === "date" ? date : part === "time" ? time : `${date} ${time}`;
};

export async function GET(request: Request) {
  if (!(await hasMethodLabAccess(cookies().get(METHOD_LAB_COOKIE)?.value))) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  if (!serviceRoleConfigured) return NextResponse.json({ ok: false, message: "Service key not set." }, { status: 503 });

  const q = new URL(request.url).searchParams;
  const range = parseRange({ range: q.get("range") ?? undefined, from: q.get("from") ?? undefined, to: q.get("to") ?? undefined });
  const query = createAdminClient()
    .from("reality_check_responses")
    .select("*")
    .eq("cohort", "site")
    .order("created_at", { ascending: true })
    .limit(10000);
  const { data: raw, error } = await query;
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });

  const header = ["counted", "excluded_reason", "date_ct", "time_ct", "excluded_at_ct", ...COLS, ...questions.map((q) => `q_${q.id}`)];
  const lines = [header.join(",")];
  // Same calendar-day filter as the dashboard, in Central time.
  const inRange = (r: SiteRow) => {
    const day = new Date(r.created_at).toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
    return (!range.from || day >= range.from) && (!range.to || day <= range.to);
  };
  for (const r of ((raw ?? []) as SiteRow[]).filter(inRange)) {
    const why = siteExclusion(r);
    lines.push(
      [
        why ? "no" : "yes",
        why ?? "",
        ct(r.created_at, "date"),
        ct(r.created_at, "time"),
        r.excluded_reason ? ct(r.updated_at, "both") : "",
        ...COLS.map((c) => (r as unknown as Record<string, unknown>)[c]),
        ...questions.map((q) => r.answers?.[q.id]),
      ].map(cell).join(",")
    );
  }
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clarity-check-website-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
