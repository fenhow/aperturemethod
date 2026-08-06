/**
 * Onboarding content — single source of truth for BOTH the web forms and the
 * generated PDFs. The Client Intake Form and the New Customer Agreement are
 * transcribed from Operations/Client Onboarding/*.docx so the online experience
 * and the signed document always match.
 *
 * NOTE: The agreement is a business template, not legal advice. Bracketed [ ]
 * items are defaults that can be edited per engagement.
 */

// ---------------------------------------------------------------------------
// Shared kinds
// ---------------------------------------------------------------------------
export type OnboardingKind = "intake" | "agreement";

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "url"
  | "radio"
  | "systems";

export type IntakeField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  help?: string;
  /** textarea rows */
  rows?: number;
};

export type IntakeSection = {
  id: string;
  title: string;
  help?: string;
  fields: IntakeField[];
};

// The predefined rows for the "Systems & data" matrix.
export const SYSTEM_ROWS = [
  "Accounting / financials",
  "Point of sale / sales",
  "CRM / customer records",
  "Marketing / web analytics",
  "Scheduling / operations",
  "Other",
] as const;

// ---------------------------------------------------------------------------
// CLIENT INTAKE FORM
// ---------------------------------------------------------------------------
export const intakeMeta = {
  title: "Client Intake Form",
  subtitle: "Tell us about your business",
  why:
    "This helps us tailor your Business X-Ray and prepare the right analysis before we start. It takes about 10 minutes. Nothing here is shared or reused. Skip anything you're unsure of — we'll fill the gaps together.",
};

export const intakeSections: IntakeSection[] = [
  {
    id: "company",
    title: "1. Company",
    fields: [
      { name: "business_name", label: "Company / business name", type: "text", required: true },
      { name: "website", label: "Website", type: "url", placeholder: "https://" },
      { name: "industry", label: "Industry / what you do", type: "text" },
      { name: "year_founded", label: "Year founded", type: "text" },
      { name: "locations", label: "Number of locations", type: "text" },
      { name: "employees", label: "Number of employees (FT / PT)", type: "text" },
      {
        name: "revenue",
        label: "Approximate annual revenue",
        type: "radio",
        options: ["Under $1M", "$1–5M", "$5–10M", "$10–20M", "$20M+", "Prefer not to say"],
      },
    ],
  },
  {
    id: "contacts",
    title: "2. Primary contact",
    fields: [
      { name: "first_name", label: "First name", type: "text", required: true },
      { name: "last_name", label: "Last name", type: "text", required: true },
      { name: "title", label: "Title / role", type: "text" },
      { name: "contact_email", label: "Email", type: "email", required: true },
      { name: "contact_phone", label: "Phone", type: "tel" },
      { name: "contact_best", label: "Best way / time to reach you", type: "text" },
    ],
  },
  {
    id: "solve",
    title: "3. What you want to solve",
    fields: [
      {
        name: "top_question",
        label: "The one question you most want answered",
        type: "textarea",
        rows: 2,
      },
      { name: "challenges", label: "Top 2–3 challenges right now", type: "textarea", rows: 3 },
      {
        name: "success_12mo",
        label: "What does success look like in 12 months?",
        type: "textarea",
        rows: 2,
      },
    ],
  },
  {
    id: "systems",
    title: "4. Systems & data",
    help: "Which systems do you use, and could you share data from them? We only need read access.",
    fields: [
      { name: "systems_matrix", label: "Systems", type: "systems" },
      {
        name: "has_addresses",
        label: "Do you have customer addresses / locations on file?",
        type: "radio",
        options: ["Yes", "No", "Not sure"],
      },
      {
        name: "financials_available",
        label: "Last 3 years of financial statements available?",
        type: "radio",
        options: ["Yes", "No", "Partial"],
      },
    ],
  },
  {
    id: "market",
    title: "5. Market & growth",
    fields: [
      { name: "competitors", label: "Main competitors", type: "textarea", rows: 2 },
      {
        name: "growth_plans",
        label: "Any plans to grow, add locations, or expand? Where?",
        type: "textarea",
        rows: 2,
      },
      { name: "timing_driver", label: "What's driving the timing right now?", type: "textarea", rows: 2 },
    ],
  },
  {
    id: "fit",
    title: "6. Engagement fit",
    fields: [
      {
        name: "move_speed",
        label: "How soon are you hoping to move?",
        type: "radio",
        options: ["Exploring", "1–3 months", "3–6 months", "Not sure"],
      },
      { name: "budget", label: "Budget range in mind (optional)", type: "text" },
      { name: "decision_makers", label: "Who else is involved in the decision?", type: "text" },
      { name: "referral", label: "How did you hear about Aperture?", type: "text" },
    ],
  },
];

export const intakeConsent =
  "I confirm I have the right to share the data described above, and I authorize Aperture to use it solely to prepare and deliver the engagement, per Aperture's confidentiality and data-handling standards.";

// ---------------------------------------------------------------------------
// NEW CUSTOMER AGREEMENT
// ---------------------------------------------------------------------------
export const agreementMeta = {
  title: "New Customer Agreement",
  subtitle: "Consulting & Analytics Services — The Aperture Method™",
  template:
    "When you sign, you'll receive a digital copy of the signed agreement for your records \u2014 and it's saved to your secure client area.",
};

export type Clause = { n: string; title: string; body: string[] };

export const agreementClauses: Clause[] = [
  {
    n: "1",
    title: "Engagement & Scope of Services",
    body: [
      "Client engages Aperture to provide business analytics, strategy, and geographic-intelligence services delivered through The Aperture Method (the “Services”). The specific segments, deliverables, fees, and schedule for this engagement are set out in Exhibit A (Scope & Fees). Services not described in Exhibit A are out of scope until agreed in writing.",
    ],
  },
  {
    n: "2",
    title: "The Method & Phase-Gates",
    body: [
      "The Services are delivered in phases (e.g., Business X-Ray, Aperture Insights, Analytics, Intelligence, Compass, and Atlas). Each phase is fixed-fee and phase-gated: at the end of a phase, Client decides whether to proceed to the next. Aperture will not begin a subsequent phase, and Client is not obligated to pay for it, until Client approves it in writing (email suffices).",
    ],
  },
  {
    n: "3",
    title: "Fees & Payment",
    body: [
      "Fixed fees. Fees for each phase are fixed as stated in Exhibit A.",
      "Deposit. Unless stated otherwise, each phase begins on receipt of a [50%] deposit, with the balance due on delivery of that phase's deliverable.",
      "Recurring services (Atlas). Ongoing Scoreboard/platform services are billed [monthly] in advance at the rate in Exhibit A and continue until cancelled on [30] days' notice.",
      "Expenses. Pre-approved out-of-pocket expenses (e.g., third-party data or software licenses) are billed at cost.",
      "Invoices & late payment. Invoices are due within [15] days. Overdue amounts may accrue interest at [1.5%] per month or the maximum allowed by law, and Aperture may pause work on overdue accounts.",
      "Taxes. Fees are exclusive of applicable taxes, which Client is responsible for.",
    ],
  },
  {
    n: "4",
    title: "Term & Termination",
    body: [
      "This Agreement begins on the Effective Date and continues until the Services are complete or it is terminated. Either Party may terminate: (a) at the end of any phase, for convenience, on written notice; or (b) at any time if the other Party materially breaches and does not cure within [15] days of notice. On termination, Client pays for Services performed and deliverables completed through the termination date, and Aperture delivers work product for paid phases.",
    ],
  },
  {
    n: "5",
    title: "Client Responsibilities",
    body: [
      "Provide timely, accurate access to the data, systems, and people the Services require.",
      "Designate a primary contact empowered to make decisions and give phase-gate approvals.",
      "Provide feedback and approvals within [5] business days so the schedule holds.",
      "Ensure Client has the right to share any data it provides and that doing so does not violate any law or third-party agreement.",
    ],
  },
  {
    n: "6",
    title: "Deliverables & Acceptance",
    body: [
      "Aperture will deliver the deliverables described in Exhibit A. Client has [5] business days to review each deliverable and report, in writing, any material failure to meet the agreed description; Aperture will correct such failures. Absent written notice within that period, the deliverable is deemed accepted. Deliverables are provided for Client's internal business use.",
    ],
  },
  {
    n: "7",
    title: "Intellectual Property",
    body: [
      "Client deliverables. On full payment for a phase, Client owns the deliverables Aperture creates specifically for Client from Client's data (e.g., the Business X-Ray, Profit Map, Customer & Market Map, Focus Plan, and the Client's Scoreboard configuration). Client may keep and use them.",
      "Aperture IP. Aperture retains all right, title, and interest in The Aperture Method, the Aperture Platform (including SyncPoint AI), its models, templates, frameworks, know-how, and any pre-existing or independently developed materials (“Aperture IP”). Aperture grants Client a non-exclusive, non-transferable license to use Aperture IP embedded in the deliverables solely for Client's internal business use.",
      "Aggregated learnings. Aperture may use general knowledge, skills, and de-identified, aggregated learnings gained during the engagement, provided no Client Confidential Information or personal data is disclosed.",
    ],
  },
  {
    n: "8",
    title: "Confidentiality",
    body: [
      "Each Party may receive confidential information of the other (“Confidential Information”). The receiving Party will use it only to perform under this Agreement, protect it with at least reasonable care, and not disclose it except to personnel or contractors with a need to know who are bound by similar obligations. This does not apply to information that is public through no fault of the receiving Party, independently developed, or rightfully received from a third party. These obligations survive termination for [3] years (and, for trade secrets, for as long as they remain trade secrets).",
    ],
  },
  {
    n: "9",
    title: "Data Protection & Security",
    body: [
      "Aperture handles Client data on a least-access basis, stores it in access-controlled systems, and uses encryption in transit and at rest.",
      "Aperture will not sell, share, or reuse Client data for any other client or purpose.",
      "Aperture de-identifies personal data for analysis where identity is not required, and works within the privacy laws applicable to Client's business.",
      "On request at termination, Aperture will return or securely destroy Client's raw data, retaining only the Client-owned deliverables and records reasonably needed for legal or accounting purposes.",
    ],
  },
  {
    n: "10",
    title: "Warranties & Disclaimers",
    body: [
      "Aperture will perform the Services in a professional and workmanlike manner. Aperture provides analysis, models, and recommendations to inform Client's decisions; Client is responsible for its own business decisions and results. The Services are advisory and do not guarantee any particular financial outcome. Aperture does not provide legal, accounting, tax, or investment advice. Except as expressly stated, the Services and deliverables are provided “as is,” and Aperture disclaims all other warranties, express or implied, including merchantability and fitness for a particular purpose.",
    ],
  },
  {
    n: "11",
    title: "Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, neither Party is liable for indirect, incidental, special, or consequential damages, or lost profits. Aperture's total aggregate liability arising out of or related to this Agreement will not exceed the total fees paid by Client for the phase giving rise to the claim. Nothing limits liability for a Party's fraud, willful misconduct, or breach of confidentiality.",
    ],
  },
  {
    n: "12",
    title: "Indemnification",
    body: [
      "Client will indemnify Aperture against third-party claims arising from data Client provided that Client did not have the right to share, or from Client's use of the deliverables in violation of law. Each Party will otherwise be responsible for its own acts and omissions as determined by law.",
    ],
  },
  {
    n: "13",
    title: "Independent Contractor",
    body: [
      "Aperture is an independent contractor. Nothing creates a partnership, joint venture, agency, or employment relationship. Each Party is responsible for its own taxes and personnel.",
    ],
  },
  {
    n: "14",
    title: "Non-Solicitation",
    body: [
      "During the engagement and for [12] months after, neither Party will knowingly solicit for employment the other Party's personnel who were directly involved in the Services, except through general public advertising.",
    ],
  },
  {
    n: "15",
    title: "Governing Law & Dispute Resolution",
    body: [
      "This Agreement is governed by the laws of the State of [Texas], without regard to conflict-of-laws rules. The Parties will first attempt to resolve any dispute in good faith. Unresolved disputes will be subject to the exclusive jurisdiction of the state and federal courts located in [County], [Texas], or, if the Parties agree, resolved by binding arbitration. The prevailing Party may recover reasonable attorneys' fees.",
    ],
  },
  {
    n: "16",
    title: "General",
    body: [
      "Entire agreement. This Agreement and its Exhibits are the entire agreement and supersede prior discussions.",
      "Amendment. Changes must be in writing and signed (or approved by email for phase-gate scope).",
      "Assignment. Neither Party may assign without the other's consent, except to a successor of its business.",
      "Notices. Notices are given by email to the Parties' primary contacts, effective on confirmed delivery.",
      "Severability & waiver. If any provision is unenforceable, the rest remains in effect; no waiver is implied by delay.",
      "Counterparts & e-signature. This Agreement may be signed in counterparts and by electronic signature.",
    ],
  },
];

export const feeSchedule = [
  { phase: "Business X-Ray™", deliverable: "Business X-Ray + Aperture Score", fee: "from $2,500 (fixed)" },
  { phase: "Aperture Insights™", deliverable: "X-Ray + engagement baseline", fee: "from $6,000" },
  { phase: "Aperture Analytics™", deliverable: "Profit Map + scenario model", fee: "from $6,000" },
  { phase: "Aperture Intelligence™", deliverable: "Customer & Market Map + GIS package", fee: "from $6,000" },
  { phase: "Aperture Compass™", deliverable: "Opportunity Matrix + Focus Plan", fee: "from $6,000" },
  { phase: "Full Method (bundle)", deliverable: "Insights → Compass, end to end", fee: "from $25,000" },
  { phase: "Aperture Atlas™ (recurring)", deliverable: "Live Scoreboard + KPI system", fee: "from $1,000 / month" },
];

export const ESIGN_CONSENT =
  "I agree that signing electronically is the legal equivalent of my handwritten signature, that I am authorized to sign on behalf of the company above, and I consent to do business electronically (ESIGN/UETA).";
