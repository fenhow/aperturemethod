import { questions, scoreAnswers } from "@/lib/realityCheck";
import { generateRealityCheckPdf } from "@/lib/realityCheckPdf";

/**
 * /clarity-check/sample-report — the written breakdown PDF for a made-up set of
 * answers, so visitors can see what they would receive before giving a name
 * and email (Fenwick asked for it, 6 Oct 2026). Built from the live questions
 * and the same generator as the real report, so it can never drift from it.
 * Labelled as a sample throughout; no real business or person.
 */

export const runtime = "nodejs";
export const revalidate = 3600;

/** A believable middle-of-the-road pattern: some strengths, some gaps. */
const PATTERN = [4, 2, 1, 2, 0, 4, 1, 2, 2, 1, 0, 2, 4, 1, 2];

export async function GET() {
  const answers: Record<string, number> = {};
  questions.forEach((q, i) => {
    const wanted = PATTERN[i % PATTERN.length]!;
    const opt =
      q.options.find((o) => o.score === wanted) ??
      q.options.reduce((a, b) => (Math.abs(a.score - wanted) <= Math.abs(b.score - wanted) ? a : b));
    answers[q.id] = opt.score;
  });
  const date = new Date().toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const built = await generateRealityCheckPdf({ name: "Sample report", company: "Sample report (example answers)" }, scoreAnswers(answers), answers, date);
  return new Response(Buffer.from(built.bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": 'inline; filename="Clarity Check - Sample Report.pdf"',
      "cache-control": "public, max-age=3600",
    },
  });
}
