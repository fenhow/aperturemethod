import { XRAY_FEE } from "@/lib/pricing";

/**
 * The alternatives, side by side, as a real table.
 *
 * The site already made every one of these claims in prose. What it did not do
 * was put them in a structure a machine can lift, and a comparison is the one
 * thing an assistant answering "how is X different from Y" wants most. Nothing
 * here is a new assertion about a competitor: each cell is the same
 * characterisation the surrounding copy already makes, hedged the same way.
 *
 * A real <table> with a <caption> and scoped headers, so it reads correctly to
 * a screen reader as well as to a crawler. It scrolls horizontally on a phone
 * rather than collapsing into cards, because a comparison that has been broken
 * into four separate lists is no longer a comparison.
 */

/**
 * Aperture is the first data column, not the last.
 *
 * Building up to yourself reads well on a wide screen and fails badly on a
 * phone, where the table scrolls sideways and the reader sees three competitor
 * columns before anything of ours. The column that has to be visible without
 * scrolling is ours.
 */
const COLUMNS = [
  "The Aperture Method",
  "Large consultancies",
  "Local advisors & CPAs",
  "GIS & data vendors",
] as const;

const ROWS: { dimension: string; cells: [string, string, string, string] }[] = [
  {
    dimension: "Quantitative depth",
    cells: [
      "Graduate level",
      "Graduate level",
      "Rarely the quantitative work",
      "Data, not analysis",
    ],
  },
  {
    dimension: "Spatial and market intelligence",
    cells: [
      "Yes, tied to the decision",
      "Seldom offered at your size",
      "No",
      "Maps and lists, no strategy",
    ],
  },
  {
    dimension: "Who does the work",
    cells: [
      "Fenwick How, start to finish",
      "A team you did not meet",
      "Your advisor, part time",
      "A platform or a vendor",
    ],
  },
  {
    dimension: "What it costs",
    cells: [
      `Fixed fee, from ${XRAY_FEE}`,
      "Enterprise retainers",
      "Hourly or per filing",
      "Per report or subscription",
    ],
  },
  {
    dimension: "What you keep",
    cells: [
      "Models, dashboards and working files",
      "The deck",
      "Your accounts",
      "A file export",
    ],
  },
  {
    dimension: "After the recommendation",
    cells: [
      "Stays until the strategy is running",
      "The engagement ends",
      "Ongoing, but not strategic",
      "No follow-through",
    ],
  },
];

export function ComparisonTable() {
  return (
    <div className="mt-10">
      <p className="mb-3 text-small text-muted lg:hidden" aria-hidden="true">
        Scroll sideways to compare &rarr;
      </p>
      <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <caption className="sr-only">
            The Aperture Method compared with large consultancies, local advisors and CPAs, and GIS
            and data vendors, across depth, delivery, cost and what the client keeps.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[190px] border-b border-line px-4 py-3 text-overline font-semibold uppercase tracking-overline text-muted">
                <span className="sr-only">Dimension</span>
              </th>
              {COLUMNS.map((c) => {
                const mine = c === "The Aperture Method";
                return (
                  <th
                    key={c}
                    scope="col"
                    className={
                      "border-b px-4 py-3 align-bottom text-small font-semibold " +
                      (mine
                        ? "border-maroon bg-maroon/5 text-maroon"
                        : "border-line text-muted")
                    }
                  >
                    {c}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.dimension}>
                <th
                  scope="row"
                  className="border-b border-line px-4 py-3.5 align-top text-small font-semibold text-ink"
                >
                  {row.dimension}
                </th>
                {row.cells.map((cell, i) => {
                  const mine = i === 0;
                  return (
                    <td
                      key={COLUMNS[i]}
                      className={
                        "border-b px-4 py-3.5 align-top text-small " +
                        (mine
                          ? "border-maroon/30 bg-maroon/5 font-semibold text-ink"
                          : "border-line text-muted")
                      }
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
