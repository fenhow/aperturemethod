import { questions, scoreAnswers } from "@/lib/realityCheck";
import { reportHtml, ownerHtml } from "@/lib/realityCheckEmail";
import { generateRealityCheckPdf } from "@/lib/realityCheckPdf";

/**
 * /preview-email — see a Reality Check email without sending one.
 *
 * WHY THIS EXISTS. Submitting the form fires two messages a second apart with
 * near-identical subject lines, one to the visitor and one to the lead inbox.
 * If those two addresses forward to the same mailbox, as they do here, the one
 * you open is a coin flip, and "the email is missing a section" and "I opened
 * the other email" look exactly alike from the outside. This renders either
 * template on demand, in the browser, instantly, with nothing sent to anyone.
 *
 *   /preview-email              the customer's report
 *   /preview-email?who=owner    the lead alert
 *   /preview-email?score=low    someone with a lot of gaps
 *   /preview-email?score=high   someone with almost none
 *   /preview-email?pdf=1        the attached PDF, rendered in the browser
 *
 * DEVELOPMENT ONLY. It returns 404 in production, because the templates carry
 * the firm's sales copy and there is no reason for that to sit on a public URL.
 * Run `npm run dev` and open http://localhost:3000/preview-email.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Answer patterns, so both ends of the score range can be eyeballed. */
const PATTERNS: Record<string, number[]> = {
  mixed: [0, 4, 1, 2, 4],
  low: [0, 1, 0, 1, 0],
  high: [4, 4, 4, 2, 4],
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const params = new URL(request.url).searchParams;
  const pattern = PATTERNS[params.get("score") ?? "mixed"] ?? PATTERNS.mixed!;

  const answers: Record<string, number> = {};
  questions.forEach((q, i) => {
    const wanted = pattern[i % pattern.length]!;
    // Snap to a score this question actually offers, so the preview can never
    // render a row as "Not answered" the way a hand-built payload would.
    const opt =
      q.options.find((o) => o.score === wanted) ??
      q.options.reduce((a, b) => (Math.abs(a.score - wanted) <= Math.abs(b.score - wanted) ? a : b));
    answers[q.id] = opt.score;
  });

  const result = scoreAnswers(answers);

  if (params.get("pdf")) {
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
    const built = await generateRealityCheckPdf(
      { name: "Sample Owner", company: "Sample Co" },
      result,
      answers,
      date
    );
    return new Response(Buffer.from(built.bytes), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `inline; filename="${built.filename}"`,
        "cache-control": "no-store",
      },
    });
  }

  const html =
    params.get("who") === "owner"
      ? ownerHtml(
          { name: "Sample Owner", company: "Sample Co", title: "Owner", email: "owner@example.com" },
          result,
          answers
        )
      : reportHtml(result, answers);

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
