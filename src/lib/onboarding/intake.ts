/**
 * Intake Questionnaire content, transcribed from
 * Operations/The Aperture Method - Intake Questionnaire.pdf.
 *
 * Structure: a shared "Before we begin" foundation everyone answers, then one
 * section-set per Method segment. The client answers the shared part + only the
 * segment(s) they're engaging. The AI-agent personas from the source document
 * are intentionally NOT included (kept internal); each segment reads by its
 * public name and phase.
 */

export type IntakeFieldType = "text" | "textarea" | "checkgroup";
export type IntakeField = {
  name: string;
  label: string;
  type: IntakeFieldType;
  rows?: number;
  options?: string[];
};
export type IntakeSection = { id: string; title: string; help?: string; fields: IntakeField[] };
export type IntakeSegment = {
  key: string;
  name: string;
  phase: string; // e.g. "Phase 01"
  verb: string; // e.g. "Understand"
  question: string; // the phase question
  blurb: string;
  gives: string; // the named deliverable(s) they receive
  sections: IntakeSection[];
};

const T = (name: string, label: string, rows = 2): IntakeField => ({ name, label, type: "textarea", rows });
const S = (name: string, label: string): IntakeField => ({ name, label, type: "text" });

export const intakeIntro = {
  title: "Intake Questionnaire",
  subtitle: "This is where an engagement starts.",
  lead:
    "Answer what you can, in your own words. Leave anything blank that you don't know or don't have. A blank is information too, and far more useful than a guess. Nothing here is a test.",
};

// ---------------------------------------------------------------------------
// SHARED: answered once, shared by every part of the Method
// ---------------------------------------------------------------------------
export const sharedIntro =
  "This first section is answered once and shared by every part of the Method. It tells us who you are, what you actually want answered, and what data exists.";

export const sharedSections: IntakeSection[] = [
  {
    id: "business",
    title: "The business",
    fields: [
      S("b_legal", "Legal name of the business"),
      S("b_trading", "Trading name, if different"),
      S("b_industry", "Industry / what you sell, in one line"),
      S("b_years", "Years in operation"),
      T("b_locations", "Number of locations, and where", 2),
      S("b_employees", "Employees: full-time, part-time, contract"),
      T("b_ownership", "Ownership structure, and who else has a say in decisions", 2),
      S("b_revenue", "Approximate annual revenue (a range is fine)"),
      S("b_fye", "Financial year end (month)"),
      T("b_buyers", "Who buys from you: consumers, other businesses, or both? Roughly what split?", 2),
    ],
  },
  {
    id: "one-question",
    title: "The one question",
    fields: [
      T("q_one", "If you could have exactly one question about your business answered with certainty, what would it be? Write it as a question.", 2),
      T("q_why", "Why does that question matter right now? What happens if it stays unanswered?", 2),
      T("q_belief", "What do you believe the answer is? (We will test this, not assume it.)", 2),
    ],
  },
  {
    id: "headed",
    title: "Where you are headed",
    fields: [
      T("h_vision", "What do you want the business to look like in 24 months?", 3),
      T("h_changed", "What has changed in the last 12 months, good or bad?", 2),
      T("h_tried", "What have you already tried that didn't work, and why do you think it didn't?", 2),
    ],
  },
  {
    id: "decisions",
    title: "How decisions get made",
    fields: [
      T("d_approve", "Who has to approve a significant decision?", 2),
      T("d_capital", "Roughly what capital could you put behind the right move in the next 12 months?", 2),
      T("d_risk", "How much risk are you willing to take, and what would you refuse to do?", 2),
      T("d_timing", "Any timing you are locked into? (season, lease, loan, contract, life event)", 2),
    ],
  },
  {
    id: "systems",
    title: "Systems we would read from",
    fields: [
      S("s_accounting", "Accounting system"),
      S("s_pos", "POS / booking / order system"),
      S("s_crm", "CRM or customer database"),
      S("s_marketing", "Marketing platforms (email, ads, social)"),
      T("s_other", "Anything else that holds numbers you rely on", 2),
      T("s_admin", "Who administers these systems and can grant read-only access?", 2),
    ],
  },
  {
    id: "data",
    title: "What data exists",
    help: "Tick what you have. Messy or partial is normal; it's not a blocker.",
    fields: [
      {
        name: "data_have",
        label: "What you can share",
        type: "checkgroup",
        options: [
          "Profit & loss statements, last 3 years plus year-to-date",
          "Balance sheet, last 3 years",
          "Revenue broken out by product or service",
          "Revenue broken out by location",
          "Transaction-level export (date, amount, customer ID)",
          "Customer list with addresses or ZIP codes",
          "Payroll or headcount by role",
          "Staff list by role, showing who can do what",
          "Licence, certification or qualification register",
          "Marketing spend by channel or area",
        ],
      },
      T("data_missing", "Anything you know is missing, messy, or that you don't trust: tell us now. Messy data is normal and is not a blocker.", 2),
      T("data_basis", "Are your accounts kept on a cash or accrual basis? Are all locations and entities in one set of books, or several? Who prepares and closes them, someone in-house or an external accountant?", 3),
    ],
  },
  {
    id: "people",
    title: "People we should talk to",
    fields: [
      T("p_people", "Three to five people, you and your key managers, who should each sit for a 45-minute conversation. Name, role, and what they see that nobody else does.", 4),
      T("p_avoid", "Is there anyone we should not approach, or anything not yet public inside the business?", 2),
    ],
  },
];

// ---------------------------------------------------------------------------
// SEGMENTS
// ---------------------------------------------------------------------------
export const segments: IntakeSegment[] = [
  {
    key: "insights",
    name: "Aperture Insights™",
    phase: "Phase 01",
    verb: "Understand",
    question: "What is happening?",
    blurb:
      "A read of the whole business across seven lenses, naming the single biggest thing holding it back and setting your Aperture Score™ baseline.",
    gives: "Business X-Ray™ + your Aperture Score™",
    sections: [
      { id: "ins-fin", title: "Lens 1 · Finance", fields: [
        T("ins_fin1", "Do you know which parts of the business make money and which lose it? How confident are you?", 2),
        T("ins_fin2", "What is your cash position like across a typical year; when is it tight?", 2),
        T("ins_fin3", "Which costs have grown fastest, and do you know why?", 2),
        T("ins_fin4", "How and when do you get paid: on delivery, on terms, deposits, retainers? Roughly how much is owed to you at any one time, and what debt, lease or repayment obligations does the business carry?", 3),
        T("ins_fin5", "For your main product or service: what do you charge, and roughly what does it cost you to deliver one? Include the labour and materials that go into that single unit.", 3),
        T("ins_fin6", "Do your accounts separate the cost of delivering the work from general overhead? Are any costs allocated down to individual products, services or locations, and on what basis?", 2),
        T("ins_fin7", "Do you hold inventory, stock or materials? Roughly what is it worth at any one time, and how long does a typical item sit before it is used or sold? What payment terms do your main suppliers give you, and do you actually take them?", 3),
      ]},
      { id: "ins-ops", title: "Lens 2 · Operations", fields: [
        T("ins_ops1", "Walk us through how the work actually gets done, start to finish.", 3),
        T("ins_ops2", "Where does it back up? What is the thing that most often makes everything else wait?", 2),
        T("ins_ops3", "If demand doubled tomorrow, what breaks first?", 2),
        T("ins_ops5", "Which parts of your work require a licensed, certified or specifically-trained person to perform? How many such people do you have, what share of billable volume depends on them, and how long does it take to get another one qualified?", 4),
        T("ins_ops4", "What physically sets your ceiling on volume: chairs, bays, rooms, vehicles, machine hours, staffed hours? How many do you have, and roughly what share is in use in an average week versus your busiest? In a typical month, how many units, jobs or visits do you do, and which months are the peaks and troughs?", 4),
        T("ins_ops6", "Which suppliers, subcontractors or platforms would hurt most if they raised their price, changed their terms or stopped serving you tomorrow? Roughly what share of your cost or your volume runs through the largest one, and how long would it take you to replace them?", 3),
      ]},
      { id: "ins-cust", title: "Lens 3 · Customers & Retention", fields: [
        T("ins_cust1", "Where do new customers come from today, ranked?", 2),
        T("ins_cust2", "What share of customers come back? How do you know?", 2),
        T("ins_cust3", "Describe your single best customer, not the biggest, the best. What makes them that?", 2),
        T("ins_cust4", "Why do customers leave, when they leave?", 2),
        T("ins_cust5", "What do you spend on marketing in a typical year, and can you break that down by channel or by area? Where do referrals come from?", 3),
      ]},
      { id: "ins-mkt", title: "Lens 4 · Market & Competition", fields: [
        T("ins_mkt1", "Who do you actually lose to, and on what: price, speed, quality, convenience, relationship?", 2),
        T("ins_mkt2", "What is changing in your market that worries you?", 2),
        T("ins_mkt3", "Roughly how far do customers travel to reach you, and what is the furthest you would call normal? Which areas do you do well in, and which would you expect to and don't?", 3),
        T("ins_mkt4", "Name the competitors that actually cost you business, and where they are. Has anyone opened, closed or expanded near you recently?", 3),
        T("ins_mkt5", "If a well-funded competitor opened across the road tomorrow and set out to copy you, what would they find hardest to reproduce, and roughly how long would it take them? If the honest answer is \"not much, and quickly\", say that; it is a more useful place to start than a strength nobody can name.", 3),
      ]},
      { id: "ins-lead", title: "Lens 5 · Leadership & Team", fields: [
        T("ins_lead1", "If you took a month off with no contact, what would fall over?", 2),
        T("ins_lead2", "Which role, filled well, would unlock the most? Which is hardest to hire?", 2),
        T("ins_lead3", "Think of an initiative here that stalled. What actually stopped it, and who would need to be persuaded for something like it to happen?", 3),
        T("ins_lead4", "Which jobs can only one person here do? For each, name the role, not the person, and roughly what share of revenue depends on it. If that role were unavailable for ninety days, what would stop, and what would it cost you?", 4),
        T("ins_lead5", "For each of those roles, who could cover it tomorrow, and what is written down well enough that someone else could follow it? Where the answer is nobody and nothing, say so: that is the finding.", 3),
        T("ins_lead6", "How many people report directly to you? Who else has people reporting to them, and how many? Roughly how many staff are there in total, and how has that changed over three years?", 3),
      ]},
      { id: "ins-proc", title: "Lens 6 · Processes", fields: [
        T("ins_proc1", "Which process, if it ran properly, would change the most?", 2),
        T("ins_proc2", "What still runs on someone's memory, a spreadsheet, or a piece of paper?", 2),
      ]},
      { id: "ins-tech", title: "Lens 7 · Technology & Data", fields: [
        T("ins_tech1", "What can't you see today that you wish you could?", 2),
        T("ins_tech2", "Where do you not trust your own numbers?", 2),
        T("ins_tech3", "Which numbers do you check weekly, and which monthly? Where do you go to look each one up?", 2),
      ]},
      { id: "ins-con", title: "The constraint, and what “solved” means", fields: [
        T("ins_con1", "In one sentence: what do you believe is the single biggest thing holding the business back?", 2),
        T("ins_con2", "If that were fixed, what number would move, and by how much, by when? Be specific; this becomes how we measure the engagement.", 2),
        T("ins_con3", "What is that number today? An approximate figure is fine. This is the baseline we measure the engagement against, and without it there is nothing to compare to.", 2),
        T("ins_con4", "Besides that number, what two or three others would have to move for you to call this engagement a success? For each, roughly where it stands today and where it would need to get to.", 3),
      ]},
    ],
  },
  {
    key: "analytics",
    name: "Aperture Analytics™",
    phase: "Phase 02",
    verb: "Quantify",
    question: "Why is it happening?",
    blurb:
      "The Profit Map and scenario model: where the money is made and lost, and what happens if you change something. Rough answers are fine; anything you can export is better than anything you can describe.",
    gives: "Profit Map + scenario model",
    sections: [
      { id: "an-num", title: "How your numbers are kept", fields: [
        T("an_num1", "At what level can you export revenue: per transaction, per day, per month?", 2),
        T("an_num2", "Do your accounts separate cost of delivery from overhead? Roughly how?", 2),
        T("an_num3", "Are costs currently allocated to products, services or locations? If so, on what basis?", 2),
        T("an_num4", "Who closes the books, and how confident are you in them?", 2),
        T("an_num5", "Owner compensation, one-off or unusual costs, and anything personal or related-party running through the business: roughly what, and how much? We adjust for these before analysing so the underlying economics are visible. This is standard practice and not a judgment.", 3),
      ]},
      { id: "an-price", title: "Price and mix", fields: [
        T("an_price1", "List your main products or services and their current prices.", 3),
        T("an_price2", "What discounts, packages, memberships or negotiated rates exist?", 2),
        T("an_price3", "When did you last change prices, and what happened?", 2),
        T("an_price4", "Are there things you sell that you suspect lose money?", 2),
      ]},
      { id: "an-vol", title: "Volume", fields: [
        T("an_vol1", "Units, jobs, visits or orders in a typical month, by product or service", 2),
        T("an_vol2", "How does that split across locations?", 2),
        T("an_vol3", "How seasonal is the business? Which months are the peaks and troughs?", 2),
      ]},
      { id: "an-dec", title: "The decisions you want tested", fields: [
        T("an_dec1", "What decisions are actually on the table right now? List them. We'll model them side by side on profit, cash and risk.", 3),
        T("an_dec2", "What would you need to see to be convinced either way?", 2),
        T("an_dec3", "Do you know your break-even? If yes, what is it and how was it worked out?", 2),
      ]},
    ],
  },
  {
    key: "intelligence",
    name: "Aperture Intelligence™",
    phase: "Phase 03",
    verb: "Reveal",
    question: "What opportunities does it reveal?",
    blurb:
      "Your customers, market and competitors mapped onto real geography: where the next customers come from. Addresses are geocoded and then stripped; the analysis layer holds no personal identifying information.",
    gives: "Market & customer map",
    sections: [
      { id: "int-geo", title: "Your customers, geographically", fields: [
        T("int_geo1", "Can you export customers with addresses or ZIP codes? From which system?", 2),
        T("int_geo1b", "Can that customer export be joined to purchase history by a shared customer ID? How far back does the history go, and does it hold one row per transaction with a date and amount?", 3),
        T("int_geo2", "Roughly how far do people travel to you? What is the furthest you'd call normal?", 2),
        T("int_geo3", "Are there areas you know you do well in, and areas you'd expect to and don't?", 2),
      ]},
      { id: "int-fp", title: "Your footprint", fields: [
        T("int_fp1", "List every location: address, opened when, size, and how it is performing in your view.", 3),
        T("int_fp2", "Which location is the model you'd want to repeat, and why?", 2),
      ]},
      { id: "int-comp", title: "The competition", fields: [
        T("int_comp1", "Name the competitors that actually cost you business, and where they are.", 2),
        T("int_comp2", "Has anyone opened, closed or expanded near you recently?", 2),
        T("int_comp3", "What do they do better than you? Answer honestly; it is more useful.", 2),
      ]},
      { id: "int-grow", title: "Where you might grow", fields: [
        T("int_grow1", "Are there specific areas, towns or sites you have been considering? List them even if it's a hunch. We'll score them against demand rather than dismiss them.", 3),
        T("int_grow2", "What marketing do you run, and can you break the spend down by area or channel?", 2),
        T("int_grow3", "Where do referrals come from: other businesses, professionals, existing customers?", 2),
      ]},
    ],
  },
  {
    key: "compass",
    name: "Aperture Compass™",
    phase: "Phase 04",
    verb: "Navigate",
    question: "Where should we go next?",
    blurb:
      "Every option scored on value, complexity, risk and impact on your constraint, then sequenced into Now / Next / Later. This needs your real limits, not your ideal ones.",
    gives: "Now / Next / Later growth plan",
    sections: [
      { id: "comp-tab", title: "What's already on the table", fields: [
        T("comp_tab1", "List every move you are considering, however half-formed. We'd rather rule something out with evidence than never see it.", 3),
        T("comp_tab2", "Which of these is your instinct telling you to do? (Recorded so we can check it later, not to flatter it.)", 2),
      ]},
      { id: "comp-lim", title: "Your real limits", fields: [
        T("comp_lim1", "Capital available, and how quickly it could be released", 2),
        T("comp_lim2", "Capacity: whose time would this actually take, and do they have it?", 2),
        T("comp_lim3", "What is genuinely off the table? (won't sell, won't franchise, won't borrow, won't relocate)", 2),
        T("comp_lim4", "What is your appetite for a move that pays off in year three rather than this year?", 2),
      ]},
      { id: "comp-done", title: "How things get done here", fields: [
        T("comp_done1", "Think of an initiative that stalled. What actually stopped it?", 2),
        T("comp_done2", "Who needs to be persuaded for something to happen, and what persuades them?", 2),
        T("comp_done3", "Who would own delivery of a major initiative day to day?", 2),
      ]},
    ],
  },
  {
    key: "atlas",
    name: "Aperture Atlas™",
    phase: "Phase 05",
    verb: "Perform",
    question: "How do we sustain and improve results?",
    blurb:
      "A live Scoreboard of the few numbers that matter, wired to your systems, on a cadence. Fewer, better: a dashboard nobody opens is worse than none.",
    gives: "Live Scoreboard, wired to your systems",
    sections: [
      { id: "atl-watch", title: "What you watch today", fields: [
        T("atl_watch1", "What numbers do you check weekly? Monthly? Where do you look them up?", 2),
        T("atl_watch2", "What report do you currently get that you don't read? Why not?", 2),
        T("atl_watch3", "What would you check every morning if it were one click away?", 2),
      ]},
      { id: "atl-good", title: "What good looks like", fields: [
        T("atl_good1", "For each number that matters: what value means on track, and what value means call me?", 2),
        T("atl_good2", "How quickly do you need to know when something goes wrong: same day, weekly, monthly?", 2),
      ]},
      { id: "atl-rhythm", title: "Rhythm and ownership", fields: [
        T("atl_rhythm1", "Who should own each number? (a person, not a department)", 2),
        T("atl_rhythm2", "What meeting already exists that this should feed, and when does it run?", 2),
        T("atl_rhythm3", "Who else should be able to see the Scoreboard?", 2),
      ]},
      { id: "atl-wire", title: "Wiring it up", fields: [
        T("atl_wire1", "Which systems can we connect to directly, and who authorises that?", 2),
        T("atl_wire2", "Any system that cannot be connected and would need a manual upload?", 2),
      ]},
    ],
  },
];

export const segmentByKey = Object.fromEntries(segments.map((s) => [s.key, s]));

export const intakeClosing =
  "A person reviews every result before it reaches you. The mechanical work, assembling, reconciling, scoring, drafting, produces findings, never conclusions. The judgment, and the signature, are mine.";

export const intakeConsentLine =
  "I confirm the information above is accurate to the best of my knowledge, and I authorize Aperture to use it to prepare and deliver the engagement, per Aperture's confidentiality and data-handling standards.";
