/**
 * Content for the "five financial statements" figure.
 *
 * IMPORTANT: this is the small-screen transcription of the printed infographic
 * at public/insights/five-financial-statements.png. The image is the artwork;
 * this file is the same information rebuilt as text so it stays readable on a
 * phone, where a 1402px wide graphic is not.
 *
 * Because there are two renderings of one thing, they can drift. If the artwork
 * is ever re-exported with different wording, change it here in the same pass.
 * A figure whose caption disagrees with its own image is worse than no figure.
 */

export type StatementRow = {
  /** The arithmetic or direction marker printed to the left of the row. */
  op?: string;
  label: string;
  /** The smaller clarifying line beneath the label. */
  sub?: string;
};

export type StatementGroup = {
  title?: string;
  rows: StatementRow[];
  /** The summed line that closes the group. */
  total?: string;
};

export type StatementPanel = {
  n: number;
  tone: "ink" | "maroon";
  title: string;
  when: string;
  shows: string;
  blockTitle: string;
  /** The accounting identity, where the panel states one. */
  equation?: string;
  groups: StatementGroup[];
  footer?: string;
  question: string;
};

export const statementPanels: StatementPanel[] = [
  {
    n: 1,
    tone: "ink",
    title: "Beginning Balance Sheet",
    when: "Start of period",
    shows: "Shows your financial position at the beginning of the period.",
    blockTitle: "The equation",
    equation: "Assets = Liabilities + Equity",
    groups: [
      {
        title: "Assets",
        rows: [
          { label: "Cash" },
          { label: "Accounts Receivable" },
          { label: "Inventory" },
          { label: "Equipment" },
          { label: "Other Assets" },
        ],
        total: "= Total Assets",
      },
      {
        title: "Liabilities",
        rows: [{ label: "Accounts Payable" }, { label: "Loans" }, { label: "Other Liabilities" }],
      },
      {
        title: "Equity",
        rows: [
          { label: "Common Stock" },
          { label: "Additional Paid-in Capital" },
          { label: "Retained Earnings" },
        ],
        total: "= Total Liabilities + Equity",
      },
    ],
    question: "Where are we starting?",
  },
  {
    n: 2,
    tone: "maroon",
    title: "Income Statement",
    when: "During the period",
    shows: "Shows your performance over the period.",
    blockTitle: "The result",
    groups: [
      {
        rows: [{ label: "Revenues" }, { op: "−", label: "Expenses" }],
        total: "= Net Profit (or Loss)",
      },
    ],
    footer: "Measures the profitability of your business.",
    question: "How did we perform?",
  },
  {
    n: 3,
    tone: "ink",
    title: "Cash Flow Statement",
    when: "During the period",
    shows: "Shows how cash moved in and out of the business.",
    blockTitle: "The movement",
    groups: [
      {
        rows: [
          { op: "↑", label: "Cash from Operations", sub: "Your core business" },
          { op: "→", label: "Cash from Investing", sub: "Buying and selling assets" },
          { op: "↓", label: "Cash from Financing", sub: "Loans, equity, dividends" },
        ],
        total: "= Net Change in Cash",
      },
    ],
    footer: "Explains the change in your cash balance.",
    question: "Why did cash change?",
  },
  {
    n: 4,
    tone: "maroon",
    title: "Statement of Equity",
    when: "During the period",
    shows: "Shows the changes in owner equity during the period.",
    blockTitle: "The change",
    groups: [
      {
        rows: [
          { label: "Beginning Retained Earnings" },
          { op: "+", label: "Net Profit (or Loss)", sub: "from the Income Statement" },
          { op: "+", label: "Owner Contributions" },
          { op: "−", label: "Owner Distributions", sub: "Dividends" },
        ],
        total: "= Ending Retained Earnings",
      },
    ],
    footer: "Shows how the owner's equity in the business changed.",
    question: "What happened to owner's equity?",
  },
  {
    n: 5,
    tone: "ink",
    title: "Ending Balance Sheet",
    when: "End of period",
    shows: "Shows your financial position at the end of the period.",
    blockTitle: "The new equation",
    equation: "Assets = Liabilities + Equity",
    groups: [
      {
        title: "Assets",
        rows: [
          { label: "Cash" },
          { label: "Accounts Receivable" },
          { label: "Inventory" },
          { label: "Equipment" },
          { label: "Other Assets" },
        ],
        total: "= Total Assets",
      },
      {
        title: "Liabilities",
        rows: [{ label: "Accounts Payable" }, { label: "Loans" }, { label: "Other Liabilities" }],
      },
      {
        title: "Equity",
        rows: [
          { label: "Common Stock" },
          { label: "Additional Paid-in Capital" },
          { label: "Retained Earnings" },
        ],
        total: "= Total Liabilities + Equity",
      },
    ],
    question: "Where did we end up?",
  },
];

/** The closing sequence: how the five connect, in order. */
export const statementConnections: string[] = [
  "We start with the Beginning Balance Sheet, a snapshot in time.",
  "Our performance, the Income Statement, produces Net Profit or Loss.",
  "Cash moves in and out, the Cash Flow Statement, and changes our cash.",
  "Net Profit or Loss flows into the Statement of Equity and changes equity.",
  "All the changes land in the Ending Balance Sheet, our new snapshot.",
];

export const statementCycle = {
  title: "It is a continuous cycle.",
  body: "The Ending Balance Sheet becomes the Beginning Balance Sheet for the next period.",
  points: [
    "Performance creates results.",
    "Cash explains the movement.",
    "Equity reflects those results.",
    "The Balance Sheets bookend the story.",
  ],
};

export const statementFigure = {
  src: "/insights/five-financial-statements.png",
  width: 1402,
  height: 1122,
  alt:
    "The five financial statements and how they work together: beginning balance sheet, income statement, cash flow statement, statement of equity, and ending balance sheet, shown in sequence with the question each one answers.",
  caption:
    "One business, five perspectives, a complete financial story. Each statement answers a different question, and the last one hands the story back to the first.",
};
