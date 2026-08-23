/**
 * Industry data: the single source for the Industries hub, the per-sector
 * pages (repeatable template, Step 9), and the Case Studies hub. Case studies
 * are illustrative and labeled as such (Step 11).
 */

export type Industry = {
  slug: string;
  name: string;
  href: string;
  hook: string; // one-line card hook
  promise: string; // page H1, the sector's sharpest problem-as-promise
  sub: string; // hero subhead
  buyer: string; // who this is for
  problems: string[];
  offer: string; // how we help
  phases: string;
  deliverables: string[];
  firstQuestion: string;
  caseStudy: { title: string; body: string };
  seoDescription: string;
  privacyNote?: string;
  /**
   * The H1. A question in the words this sector's owners actually use, which
   * is not the same sentence for a job shop and a dental group. The `promise`
   * becomes the outcome line beneath it.
   */
  question: string;
  /** Four objections specific to the sector. Emitted as FAQPage schema. */
  faqs: { q: string; a: string }[];
  /** ISO date the page was last read through and its claims confirmed. */
  reviewed: string;
};

const make = (i: Omit<Industry, "href">): Industry => ({ ...i, href: `/industries/${i.slug}` });

export const industries: Industry[] = [
  make({
    slug: "industrial-manufacturing",
    question: "Do you know your true cost per job?",
    faqs: [
      {
        q: "We already have an ERP. Why is that not enough?",
        a: "An ERP records what happened on each job accurately, which is a different thing from telling you which job types and which customers earn money once setup, rework and the time nobody logs are counted. The data is usually all in there. What is missing is somebody pulling it into a costed view and ranking it.",
      },
      {
        q: "Our job costing is not clean. Does that stop us?",
        a: "No. Almost nobody's is. Where labour hours are estimated rather than captured, we say so and show the range it creates rather than presenting a false precision. Finding out which parts of your costing cannot be trusted is often the most valuable finding of the engagement.",
      },
      {
        q: "Will this tell us what to quote?",
        a: "It tells you what each type of work actually costs you and what margin you are currently getting, by job type and by customer. Pricing is then your decision, made with the number in front of you. We can model what a change does to volume and margin before you take it to a customer.",
      },
      {
        q: "One customer is most of our revenue. Is that a problem?",
        a: "It is a risk that every lender and every buyer prices, and it is worth knowing exactly how large it is before somebody else calculates it for you. Concentration shows up in the X-Ray, and the Focus Plan usually treats reducing it as a sequencing question rather than an emergency.",
      },
    ],
    reviewed: "2026-08-20",
    name: "Industrial & Manufacturing",
    hook: "Know your true cost per job, and price with confidence.",
    promise: "Know your true cost per job.",
    sub: "For owner-run manufacturers, job shops, and fabricators. See the true cost of every job, and price it right.",
    buyer:
      "Owner-operated manufacturers, job shops, and fabricators, roughly $2M–$20M, running on an ERP and QuickBooks, with detailed job and cost data that almost never gets analyzed.",
    problems: [
      "True cost and margin by job, product, and customer are unclear",
      "Quoting and pricing lag rising labor and material costs",
      "Capacity and throughput constraints",
      "Customer concentration risk",
      "Inconsistent operational data",
    ],
    offer:
      "Start with the Business X-Ray to expose pricing and margin leaks fast; then a Profit Map by job and customer, and a plan to fix quoting and mix.",
    phases: "Understand · Quantify · Navigate · Perform",
    deliverables: ["Business X-Ray", "Profit Map", "Focus Plan", "Scoreboard"],
    firstQuestion:
      "Do you know your true cost per job, and which work and customers actually make money?",
    caseStudy: {
      title: "An $8M metal-fabrication job shop that quoted on gut.",
      body: "The shop quoted work the way it always had, on experience and a feel for the shop rate. Margins were slipping and the owner couldn't say which jobs were the problem. Aperture Insights named the constraint: quoting that hadn't kept pace with labor and material costs. Aperture Analytics built a Profit Map by job type and customer and found a large share of jobs run below true cost once setup and rework were counted, with a handful of accounts carrying the rest. Aperture Compass introduced quoting discipline, repriced the worst work, and set target margins by job type. Aperture Atlas tracked margin per job on the Scoreboard. Illustratively, a shop like this could recover several points of margin through pricing and quoting discipline alone, without turning away good work.",
    },
    seoDescription:
      "The Aperture Method™ helps owner-run manufacturers and job shops ($2M–$20M) find their true cost per job, fix quoting and pricing, and grow margin, using the data they already have.",
  }),
  make({
    slug: "retail-consumer",
    question: "Which of your locations is actually making money?",
    faqs: [
      {
        q: "Our POS reports already show sales by store. Is this different?",
        a: "Yes, because sales by store is not profit by store. Once rent, labour, shrink and the manager's real time are allocated, the ranking frequently changes, and the busiest site is often not the most profitable one. It is usually the site the next expansion gets modelled on, which is what makes the distinction expensive.",
      },
      {
        q: "Can this tell us where to open next?",
        a: "The Customer & Market Map shows which trade areas hold demand you are not serving, using your own transaction data mapped against demographics and competitors. If you are choosing between specific sites and about to sign a lease, that is a Site Selection Study, priced separately because the decision is much larger.",
      },
      {
        q: "We run on thin margins. Is the fee worth it?",
        a: "That is the right question to ask, and it is why the first step is fixed fee and deliberately small. Thin margins are exactly the condition where a few points of mix or pricing matter most, but you should not take that on faith: start with the X-Ray and decide afterwards.",
      },
      {
        q: "Do you need our customer data?",
        a: "Transaction-level data with a customer identifier, if you have it, and addresses or postcodes for the mapping. Names are not needed. Addresses are converted to coordinates and then deleted, so the analysis itself holds no personal details.",
      },
    ],
    reviewed: "2026-08-20",
    name: "Retail & Consumer",
    hook: "See which locations, products, and customers actually make money.",
    promise: "See which locations and products actually make money.",
    sub: "For multi-unit retailers, restaurants, and hospitality. Find the profit hiding in your POS data.",
    buyer:
      "Owner-operators running two to fifteen units, retail, restaurants, and hospitality, sitting on a point-of-sale system full of transaction data that rarely gets mined.",
    problems: [
      "Profit by unit, daypart, and item is unclear",
      "Site-selection and expansion decisions made on instinct",
      "Labor and inventory eroding margin",
      "Customer loyalty run on gut, not segmentation",
      "“Where do we open next?”",
    ],
    offer:
      "A Profit Map by unit, daypart, and item; the Customer & Market Map with GIS trade-area analysis to pick your next site; and labor and inventory targets.",
    phases: "All five phases",
    deliverables: ["Profit Map", "Customer & Market Map", "Focus Plan", "Scoreboard"],
    firstQuestion:
      "Which locations, hours, and items actually make money, and where should the next one go?",
    caseStudy: {
      title: "A five-unit fast-casual group deciding where to open next.",
      body: "The group was doing well on the surface: revenue up, the owner already eyeing a sixth location. Aperture Insights reframed the question from “where do we expand” to “what makes a unit win here.” Aperture Analytics built a Profit Map by unit, daypart, and menu item and exposed popular items sold at a loss once labor was counted, plus a busy flagship that kept the least. Aperture Intelligence used trade-area and demographic data to explain two laggards and pinpoint strong sites for number six. Aperture Compass sequenced menu and labor fixes first, a data-backed site decision second. Aperture Atlas tracked unit-level margin. Illustratively, a group like this could lift blended margin through menu and labor changes alone, and choose its next site on evidence.",
    },
    seoDescription:
      "The Aperture Method™ helps multi-unit retailers, restaurants, and hospitality owners see profit by location, daypart, and item, and choose their next site on evidence.",
  }),
  make({
    slug: "professional-services",
    question: "Are your busiest clients your most profitable ones?",
    faqs: [
      {
        q: "Utilisation looks fine. Why would profitability not be?",
        a: "Utilisation measures whether people are busy, not whether the work they are busy on pays. A fully utilised team delivering underpriced scope produces exactly the numbers you are seeing: everyone stretched, revenue holding, profit flat. Separating margin by client and by engagement type is what tells the two apart.",
      },
      {
        q: "We bill hourly. Does this still apply?",
        a: "It applies more, not less. Hourly billing hides write-offs, scope creep and the unbilled time senior people absorb, all of which sit between the rate card and what actually lands. The analysis works from time records and invoices you already keep.",
      },
      {
        q: "Our time records are patchy.",
        a: "Common, and workable. Where time is incomplete we say which conclusions are derived and which are estimated, and the report shows both. Patchy records are usually a finding in themselves, because a firm that cannot see where its senior hours go cannot price them.",
      },
      {
        q: "Will you tell us to fire clients?",
        a: "Occasionally the numbers point that way, and it will be said plainly if so. More often the answer is repricing, changing scope, or moving delivery to a different level of seniority. The Focus Plan sequences it, because losing revenue you have not yet replaced is its own risk.",
      },
    ],
    reviewed: "2026-08-20",
    name: "Professional Services",
    hook: "Find out whether your busiest clients are your most profitable.",
    promise: "Find out if your busiest clients are your most profitable.",
    sub: "For founder-led agencies, firms, and specialist practices. Turn “busy” into profitable and predictable.",
    buyer:
      "Founder-led agencies, firms, IT and managed-services businesses, and specialist practices, roughly $5M–$20M, with client, utilization, and time data that's rarely joined up.",
    problems: [
      "Profit by client, service, and team is unclear",
      "Scope creep and under-pricing",
      "Client concentration risk",
      "Utilization guessed at",
      "Thin, unpredictable margin",
    ],
    offer:
      "A Profit Map by client, service, and team; client segmentation to define your best-fit work; and pricing, packaging, and productization moves.",
    phases: "Understand · Quantify · Navigate · Perform",
    deliverables: ["Business X-Ray", "Profit Map", "Focus Plan", "Scoreboard"],
    firstQuestion:
      "Are your biggest clients your most profitable, and what should you reprice or restructure?",
    caseStudy: {
      title: "A $4M marketing agency, always busy, never sure why profit was thin.",
      body: "The founder was working flat out but couldn't predict a good month from a bad one. Aperture Insights identified the constraint as pricing and mix, not sales. Aperture Analytics built a Profit Map by client, service, and team that revealed a few marquee clients run at or below cost after real hours, heavy scope creep on fixed-fee work, and dangerous revenue concentration. Aperture Intelligence defined the genuinely profitable, best-fit client. Aperture Compass sequenced repricing, renegotiating or exiting the worst-fit clients, and productizing a high-demand service. Aperture Atlas tracked client-level margin and utilization. Illustratively, a firm like this could lift and stabilize margin through pricing and client-mix changes alone, turning “busy” into profitable and predictable.",
    },
    seoDescription:
      "The Aperture Method™ helps founder-led agencies and firms ($5M–$20M) see profit by client and service, fix pricing and scope, and make margin predictable.",
  }),
  make({
    slug: "healthcare",
    question: "Which providers, procedures and locations actually pay?",
    faqs: [
      {
        q: "Does this involve patient data?",
        a: "No patient identifiers are needed and none are wanted. The analysis works from encounter and procedure-level data with identifiers removed, plus postcodes for the mapping. Addresses are converted to coordinates and deleted. The terms covering all of this are signed before anything is sent.",
      },
      {
        q: "Our payer mix makes every comparison messy.",
        a: "Payer mix is usually the answer rather than an obstacle. Contribution by procedure has to be read net of the reimbursement each payer actually pays, and doing that properly is what reveals that two clinically identical procedures can have opposite economics.",
      },
      {
        q: "Can this help us decide whether to add a provider?",
        a: "Yes, and it is one of the clearer uses. It comes down to contribution per provider, the capacity actually available, and whether the demand exists in your catchment. The scenario model lets you test the hire before you make it.",
      },
      {
        q: "We are part of a group with shared overhead. Does that break it?",
        a: "It has to be handled explicitly rather than ignored, which is a common failing in practice benchmarking. Shared overhead is allocated on a stated basis, that basis is shown, and the analysis reports results both with and without it so you can see how much the allocation is doing.",
      },
    ],
    reviewed: "2026-08-20",
    name: "Healthcare Practices",
    hook: "Understand profit by location, provider, and procedure, and where to grow.",
    promise: "Understand profit by location, provider, and procedure.",
    sub: "For clinician-owned practices. The business side, in plain numbers, never the clinical side.",
    buyer:
      "Clinician-owners of dental, veterinary, physical-therapy, med-spa, and optometry practices, single or multi-location, sitting on years of practice-management data.",
    problems: [
      "Profit by location, provider, and procedure is unclear",
      "Chairs and rooms underutilized",
      "Patient recall left to chance",
      "Add-a-location or add-a-provider decisions",
      "Retaining high-value patients",
    ],
    offer:
      "A Profit Map by location, provider, and procedure; the Customer (Patient) Map for recall and high-value segments; and a data-backed answer to the “should I add a location” question.",
    phases: "All five phases",
    deliverables: ["Profit Map", "Customer & Market Map", "Focus Plan", "Scoreboard"],
    firstQuestion:
      "Which locations, providers, and procedures actually profit, and should you add a location?",
    caseStudy: {
      title: "A three-location dental group unsure where to invest next.",
      body: "The owner was considering a fourth office but couldn't tell which of the three, or which providers and procedures, actually drove profit. Aperture Insights found the constraint wasn't demand; it was utilization and mix. Aperture Analytics produced a Profit Map by location, provider, and procedure and showed the “busy” office was least profitable once chair time was counted, with a few procedures run at a loss. Aperture Intelligence flagged a large base of lapsed patients overdue for recall and the highest-value segments. Aperture Compass prioritized fixing scheduling and mix before expansion, plus a recall push and a geographically-informed site decision. Aperture Atlas tracked utilization and recall. Illustratively, a practice like this could lift chair utilization and reactivate dormant patients before spending on a new build-out.",
    },
    seoDescription:
      "The Aperture Method™ helps clinician-owned practices understand profit by location, provider, and procedure, improve utilization and recall, and decide where to grow, strictly on the business side.",
    privacyNote:
      "We work strictly on the business side of your practice, with de-identified or business-level data under proper agreements. No patient care, no clinical advice, and full respect for HIPAA and patient privacy.",
  }),
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
