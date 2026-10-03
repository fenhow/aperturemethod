import { NextResponse } from "next/server";
import { questions, scoreAnswers } from "@/lib/realityCheck";
import { sendEmail, emailConfigured, NOTIFY_EMAIL } from "@/lib/email";
import { completionHtml } from "@/lib/realityCheckEmail";

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
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { answers?: Record<string, number> };
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
