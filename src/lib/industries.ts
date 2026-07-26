/**
 * Industry data — the single source for the Industries hub, the per-sector
 * pages (repeatable template, Step 9), and the Case Studies hub. Case studies
 * are illustrative and labeled as such (Step 11).
 */

export type Industry = {
  slug: string;
  name: string;
  href: string;
  hook: string; // one-line card hook
  promise: string; // page H1 — the sector's sharpest problem-as-promise
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
};

const make = (i: Omit<Industry, "href">): Industry => ({ ...i, href: `/industries/${i.slug}` });

export const industries: Industry[] = [
  make({
    slug: "industrial-manufacturing",
    name: "Industrial & Manufacturing",
    hook: "Know your true cost per job, and price with confidence.",
    promise: "Know your true cost per job.",
    sub: "For owner-run manufacturers, job shops, and fabricators. See the true cost of every job — and price it right.",
    buyer:
      "Owner-operated manufacturers, job shops, and fabricators — roughly $2M–$20M — running on an ERP and QuickBooks, with detailed job and cost data that almost never gets analyzed.",
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
      "Do you know your true cost per job — and which work and customers actually make money?",
    caseStudy: {
      title: "An $8M metal-fabrication job shop that quoted on gut.",
      body: "The shop quoted work the way it always had — on experience and a feel for the shop rate. Margins were slipping and the owner couldn't say which jobs were the problem. Aperture Insights named the constraint: quoting that hadn't kept pace with labor and material costs. Aperture Analytics built a Profit Map by job type and customer and found a large share of jobs run below true cost once setup and rework were counted, with a handful of accounts carrying the rest. Aperture Compass introduced quoting discipline, repriced the worst work, and set target margins by job type. Aperture Live tracked margin per job on the Scoreboard. Illustratively, a shop like this could recover several points of margin through pricing and quoting discipline alone — without turning away good work.",
    },
    seoDescription:
      "The Aperture Method™ helps owner-run manufacturers and job shops ($2M–$20M) find their true cost per job, fix quoting and pricing, and grow margin — using the data they already have.",
  }),
  make({
    slug: "retail-consumer",
    name: "Retail & Consumer",
    hook: "See which locations, products, and customers actually make money.",
    promise: "See which locations and products actually make money.",
    sub: "For multi-unit retailers, restaurants, and hospitality. Find the profit hiding in your POS data.",
    buyer:
      "Owner-operators running two to fifteen units — retail, restaurants, and hospitality — sitting on a point-of-sale system full of transaction data that rarely gets mined.",
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
      "Which locations, hours, and items actually make money — and where should the next one go?",
    caseStudy: {
      title: "A five-unit fast-casual group deciding where to open next.",
      body: "The group was doing well on the surface — revenue up, the owner already eyeing a sixth location. Aperture Insights reframed the question from “where do we expand” to “what makes a unit win here.” Aperture Analytics built a Profit Map by unit, daypart, and menu item and exposed popular items sold at a loss once labor was counted, plus a busy flagship that kept the least. Aperture Intelligence used trade-area and demographic data to explain two laggards and pinpoint strong sites for number six. Aperture Compass sequenced menu and labor fixes first, a data-backed site decision second. Aperture Live tracked unit-level margin. Illustratively, a group like this could lift blended margin through menu and labor changes alone, and choose its next site on evidence.",
    },
    seoDescription:
      "The Aperture Method™ helps multi-unit retailers, restaurants, and hospitality owners see profit by location, daypart, and item — and choose their next site on evidence.",
  }),
  make({
    slug: "professional-services",
    name: "Professional Services",
    hook: "Find out whether your busiest clients are your most profitable.",
    promise: "Find out if your busiest clients are your most profitable.",
    sub: "For founder-led agencies, firms, and specialist practices. Turn “busy” into profitable and predictable.",
    buyer:
      "Founder-led agencies, firms, IT and managed-services businesses, and specialist practices — roughly $1M–$10M — with client, utilization, and time data that's rarely joined up.",
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
      "Are your biggest clients your most profitable — and what should you reprice or restructure?",
    caseStudy: {
      title: "A $4M marketing agency, always busy, never sure why profit was thin.",
      body: "The founder was working flat out but couldn't predict a good month from a bad one. Aperture Insights identified the constraint as pricing and mix, not sales. Aperture Analytics built a Profit Map by client, service, and team that revealed a few marquee clients run at or below cost after real hours, heavy scope creep on fixed-fee work, and dangerous revenue concentration. Aperture Intelligence defined the genuinely profitable, best-fit client. Aperture Compass sequenced repricing, renegotiating or exiting the worst-fit clients, and productizing a high-demand service. Aperture Live tracked client-level margin and utilization. Illustratively, a firm like this could lift and stabilize margin through pricing and client-mix changes alone — turning “busy” into profitable and predictable.",
    },
    seoDescription:
      "The Aperture Method™ helps founder-led agencies and firms ($1M–$10M) see profit by client and service, fix pricing and scope, and make margin predictable.",
  }),
  make({
    slug: "healthcare",
    name: "Healthcare Practices",
    hook: "Understand profit by location, provider, and procedure — and where to grow.",
    promise: "Understand profit by location, provider, and procedure.",
    sub: "For clinician-owned practices. The business side, in plain numbers — never the clinical side.",
    buyer:
      "Clinician-owners of dental, veterinary, physical-therapy, med-spa, and optometry practices — single or multi-location — sitting on years of practice-management data.",
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
      "Which locations, providers, and procedures actually profit — and should you add a location?",
    caseStudy: {
      title: "A three-location dental group unsure where to invest next.",
      body: "The owner was considering a fourth office but couldn't tell which of the three — or which providers and procedures — actually drove profit. Aperture Insights found the constraint wasn't demand; it was utilization and mix. Aperture Analytics produced a Profit Map by location, provider, and procedure and showed the “busy” office was least profitable once chair time was counted, with a few procedures run at a loss. Aperture Intelligence flagged a large base of lapsed patients overdue for recall and the highest-value segments. Aperture Compass prioritized fixing scheduling and mix before expansion, plus a recall push and a geographically-informed site decision. Aperture Live tracked utilization and recall. Illustratively, a practice like this could lift chair utilization and reactivate dormant patients before spending on a new build-out.",
    },
    seoDescription:
      "The Aperture Method™ helps clinician-owned practices understand profit by location, provider, and procedure, improve utilization and recall, and decide where to grow — strictly on the business side.",
    privacyNote:
      "We work strictly on the business side of your practice, with de-identified or business-level data under proper agreements. No patient care, no clinical advice, and full respect for HIPAA and patient privacy.",
  }),
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
