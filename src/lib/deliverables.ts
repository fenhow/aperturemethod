/**
 * The tangible deliverables — the named artifacts a client actually receives,
 * each explained plainly (what it is + how we get it). Grouped by the component
 * that produces them. Powers /deliverables and /deliverables/[slug], and is
 * cross-linked from the component pages.
 */

export type Deliverable = {
  slug: string;
  name: string; // e.g. "Business X-Ray"
  component: string; // e.g. "Aperture Insights"
  componentSlug: string; // e.g. "insights"
  cap: string; // capability tag
  tagline: string; // one line
  whatItIs: string; // plain-language "what it is"
  howWeGetIt: string; // plain-language "how we produce it"
  inside: string[]; // what's in it
};

export const deliverables: Deliverable[] = [
  {
    slug: "business-x-ray",
    name: "Business X-Ray",
    component: "Aperture Insights",
    componentSlug: "insights",
    cap: "MBA",
    tagline: "A seven-lens read of your whole business, in one executive picture.",
    whatItIs:
      "A structured, seven-lens assessment of your entire business — operations, finances, customers, processes, technology, leadership, and market — pulled together into one clear executive picture. It shows what's working, what's holding you back, and names your single biggest constraint.",
    howWeGetIt:
      "We use the data you already have plus a few short interviews, then run a set of diagnostics across all seven lenses and translate the findings into plain language. No lengthy questionnaires — it delivers real insight in its first weeks.",
    inside: [
      "A seven-lens assessment of the whole business",
      "Your #1 constraint, clearly named",
      "Prioritized findings, risks, and opportunities",
      "Your Aperture Score (your baseline)",
    ],
  },
  {
    slug: "aperture-score",
    name: "Aperture Score",
    component: "Aperture Insights",
    componentSlug: "insights",
    cap: "MBA",
    tagline: "One honest number for your business's health — a baseline you can track.",
    whatItIs:
      "A single, honest score of your business's current health. It rolls the seven-lens diagnostic into one number so you know exactly where you stand today — and can prove progress later.",
    howWeGetIt:
      "We score each lens of the Business X-Ray against clear, consistent criteria, weight them, and combine them into one figure. At the end of an engagement we re-score it, giving you measurable before-and-after proof.",
    inside: [
      "One overall business-health score",
      "A score for each business lens",
      "A baseline to measure against",
      "Re-scored later to prove progress",
    ],
  },
  {
    slug: "profit-map",
    name: "Profit Map",
    component: "Aperture Analytics",
    componentSlug: "analytics",
    cap: "MBA",
    tagline: "Exactly where you make and lose money — and the few drivers you can move.",
    whatItIs:
      "A clear picture of exactly where you make and lose money — by product, service, location, or customer. It turns your financials into the handful of profit drivers you can actually act on.",
    howWeGetIt:
      "We model your financial and operational data — profitability and cost-structure analysis, 80/20, break-even and sensitivity — and build a forward-looking scenario model so you can test decisions before you make them.",
    inside: [
      "Profit by product, location, or customer",
      "Your true cost structure",
      "The 80/20 profit drivers",
      "A scenario & forecast model",
    ],
  },
  {
    slug: "customer-market-map",
    name: "Customer & Market Map",
    component: "Aperture Intelligence",
    componentSlug: "intelligence",
    cap: "MBA · GIS",
    tagline: "Who your best customers are, where they are, and where the next ones come from.",
    whatItIs:
      "A map of who your best customers are, where they are, and where your next ones will come from — your market and competitors laid over real geography.",
    howWeGetIt:
      "We combine customer analytics and demographics with geographic intelligence (GIS) — trade areas, drive-time rings, market penetration, and site selection — plus competitive benchmarking, to reveal where demand actually clusters.",
    inside: [
      "Customer segments & lifetime value",
      "GIS trade-area & drive-time maps",
      "Competitive & market benchmarks",
      "Where to grow next",
    ],
  },
  {
    slug: "opportunity-matrix",
    name: "Opportunity Matrix",
    component: "Aperture Compass",
    componentSlug: "compass",
    cap: "MBA · GIS",
    tagline: "Every opportunity, scored and ranked — so the best moves are obvious.",
    whatItIs:
      "Every opportunity in front of you, scored and ranked on value, complexity, risk, and impact — so the best moves are obvious and defensible.",
    howWeGetIt:
      "We generate a wide set of strategic options, score them in a weighted decision matrix, stress-test them against different scenarios, and rank them so you invest in the few that matter most.",
    inside: [
      "Every option, scored",
      "Value / complexity / risk / impact",
      "A defensible ranking",
      "The shortlist of best moves",
    ],
  },
  {
    slug: "focus-plan",
    name: "Focus Plan",
    component: "Aperture Compass",
    componentSlug: "compass",
    cap: "MBA · GIS",
    tagline: "A board-ready roadmap — what to do now, next, and later.",
    whatItIs:
      "A prioritized, board-ready roadmap that turns the ranked opportunities into a clear order of operations — what to do now, next, and later.",
    howWeGetIt:
      "We sequence the winning opportunities into a Now / Next / Later roadmap with owners and milestones, so execution is obvious and nothing important slips.",
    inside: [
      "A Now / Next / Later roadmap",
      "Owners & milestones",
      "A clear order of operations",
      "Board-ready format",
    ],
  },
  {
    slug: "scoreboard",
    name: "Scoreboard",
    component: "Aperture Atlas",
    componentSlug: "atlas",
    cap: "GIS · DATA",
    tagline: "Your always-on executive dashboard — the numbers that matter, live.",
    whatItIs:
      "Your always-on executive dashboard — the few KPIs that matter, live — so you always know how the business is performing and where it's heading.",
    howWeGetIt:
      "We define the KPIs tied to your goals, wire them into a live dashboard on the Aperture Atlas platform with automated reporting, and keep it current — plus a re-scored Aperture Score to prove progress.",
    inside: [
      "A live executive KPI dashboard",
      "Automated reporting",
      "Runs on the Aperture Atlas™ platform",
      "A re-scored Aperture Score",
    ],
  },
];

export const deliverableBySlug = (slug: string) =>
  deliverables.find((d) => d.slug === slug);
