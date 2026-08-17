/**
 * The data request: what we still need from a client, personalised to the modules they
 * engaged and to what they told us they already have.
 *
 * Two principles behind this file:
 *
 *  1. **Never ask for something we will not use.** A request padded with items that belong
 *     to a phase the client is not doing is how a data request stalls. Each item declares
 *     the segments that need it; nothing else is shown.
 *  2. **Always say why.** Owners hesitate over payroll, customer lists and owner
 *     compensation, reasonably so. A one-line reason converts far better than a bare
 *     filename, and it is also just fair.
 *
 * Items are matched against the "What data exists" checkboxes in the shared intake section.
 * A ticked box means they have it; anything unticked and relevant becomes an outstanding
 * item on the list they see at the end of the form.
 */

export type DataItem = {
  id: string;
  label: string;
  /** Shown to the client. Why this is needed, in their language, not ours. */
  why: string;
  /** Which segments need it. "shared" = needed for every engagement. */
  segments: ("shared" | "insights" | "analytics" | "intelligence" | "compass" | "atlas")[];
  /** Exact text of the `data_have` option that satisfies this item, if one does. */
  satisfiedBy?: string;
  /** Blocking work cannot start without it; helpful improves the answer. */
  priority: "blocking" | "helpful";
};

export const DATA_ITEMS: DataItem[] = [
  // ---------------------------------------------------------------- financial core
  {
    id: "pl",
    label: "Profit & loss statements: last 3 years plus year-to-date",
    why: "Every headline number we produce is reconciled back to these. If it doesn't tie to your own accounts, it doesn't ship.",
    segments: ["shared"],
    satisfiedBy: "Profit & loss statements, last 3 years plus year-to-date",
    priority: "blocking",
  },
  {
    id: "bs",
    label: "Balance sheets: last 4 period ends",
    why: "Four dates, not three. Anything measured against an average balance, days sales outstanding, inventory days, return on assets, needs an opening balance as well as a closing one, so four balance sheets produce three years of ratios and three produce two.",
    segments: ["shared"],
    satisfiedBy: "Balance sheets, last 4 period ends",
    priority: "blocking",
  },
  {
    id: "cf",
    label: "Cash flow statements: last 3 years",
    why: "The statement most often left out, and the one that carries depreciation, capital spending, the movement in working capital and what was taken out of the business. Without it, EBITDA has to be estimated rather than derived, and cash conversion cannot be measured at all.",
    segments: ["shared"],
    satisfiedBy: "Cash flow statements, last 3 years",
    priority: "blocking",
  },
  {
    id: "accountant_report",
    label: "The accountant's report that came with the statements",
    why: "Audit, review, compilation or nothing at all: this single page decides how much weight every figure in the analysis can carry, and it is stated openly in the report rather than assumed.",
    segments: ["shared"],
    satisfiedBy: "The accountant's report that came with the statements",
    priority: "blocking",
  },
  {
    id: "tax_returns",
    label: "Business tax returns: last 3 years",
    why: "Corroborates the statements from an independent direction, and where the books are kept on a tax basis it is often the more complete record.",
    segments: ["analytics"],
    satisfiedBy: "Business tax returns, last 3 years",
    priority: "helpful",
  },
  {
    id: "rev_product",
    label: "Revenue broken out by product or service",
    why: "Without this, profitability can only be assessed for the business as a whole, which is rarely where the answer is.",
    segments: ["insights", "analytics"],
    satisfiedBy: "Revenue broken out by product or service",
    priority: "blocking",
  },
  {
    id: "rev_location",
    label: "Revenue broken out by location",
    why: "Lets us compare sites fairly and see which model is worth repeating.",
    segments: ["insights", "analytics", "intelligence"],
    satisfiedBy: "Revenue broken out by location",
    priority: "helpful",
  },
  {
    id: "payroll",
    label: "Payroll or headcount by role",
    why: "Labour is usually the largest controllable cost and sets your real capacity ceiling. Roles and cost are enough; we do not need individual names.",
    segments: ["insights", "analytics"],
    satisfiedBy: "Payroll or headcount by role",
    priority: "blocking",
  },
  {
    id: "addbacks",
    label: "Owner compensation and one-off or personal costs",
    why: "We adjust for these before analysing so the underlying economics are visible. Standard practice, and not a judgment: a rough schedule is fine.",
    segments: ["analytics"],
    priority: "blocking",
  },
  {
    id: "debt_schedule",
    label: "Debt and lease schedule",
    why: "Lender, balance, rate, maturity, monthly payment, and any personal guarantee. Leases sit alongside debt because a long lease behaves like borrowing whether or not it is on the balance sheet.",
    segments: ["analytics"],
    satisfiedBy: "Debt and lease schedule",
    priority: "blocking",
  },
  {
    id: "fixed_assets",
    label: "Fixed asset or depreciation schedule",
    why: "Separates what was actually spent on equipment and build-out from the depreciation charge, which is what makes capital intensity and maintenance spending visible.",
    segments: ["analytics"],
    satisfiedBy: "Fixed asset or depreciation schedule",
    priority: "blocking",
  },
  {
    id: "agings",
    label: "Receivables and payables aging",
    why: "Tests the collection and payment days the statements imply, and shows concentration: one customer at ninety days is a different business from thirty customers at thirty.",
    segments: ["analytics"],
    priority: "helpful",
  },
  {
    id: "inventory",
    label: "Inventory listing and how it is valued",
    why: "Only if you hold stock. Inventory is the balance-sheet line most often carried at a number nobody has tested, and it moves both margin and working capital.",
    segments: ["analytics"],
    priority: "helpful",
  },
  {
    id: "deferred_revenue",
    label: "Deferred revenue, memberships or prepaid packages",
    why: "Money taken for work not yet done is a liability, not revenue. Where it is calculated on a spreadsheet, that spreadsheet is usually the largest unaudited number in the business.",
    segments: ["analytics"],
    priority: "helpful",
  },
  {
    id: "related_party",
    label: "Related-party arrangements: rent, loans, family on payroll",
    why: "A building leased from an entity you own, or a relative on the payroll, is not wrong and is not hidden. It just has to be normalised out before the earnings mean anything to a lender or a buyer.",
    segments: ["analytics"],
    priority: "blocking",
  },
  {
    id: "distributions",
    label: "Owner distributions or dividends by year",
    why: "In a pass-through business this is where the profit actually went, and it is invisible on the P&L.",
    segments: ["analytics"],
    priority: "helpful",
  },
  {
    id: "one_offs",
    label: "One-off items in the last three years",
    why: "A lawsuit, a move, a failed hire, a relief payment, an insurance recovery. Anything that happened once and will not repeat, so it does not get read as a trend.",
    segments: ["analytics"],
    priority: "helpful",
  },
  {
    id: "concentration",
    label: "Top ten customers as a share of revenue",
    why: "Concentration is priced by every lender and every buyer, and it is the most common reason an otherwise healthy business is discounted.",
    segments: ["analytics", "intelligence"],
    priority: "helpful",
  },
  {
    id: "subsequent",
    label: "Anything material that happened after the last period end",
    why: "A signed lease, a large order, a lost account, equipment ordered. The statements stop at a date; decisions do not.",
    segments: ["shared"],
    priority: "helpful",
  },
  {
    id: "chart_accounts",
    label: "Chart of accounts, or how cost of delivery is separated from overhead",
    why: "Determines whether we can split what it costs to deliver the work from what it costs to keep the doors open.",
    segments: ["analytics"],
    priority: "helpful",
  },

  // ------------------------------------------------------------------- transactional
  {
    id: "transactions",
    label: "Transaction-level export: date, amount, customer ID",
    why: "The single most useful file you can send. It is what makes repeat rate, lifetime value and seasonality measurable rather than estimated.",
    segments: ["analytics", "intelligence", "atlas"],
    satisfiedBy: "Transaction-level export (date, amount, customer ID)",
    priority: "blocking",
  },
  {
    id: "price_list",
    label: "Current price list, including discounts and packages",
    why: "Needed to model what happens to profit if you change price, mix or terms.",
    segments: ["analytics"],
    priority: "blocking",
  },

  // ---------------------------------------------------------------------- geographic
  {
    id: "customer_geo",
    label: "Customer list with addresses or ZIP codes",
    why: "Addresses are converted to map coordinates and then deleted; the analysis holds no personal details. This is what shows where your next customers are.",
    segments: ["intelligence"],
    satisfiedBy: "Customer list with addresses or ZIP codes",
    priority: "blocking",
  },
  {
    id: "staff_roles",
    label: "Staff list by role, showing who can do what",
    why: "Roles and cover, not names and appraisals. It is what lets us price key-person risk, the revenue exposed if a role goes dark, instead of just describing it.",
    segments: ["insights"],
    satisfiedBy: "Staff list by role, showing who can do what",
    priority: "blocking",
  },
  {
    id: "quals_register",
    label: "Licence, certification or qualification register",
    why: "Where the law or a certification decides who may do the billable work, qualified headcount is a hard ceiling on volume, and the lead time to add one is often the real constraint.",
    segments: ["insights", "analytics"],
    satisfiedBy: "Licence, certification or qualification register",
    priority: "helpful",
  },
  {
    id: "marketing_spend",
    label: "Marketing spend by channel or area",
    why: "Turns 'where do customers come from' into a cost per customer you can act on.",
    segments: ["intelligence", "analytics"],
    satisfiedBy: "Marketing spend by channel or area",
    priority: "helpful",
  },
  {
    id: "locations",
    label: "List of locations: address, opened when, size",
    why: "The basis for trade areas, catchment and any site comparison.",
    segments: ["intelligence"],
    priority: "blocking",
  },

  // -------------------------------------------------------------------------- access
  {
    id: "accounting_access",
    label: "Read-only access to your accounting system",
    why: "Faster and more accurate than exports, and it means we stop asking you for files. Read-only: nothing can be changed.",
    segments: ["shared"],
    priority: "helpful",
  },
  {
    id: "system_access",
    label: "Read-only access to POS / CRM / marketing platforms",
    why: "Needed to wire your Scoreboard to live data rather than a monthly manual upload.",
    segments: ["atlas"],
    priority: "blocking",
  },

  // -------------------------------------------------------------------------- people
  {
    id: "interviews",
    label: "Three to five people available for a 45-minute conversation",
    why: "The numbers tell us what happened. These conversations tell us why, and they routinely surface the thing no report would have found.",
    segments: ["shared"],
    priority: "blocking",
  },
];

export type RequestStatus = "outstanding" | "provided" | "received" | "waived";

export type DataRequestItem = {
  id: string;
  label: string;
  why: string;
  priority: DataItem["priority"];
  status: RequestStatus;
};

/**
 * Build the personalised request.
 *
 * `provided` means the client ticked it in the intake, a stated intention, not an arrival.
 * Only Fenwick marks something `received`, and only when the file is actually in hand.
 * Keeping those two states distinct is the whole point: "they said they'd send it" and
 * "we have it" are different facts, and conflating them is how a phase starts on data
 * that never turned up.
 */
export function buildDataRequest(
  selectedSegments: string[],
  ticked: string[],
): DataRequestItem[] {
  const active = new Set(["shared", ...selectedSegments]);
  return DATA_ITEMS.filter((item) => item.segments.some((s) => active.has(s))).map((item) => ({
    id: item.id,
    label: item.label,
    why: item.why,
    priority: item.priority,
    status: (item.satisfiedBy && ticked.includes(item.satisfiedBy)
      ? "provided"
      : "outstanding") as RequestStatus,
  }));
}

export function outstandingCount(items: DataRequestItem[]): number {
  return items.filter((i) => i.status === "outstanding").length;
}
