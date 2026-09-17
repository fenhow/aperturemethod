import { questions, scoreAnswers, type RCResult } from "@/lib/realityCheck";
import { siteConfig } from "@/lib/site";

/**
 * Reality Check: the two emails, and nothing else.
 *
 * These used to live inside the API route. A Next.js route file may only export
 * the HTTP verbs and a handful of config keys, so nothing else could import the
 * templates, which meant the only way to see an email was to submit the form and
 * go looking in an inbox. Two messages land a second apart with near-identical
 * subjects, and checking the wrong one is the obvious mistake to make. They live
 * here now so /preview-email can render either on demand, in development, with
 * nothing sent.
 *
 * Reality Check: the written breakdown.
 *
 * The score is always shown on screen. When someone asks for the long version
 * we send it to them immediately, and send Fenwick a copy as a lead
 * notification. Both go over the same SMTP relay as the rest of the site.
 *
 * If SMTP is not configured we say so honestly rather than showing a success
 * message for an email that was never sent.
 */


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

/**
 * The question-by-question walkthrough, shared by both emails.
 *
 * It renders into the visitor's report AND into the lead alert. That is
 * deliberate duplication rather than an oversight: the two messages arrive
 * within a second of each other with near-identical subject lines, and telling
 * them apart by reading the header is a job nobody should have. Putting the
 * same reference in both means whichever one gets opened is the right one, and
 * it gives the alert something it genuinely wanted anyway, which is the metric
 * behind each answer, in hand before a call.
 *
 * One block per question, in the order they were asked: the question, the
 * answer they gave, then the measure behind it. That order is deliberate. A
 * reference detached from your own answers is a glossary, and nobody reads a
 * glossary; the same words sitting directly under what you just said about
 * your business are a verdict you can act on.
 *
 * This is the part of the email people keep. The panel in the quiz gives the
 * definition and the arithmetic, and the results screen adds the reading, but
 * both are transient. Here all three land in one place the owner can come
 * back to, print, or hand to their bookkeeper, which is the whole reason for
 * asking for an email address at all. Their own gaps are marked so the list
 * has an order to work through rather than being fifteen equal items.
 *
 * Run-in bold labels rather than headings: Outlook collapses margins on
 * stacked headings, and at fifteen entries the vertical rhythm falls apart.
 */
function walkthroughHtml(answers: Record<string, number>): string {
    return questions
    .map((q, i) => {
      const weak = (answers[q.id] ?? 0) <= 1;
      const n = String(i + 1).padStart(2, "0");
      const beat = (label: string, text: string) =>
        `<p style="font-size:14px;line-height:1.65;color:${INK};margin:10px 0 0">
           <strong style="color:${MAROON}">${label}</strong> ${esc(text)}
         </p>`;
      const chosen = q.options.find((o) => o.score === answers[q.id]);
      return `<table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:14px">
        <tr><td style="padding:18px 20px;background:${weak ? SURFACE : "#ffffff"};
          border:1px solid ${LINE};border-left:3px solid ${weak ? MAROON : LINE}">
          <p style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${GRAY};font-weight:700;margin:0 0 5px">
            ${n} &middot; ${esc(q.area)}${weak ? ` <span style="color:${MAROON}">&middot; one of your gaps</span>` : ""}
          </p>

          <div style="font-size:16px;font-weight:700;color:${INK};line-height:1.4">${esc(q.prompt)}</div>

          <table role="presentation" style="border-collapse:collapse;width:100%;margin:12px 0 4px">
            <tr><td style="padding:10px 14px;background:${weak ? "#ffffff" : SURFACE};
              border-left:3px solid ${weak ? MAROON : LINE}">
              <p style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${GRAY};font-weight:700;margin:0 0 3px">
                Your answer
              </p>
              <p style="font-size:14px;line-height:1.5;margin:0;color:${weak ? MAROON : INK};font-weight:${weak ? 700 : 400}">
                ${chosen ? esc(chosen.label) : "Not answered"}
              </p>
            </td></tr>
          </table>

          <p style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${GRAY};font-weight:700;margin:16px 0 2px">
            The measure behind it
          </p>
          <div style="font-size:15px;font-weight:700;color:${INK};line-height:1.35">${esc(q.explainer.metric)}</div>
          ${beat("What it is.", q.explainer.what)}
          ${beat("How it is calculated.", q.explainer.how)}
          ${beat("What the number tells you.", q.explainer.reading)}
        </td></tr>
      </table>`;
    })
    .join("");
}

/** The report the visitor receives. Plain, table-based HTML for email clients. */
export function reportHtml(result: RCResult, answers: Record<string, number>): string {
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
        : `<h2 style="font-size:19px;margin:0 0 6px;color:${INK}">You answered all ${questions.length} with confidence</h2>
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

    <h2 style="font-size:19px;margin:0 0 6px;color:${INK}">Question by question</h2>
    <p style="font-size:14px;color:${GRAY};margin:0 0 18px;line-height:1.6">
      Every question, the answer you gave, and the measure behind it: what it is, how it is
      calculated, and what the number tells you once you have it. Your gaps are marked, and they
      are the ones worth starting with. Nothing here needs software you do not already have; most
      of it comes off a P&amp;L and a balance sheet you already produce.
    </p>
    ${walkthroughHtml(answers)}
    <div style="height:14px"></div>

    <table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:26px">
      <tr><td style="padding:22px 24px;border:1px solid ${LINE}">
        <h2 style="font-size:18px;margin:0 0 10px;color:${INK}">What this is, and what it is not</h2>
        <p style="font-size:15px;line-height:1.6;color:${GRAY};margin:0 0 18px">
          This is a self-assessment. It tells you what you do not currently know. The Business
          X-Ray&trade; is the diagnostic that answers it: a seven-lens read of the whole
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

    <table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:26px">
      <tr><td style="padding:24px;background:${SURFACE};border-left:4px solid ${MAROON}">
        <h2 style="font-size:18px;margin:0 0 10px;color:${INK}">Thank you for taking it.</h2>
        <p style="font-size:15px;line-height:1.6;color:${INK};margin:0 0 14px">
          Fifteen honest answers about your own business is more scrutiny than most owners ever
          apply to it, and the useful part is not the score. It is the two or three questions you
          could not answer, which are now named. The same result is attached as a PDF if you would
          rather print it or pass it to whoever keeps your books.
        </p>
        <p style="font-size:15px;line-height:1.6;color:${INK};margin:0 0 18px">
          If you want to talk any of it through, book a consultation. No charge, no pitch: bring
          the one answer that bothered you most and we will work out whether it is worth doing
          anything about.
        </p>
        <a href="${siteUrl("/contact?ref=reality-check-report#book")}"
           style="display:inline-block;background:${MAROON};color:#ffffff;text-decoration:none;
           font-size:15px;font-weight:700;padding:14px 28px">Book a consultation</a>
        <p style="font-size:13px;line-height:1.6;color:${GRAY};margin:16px 0 0">
          Or reply to this message. It comes straight to me.<br>
          <span style="color:${INK};font-weight:700">Fenwick How</span> &middot; Founder, The
          Aperture Method &middot;
          <a href="${siteUrl("/")}" style="color:${MAROON};font-weight:700;text-decoration:underline">aperturemethod.com</a>
        </p>
      </td></tr>
    </table>

    <p style="font-size:12px;color:${GRAY};border-top:1px solid ${LINE};padding-top:16px;margin:0;line-height:1.6">
      You received this because you asked for your Reality Check breakdown at
      ${esc(siteUrl("/reality-check"))}. We will not add you to a sequence.
    </p>
  </div></body></html>`;
}

/** The lead notification Fenwick receives. */
export function ownerHtml(
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
      Reality Check: new lead
    </p>
    <p style="margin:6px 0 0;font-size:12px;color:${GRAY};line-height:1.5">
      This is your internal alert. Their copy went out separately, subject
      &ldquo;Your Reality Check: ${result.score}/100&rdquo;.
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
      <strong>${result.score}/100 &middot; ${esc(result.band.name)}</strong>
    </p>
    <p style="font-size:15px;margin:0 0 6px">
      Could not answer with confidence: <strong>${result.gaps.length} of ${questions.length}</strong>
    </p>
    <p style="font-size:15px;margin:0 0 18px">
      ${
        result.blindSpot
          ? `Biggest blind spot: <strong>${esc(result.blindSpot.area)}</strong>, ${esc(
              result.blindSpot.blindSpot.headline
            )} <span style="color:${GRAY}">(${esc(result.blindSpot.component)})</span>`
          : `<span style="color:${GRAY}">No blind spot: full marks throughout.</span>`
      }
    </p>
    <table style="border-collapse:collapse;width:100%;border-top:2px solid ${INK}">${rows}</table>

    <h3 style="font-size:17px;margin:30px 0 4px;color:${INK}">The metrics behind their answers</h3>
    <p style="font-size:13px;color:${GRAY};margin:0 0 16px;line-height:1.6">
      The same reference they received, so you have it in hand before you call. Their gaps are
      shaded.
    </p>
    ${walkthroughHtml(answers)}
  </div>`;
}
