import "server-only";
import { questions } from "./realityCheck";
import { sourceLabel } from "./realityStudy";
import { MIN_SECONDS } from "./realityStudyStats";
import { CW, M, MUTED, Report, r0, r1 } from "./realityStudyPdf";
import type { SiteStats } from "./websiteCheckStats";

/** The website Clarity Check as a branded PDF, built on the study report's layout. */
export async function generateWebsiteReportPdf(s: SiteStats): Promise<{ bytes: Uint8Array; filename: string }> {
  const now = new Date();
  const asOf = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Chicago" });
  const d = new Report();
  await d.init("Website results · aperturemethod.com/clarity-check", asOf, `${s.n} completed · ${s.last30} in the last 30 days`, "Website Clarity Check");

  d.section("Summary", 80);
  if (s.n === 0) {
    d.para("No website completions yet. This report fills in automatically as visitors finish the Clarity Check.");
  } else {
    const top = s.byQuestion[0];
    const spot = s.blindSpots[0];
    d.para(
      [
        `${s.n} visitors completed the free Clarity Check on the website (${s.last7} in the last 7 days, ${s.last30} in the last 30).`,
        `Their average Clarity Score was ${r0(s.meanScore)} out of 100 (median ${r0(s.medianScore)}), and on average they could not answer ${r1(s.meanGaps)} of the ${questions.length} questions with confidence.`,
        top ? `The question visitors were least able to answer was "${top.area}": ${r0(top.pct)}% could not answer it with confidence.` : "",
        spot ? `The most common biggest blind spot was ${spot.area} (${spot.n} of ${s.n}).` : "",
      ].filter(Boolean).join(" "),
      { size: 10.5, after: 8 }
    );
    d.tiles([
      { label: "Completed", value: String(s.n), sub: `${s.last7} last 7 days · ${s.last30} last 30` },
      { label: "Avg Clarity Score", value: r0(s.meanScore), sub: `Median ${r0(s.medianScore)}` },
      { label: "Could not answer", value: r1(s.meanGaps), sub: `Questions on average, of ${questions.length}` },
      {
        label: "Time to finish",
        value: s.medianSeconds === null ? "-" : `${Math.floor(s.medianSeconds / 60)}:${String(Math.round(s.medianSeconds % 60)).padStart(2, "0")}`,
        sub: "Median, minutes:seconds",
      },
    ]);

    d.section("Completions per week (last 12 weeks)", 150);
    d.y -= d.histogram(s.weekly.map((w) => ({ label: w.label, n: w.n })), M, CW) + 6;

    d.section("Clarity Score distribution", 150);
    d.y -= d.histogram(s.histogram, M, CW) + 6;

    d.section("Result bands", 90);
    for (const b of s.bandCounts) d.bar(b.name, `${b.n} · ${r0(b.pct)}%`, b.pct);

    d.section("Where visitors are guessing", 200);
    d.para("Share who could not answer each question with confidence (scored 0 or 1), highest first. 95% intervals in brackets.", { size: 8.5, color: MUTED, after: 6 });
    for (const q of s.byQuestion) {
      d.bar(q.area, `${r0(q.pct)}%${q.ci ? ` (${r0(q.ci.lo)}-${r0(q.ci.hi)})` : ""}`, q.pct);
    }

    if (s.blindSpots.length) {
      d.section("Most common biggest blind spot", 100);
      for (const b of s.blindSpots) d.bar(b.area, `${b.n} · ${r0((100 * b.n) / s.n)}%`, (100 * b.n) / s.n);
    }

    d.section("Link tags", 90);
    for (const x of s.sources) {
      d.bar(x.source ? sourceLabel(x.source) : "No link tag", `${x.count} · ${r0((100 * x.count) / s.n)}%`, (100 * x.count) / s.n);
    }
  }

  d.section("Notes", 100);
  const ex = s.exclusions.length ? s.exclusions.map((e) => `${e.count} ${e.reason.toLowerCase()}`).join(", ") : "none";
  d.para(
    `Counted means finished in at least ${MIN_SECONDS} seconds and not tagged as a test. ${s.totalRows} completed in total; left out: ${ex}. ` +
      "This is the public website version: visitors saw no honesty commitment, profile or price question, so these results are reported separately from the capstone survey and never pooled with it. Visitors are self-selected; read the figures as demand signals, not population estimates.",
    { size: 8.5, color: MUTED }
  );

  d.footers();
  const bytes = await d.doc.save();
  return { bytes, filename: `Website Clarity Check - Results ${now.toISOString().slice(0, 10)}.pdf` };
}
