import Link from "next/link";
import { cookies } from "next/headers";
import { Section } from "@/components/ui/Section";
import { METHOD_LAB_COOKIE, hasMethodLabAccess } from "@/lib/methodLab";
import { loadStudy, EXCLUDE_REASONS, MIN_N_TO_READ, MIN_SECONDS, type Count, type StudyStats } from "@/lib/realityStudyStats";
import { ExcludeControl } from "@/components/reality/ExcludeControl";
import { sourceLabel, studyFields } from "@/lib/realityStudy";
import { questions } from "@/lib/realityCheck";
import { H1_NOTE, H2_NOTE, VERDICT_NOTE, type MethodNote } from "@/lib/realityStudyMethod";
import { StatNote } from "@/components/methodlab/StatNote";
import { DistributionChart, ProportionCurve, ScoreScatter } from "@/components/methodlab/StudyCharts";
import { MIN_N_FOR_SHARE, fmtP, type ProportionTest } from "@/lib/stats";
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
 * /method-lab/study — the Clarity Check research study, read for the capstone.
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
/** A share, or a plain count while a share would read as 0% or 100%. */
const share = (t: { n: number; pct: number }) =>
  t.n < MIN_N_FOR_SHARE ? `${Math.round((t.pct / 100) * t.n)} of ${t.n}` : `${Math.round(t.pct)}% (n = ${t.n})`;

type Search = { revenue?: string; industry?: string; source?: string; all?: string };

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
            <h1 className="text-h1 font-semibold text-ink">Clarity Check study</h1>
            <p className="mt-3 max-w-2xl text-body text-muted">
              Every completed run of /clarity-check/study, read for the capstone. Figures use the
              clean sample only; what was left out, and why, is listed below the progress bar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`/method-lab/study/report${qs(filter)}`} target="_blank" rel="noopener" className="btn">Download PDF report</a>
            <a href="/method-lab/study/export" className="btn--secondary">Download CSV</a>
            <Link href="/study" className="btn--secondary">Open the study</Link>
            <a href="/method-lab/website" className="btn--secondary">Website dashboard</a>
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
          <Dashboard s={s} filter={filter} showAll={searchParams.all === "1"} />
        )}
      </div>
    </Section>
  );
}

function Dashboard({ s, filter, showAll }: { s: StudyStats; filter: Search; showAll: boolean }) {
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
              note={H1_NOTE}
            />
            <Hypothesis
              code="H2"
              claim="Owners will pay for a fixed-fee diagnostic."
              test="Survey measure (need): not supported if 50% or fewer of owners and co-owners at $1M+ businesses say an outside view would help somewhat or a lot. Payment itself is tested in sales conversations: falsified if fewer than 1 in 8 qualified conversations convert."
              t={s.h2}
              measure="of owners and co-owners at $1M+ businesses say an outside view would help somewhat or a lot"
              extra={[
                s.h2Fit.n ? `Fit: ${share(s.h2Fit)} of them would choose an independent review over a tool, their CPA or doing it themselves.` : null,
                s.h2Everyone.n ? `All respondents, for context: ${share(s.h2Everyone)}.` : null,
                s.h2Legacy.n ? `The retired price question was answered ${s.h2Legacy.n} times; reported separately, not used for H2.` : null,
              ].filter(Boolean).join(" ") || null}
              note={H2_NOTE}
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
            <ScoreScatter points={s.scatter} />
          </Panel>

          {/* ───────── distributions, with the curve the statistics assume */}
          <Panel title="Where the scores fall">
            <p className="text-small text-muted">
              Every Clarity Score, in ten-point bins. The line is a normal distribution with the same
              mean and standard deviation, drawn for comparison: it is what the t-test assumes, not a
              claim that the scores are normal. The shaded band is the 95% confidence interval of the
              mean. Hover a bar for the count.
            </p>
            <DistributionChart
              values={s.scoreValues}
              min={0}
              max={100}
              binWidth={10}
              mean={s.meanScore}
              sd={s.stats.meanScore?.sd ?? null}
              ci={s.stats.meanScore?.ci ?? null}
              xLabel="Clarity Score"
            />
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-small">
              <Stat k="n" v={`${s.n}`} />
              <Stat k="Mean" v={f1(s.meanScore)} />
              <Stat k="Median" v={f0(s.medianScore)} />
              <Stat k="SD" v={f1(s.stats.meanScore?.sd ?? null)} />
              <Stat
                k="95% CI of the mean"
                v={s.stats.meanScore ? `${f1(s.stats.meanScore.ci.lo)} to ${f1(s.stats.meanScore.ci.hi)}` : "—"}
              />
            </dl>
          </Panel>

          <Panel title="The overconfidence gap">
            <p className="text-small text-muted">
              Self-rating minus Clarity Score, one value per respondent. Right of the dashed line is an
              owner who rated themselves above what they could evidence. The curve and the shaded band
              are as above: a normal distribution of the same mean and spread, and the 95% confidence
              interval of the mean gap.
            </p>
            <DistributionChart
              values={s.gapValues}
              min={-50}
              max={50}
              binWidth={10}
              mean={s.meanOverconfidence}
              sd={s.stats.overconfidence?.sd ?? null}
              ci={s.stats.overconfidence?.ci ?? null}
              zeroLine
              xLabel="Self-rating minus score (points)"
            />
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-small">
              <Stat k="n" v={`${s.nRated}`} />
              <Stat k="Mean gap" v={f1(s.meanOverconfidence)} />
              <Stat k="SD" v={f1(s.stats.overconfidence?.sd ?? null)} />
              <Stat
                k="Paired t-test"
                v={
                  s.stats.overconfidence
                    ? `t(${s.stats.overconfidence.n - 1}) = ${s.stats.overconfidence.t.toFixed(2)} · ${fmtP(s.stats.overconfidence.p)}`
                    : "—"
                }
              />
              <Stat k="Effect size d" v={s.stats.overconfidence ? s.stats.overconfidence.d.toFixed(2) : "—"} />
            </dl>
          </Panel>

          <div className="grid gap-6 md:grid-cols-2">
            <Panel title="Clarity Score bins">
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

        </>
      )}

      {/* ───────── every response, with Exclude / Restore. Shown even when
          nothing is counted yet, so excluded rows can always be restored. */}
          <Panel title={showAll ? `All responses (${s.recent.length})` : "Latest responses"}>
            <p className="-mt-2 mb-4 text-caption text-muted">
              Exclude takes a response out of every figure and the PDF but keeps it on record; Restore puts it back. Delete removes it permanently.
              Grey rows are not counted.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-[13px] leading-snug">
                <thead className="text-[11px] uppercase tracking-overline text-muted">
                  <tr className="border-b border-line">
                    <th className="py-2 pr-3">Date &amp; time</th>
                    <th className="py-2 pr-3">Source</th>
                    <th className="py-2 pr-3">Score</th>
                    <th className="py-2 pr-3">Self</th>
                    <th className="py-2 pr-3">Revenue</th>
                    <th className="py-2 pr-3">Industry</th>
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
                      <td className="py-2 pr-3">{sourceLabel(r.source)}</td>
                      <td className="py-2 pr-3 tabular-nums">{r.score}</td>
                      <td className="py-2 pr-3 tabular-nums">{r.self_rating ?? "—"}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{label("revenue", r.revenue)}</td>
                      <td className="py-2 pr-3">{label("industry", r.industry)}</td>
                      <td className="py-2 pr-3 whitespace-nowrap tabular-nums">{r.duration_s === null ? "—" : `${Math.floor(r.duration_s / 60)}m ${r.duration_s % 60}s`}</td>
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
                <Link href={showAll ? "/method-lab/study" : "/method-lab/study?all=1"} className="font-semibold text-maroon hover:underline">
                  {showAll ? "Show the latest 25 only" : `Show all ${s.recent.length} responses`}
                </Link>
              </p>
            ) : null}
          </Panel>
    </>
  );
}

/* ───────────────────────── pieces */

/** Every timestamp on the dashboard is shown in Central time, labelled. */
function stampDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" });
}
function stampTime(iso: string) {
  return (
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", timeZone: "America/Chicago" }) +
    " CT"
  );
}

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

/**
 * One hypothesis, as a card.
 *
 * Laid out in four bands with a rule between each, so the eye has somewhere to
 * stop: what is claimed, what was measured, where the true share could sit, and
 * what would falsify it. Before this they ran together as one column of text at
 * four different sizes, and the two cards did not line up with each other.
 *
 * Two "?" buttons: one on the code, for how the figure is calculated, and one on
 * the verdict tag, for what the tag means and when it changes.
 */
function Hypothesis(p: {
  code: string; claim: string; test: string; t: ProportionTest; measure: string; extra: string | null;
  note: MethodNote;
}) {
  const v = p.t.verdict;
  const pill =
    v === "supported" ? "bg-maroon text-white" : v === "against" ? "bg-ink text-white" : "bg-line text-ink";
  const thin = p.t.n < MIN_N_FOR_SHARE;

  return (
    <div className="flex flex-col rounded-lg border border-line border-l-4 border-l-maroon bg-surface">
      {/* 1 · the claim */}
      <div className="p-6 pb-5">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className="text-h4 font-semibold leading-none text-maroon">{p.code}</span>
            <StatNote title={`${p.code}: ${p.claim}`} note={p.note} />
          </span>
          <span className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-caption font-semibold ${pill}`}>{VERDICT_LABEL[v]}</span>
            <StatNote title={`Verdict: ${VERDICT_LABEL[v]}`} note={VERDICT_NOTE} />
          </span>
        </div>
        <p className="mt-3 text-body font-semibold leading-snug text-ink">{p.claim}</p>
      </div>

      {/* 2 · what was measured */}
      <div className="border-t border-line px-6 py-5">
        {thin ? (
          <>
            <p className="flex items-baseline gap-2">
              <span className="text-[34px] font-semibold leading-none text-muted tabular-nums">{p.t.n}</span>
              <span className="text-body font-semibold text-muted">{p.t.n === 1 ? "answer" : "answers"}</span>
            </p>
            <p className="mt-2 text-small font-semibold text-maroon">
              Too few to report a share. From {MIN_N_FOR_SHARE}.
            </p>
            <p className="mt-2 max-w-measure text-small leading-snug text-muted">Measuring: {p.measure}.</p>
          </>
        ) : (
          <>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[34px] font-semibold leading-none text-ink tabular-nums">{f0(p.t.pct)}%</span>
              {p.t.ci ? (
                <span className="text-small font-semibold text-maroon tabular-nums">
                  95% CI {f0(p.t.ci.lo)}–{f0(p.t.ci.hi)}% · {fmtP(p.t.verdict === "against" ? p.t.pBelow : p.t.pAbove)}
                </span>
              ) : null}
            </p>
            <p className="mt-2 max-w-measure text-small leading-snug text-muted">
              {p.measure} <span className="whitespace-nowrap tabular-nums">(n = {p.t.n})</span>
            </p>
          </>
        )}
        {p.extra ? <p className="mt-3 max-w-measure text-small leading-snug text-ink">{p.extra}</p> : null}
      </div>

      {/* 3 · where the true share could sit. Hidden on a thin sample: a curve
          drawn from one answer is a spike at 0% or 100%, which looks like
          certainty and is the opposite of it. */}
      {p.t.n >= MIN_N_FOR_SHARE ? (
        <div className="border-t border-line px-6 pb-4 pt-5">
          <p className="text-caption font-semibold uppercase tracking-overline text-muted">
            Where the true share could sit
          </p>
          <ProportionCurve pct={p.t.pct} n={p.t.n} ci={p.t.ci} threshold={p.t.threshold} />
          <p className="mt-1 text-caption leading-snug text-muted">
            Normal approximation, drawn for the shape. The p-value above comes from the exact binomial.
          </p>
        </div>
      ) : null}

      {/* 4 · what would falsify it */}
      <div className="mt-auto border-t border-line px-6 py-4">
        <p className="text-caption leading-snug text-muted">{p.test}</p>
      </div>
    </div>
  );
}

/** One label-and-figure pair under a chart. */
function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-caption uppercase tracking-overline text-muted">{k}</dt>
      <dd className="mt-0.5 font-semibold tabular-nums text-ink">{v}</dd>
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

function Filters({ s, filter }: { s: StudyStats; filter: Search }) {
  const href = (patch: Partial<Search>) => {
    const next = { ...filter, ...patch };
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) q.set(k, v);
    const qs = q.toString();
    return `/method-lab/study${qs ? `?${qs}` : ""}`;
  };
  const chip = (on: boolean) =>
    `whitespace-nowrap rounded-full border px-3 py-1 text-[13px] transition-colors ${on ? "border-maroon bg-maroon text-white" : "border-line text-ink hover:border-maroon"}`;
  const revenue = studyFields.find((f) => f.id === "revenue")!;
  return (
    <div className="mt-8 space-y-3">
      <FilterRow label="Revenue">
        <Link href={href({ revenue: undefined })} className={chip(!filter.revenue)}>All</Link>
        {revenue.options.filter((o) => o.value !== "prefer-not").map((o) => (
          <Link key={o.value} href={href({ revenue: o.value })} className={chip(filter.revenue === o.value)}>{o.label}</Link>
        ))}
      </FilterRow>
      <FilterRow label="Heard via">
        <Link href={href({ source: undefined })} className={chip(!filter.source)}>All</Link>
        {s.sources.map((o) => (
          <Link key={o.source} href={href({ source: o.source })} className={chip(filter.source === o.source)}>
            {sourceLabel(o.source)} · {o.count}
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
      <span className="w-full shrink-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-overline text-muted sm:w-28">{label}</span>
      {children}
    </div>
  );
}
