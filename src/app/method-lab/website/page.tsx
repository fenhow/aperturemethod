import Link from "next/link";
import { cookies } from "next/headers";
import { Section } from "@/components/ui/Section";
import { METHOD_LAB_COOKIE, hasMethodLabAccess } from "@/lib/methodLab";
import { EXCLUDE_REASONS, MIN_SECONDS } from "@/lib/realityStudyStats";
import { ctToday, loadSite, parseRange, type SiteStats } from "@/lib/websiteCheckStats";
import { ExcludeControl } from "@/components/reality/ExcludeControl";
import { sourceLabel } from "@/lib/realityStudy";
import { questions } from "@/lib/realityCheck";

/**
 * /method-lab/website — the public Clarity Check on the website (/clarity-check),
 * read as demand and marketing data. Fenwick asked for it (Oct 2026) once he
 * saw website completions arriving by email but nowhere on the survey
 * dashboard. Deliberately separate from /method-lab/study: the website version
 * has no honesty commitment, profile or follow-up questions, so it never feeds the
 * capstone figures. Method Lab passphrase only (middleware, and checked here).
 */

export const dynamic = "force-dynamic";

const f0 = (x: number | null | undefined) => (x === null || x === undefined ? "—" : Math.round(x).toString());
const f1 = (x: number | null | undefined) => (x === null || x === undefined ? "—" : x.toFixed(1));
const tag = (v: string | null | undefined) => (v ? sourceLabel(v) : "No link tag");

type Search = { all?: string; range?: string; from?: string; to?: string };

/** The range part of the query string, so the PDF, CSV and "show all" keep it. */
function rangeQs(q: Search, extra?: Record<string, string>) {
  const p = new URLSearchParams();
  for (const k of ["range", "from", "to"] as const) if (q[k]) p.set(k, q[k]!);
  for (const [k, v] of Object.entries(extra ?? {})) p.set(k, v);
  const out = p.toString();
  return out ? `?${out}` : "";
}

export default async function WebsiteCheckPage({ searchParams }: { searchParams: Search }) {
  if (!(await hasMethodLabAccess(cookies().get(METHOD_LAB_COOKIE)?.value))) {
    return (
      <Section className="pt-28 md:pt-36">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-h2 font-semibold text-ink">This page is in the Method Lab.</h1>
          <p className="mt-6">
            <a href="/method-lab/enter" className="btn">Enter the Method Lab</a>
          </p>
        </div>
      </Section>
    );
  }

  let s: SiteStats | null = null;
  let loadError: string | null = null;
  try {
    s = await loadSite(parseRange(searchParams));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Could not read the responses table.";
  }

  return (
    <Section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Method Lab · Website</p>
            <h1 className="text-h1 font-semibold text-ink">Website Clarity Check</h1>
            <p className="mt-3 max-w-2xl text-body text-muted">
              Every completed run of the free Clarity Check on the website. Kept separate from the capstone
              survey, which has its own dashboard: these visitors saw no honesty commitment, profile or price
              question, so the two are never pooled.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`/method-lab/website/report${rangeQs(searchParams)}`} target="_blank" rel="noopener" className="btn">Download PDF report</a>
            <a href={`/method-lab/website/export${rangeQs(searchParams)}`} className="btn--secondary">Download CSV</a>
            <Link href="/clarity-check" className="btn--secondary">Open the Clarity Check</Link>
            <a href="/method-lab/study" className="btn--secondary">Survey dashboard</a>
            <a href="/method-lab" className="btn--secondary">Method Lab</a>
          </div>
        </div>

        {loadError ? (
          <Panel title="Could not load the data">
            <p className="text-body text-muted">{loadError}</p>
          </Panel>
        ) : !s ? (
          <Panel title="Supabase service key not configured">
            <p className="text-body text-muted">Set SUPABASE_SERVICE_ROLE_KEY on Vercel to read the responses.</p>
          </Panel>
        ) : (
          <Dashboard s={s} q={searchParams} />
        )}
      </div>
    </Section>
  );
}

function Dashboard({ s, q }: { s: SiteStats; q: Search }) {
  const showAll = q.all === "1";
  return (
    <>
      <RangeBar q={q} label={s.range.label} />
      <p className="mt-3 text-caption text-muted">
        {s.firstStored && s.lastStored
          ? `Saving since ${stampDate(s.firstStored)}. Latest response saved ${stampDate(s.lastStored)}, ${stampTime(s.lastStored)}.`
          : "Nothing saved yet."}{" "}
        Every completion email now says whether that response was saved.
      </p>
      {/* ───────── headline */}
      <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Completed" value={String(s.n)} sub={`${s.range.label} · ${s.last7} in the last 7 days, ${s.last30} in the last 30`} />
        <Tile label="Average Clarity Score" value={f0(s.meanScore)} sub={`Median ${f0(s.medianScore)}`} />
        <Tile label="Questions they could not answer" value={f1(s.meanGaps)} sub={`On average, of ${questions.length}`} />
        <Tile
          label="Time to finish"
          value={s.medianSeconds === null ? "—" : `${Math.floor(s.medianSeconds / 60)}:${String(Math.round(s.medianSeconds % 60)).padStart(2, "0")}`}
          sub="Median, minutes:seconds"
        />
      </div>
      <p className="mt-3 text-caption text-muted">
        {s.exclusions.length
          ? "Not counted: " + s.exclusions.map((e) => `${e.count} ${e.reason.toLowerCase()}`).join(" · ")
          : "Nothing left out so far."}{" "}
        (Counted means at least {MIN_SECONDS} seconds and not tagged test. {s.totalRows} completed in total.)
      </p>

      {s.n === 0 ? (
        <Panel title="No website completions yet">
          <p className="text-body text-muted">
            {s.range.label === "All time" ? "Completed runs of /clarity-check will appear here." : "Nothing in this date range. Try a wider one."}
          </p>
        </Panel>
      ) : (
        <>
          <Panel title={s.trendUnit === "day" ? "Completions per day" : "Completions per week"}>
            <WeekChart data={s.trend} />
            <p className="mt-3 text-caption text-muted">
              {s.trendUnit === "day" ? "Each bar is one day" : "Each bar is a week, Monday to Sunday (latest 26 weeks at most)"}, Central time.
            </p>
          </Panel>

          <div className="grid gap-6 md:grid-cols-2">
            <Panel title="Clarity Score distribution">
              <Histogram data={s.histogram} />
            </Panel>
            <Panel title="Result bands">
              <Bars rows={s.bandCounts.map((b) => ({ label: b.name, n: b.n, pct: b.pct }))} />
            </Panel>
          </div>

          <Panel title="Where visitors are guessing">
            <p className="text-small text-muted">
              Share who could not answer each question with confidence (their answer scored 0 or 1). The top of this
              list is what to lead your marketing with: the numbers visitors most admit they do not have.
            </p>
            <ul className="mt-5 space-y-3">
              {s.byQuestion.map((q) => (
                <li key={q.id}>
                  <div className="flex items-baseline justify-between gap-4 text-small">
                    <span className="font-semibold text-ink" title={q.prompt}>{q.area}</span>
                    <span className="shrink-0 tabular-nums text-muted">
                      {f0(q.pct)}%{q.ci ? <span className="text-caption"> ({f0(q.ci.lo)}–{f0(q.ci.hi)})</span> : null}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-line">
                    <div className="h-full bg-maroon" style={{ width: `${Math.max(q.pct, 0.5)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="grid gap-6 md:grid-cols-2">
            {s.blindSpots.length ? (
              <Panel title="Most common biggest blind spot">
                <Bars rows={s.blindSpots.map((b) => ({ label: b.area, n: b.n, pct: (100 * b.n) / s.n }))} />
              </Panel>
            ) : null}
            <Panel title="Link tags">
              <Bars rows={s.sources.map((x) => ({ label: tag(x.source), n: x.count, pct: (100 * x.count) / s.n }))} />
              <p className="mt-3 text-caption text-muted">
                From ?src= or utm_source on the link they used. Untagged visits arrive directly, from search or from
                untagged posts; the completion email names the site they came from.
              </p>
            </Panel>
          </div>
        </>
      )}

      {/* ───────── every response */}
      <Panel title={showAll ? `All responses (${s.recent.length})` : "Latest responses"}>
        <p className="-mt-2 mb-4 text-caption text-muted">
          Exclude takes a response out of every figure but keeps it on record; Restore puts it back. Delete removes it
          permanently. Grey rows are not counted.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px] leading-snug">
            <thead className="text-[11px] uppercase tracking-overline text-muted">
              <tr className="border-b border-line">
                <th className="py-2 pr-3">Date &amp; time</th>
                <th className="py-2 pr-3">Link tag</th>
                <th className="py-2 pr-3">Score</th>
                <th className="py-2 pr-3">Band</th>
                <th className="py-2 pr-3">Blind spot</th>
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Counted</th>
                <th className="py-2"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {(showAll ? s.recent : s.recent.slice(0, 25)).map((r) => (
                <tr key={r.run_id} className={`border-b border-line ${r.excluded ? "text-muted" : "text-ink"}`}>
                  <td className="py-2 pr-3 whitespace-nowrap">
                    <span className="block">{stampDate(r.created_at)}</span>
                    <span className="block text-[11px] text-muted">{stampTime(r.created_at)}</span>
                  </td>
                  <td className="py-2 pr-3">{tag(r.source)}</td>
                  <td className="py-2 pr-3 tabular-nums">{r.score}</td>
                  <td className="py-2 pr-3">{r.band}</td>
                  <td className="py-2 pr-3">{questions.find((q) => q.id === r.blind_spot)?.area ?? "—"}</td>
                  <td className="py-2 pr-3 whitespace-nowrap tabular-nums">
                    {r.duration_s === null ? "—" : `${Math.floor(r.duration_s / 60)}m ${r.duration_s % 60}s`}
                  </td>
                  <td className="py-2 pr-3">
                    {r.excluded ? r.excluded : "Yes"}
                    {r.excluded_reason && r.updated_at ? (
                      <span className="block text-[11px] text-muted">
                        on {stampDate(r.updated_at)}, {stampTime(r.updated_at)}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 text-right">
                    <ExcludeControl
                      runId={r.run_id}
                      removed={Boolean(r.excluded_reason)}
                      canExclude={!r.excluded || Boolean(r.excluded_reason)}
                      reasons={EXCLUDE_REASONS}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {s.recent.length > 25 ? (
          <p className="mt-4 text-small">
            <Link href={`/method-lab/website${showAll ? rangeQs(q) : rangeQs(q, { all: "1" })}`} className="font-semibold text-maroon hover:underline">
              {showAll ? "Show the latest 25 only" : `Show all ${s.recent.length} responses`}
            </Link>
          </p>
        ) : null}
      </Panel>
    </>
  );
}

/* ───────────────────────── pieces */

function RangeBar({ q, label }: { q: Search; label: string }) {
  const chip = (on: boolean) =>
    `whitespace-nowrap rounded-full border px-3 py-1 text-[13px] transition-colors ${on ? "border-maroon bg-maroon text-white" : "border-line text-ink hover:border-maroon"}`;
  const custom = Boolean(q.from || q.to);
  const presets: { key: string; text: string }[] = [
    { key: "7", text: "Last 7 days" },
    { key: "30", text: "Last 30 days" },
    { key: "90", text: "Last 90 days" },
    { key: "365", text: "Last 12 months" },
    { key: "", text: "All time" },
  ];
  return (
    <div className="mt-8 rounded-lg border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-full shrink-0 text-[11px] font-semibold uppercase tracking-overline text-muted sm:w-24">Date range</span>
        {presets.map((p) => (
          <Link
            key={p.text}
            href={p.key ? `/method-lab/website?range=${p.key}` : "/method-lab/website"}
            className={chip(!custom && (q.range ?? "") === p.key)}
          >
            {p.text}
          </Link>
        ))}
      </div>
      <form method="get" action="/method-lab/website" className="mt-3 flex flex-wrap items-center gap-2 text-[13px] sm:pl-[104px]">
        <label className="flex items-center gap-2 text-muted">
          From
          <input type="date" name="from" defaultValue={q.from ?? ""} max={ctToday()} className="rounded border border-line bg-white px-2 py-1 text-ink" />
        </label>
        <label className="flex items-center gap-2 text-muted">
          to
          <input type="date" name="to" defaultValue={q.to ?? ""} max={ctToday()} className="rounded border border-line bg-white px-2 py-1 text-ink" />
        </label>
        <button type="submit" className={chip(custom)}>Apply</button>
        <span className="text-caption text-muted">Showing: <strong className="text-ink">{label}</strong></span>
      </form>
    </div>
  );
}

function stampDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" });
}
function stampTime(iso: string) {
  return (
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", timeZone: "America/Chicago" }) +
    " CT"
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-lg border border-line p-6 sm:p-8">
      <h3 className="text-h4 font-semibold text-ink">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Same tile as the study dashboard: two-line label block, figures on a
 *  common baseline, note pinned to the bottom so a row of them lines up. */
function Tile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex h-full flex-col items-center rounded-lg border border-line p-5 text-center">
      <p className="min-h-[2.4em] text-[10.5px] font-semibold uppercase leading-[1.2] tracking-[0.1em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-[40px] font-semibold leading-none text-maroon tabular-nums">{value}</p>
      <p className="mt-auto max-w-[22ch] pt-3 text-[11.5px] leading-[1.45] text-muted">{sub}</p>
    </div>
  );
}

function Bars({ rows }: { rows: { label: string; n: number; pct: number }[] }) {
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex justify-between gap-4 text-small">
            <span className="text-ink">{r.label}</span>
            <span className="shrink-0 tabular-nums text-muted">{r.n} · {f0(r.pct)}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full bg-maroon" style={{ width: `${Math.max(r.pct, 0.5)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Histogram({ data }: { data: { label: string; n: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  return (
    <div>
      <div className="flex h-44 items-end gap-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end">
            <span className="mb-1 text-caption tabular-nums text-muted">{d.n || ""}</span>
            <div className="w-full rounded-t bg-maroon" style={{ height: `${(d.n / max) * 85}%`, minHeight: d.n ? 3 : 0 }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 border-t border-line pt-2">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[10px] text-muted">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function WeekChart({ data }: { data: { label: string; n: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  return (
    <div>
      <div className="flex h-36 items-end gap-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end">
            <span className="mb-1 text-caption tabular-nums text-muted">{d.n || ""}</span>
            <div className="w-full rounded-t bg-maroon" style={{ height: `${(d.n / max) * 80}%`, minHeight: d.n ? 3 : 0 }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 border-t border-line pt-2">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[10px] leading-tight text-muted">{d.label}</span>
        ))}
      </div>
    </div>
  );
}
