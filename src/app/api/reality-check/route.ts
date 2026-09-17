import { NextResponse } from "next/server";
import { EMAIL_RE } from "@/lib/contact";
import { questions, scoreAnswers } from "@/lib/realityCheck";
import { sendEmail, emailConfigured, NOTIFY_EMAIL } from "@/lib/email";
import { reportHtml, ownerHtml } from "@/lib/realityCheckEmail";

/**
 * Reality Check: the written breakdown.
 *
 * The score is always shown on screen. When someone asks for the long version
 * we send it to them immediately, and send Fenwick a copy as a lead
 * notification. Both go over the same SMTP relay as the rest of the site.
 *
 * The two email templates live in src/lib/realityCheckEmail.ts so they can be
 * previewed without sending anything. See /preview-email.
 *
 * If SMTP is not configured we say so honestly rather than showing a success
 * message for an email that was never sent.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: {
    name?: string;
    company?: string;
    title?: string;
    email?: string;
    website?: string;
    score?: number;
    band?: string;
    answers?: Record<string, number>;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: accept silently so bots learn nothing.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  const title = body.title?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  if (!name) {
    return NextResponse.json(
      { ok: false, message: "Please add your name so we know who this is." },
      { status: 422 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  /*
   * Only accept scores for questions we actually asked, and only values that
   * question actually offers. A bare 0–4 range check would let a crafted POST
   * submit a score no option carries; it would count toward the total while
   * the report rendered that row as "Not answered".
   */
  const allowed = new Map<string, Set<number>>(
    questions.map((q) => [q.id, new Set<number>(q.options.map((o) => o.score))])
  );
  const answers: Record<string, number> = {};
  for (const [k, v] of Object.entries(body.answers ?? {})) {
    if (typeof v === "number" && allowed.get(k)?.has(v)) answers[k] = v;
  }

  // Recompute server-side rather than trusting the posted score.
  const result = scoreAnswers(answers);

  if (!emailConfigured) {
    console.info("[reality-check] SMTP not configured; result logged only:", {
      email,
      score: result.score,
      band: result.band.name,
      answers,
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          "We could not send that just now. Your score is above and it is yours to keep. Please email us and we will send the breakdown over.",
      },
      { status: 503 }
    );
  }

  // The visitor's copy is the one that matters. Send it first.
  const toVisitor = await sendEmail({
    to: email,
    subject: `Your Reality Check: ${result.score}/100, ${result.band.name}`,
    html: reportHtml(result, answers),
    replyTo: NOTIFY_EMAIL,
  });

  if (!toVisitor.ok) {
    console.error("[reality-check] visitor send failed:", toVisitor.error);
    return NextResponse.json(
      { ok: false, message: "We could not send that just now. Please try again shortly." },
      { status: 502 }
    );
  }

  // Owner notification is best-effort. Never fail the visitor over it.
  const toOwner = await sendEmail({
    to: NOTIFY_EMAIL,
    subject: `Reality Check: ${name}${company ? ` (${company})` : ""}, ${result.score}/100 (${result.band.name})`,
    html: ownerHtml({ name, company, title, email }, result, answers),
    replyTo: email,
  });
  if (!toOwner.ok) console.error("[reality-check] owner notification failed:", toOwner.error);

  return NextResponse.json({ ok: true });
}
