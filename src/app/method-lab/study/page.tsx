import Link from "next/link";
import { cookies } from "next/headers";
import { Section } from "@/components/ui/Section";
import { METHOD_LAB_COOKIE, hasMethodLabAccess } from "@/lib/methodLab";
import { loadStudy, MIN_N_TO_READ, MIN_SECONDS, type Count, type StudyStats } from "@/lib/realityStudyStats";
import { studyFields } from "@/lib/realityStudy";
import { questions } from "@/lib/realityCheck";
import { fmtP, type ProportionTest } from "@/lib/stats";
import {
  VERDICT_LABEL,
  STATS_CAVEAT,
  correlationSentence,
  groupSentence,
  moeSentence,
  overconfidenceSentence,
  proportionSentence,
} from "@/lib/realityStudyReadout";

/**
 * /method-lab/study — the Reality Check research study, read for the capstone.
 *
 * Behind the Method Lab passphrase (Fenwick chose this over the email sign-in,
 * Oct 2026). The middleware gates every /method-lab path; the cookie is checked
 * again here so the page never renders data on its own. Reads Supabase reality_check_responses with
 * the service role and computes everything in src/lib/realityStudyStats.ts.
 * Optional segment filters ride in the query string (?revenue=5-20m etc.).
 *
 * @illustrative-figures — dollar amounts here are the H2 survey threshold and
 * the H1 revenue range, not our fees. Fees live only in src/lib/pricing.ts.
 */

export const dynamic = "force-dynamic";

const f1 = (x: number | null | undefined) => (x === null || x === undefined ? "—" : x.toFixed(1));
const f0 = (x: number | null | undefined) => (x === null || x === undefined ? "—" : Math.round(x).toString());

type Search = { revenue?: string; industry?: string; source?: string };

/** The current filter as a query string, so the PDF matches what is on screen. */
function qs(f: Search) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) if (v) q.set(k, v);
  const out = q.toString();
  return out ? `?${out}` : "";
}

export default async function StudyAdminPage({ searchParams }: { searchParams: Search }) {
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

  const filter: Search = {
    revenue: searchParams.revenue || undefined,
    industry: searchParams.industry || undefined,
    source: searchParams.source || undefined,
  };

  let s: StudyStats | null = null;
  let loadError: string | null = null;
  try {
    s = await loadStudy(filter);
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Could not read the study table.";
  }

  return (
    <Section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Method Lab · Research study</p>
            <h1 className="text-h1 font-semibold text-ink">Reality Check study</h1>
            <p className="mt-3 max-w-2xl text-body text-muted">
              Every completed run of /reality-check/study, read for the capstone. Figures use the
              clean sample only; what was left out, and why, is listed below the progress bar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`/method-lab/study/report${qs(filter)}`} target="_blank" rel="noopener" className="btn">Download PDF report</a>
            <a href="/method-lab/study/export" className="btn--secondary">Download CSV</a>
            <Link href="/reality-check/study" className="btn--secondary">Open the study</Link>
            <a href="/method-lab" className="btn--secondary">Method Lab</a>
          </div>
        </div>

        {loadError ? (
          <Panel title="Could not load the data">
            <p className="text-body text-muted">
              {loadError}. If the table is missing, run supabase/migrations/0004 in the Supabase SQL
              Editor. If the service key is missing, set SUPABASE_SERVICE_ROLE_KEY on Vercel.
            </p>
          </Panel>
        ) : !s ? (
          <Panel title="Supabase service key not configured">
            <p className="text-body text-muted">Set SUPABASE_SERVICE_ROLE_KEY on Vercel to read the study.</p>
          </Panel>
        ) : (
          <Dashboard s={s} filter={filter} />
        )}
      </div>
    </Section>
  );
}

function Dashboard({ s, filter }: { s: StudyStats; filter: Search }) {
  const progress = Math.min(100, (s.cleanTotal / s.target) * 100);
  const early = s.n < MIN_N_TO_READ;

  return (
    <>
      {/* ───────── progress */}
      <div className="mt-10 rounded-lg border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-h3 font-semibold text-ink">
            {s.cleanTotal} <span className="text-body font-normal text-muted">of {s.target} usable responses</span>
          </p>
          <p className="text-small text-muted">
            {s.totalRows} completed in total · {s.optins} asked for the benchmark report
          </p>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full bg-maroon" style={{ width: `${Math.max(progress, 1)}%` }} />
        </div>
        <p className="mt-3 text-caption text-muted">
          {s.exclusions.length
            ? "Left out: " + s.exclusions.map((e) => `${e.count} ${e.reason.toLowerCase()}`).join(" · ")
            : "Nothing left out so far."}{" "}
          (Usable means first attempt, at least {MIN_SECONDS} seconds, not tagged test.)
        </p>
        <p className="mt-1 text-caption text-muted">{moeSentence(s)}</p>
      </div>

      {/* ───────── filters */}
      <Filters s={s} filter={filter} />

      {s.n === 0 ? (
        <Panel title="No responses yet">
          <p className="text-body text-muted">
            {s.filtered ? "Nothing matches this filter." : "Share the tagged study links and results will appear here."}
          </p>
        </Panel>
      ) : (
        <>
          {early ? (
            <p className="mt-6 rounded-md border-l-4 border-maroon bg-surface px-4 py-3 text-small text-ink">
              {s.n} responses {s.filtered ? "in this segment" : "so far"}. Percentages below {MIN_N_TO_READ} responses
              move a lot with each new answer, so treat them as early signals, not findings.
            </p>
          ) : null}

          {/* ───────── headline */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Tile
              label="Average Clarity Score"
              value={f0(s.meanScore)}
              sub={`Median ${f0(s.medianScore)}${s.stats.meanScore ? ` · 95% CI ${f0(s.stats.meanScore.ci.lo)}–${f0(s.stats.meanScore.ci.hi)}` : ""}`}
            />
            <Tile
              label="What owners think"
              value={f0(s.meanSelf)}
              sub={`Average self-rating, ×10 to match the score (n = ${s.nRated})`}
            />
            <Tile
              label="Overconfidence gap"
              value={s.meanOverconfidence === null ? "—" : `${s.meanOverconfidence > 0 ? "+" : ""}${f0(s.meanOverconfidence)}`}
              sub={`${f0(s.pctOverconfident)}% rated above their score${s.stats.overconfidence ? ` · ${fmtP(s.stats.overconfidence.p)}` : ""}`}
            />
            <Tile label="Questions they could not answer" value={f1(s.meanGaps)} sub={`On average, of ${questions.length}`} />
          </div>

          {/* ───────── hypotheses */}
          <h2 className="mt-14 text-h3 font-semibold text-ink">What it says about the hypotheses</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Hypothesis
              code="H1"
              claim="$1–20M owner-run firms lack access to decision-grade analysis."
              test="Falsified if fewer than 40% report no access. Tested: is the true share above 40%?"
              t={s.h1}
              measure="of $1–20M firms get analysis from no one, only their bookkeeper or CPA, or software alone"
              extra={null}
            />
            <Hypothesis
              code="H2"
              claim="Owners will pay for a fixed-fee diagnostic."
              test="Falsified if willingness to pay clusters below $3,000. Tested: do most owners say $3,000 or more?"
              t={s.h2}
              measure="would pay $3,000 or more for an independent diagnostic"
              extra={
                s.h2AtPrice.n
                  ? `At the actual $4,500 fee: ${f0(s.h2AtPrice.pct)}% would pay it or more (95% CI ${f0(s.h2AtPrice.ci?.lo)}–${f0(s.h2AtPrice.ci?.hi)}%).`
                  : null
              }
            />
          </div>
          {/* ───────── how sure */}
          <Panel title="How sure can we be?">
            <ul className="space-y-3 text-body text-body">
              {[overconfidenceSentence(s), correlationSentence(s), `H1: ${proportionSentence(s.h1, "H1")}`, `H2: ${proportionSentence(s.h2, "H2")}`]
                .filter(Boolean)
                .map((t) => (
                  <li key={t!} className="border-l-2 border-maroon pl-4">{t}</li>
                ))}
            </ul>
            <p className="mt-5 text-caption text-muted">{STATS_CAVEAT}</p>
          </Panel>

          {/* ───────── perceived vs measured */}
          <Panel title="What owners think vs what they can evidence">
            <p className="text-small text-muted">
              Each dot is one owner. Above the line: they rated themselves higher than they scored.
            </p>
            {correlationSentence(s) ? <p className="mt-2 text-small text-ink">{correlationSentence(s)}</p> : null}
            <Scatter points={s.scatter} />
          </Panel>

          {/* ───────── distribution */}
          <div className="grid gap-6 md:grid-cols-2">
            <Panel title="Clarity Score distribution">
              <Histogram data={s.histogram} />
            </Panel>
            <Panel title="Result bands">
              <Bars rows={s.bandCounts.map((b) => ({ label: b.name, n: b.n, pct: b.pct }))} />
            </Panel>
          </div>

          {/* ───────── questions */}
          <Panel title="Where owners are guessing">
            <p className="text-small text-muted">
              Share who could not answer each question with confidence (their answer scored 0 or 1). This is the
              demand map: the higher the bar, the more owners lack that number. Brackets show the 95% confidence interval.
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

          {s.blindSpots.length ? (
            <Panel title="Most common biggest blind spot">
              <Bars rows={s.blindSpots.map((b) => ({ label: b.area, n: b.n, pct: (100 * b.n) / s.n }))} />
            </Panel>
          ) : null}

          {/* ───────── who took part */}
          <h2 className="mt-14 text-h3 font-semibold text-ink">Who took part</h2>
          <p className="mt-2 text-small text-muted">
            {f0(s.profileRate)}% answered at least one profile question. Percentages are of those who answered that
            question; “avg score” is their average Clarity Score.
          </p>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {(Object.keys(s.profile) as (keyof StudyStats["profile"])[]).map((k) => (
              <Panel key={k} title={studyFields.find((f) => f.id === k)!.prompt} compact>
                <ProfileBars rows={s.profile[k]} />
                <p className={`mt-3 text-caption ${s.stats.groups[k]?.p !== undefined && s.stats.groups[k]!.p < 0.05 ? "font-semibold text-maroon" : "text-muted"}`}>
                  {groupSentence(s.stats.groups[k])}
                </p>
              </Panel>
            ))}
          </div>

          {/* ───────── recent */}
          <Panel title="Latest responses">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-small">
                <thead className="text-caption uppercase tracking-overline text-muted">
                  <tr className="border-b border-line">
                    <th className="py-2 pr-3">When</th>
                    <th className="py-2 pr-3">Source</th>
                    <th className="py-2 pr-3">Score</th>
                    <th className="py-2 pr-3">Self</th>
                    <th className="py-2 pr-3">Revenue</th>
                    <th className="py-2 pr-3">Industry</th>
                    <th className="py-2 pr-3">Time</th>
                    <th className="py-2">Counted</th>
                  </tr>
                </thead>
                <tbody>
                  {s.recent.map((r) => (
                    <tr key={r.run_id} className={`border-b border-line ${r.excluded ? "text-muted" : "text-ink"}`}>
                      <td className="py-2 pr-3 whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" })}
                      </td>
                      <td className="py-2 pr-3">{r.source ?? "direct"}</td>
                      <td className="py-2 pr-3 tabular-nums">{r.score}</td>
                      <td className="py-2 pr-3 tabular-nums">{r.self_rating ?? "—"}</td>
                      <td className="py-2 pr-3">{label("revenue", r.revenue)}</td>
                      <td className="py-2 pr-3">{label("industry", r.industry)}</td>
                      <td className="py-2 pr-3 tabular-nums">{r.duration_s === null ? "—" : `${Math.round(r.duration_s / 60)}m ${r.duration_s % 60}s`}</td>
                      <td className="py-2">{r.excluded ? r.excluded : "Yes"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}
    </>
  );
}

/* ───────────────────────── pieces */

function label(field: "revenue" | "industry", value: string | null | undefined) {
  if (!value) return "—";
  return studyFields.find((f) => f.id === field)?.options.find((o) => o.value === value)?.label ?? value;
}

function Panel({ title, children, compact }: { title: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <section className={`mt-6 rounded-lg border border-line ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <h3 className={`${compact ? "text-body" : "text-h4"} font-semibold text-ink`}>{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border border-line p-5">
      <p className="text-caption uppercase tracking-overline text-muted">{label}</p>
      <p className="mt-2 text-[40px] font-semibold leading-none text-maroon tabular-nums">{value}</p>
      <p className="mt-2 text-caption text-muted">{sub}</p>
    </div>
  );
}

function Hypothesis(p: {
  code: string; claim: string; test: string; t: ProportionTest; measure: string; extra: string | null;
}) {
  const v = p.t.verdict;
  const pill =
    v === "supported" ? "bg-maroon text-white" : v === "against" ? "bg-ink text-white" : "bg-line text-ink";
  return (
    <div className="rounded-lg border border-line border-l-4 border-l-maroon bg-surface p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-h4 font-semibold text-maroon">{p.code}</p>
        <span className={`rounded-full px-3 py-1 text-caption font-semibold ${pill}`}>{VERDICT_LABEL[v]}</span>
      </div>
      <p className="mt-2 text-body font-semibold text-ink">{p.claim}</p>
      <p className="mt-4 text-[36px] font-semibold leading-none text-ink tabular-nums">{p.t.n ? `${f0(p.t.pct)}%` : "—"}</p>
      {p.t.ci ? (
        <p className="mt-1 text-small font-semibold text-maroon tabular-nums">
          95% CI {f0(p.t.ci.lo)}–{f0(p.t.ci.hi)}% · {fmtP(p.t.verdict === "against" ? p.t.pBelow : p.t.pAbove)}
        </p>
      ) : null}
      <p className="mt-2 text-small text-muted">{p.measure} (n = {p.t.n})</p>
      {p.extra ? <p className="mt-2 text-small text-ink">{p.extra}</p> : null}
      <p className="mt-3 text-caption text-muted">{p.test}</p>
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

function ProfileBars({ rows }: { rows: Count[] }) {
  const total = rows.reduce((a, r) => a + r.n, 0);
  if (!total) return <p className="text-small text-muted">No answers yet.</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="flex justify-between gap-3 text-small">
            <span className="text-ink">{r.label}</span>
            <span className="shrink-0 tabular-nums text-muted">
              {r.n} · {f0(r.pct)}%{r.avgScore !== null ? ` · avg ${f0(r.avgScore)}` : ""}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
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
          <div key={d.label} className="flex flex-1 flex-col items-center justify-end">
            <span className="mb-1 text-caption tabular-nums text-muted">{d.n || ""}</span>
            <div className="w-full rounded-t bg-maroon" style={{ height: `${(d.n / max) * 100}%`, minHeight: d.n ? 3 : 0 }} />
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

function Scatter({ points }: { points: { self: number; score: number }[] }) {
  // x = self-rating 1..10 (as 10..100), y = Clarity Score 0..100.
  const W = 640, H = 340, L = 48, B = 36, T = 12, R = 12;
  const x = (v: number) => L + ((v - 0) / 100) * (W - L - R);
  const y = (v: number) => T + (1 - v / 100) * (H - T - B);
  // Small deterministic jitter so identical answers do not stack into one dot.
  const jitter = (i: number) => ((i * 7919) % 11) - 5;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Self-rating against Clarity Score">
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="currentColor" className="text-line" />
          <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#6b6b6b">{v}</text>
        </g>
      ))}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
        <text key={v} x={x(v * 10)} y={H - B + 18} textAnchor="middle" fontSize="11" fill="#6b6b6b">{v}</text>
      ))}
      <line x1={x(0)} y1={y(0)} x2={x(100)} y2={y(100)} stroke="#6b6b6b" strokeDasharray="4 4" />
      <text x={x(96)} y={y(100) + 14} textAnchor="end" fontSize="11" fill="#6b6b6b">score matches self-rating</text>
      {points.map((p, i) => (
        <circle key={i} cx={x(p.self * 10) + jitter(i)} cy={y(p.score) + jitter(i + 3) / 2} r="5" fill="#500000" fillOpacity="0.55" />
      ))}
      <text x={(L + W - R) / 2} y={H - 2} textAnchor="middle" fontSize="11" fill="#6b6b6b">Self-rating before the quiz (1–10)</text>
      <text x={12} y={(T + H - B) / 2} textAnchor="middle" fontSize="11" fill="#6b6b6b" transform={`rotate(-90 12 ${(T + H - B) / 2})`}>Clarity Score</text>
    </svg>
  );
}

function Filters({ s, filter }: { s: StudyStats; filter: Search }) {
  const href = (patch: Partial<Search>) => {
    const next = { ...filter, ...patch };
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) q.set(k, v);
    const qs = q.toString();
    return `/method-lab/study${qs ? `?${qs}` : ""}`;
  };
  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1.5 text-caption transition-colors ${on ? "border-maroon bg-maroon text-white" : "border-line text-ink hover:border-maroon"}`;
  const revenue = studyFields.find((f) => f.id === "revenue")!;
  const industry = studyFields.find((f) => f.id === "industry")!;
  return (
    <div className="mt-8 space-y-3">
      <FilterRow label="Revenue">
        <Link href={href({ revenue: undefined })} className={chip(!filter.revenue)}>All</Link>
        {revenue.options.filter((o) => o.value !== "prefer-not").map((o) => (
          <Link key={o.value} href={href({ revenue: o.value })} className={chip(filter.revenue === o.value)}>{o.label}</Link>
        ))}
      </FilterRow>
      <FilterRow label="Industry">
        <Link href={href({ industry: undefined })} className={chip(!filter.industry)}>All</Link>
        {industry.options.map((o) => (
          <Link key={o.value} href={href({ industry: o.value })} className={chip(filter.industry === o.value)}>{o.label}</Link>
        ))}
      </FilterRow>
      <FilterRow label="Source">
        <Link href={href({ source: undefined })} className={chip(!filter.source)}>All</Link>
        {s.sources.map((o) => (
          <Link key={o.source} href={href({ source: o.source })} className={chip(filter.source === o.source)}>
            {o.source} · {o.count}
          </Link>
        ))}
      </FilterRow>
      {s.filtered ? (
        <p className="text-caption text-maroon">
          Filtered: showing {s.n} of {s.cleanTotal} usable responses. <Link href="/method-lab/study" className="font-semibold underline">Clear</Link>
        </p>
      ) : null}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 shrink-0 text-caption font-semibold uppercase tracking-overline text-muted">{label}</span>
      {children}
    </div>
  );
}
