import { NextResponse } from "next/server";
import { EMAIL_RE } from "@/lib/contact";
import { questions, scoreAnswers } from "@/lib/realityCheck";
import { sendEmail, emailConfigured, NOTIFY_EMAIL } from "@/lib/email";

/**
 * Reality Check — the written breakdown.
 *
 * The score is always shown on screen; this endpoint only runs when someone
 * asks for the long version. It sends the full breakdown to the owner address
 * over the same SMTP relay the rest of the site uses, so the follow-up goes out
 * from a person rather than an automation.
 *
 * If SMTP is not configured we say so honestly rather than showing a success
 * message for an email that was never sent.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: {
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

  // Honeypot — accept silently so bots learn nothing.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = body.email?.trim() ?? "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  // Only accept scores for questions we actually asked.
  const known = new Set(questions.map((q) => q.id));
  const answers: Record<string, number> = {};
  for (const [k, v] of Object.entries(body.answers ?? {})) {
    if (known.has(k) && typeof v === "number" && v >= 0 && v <= 4) answers[k] = v;
  }

  // Recompute server-side rather than trusting the posted score.
  const result = scoreAnswers(answers);

  const rows = questions
    .map((q) => {
      const v = answers[q.id];
      const chosen = q.options.find((o) => o.score === v);
      const weak = (v ?? 0) <= 1;
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e0e0;vertical-align:top;width:30%;
          color:#500000;font-weight:600;font-size:13px">${esc(q.area)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e0e0;vertical-align:top;font-size:14px">
          <div style="color:#1a1a1a">${esc(q.prompt)}</div>
          <div style="margin-top:6px;color:${weak ? "#500000" : "#6b6b6b"};font-weight:${weak ? 600 : 400}">
            ${chosen ? esc(chosen.label) : "— not answered —"}${weak ? "  ← gap" : ""}
          </div>
        </td>
      </tr>`;
    })
    .join("");

  const blind = result.blindSpot;
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:680px">
    <p style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#500000;font-weight:700;margin:0">
      Reality Check — new result
    </p>
    <h2 style="font-size:24px;margin:8px 0 4px">${esc(email)}</h2>
    <p style="margin:0 0 20px;color:#6b6b6b;font-size:14px">
      Requested the written breakdown · ${new Date().toLocaleString("en-US")}
    </p>

    <table style="border-collapse:collapse;width:100%;margin-bottom:22px">
      <tr>
        <td style="padding:16px 18px;background:#f5f2f2;border-left:4px solid #500000">
          <div style="font-size:44px;font-weight:700;color:#500000;line-height:1">${result.score}</div>
          <div style="font-size:12px;color:#6b6b6b;margin-top:4px">Clarity Score out of 100</div>
          <div style="font-size:17px;font-weight:700;margin-top:10px">${esc(result.band.name)}</div>
          <div style="font-size:14px;color:#6b6b6b;margin-top:4px">${esc(result.band.verdict)}</div>
        </td>
      </tr>
    </table>

    <p style="font-size:15px;margin:0 0 6px">
      <strong>Could not answer with confidence: ${result.gaps.length} of ${questions.length}</strong>
    </p>
    ${
      blind
        ? `<p style="font-size:15px;margin:0 0 20px">
             <strong>Biggest blind spot:</strong> ${esc(blind.area)} — ${esc(blind.blindSpot.headline)}
             <span style="color:#6b6b6b">(addressed by ${esc(blind.component)})</span>
           </p>`
        : `<p style="font-size:15px;margin:0 0 20px;color:#6b6b6b">
             No blind spot — every question answered at full confidence.
           </p>`
    }

    <table style="border-collapse:collapse;width:100%;border-top:2px solid #1a1a1a">${rows}</table>

    <p style="margin-top:24px;font-size:13px;color:#6b6b6b">
      Reply directly to this message to reach them — the reply-to is set to their address.
    </p>
  </div>`;

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
          "We could not send that just now. Your score is above and it is yours to keep — please email us and we will send the breakdown over.",
      },
      { status: 503 }
    );
  }

  const sent = await sendEmail({
    to: NOTIFY_EMAIL,
    subject: `Reality Check — ${result.score}/100 (${result.band.name}) — ${email}`,
    html,
    replyTo: email,
  });

  if (!sent.ok) {
    console.error("[reality-check] send failed:", sent.error);
    return NextResponse.json(
      { ok: false, message: "We could not send that just now. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
