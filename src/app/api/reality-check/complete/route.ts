import { NextResponse } from "next/server";
import { questions, scoreAnswers } from "@/lib/realityCheck";
import { sendEmail, emailConfigured, NOTIFY_EMAIL } from "@/lib/email";
import { completionHtml } from "@/lib/realityCheckEmail";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { WTP_VERSION, cleanHeardFrom, cleanProfile, cleanSelfRating, cleanTag, cleanWtp, UUID_RE } from "@/lib/realityStudy";

/**
 * Reality Check: the anonymous completion ping.
 *
 * Fired by the quiz the moment someone reaches their result, whether or not
 * they go on to ask for the written breakdown. It sends Fenwick the score and
 * the answers, so he can see which questions people cannot answer.
 *
 * What it deliberately does NOT carry: name, email, company, IP, or anything
 * else that identifies a person. The page says exactly this in plain language
 * before anyone starts, and the promise is only worth keeping if the code keeps
 * it. If you are ever tempted to add a field here, change the page first.
 *
 * Best-effort in both directions: a failure here must never affect the visitor,
 * so the client ignores the response and this always answers ok.
 *
 * Storage (Oct 2026, for the capstone study). Every finished run is also saved
 * as one anonymous row in Supabase `reality_check_responses`, keyed by a random
 * run id the browser makes up. The study page calls this twice per run: once
 * when the last question is answered (stage "finish") and again if the optional
 * profile is filled in (stage "profile"), which updates the same row. Only the
 * first call emails Fenwick. See supabase/migrations/0004.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: {
    answers?: Record<string, number>;
    runId?: string;
    stage?: "finish" | "profile" | "pricing";
    wtp?: string;
    cohort?: string;
    source?: string;
    medium?: string;
    campaign?: string;
    selfRating?: number;
    durationS?: number;
    repeat?: boolean;
    profile?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: true });
  }

  // Same whitelist as the breakdown route: only questions we asked, only
  // scores those questions offer.
  const allowed = new Map<string, Set<number>>(
    questions.map((q) => [q.id, new Set<number>(q.options.map((o) => o.score))])
  );
  const answers: Record<string, number> = {};
  for (const [k, v] of Object.entries(body.answers ?? {})) {
    if (typeof v === "number" && allowed.get(k)?.has(v)) answers[k] = v;
  }

  // A part-finished run is not a completion. Ignore it rather than filing a
  // misleading score.
  if (Object.keys(answers).length < questions.length) {
    return NextResponse.json({ ok: true });
  }

  const result = scoreAnswers(answers);

  await store(body, answers, result);

  // Follow-ups update the stored row only; the alert went already.
  if (body.stage === "profile" || body.stage === "pricing") return NextResponse.json({ ok: true });

  if (!emailConfigured) {
    console.info("[reality-check] completion (SMTP not configured):", {
      score: result.score,
      band: result.band.name,
    });
    return NextResponse.json({ ok: true });
  }

  const sent = await sendEmail({
    to: NOTIFY_EMAIL,
    subject: `Reality Check completed (anonymous): ${result.score}/100, ${result.band.name}`,
    html: completionHtml(result, answers),
  });
  if (!sent.ok) console.error("[reality-check] completion alert failed:", sent.error);

  return NextResponse.json({ ok: true });
}

async function store(
  body: {
    runId?: string;
    stage?: string;
    cohort?: string;
    source?: string;
    medium?: string;
    campaign?: string;
    selfRating?: number;
    durationS?: number;
    repeat?: boolean;
    profile?: unknown;
    wtp?: string;
  },
  answers: Record<string, number>,
  result: ReturnType<typeof scoreAnswers>
) {
  if (!serviceRoleConfigured || typeof body.runId !== "string" || !UUID_RE.test(body.runId)) {
    console.info("[reality-check] response not stored (no run id or Supabase not configured)");
    return;
  }
  const profile = body.stage === "profile" ? cleanProfile(body.profile) : {};
  const duration =
    typeof body.durationS === "number" && body.durationS >= 0 && body.durationS < 86400
      ? Math.round(body.durationS)
      : null;
  // The dropdown answer becomes the source, unless the run was tagged as a test.
  const urlSource = cleanTag(body.source);
  const heard =
    body.stage === "profile" && body.profile && typeof body.profile === "object"
      ? cleanHeardFrom((body.profile as Record<string, unknown>).heard_from)
      : null;
  const source = urlSource?.startsWith("test") ? urlSource : heard ?? urlSource;
  const row = {
    run_id: body.runId,
    updated_at: new Date().toISOString(),
    cohort: body.cohort === "study" ? "study" : "site",
    source,
    medium: cleanTag(body.medium),
    campaign: cleanTag(body.campaign),
    question_count: questions.length,
    answers,
    score: result.score,
    band: result.band.name,
    gaps: result.gaps.length,
    blind_spot: result.blindSpot?.id ?? null,
    self_rating: cleanSelfRating(body.selfRating),
    duration_s: duration,
    repeat_taker: body.repeat === true,
    ...(body.stage === "profile" ? { profile_done: true, ...profile } : {}),
    ...(body.stage === "pricing" && cleanWtp(body.wtp) ? { wtp: cleanWtp(body.wtp)!, wtp_version: WTP_VERSION } : {}),
  };
  // The profile never carries the price question any more (version 2 asks it
  // after the result), so a profile ping must not touch an existing answer.
  if (body.stage === "profile") delete (row as Record<string, unknown>).wtp;
  try {
    const db = createAdminClient().from("reality_check_responses");
    let { error } = await db.upsert(row, { onConflict: "run_id" });
    // Until migration 0005 adds the candor column, save everything else rather
    // than losing the whole response over one optional answer.
    // Same for the version tag on the price question (migration 0005).
    if (error && /(candor|wtp_version)/.test(error.message)) {
      const rest = { ...(row as Record<string, unknown>) };
      delete rest.candor;
      delete rest.wtp_version;
      ({ error } = await createAdminClient().from("reality_check_responses").upsert(rest, { onConflict: "run_id" }));
    }
    if (error) console.error("[reality-check] store failed:", error.message);
  } catch (err) {
    console.error("[reality-check] store threw:", err);
  }
}
