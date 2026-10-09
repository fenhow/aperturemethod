/**
 * Onboarding content: single source of truth for BOTH the web forms and the
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
export type OnboardingKind = "intake" | "agreement" | "nda";

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
    "This helps us tailor your Business X-Ray and prepare the right analysis before we start. It takes about 10 minutes. Nothing here is shared or reused. Skip anything you're unsure of. We'll fill the gaps together.",
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
  subtitle: "Consulting & Analytics Services: The Aperture Method™",
  template:
    "When you sign, you'll receive a digital copy of the signed agreement for your records, and it's saved to your secure client area.",
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
      "Recurring services (Atlas). Ongoing Scoreboard/platform services are billed [monthly] in advance at the rate in Exhibit A and continue until canceled on [30] days' notice.",
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
      "Obligations run both ways. Aperture's own methods, models, pricing, and working papers are equally confidential to Client, and Client owes the same duty of care for them.",
      "If the Parties signed a mutual non-disclosure agreement before this one, it stays in force for everything exchanged under it. For anything exchanged under this Agreement, this clause and Clause 9 govern, and where they give more protection than the earlier agreement, they apply.",
    ],
  },
  {
    n: "9",
    title: "Data Protection & Security",
    body: [
      "Ownership. Client data stays Client's. Aperture claims no ownership of it and acquires no licence beyond what is needed to deliver the Services under this Agreement.",
      "Purpose limitation. Aperture will use Client data only to deliver this engagement. Aperture will not sell it, share it, use it to benefit another client, or use it to train any general-purpose machine-learning model.",
      "Least access. Only those working on the engagement get access, on a need-to-know basis, under written confidentiality obligations at least as strict as this Agreement.",
      "Security. Data is held in access-controlled systems with multi-factor authentication, encrypted in transit (TLS) and at rest, with access logged. Aperture does not copy Client data to personal devices or unmanaged storage.",
      "Minimisation. Aperture asks for the narrowest data that answers the question, and de-identifies or aggregates personal data wherever identity is not required for the analysis.",
      "Sub-processors. Aperture may use service providers (for example cloud hosting and analytics tools) bound by equivalent confidentiality and security terms. On request, Aperture will name the sub-processors that touch Client data, and will give Client notice before adding a new one that processes it.",
      "Location. Client data is processed and stored in the United States unless the Parties agree otherwise in writing.",
      "Personal and regulated data. Client will not send personal data that is not needed for the Services, and will not send protected health information, payment card data, or similar regulated data unless the Parties first agree in writing how it will be handled. Aperture will work within the privacy laws applicable to Client's business.",
      "Incident notice. If Aperture becomes aware of a security incident affecting Client data, Aperture will notify Client without undue delay and in any case within [72] hours, share what is known, and cooperate in Client's response and in any notice Client must give.",
      "Retention and return. During the engagement Aperture keeps raw Client data only as long as it is needed. Within [30] days of a written request, or on termination, Aperture will return or securely destroy it, keeping only the Client-owned deliverables and the minimum records required for legal, tax, or insurance purposes, which stay subject to the confidentiality terms of this Agreement.",
      "Audit. On reasonable notice and no more than once a year, Client may ask Aperture in writing to describe the controls that apply to Client data, and Aperture will answer in writing.",
      "No publicity without consent. Aperture will not name Client, use Client's logo, or describe the engagement publicly without Client's prior written consent. Any case study is anonymised, approved in writing, or both.",
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


// ---------------------------------------------------------------------------
// MUTUAL NON-DISCLOSURE AGREEMENT
// ---------------------------------------------------------------------------
/**
 * A two-way NDA, signable before anything else.
 *
 * Deliberately mutual: an owner is about to hand over their P&L, their customer
 * list and the things that keep them up at night, and a one-way NDA that only
 * protects the consultant reads exactly like what it is. Both Parties are bound
 * on the same terms.
 *
 * Square brackets are the figures to settle with counsel before this is used in
 * anger: term, survival, and governing state.
 */
export const ndaMeta = {
  title: "Mutual Non-Disclosure Agreement",
  subtitle: "Two-way confidentiality, before anything is shared",
  template:
    "Sign this first if you want protection in place before our first real conversation. It binds both of us on the same terms. You will receive a signed PDF for your records, and a copy is saved to your secure client area.",
};

export const ndaClauses: Clause[] = [
  {
    n: "1",
    title: "Purpose",
    body: [
      "The Parties wish to explore and may carry out a business analytics, strategy, and geographic-intelligence engagement delivered through The Aperture Method (the “Purpose”). To do that, each Party may disclose confidential information to the other. This Agreement is mutual: each Party may be the Disclosing Party or the Receiving Party, and the obligations are identical in both directions.",
    ],
  },
  {
    n: "2",
    title: "What is confidential",
    body: [
      "“Confidential Information” means non-public information disclosed by one Party to the other, in any form, that is marked confidential or that a reasonable person would understand to be confidential from its nature or the circumstances of disclosure. It includes, without limitation: financial statements and management accounts; pricing, margins, and unit economics; customer and supplier lists and contracts; employee and compensation information; strategy, plans, and forecasts; data files, systems access, and credentials; and the existence and content of the Parties' discussions.",
      "On Aperture's side it also includes the Method's models, scoring rubrics, templates, working papers, and fee structures.",
      "Information does not have to be marked to be protected. Nothing in this Agreement requires a Party to mark or confirm in writing what is obviously confidential.",
    ],
  },
  {
    n: "3",
    title: "What is not confidential",
    body: [
      "This Agreement does not apply to information that: is or becomes public through no act or omission of the Receiving Party; was rightfully known to the Receiving Party without restriction before disclosure; is rightfully received from a third party without a duty of confidentiality; or is independently developed by the Receiving Party without use of or reference to the other Party's Confidential Information, as shown by its records.",
    ],
  },
  {
    n: "4",
    title: "How it will be treated",
    body: [
      "Use it only for the Purpose. The Receiving Party will not use the other Party's Confidential Information for any other purpose, including its own commercial advantage or the benefit of any other client.",
      "Protect it. The Receiving Party will protect it with at least the care it uses for its own confidential information, and never less than reasonable care.",
      "Limit who sees it. Disclosure is limited to the Receiving Party's personnel, contractors, and professional advisers who need it for the Purpose and who are bound by confidentiality obligations at least as protective as these. The Receiving Party stays responsible for their compliance.",
      "No copies beyond need. The Receiving Party will not copy or store Confidential Information beyond what the Purpose requires, and will keep it in access-controlled systems.",
      "No reverse engineering. The Receiving Party will not reverse engineer, decompile, or disassemble anything provided, nor use Confidential Information to train any general-purpose machine-learning model.",
    ],
  },
  {
    n: "5",
    title: "Security and personal data",
    body: [
      "Each Party will use reasonable administrative, technical, and physical safeguards, including encryption in transit and at rest, access control, and multi-factor authentication on systems holding the other Party's Confidential Information.",
      "Where Confidential Information includes personal data, the Receiving Party will handle it in line with applicable privacy laws, use the minimum needed for the Purpose, and de-identify or aggregate it wherever identity is not required.",
      "If a Party becomes aware of a security incident affecting the other Party's Confidential Information, it will notify the other Party without undue delay and in any case within [72] hours, share what is known, and cooperate in the response.",
    ],
  },
  {
    n: "6",
    title: "Compelled disclosure",
    body: [
      "If the Receiving Party is required by law, regulation, or court order to disclose Confidential Information, it may do so, provided it gives the Disclosing Party prompt written notice where legally permitted, discloses only what is required, and cooperates with any effort by the Disclosing Party to obtain protective treatment.",
    ],
  },
  {
    n: "7",
    title: "No licence, no obligation to proceed",
    body: [
      "All Confidential Information remains the property of the Disclosing Party. Nothing here grants any licence or right in it, by implication or otherwise, beyond the limited use permitted for the Purpose.",
      "Nothing here obliges either Party to proceed with any engagement, to disclose any particular information, or to refrain from doing business with anyone else, except as expressly stated.",
      "No representation or warranty is made as to the accuracy or completeness of Confidential Information disclosed. Neither Party is liable to the other for decisions taken in reliance on it, which is separate from the duty to keep it confidential.",
    ],
  },
  {
    n: "8",
    title: "Return or destruction",
    body: [
      "On written request, or when the Purpose ends, the Receiving Party will within [30] days return or securely destroy the other Party's Confidential Information and confirm in writing that it has done so.",
      "Each Party may keep one copy in its legal or archival files, and copies held in routine backups, solely for compliance purposes. Anything kept stays subject to this Agreement for as long as it is held.",
    ],
  },
  {
    n: "9",
    title: "Term and survival",
    body: [
      "This Agreement starts on the Effective Date and continues for [two (2)] years, unless ended earlier by either Party on [thirty (30)] days' written notice.",
      "Confidentiality obligations continue for [three (3)] years after the date of disclosure, and for as long as the information remains a trade secret under applicable law. Obligations relating to personal data continue for as long as the data is held.",
      "If the Parties later sign the Aperture Method New Customer Agreement, this Agreement stays in force for everything already exchanged, and the confidentiality and data-protection terms of that agreement govern what is exchanged after it.",
    ],
  },
  {
    n: "10",
    title: "Remedies",
    body: [
      "Each Party acknowledges that a breach of this Agreement may cause harm that money alone cannot fix, and that the other Party may seek injunctive or equitable relief in addition to any other remedy available, without the need to post a bond.",
    ],
  },
  {
    n: "11",
    title: "General",
    body: [
      "Entire agreement. This is the entire agreement on confidentiality between the Parties until superseded as described in Clause 9, and replaces prior discussions on the subject.",
      "Amendment and waiver. Changes must be in writing and signed by both Parties. No waiver is implied by delay.",
      "Assignment. Neither Party may assign this Agreement without the other's written consent, except to a successor of its business.",
      "Severability. If any provision is unenforceable, the rest remains in effect.",
      "Governing law. This Agreement is governed by the laws of the State of [Texas], without regard to conflict-of-laws rules, and the Parties submit to the courts located in [Harris County, Texas].",
      "Counterparts and e-signature. This Agreement may be signed in counterparts and by electronic signature, which has the same effect as a handwritten one.",
    ],
  },
];

// Exhibit A of the contract the client signs. Defined once in src/lib/pricing.ts and
// re-exported here so existing importers keep working.
export { feeSchedule } from "@/lib/pricing";

export const ESIGN_CONSENT =
  "I agree that signing electronically is the legal equivalent of my handwritten signature, that I am authorized to sign on behalf of the company above, and I consent to do business electronically (ESIGN/UETA).";
