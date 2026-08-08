import { NextResponse } from "next/server";
import { EMAIL_RE } from "@/lib/contact";
import { questions, scoreAnswers, type RCResult } from "@/lib/realityCheck";
import { sendEmail, emailConfigured, NOTIFY_EMAIL } from "@/lib/email";
import { siteConfig } from "@/lib/site";

/**
 * Reality Check — the written breakdown.
 *
 * The score is always shown on screen. When someone asks for the long version
 * we send it to them immediately, and send Fenwick a copy as a lead
 * notification. Both go over the same SMTP relay as the rest of the site.
 *
 * If SMTP is not configured we say so honestly rather than showing a success
 * message for an email that was never sent.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAROON = "#500000";
const INK = "#1a1a1a";
const GRAY = "#6b6b6b";
const LINE = "#e2e0e0";
const SURFACE = "#f5f2f2";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function siteUrl(path: string): string {
  try {
    return new URL(path, siteConfig.url).toString();
  } catch {
    return `https://aperturemethod.com${path}`;
  }
}

/** The report the visitor receives. Plain, table-based HTML for email clients. */
function reportHtml(result: RCResult, answers: Record<string, number>): string {
  const { score, band, gaps, blindSpot } = result;

  const gapRows =
    gaps.length > 0
      ? gaps
          .map(
            (g) => `<tr>
              <td style="padding:12px 0;border-bottom:1px solid ${LINE};vertical-align:top;width:34%;
                color:${MAROON};font-weight:700;font-size:12px;letter-spacing:.06em;text-transform:uppercase">
                ${esc(g.area)}
              </td>
              <td style="padding:12px 0 12px 16px;border-bottom:1px solid ${LINE};vertical-align:top;
                font-size:15px;color:${INK};line-height:1.5">${esc(g.prompt)}</td>
            </tr>`
          )
          .join("")
      : "";

  const allRows = questions
    .map((q) => {
      const v = answers[q.id];
      const chosen = q.options.find((o) => o.score === v);
      const weak = (v ?? 0) <= 1;
      return `<tr>
        <td style="padding:10px 0;border-bottom:1px solid ${LINE};vertical-align:top;width:34%;
          font-size:12px;color:${GRAY};line-height:1.5">${esc(q.area)}</td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid ${LINE};vertical-align:top;
          font-size:14px;line-height:1.5;color:${weak ? MAROON : INK};font-weight:${weak ? 600 : 400}">
          ${chosen ? esc(chosen.label) : "Not answered"}
        </td>
      </tr>`;
    })
    .join("");

  return `<!doctype html><html><body style="margin:0;padding:0;background:#ffffff">
  <div style="font-family:Arial,Helvetica,sans-serif;color:${INK};max-width:640px;margin:0 auto;padding:32px 24px">

    <p style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${MAROON};font-weight:700;margin:0 0 22px">
      The Aperture Method&trade; &middot; The Reality Check
    </p>

    <table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:26px">
      <tr>
        <td style="padding:22px 24px;background:${SURFACE};border-left:4px solid ${MAROON}">
          <div style="font-size:56px;font-weight:700;color:${MAROON};line-height:1">${score}</div>
          <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${GRAY};margin-top:6px">
            Your Clarity Score, out of 100
          </div>
          <div style="font-size:20px;font-weight:700;margin-top:16px">${esc(band.name)}</div>
          <div style="font-size:15px;color:${INK};margin-top:6px;line-height:1.5">${esc(band.verdict)}</div>
        </td>
      </tr>
    </table>

    <p style="font-size:15px;line-height:1.6;color:${INK};margin:0 0 26px">${esc(band.frame)}</p>

    ${
      gaps.length > 0
        ? `<h2 style="font-size:19px;margin:0 0 6px;color:${INK}">
             You could not answer ${gaps.length} of ${questions.length} with confidence
           </h2>
           <p style="font-size:14px;color:${GRAY};margin:0 0 14px;line-height:1.6">
             This list is the useful part. Each one is a question about your own business that does
             not currently have an evidenced answer.
           </p>
           <table role="presentation" style="border-collapse:collapse;width:100%;border-top:2px solid ${INK};margin-bottom:30px">
             ${gapRows}
           </table>`
        : `<h2 style="font-size:19px;margin:0 0 6px;color:${INK}">You answered all ten with confidence</h2>
           <p style="font-size:14px;color:${GRAY};margin:0 0 30px;line-height:1.6">
             That is genuinely uncommon.
           </p>`
    }

    ${
      blindSpot
        ? `<table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:30px">
             <tr><td style="padding:20px 24px;background:${SURFACE};border-left:4px solid ${MAROON}">
               <p style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${MAROON};font-weight:700;margin:0 0 10px">
                 Your biggest blind spot
               </p>
               <div style="font-size:19px;font-weight:700;color:${INK}">${esc(blindSpot.blindSpot.headline)}</div>
               <p style="font-size:15px;line-height:1.6;margin:12px 0 0;color:${INK}">${esc(blindSpot.blindSpot.body)}</p>
               <p style="font-size:15px;line-height:1.6;margin:12px 0 0;color:${INK};font-weight:600">${esc(blindSpot.blindSpot.cost)}</p>
               <p style="font-size:13px;color:${GRAY};margin:14px 0 0">
                 Addressed by <span style="color:${MAROON};font-weight:700">${esc(blindSpot.component)}</span>
               </p>
             </td></tr>
           </table>`
        : ""
    }

    <h2 style="font-size:19px;margin:0 0 10px;color:${INK}">Everything you answered</h2>
    <table role="presentation" style="border-collapse:collapse;width:100%;border-top:2px solid ${INK};margin-bottom:32px">
      ${allRows}
    </table>

    <table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:26px">
      <tr><td style="padding:22px 24px;border:1px solid ${LINE}">
        <h2 style="font-size:18px;margin:0 0 10px;color:${INK}">What this is, and what it is not</h2>
        <p style="font-size:15px;line-height:1.6;color:${GRAY};margin:0 0 18px">
          This is a self-assessment. It tells you what you do not currently know. The Business
          X-Ray&trade; is the diagnostic that answers it &mdash; a seven-lens read of the whole
          business, the named constraint with the evidence behind it, and a baseline Aperture
          Score&trade; you can track. Two to three weeks, fixed fee, senior-led.
        </p>
        <a href="${siteUrl("/contact?ref=reality-check#book")}"
           style="display:inline-block;background:${MAROON};color:#ffffff;text-decoration:none;
           font-size:14px;font-weight:700;padding:13px 26px">Sign up for the Business X-Ray&trade;</a>
        <p style="font-size:13px;line-height:1.6;color:${GRAY};margin:16px 0 0">
          Want the detail first?
          <a href="${siteUrl("/deliverables/business-x-ray")}"
             style="color:${MAROON};font-weight:700;text-decoration:underline">
            See exactly what the Business X-Ray&trade; covers &rarr;
          </a>
        </p>
      </td></tr>
    </table>

    <p style="font-size:14px;line-height:1.6;color:${INK};margin:0 0 26px">
      If anything here surprised you, reply to this message &mdash; it comes straight to me.<br>
      <span style="color:${GRAY}">Fenwick How &middot; Founder, The Aperture Method</span>
    </p>

    <p style="font-size:12px;color:${GRAY};border-top:1px solid ${LINE};padding-top:16px;margin:0;line-height:1.6">
      You received this because you asked for your Reality Check breakdown at
      ${esc(siteUrl("/reality-check"))}. We will not add you to a sequence.
    </p>
  </div></body></html>`;
}

/** The lead notification Fenwick receives. */
function ownerHtml(
  who: { name: string; company: string; title: string; email: string },
  result: RCResult,
  answers: Record<string, number>
): string {
  const rows = questions
    .map((q) => {
      const v = answers[q.id];
      const chosen = q.options.find((o) => o.score === v);
      const weak = (v ?? 0) <= 1;
      return `<tr>
        <td style="padding:9px 12px;border-bottom:1px solid ${LINE};vertical-align:top;width:28%;
          color:${MAROON};font-weight:600;font-size:12px">${esc(q.area)}</td>
        <td style="padding:9px 12px;border-bottom:1px solid ${LINE};vertical-align:top;font-size:13px;
          color:${weak ? MAROON : INK};font-weight:${weak ? 600 : 400}">
          ${chosen ? esc(chosen.label) : "—"}${weak ? "  &larr; gap" : ""}
        </td>
      </tr>`;
    })
    .join("");

  const roleLine = [who.title, who.company].filter(Boolean).map(esc).join(" · ");
  return `<div style="font-family:Arial,Helvetica,sans-serif;color:${INK};max-width:660px">
    <p style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${MAROON};font-weight:700;margin:0">
      Reality Check &mdash; new lead
    </p>
    <h2 style="font-size:22px;margin:8px 0 2px">${esc(who.name)}</h2>
    ${roleLine ? `<p style="margin:0 0 2px;color:${INK};font-size:14px">${roleLine}</p>` : ""}
    <p style="margin:0 0 14px;font-size:14px">
      <a href="mailto:${esc(who.email)}" style="color:${MAROON};font-weight:600;text-decoration:none">${esc(who.email)}</a>
    </p>
    <p style="margin:0 0 18px;color:${GRAY};font-size:13px">
      Their copy of the report has been sent. Reply to this message to reach them directly.
    </p>
    <p style="font-size:16px;margin:0 0 6px">
      <strong>${result.score}/100 &mdash; ${esc(result.band.name)}</strong>
    </p>
    <p style="font-size:15px;margin:0 0 6px">
      Could not answer with confidence: <strong>${result.gaps.length} of ${questions.length}</strong>
    </p>
    <p style="font-size:15px;margin:0 0 18px">
      ${
        result.blindSpot
          ? `Biggest blind spot: <strong>${esc(result.blindSpot.area)}</strong> &mdash; ${esc(
              result.blindSpot.blindSpot.headline
            )} <span style="color:${GRAY}">(${esc(result.blindSpot.component)})</span>`
          : `<span style="color:${GRAY}">No blind spot &mdash; full marks throughout.</span>`
      }
    </p>
    <table style="border-collapse:collapse;width:100%;border-top:2px solid ${INK}">${rows}</table>
  </div>`;
}

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

  // Honeypot — accept silently so bots learn nothing.
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
   * submit a score no option carries — it would count toward the total while
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
          "We could not send that just now. Your score is above and it is yours to keep — please email us and we will send the breakdown over.",
      },
      { status: 503 }
    );
  }

  // The visitor's copy is the one that matters — send it first.
  const toVisitor = await sendEmail({
    to: email,
    subject: `Your Reality Check — ${result.score}/100, ${result.band.name}`,
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

  // Owner notification is best-effort — never fail the visitor over it.
  const toOwner = await sendEmail({
    to: NOTIFY_EMAIL,
    subject: `Reality Check — ${name}${company ? ` (${company})` : ""} — ${result.score}/100 (${result.band.name})`,
    html: ownerHtml({ name, company, title, email }, result, answers),
    replyTo: email,
  });
  if (!toOwner.ok) console.error("[reality-check] owner notification failed:", toOwner.error);

  return NextResponse.json({ ok: true });
}
