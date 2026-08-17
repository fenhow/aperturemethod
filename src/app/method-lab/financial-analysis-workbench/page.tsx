import type { Metadata } from "next";

/**
 * Method Lab · Aperture Analytics™: Financial Analysis Workbench.
 *
 * Two complete worked examples published in full: one listed retailer, one
 * owner-managed fabricator. The point of the pairing is that the analysis has
 * to change when the entity does.
 *
 * This page is PUBLIC and sits under /method-lab, which middleware otherwise
 * gates behind a passphrase. See the allowlist in src/middleware.ts. The
 * confidential Agent Workflow Map and Architecture Reference stay gated.
 *
 * Markup lifted from the self-contained drop-in produced by the workbench; its
 * stylesheet is scoped under `.falw` so none of it can reach the rest of the
 * site. Regenerate the PDFs from the workbench rather than editing them here.
 */

export const metadata: Metadata = {
  title: "Financial Analysis Workbench, Method Lab",
  description:
    "Two complete worked examples from Aperture Analytics: one public company, one privately held. " +
    "The same method applied to two entities that cannot be asked the same questions. Free to download.",
  openGraph: {
    title: "Financial Analysis Workbench, Method Lab | The Aperture Method",
    description:
      "Two complete worked examples: a listed retailer and an owner-managed fabricator. " +
      "See how the analysis changes when the entity does.",
    type: "article",
  },
};

const CSS = `.falw{
  --ink:#000000; --paper:#FFFFFF; --maroon:#500000; --maroon-deep:#2E0000;
  --type:#000000; --body:#3D3D3D; --muted:#7A7A7A; --rule:#E0E0E0; --wash:#F5F5F5;
  --sans:"Graphik","Graphik Web",-apple-system,BlinkMacSystemFont,"Inter","Helvetica Neue",Helvetica,Arial,sans-serif;
}.falw *{box-sizing:border-box}.falw{scroll-behavior:smooth}.falw{margin:0;font-family:var(--sans);color:var(--body);background:var(--paper);
  font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased}.falw img{max-width:100%;height:auto;display:block}.falw a{color:var(--maroon);text-decoration:none}.falw a:hover{text-decoration:underline}.falw .wrap{max-width:1080px;margin:0 auto;padding:0 28px}.falw .eyebrow{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--maroon);
  font-weight:600;margin:0 0 10px}.falw .crule{width:56px;height:3px;background:var(--maroon);margin:0 0 26px}.falw /* header */
.topband{height:5px;background:var(--maroon)}.falw header.site{border-bottom:1px solid var(--rule);padding:22px 0}.falw header.site .inner{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}.falw header.site .lock img{height:30px;width:auto;object-fit:contain}.falw header.site .lock .by{font-size:8.5px;letter-spacing:.3em;text-transform:uppercase;
  color:var(--muted);font-weight:600;margin-top:6px}.falw header.site nav{display:flex;gap:26px;flex-wrap:wrap}.falw header.site nav a{font-size:11px;letter-spacing:.15em;text-transform:uppercase;
  font-weight:600;color:var(--muted)}.falw header.site nav a:hover{color:var(--type);text-decoration:none}.falw header.site nav a.cta{color:#fff;background:var(--maroon);padding:8px 16px;border-radius:2px}.falw header.site nav a.cta:hover{background:var(--maroon-deep)}.falw /* hero */
.hero{padding:64px 0 44px;border-bottom:1px solid var(--rule)}.falw .hero .back{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);
  font-weight:600;display:inline-block;margin-bottom:26px}.falw .hero .back:hover{color:var(--maroon);text-decoration:none}.falw .hero h1{font-size:clamp(32px,5vw,50px);font-weight:600;letter-spacing:-.025em;line-height:1.08;
  margin:0 0 16px;color:var(--type);max-width:19ch}.falw .hero .lede{font-size:19px;line-height:1.55;color:var(--body);max-width:62ch;margin:0 0 8px}.falw .hero .lede strong{color:var(--type);font-weight:600}.falw .hero .meta{margin-top:26px;display:flex;gap:14px;flex-wrap:wrap;align-items:center}.falw .tag{font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;
  border:1px solid var(--rule);color:var(--muted);padding:6px 13px;border-radius:2px}.falw .tag.solid{background:var(--maroon);border-color:var(--maroon);color:#fff}.falw section{padding:56px 0}.falw section.alt{background:var(--wash);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)}.falw h2.sec{font-size:clamp(24px,3.2vw,34px);font-weight:600;letter-spacing:-.02em;
  margin:0 0 14px;color:var(--type);max-width:22ch;line-height:1.15}.falw p.lead{font-size:17px;max-width:66ch;margin:0 0 8px}.falw p.lead strong{color:var(--type);font-weight:600}.falw /* download cards */
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:22px;margin-top:34px}.falw .card{border:1px solid var(--rule);border-top:4px solid var(--maroon);background:var(--paper);
  padding:28px 26px 26px;display:flex;flex-direction:column}.falw .card .badge{display:inline-block;background:var(--maroon);color:#fff;font-size:8.5px;
  letter-spacing:.18em;text-transform:uppercase;font-weight:600;padding:5px 12px;
  border-radius:1px;align-self:flex-start;margin-bottom:16px}.falw .card .badge.alt{background:var(--paper);color:var(--maroon);border:1px solid var(--maroon)}.falw .card h3{font-size:21px;font-weight:600;margin:0 0 4px;color:var(--type);letter-spacing:-.01em}.falw .card .sub{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);
  font-weight:600;margin:0 0 16px}.falw .card p{font-size:14.5px;margin:0 0 14px;line-height:1.6}.falw .card ul{list-style:none;padding:0;margin:0 0 20px;font-size:13.5px}.falw .card ul li{padding:6px 0 6px 17px;position:relative;border-bottom:1px solid var(--rule);color:var(--body)}.falw .card ul li:before{content:"";position:absolute;left:0;top:14px;width:6px;height:6px;
  background:var(--maroon)}.falw .card .spacer{flex:1}.falw .card .dl{display:inline-flex;align-items:center;gap:10px;background:var(--ink);color:#fff;
  font-size:11px;letter-spacing:.15em;text-transform:uppercase;font-weight:600;
  padding:14px 22px;border-radius:2px;align-self:flex-start;transition:.15s}.falw .card .dl:hover{background:var(--maroon);text-decoration:none}.falw .card .fmeta{font-size:11px;color:var(--muted);margin-top:11px;letter-spacing:.04em}.falw /* contrast table */
.ctable{width:100%;border-collapse:collapse;margin-top:26px;font-size:14.5px}.falw .ctable th{text-align:left;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--muted);font-weight:600;padding:11px 14px;border-bottom:2px solid var(--type)}.falw .ctable th:first-child{width:26%}.falw .ctable td{padding:13px 14px;border-bottom:1px solid var(--rule);vertical-align:top;line-height:1.55}.falw .ctable td:first-child{font-weight:600;color:var(--type)}.falw .ctable tr:last-child td{border-bottom:none}.falw /* inside list */
.fnote{font-size:12px;line-height:1.5;color:var(--muted,#6B6B6B);margin-top:14px;padding-top:12px;border-top:1px solid var(--rule)}
.inside{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:2px 34px;margin-top:26px}.falw .inside .item{display:flex;gap:15px;padding:14px 0;border-bottom:1px solid var(--rule)}.falw .inside .n{font-size:19px;font-weight:600;color:var(--maroon);opacity:.5;line-height:1;
  flex:0 0 30px;letter-spacing:-.03em}.falw .inside b{display:block;font-size:15px;color:var(--type);margin-bottom:3px;font-weight:600}.falw .inside span{font-size:13.5px;color:var(--body);line-height:1.5}.falw /* pull quote */
.pull{border-left:3px solid var(--maroon);padding:6px 0 6px 24px;margin:34px 0 0;max-width:64ch}.falw .pull p{font-size:20px;line-height:1.45;color:var(--type);font-weight:400;margin:0;letter-spacing:-.01em}.falw .pull cite{display:block;margin-top:12px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--muted);font-style:normal;font-weight:600}.falw /* note box */
.note{border:1px solid var(--rule);background:var(--paper);padding:24px 26px;margin-top:30px}.falw .note h4{font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--maroon);
  font-weight:600;margin:0 0 10px}.falw .note p{font-size:14px;margin:0 0 10px;line-height:1.6}.falw .note p:last-child{margin-bottom:0}.falw .note strong{color:var(--type);font-weight:600}.falw /* cta */
.cta-band{background:var(--ink);color:#fff;padding:60px 0}.falw .cta-band h2{color:#fff;font-size:clamp(24px,3.4vw,36px);font-weight:600;margin:0 0 14px;
  letter-spacing:-.02em;max-width:20ch;line-height:1.15}.falw .cta-band p{color:#B3B3B3;font-size:17px;max-width:58ch;margin:0 0 28px}.falw .cta-band .row{display:flex;gap:14px;flex-wrap:wrap}.falw .cta-band a.b{background:#fff;color:var(--ink);font-size:11px;letter-spacing:.15em;
  text-transform:uppercase;font-weight:600;padding:15px 26px;border-radius:2px;transition:.15s}.falw .cta-band a.b:hover{background:var(--maroon);color:#fff;text-decoration:none}.falw .cta-band a.b.ghost{background:transparent;color:#fff;border:1px solid #4D4D4D}.falw .cta-band a.b.ghost:hover{border-color:#fff;background:transparent}.falw /* footer */
footer.site{background:var(--ink);color:#B3B3B3;padding:44px 0 0;font-size:13px}.falw footer.site .cols{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:34px;padding-bottom:38px}.falw footer.site h5{font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:#fff;
  font-weight:600;margin:0 0 14px}.falw footer.site a{color:#B3B3B3;display:block;padding:4px 0}.falw footer.site a:hover{color:#fff;text-decoration:none}.falw footer.site .brandcol img{height:26px;width:auto;object-fit:contain;margin-bottom:12px}.falw footer.site .brandcol p{margin:0;color:#7A7A7A;font-size:12.5px;max-width:34ch;line-height:1.6}.falw footer.site .band{background:var(--maroon);color:#fff;padding:15px 0;font-size:9px;
  letter-spacing:.16em;text-transform:uppercase}.falw footer.site .band .inner{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap}.falw footer.site .band b{font-weight:600}@media(max-width:860px){
  footer.site .cols{grid-template-columns:1fr 1fr}
  .ctable th:first-child{width:34%}
}@media(max-width:560px){
  footer.site .cols{grid-template-columns:1fr}
  .ctable{font-size:13.5px}
  .ctable td,.ctable th{padding:10px 8px}
}@media print{.cta-band,header.site nav{display:none}}`;

export default function FinancialAnalysisWorkbench() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <main className="falw">
      <section className="hero">
        <div className="wrap">
    
          <p className="eyebrow">Method Lab · Aperture Analytics™ · Phase 02 Quantify</p>
          <div className="crule"></div>
          <h1>Three companies. One method. Completely different questions.</h1>
          <p className="lede">Below are three complete financial analyses, produced by the same workbench and
            published in full. One is a listed retailer with forty billion dollars of revenue and an audited
            10-K. One is an owner-managed fabricator with eighteen million and a set of reviewed accounts.
            The third is a medical aesthetics group with six million, a compilation and no assurance at all,
            which is what most owner-run businesses actually hand you.</p>
          <p className="lede"><strong>Read side by side, they make a point that is hard to make in the
            abstract:</strong> the analysis has to change when the entity does, and most financial
            analysis quietly refuses to.</p>
          <div className="meta">
            <span className="tag solid">Free · No email required</span>
            <span className="tag">43 to 44 pages each</span>
            <span className="tag">PDF</span>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="eyebrow">The downloads</p>
          <h2 className="sec">All three reports, in full</h2>
          <p className="lead">Nothing is held back and nothing is watermarked. Every figure carries the formula
            that produced it, and the final twelve pages derive every number in the report from first
            principles, so you can check the work rather than take it on trust.</p>

          <div className="cards">
            <div className="card">
              <span className="badge">Public company</span>
              <h3>Best Buy Co., Inc.</h3>
              <p className="sub">NYSE: BBY · C Corporation · Specialty retail</p>
              <p>A listed retailer with three years of flat revenue and a gross margin that has barely
                moved. The analysis works out whether that is a market that stopped growing or a share
                position slipping, and shows why the recovery in returns is partly a shrinking denominator
                rather than a rising numerator.</p>
              <ul>
                <li>Audited statements, market-observed valuation</li>
                <li>Enterprise value, EV/EBITDA, P/E, free cash flow yield</li>
                <li>DuPont decomposition across four periods</li>
                <li>Break-even at 35,513 against revenue of 41,691</li>
              </ul>
              <div className="spacer"></div>
              <a className="dl" href="/downloads/aperture-analytics-public-example.pdf" target="_blank" rel="noopener noreferrer">
                Open the public example</a>
              <p className="fmeta">PDF · 44 pages · approx. 0.4 MB</p>
            </div>

            <div className="card">
              <span className="badge alt">Privately held</span>
              <h3>Meridian Precision Fabrication, LLC</h3>
              <p className="sub">Family owned · S Corporation · Contract manufacturing</p>
              <p>An owner-managed fabricator compounding at 9.3% with a margin that holds. The analysis
                normalises the owner’s compensation, the related-party rent and the personal expenses out
                of reported earnings, then builds a valuation range, and shows exactly which add-back will
                not survive diligence.</p>
              <ul>
                <li>Reviewed accounts: limited assurance, no opinion</li>
                <li>Full normalisation schedule with an evidence grade per item</li>
                <li>Adjusted EBITDA 2,715 · SDE 2,955 · intensity 30.5%</li>
                <li>Asking price implies 5.97× against a 4.0–6.0× range</li>
              </ul>
              <div className="spacer"></div>
              <a className="dl" href="/downloads/aperture-analytics-private-example.pdf" target="_blank" rel="noopener noreferrer">
                Open the private example</a>
              <p className="fmeta">PDF · 44 pages · approx. 0.4 MB</p>
            </div>

            <div className="card">
              <span className="badge alt">Illustrative</span>
              <h3>Lumina Medical Aesthetics, PLLC</h3>
              <p className="sub">Founder led · S Corporation · Medical aesthetics</p>
              <p>A three-clinic practice that grew revenue 61% in three years while profit stayed flat. The
                analysis finds the growth leaking out through patients who never come back, prices what the
                second visit is worth, and weighs fixing retention against opening a fourth location. It is
                also the weakest evidence base of the three: a compilation carries no assurance whatsoever.</p>
              <ul>
                <li>Compiled statements: no assurance, no testing, no opinion</li>
                <li>Reported EBITDA 878 to 966 against revenue 3,990 to 6,440</li>
                <li>Adjusted EBITDA 1,311 · margin compressed 22.0% to 15.0%</li>
                <li>Retention worth roughly 200 a year against a 900 break-even for a new site</li>
              </ul>
              <p className="fnote"><em>Lumina is a fictional company created to demonstrate the Method. Every
                figure is synthetic and internally consistent; nothing here is a real client or a real
                result.</em></p>
              <div className="spacer"></div>
              <a className="dl" href="/downloads/aperture-analytics-illustrative-example.pdf" target="_blank" rel="noopener noreferrer">
                Open the illustrative example</a>
              <p className="fmeta">PDF · 43 pages · approx. 0.4 MB</p>
            </div>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <p className="eyebrow">Why it matters</p>
          <h2 className="sec">The same ratio can mean opposite things</h2>
          <p className="lead">Most financial analysis is written as though every company were a listed one.
            It isn’t, and the consequences are not academic: they show up as a price, a covenant, or a
            decision taken on a comparison that was never valid. Three differences do most of the damage.</p>

          <table className="ctable">
            <thead>
              <tr><th>What changes</th><th>Public company</th><th>Privately held</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>How much the evidence weighs</td>
                <td>Audited under legal jeopardy, filed publicly, comparable period to period.</td>
                <td>Reviewed, compiled or neither, and often kept on a tax basis rather than a reporting one.</td>
              </tr>
              <tr>
                <td>Whether the tax line is comparable</td>
                <td>Pays entity-level tax. Net margin means what it appears to mean.</td>
                <td>A pass-through pays no entity-level tax, so net margin sits structurally higher than an
                    identical C corporation’s. Compare on operating margin and EBITDA, or not at all.</td>
              </tr>
              <tr>
                <td>What reported earnings represent</td>
                <td>Management is salaried and separate from ownership. Costs are arm’s length.</td>
                <td>The owner sets their own pay and rents the building to themselves. Reported earnings
                    reflect a personal tax decision as much as the cost of running the business.</td>
              </tr>
              <tr>
                <td>How value is established</td>
                <td>Observed. Market capitalisation, enterprise value, multiples read off the market.</td>
                <td>Constructed. Normalised earnings × an evidenced multiple range, less net debt, and the
                    range is the answer, not the midpoint.</td>
              </tr>
            </tbody>
          </table>

          <div className="pull">
            <p>It isn’t public versus private that breaks the comparison. It’s tax status, and nothing in
              either set of statements warns you that the comparison has already failed.</p>
            <cite>From the Method appendix, page 29</cite>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="eyebrow">What’s inside</p>
          <h2 className="sec">Forty-four pages, and no black boxes</h2>
          <p className="lead">Both reports follow the same structure. The last third is the part most analyses
            leave out.</p>
          <div className="inside">
            <div className="item"><span className="n">01</span><div><b>Entity profile</b><span>Ownership, legal form and tax treatment, basis of preparation, lifecycle stage, established before a single figure is computed.</span></div></div>
            <div className="item"><span className="n">02</span><div><b>Executive summary</b><span>The headline judgement, the business, the audit opinion, and the binding-constraint candidates.</span></div></div>
            <div className="item"><span className="n">03</span><div><b>Statements &amp; normalisation</b><span>Balance sheet, income statement, cash flow, and for private entities, the add-back schedule with an evidence grade on every line.</span></div></div>
            <div className="item"><span className="n">04</span><div><b>Valuation</b><span>Observed multiples, or a constructed range with its source stated and the implied multiple of any offer on the table.</span></div></div>
            <div className="item"><span className="n">05</span><div><b>Common-size &amp; horizontal</b><span>Structure with size removed, and movement with structure removed. Read together, the cause usually presents itself.</span></div></div>
            <div className="item"><span className="n">06</span><div><b>Ratios &amp; DuPont</b><span>Sixty measures, and the decomposition that separates a margin problem from a productivity one. They need opposite responses.</span></div></div>
            <div className="item"><span className="n">07</span><div><b>Findings</b><span>Mechanical screening checks. Each one says <em>look here</em>; none of them says <em>therefore</em>.</span></div></div>
            <div className="item"><span className="n">08</span><div><b>What each lever is worth</b><span>Every improvement lever sized on one scale, so effort goes where the arithmetic says it pays rather than where it is comfortable to look.</span></div></div>
            <div className="item"><span className="n">09</span><div><b>Now / Next / Later</b><span>Sequenced, not listed. The value of the page is in what has been left off it.</span></div></div>
            <div className="item"><span className="n">10</span><div><b>The Method appendix</b><span>Twelve pages deriving every figure from first principles: the formula, the company’s own numbers substituted into it, what it says, and where it misleads.</span></div></div>
          </div>

          <div className="note">
            <h4>Two things to know before you read them</h4>
            <p><strong>Best Buy is real; its share prices here are not.</strong> The financial statements come
              from the published Form 10-K. The share prices and headcount are clearly-labelled illustrative
              placeholders, included so the valuation section demonstrates. They are flagged as such in the
              report’s own evidence ledger. Replace them with observed closing prices before quoting any
              multiple from that document.</p>
            <p><strong>Meridian is fictional.</strong> It was constructed to exercise the private-company path
              honestly rather than flatteringly: 30.5% add-back intensity, a 3.0% effective tax rate, and
              one add-back resting on management assertion that would not survive diligence. Its contact
              details use reserved example domains and numbers, so nothing in it can be mistaken for a real
              business.</p>
            <p>Both reports carry an evidence ledger stating the source and confidence of every figure. That
              is not administrative overhead; it is the difference between an analysis a client can act on
              and an assertion they have to take on trust.</p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>See your own numbers this way</h2>
          <p>The Business X-Ray is the entry point, a fixed-fee diagnostic that establishes where the
            business actually stands before anyone proposes what to do about it. Founder-led, in plain
            language, done for you.</p>
          <div className="row">
            <a className="b" href="/book">Book a consultation</a>
            <a className="b ghost" href="/the-method">See the Method</a>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
