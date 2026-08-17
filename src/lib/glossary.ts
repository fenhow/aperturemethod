/**
 * Data dictionary: every Aperture term and the analytics/GIS vocabulary,
 * defined in plain language. Powers /glossary; linked from the footer.
 */

export type Term = { term: string; def: string };
export type GlossaryGroup = { id: string; title: string; terms: Term[] };

export const glossary: GlossaryGroup[] = [
  {
    id: "brand",
    title: "The Brand & Method",
    terms: [
      {
        term: "The Aperture Method™",
        def: "Our overall methodology and parent brand, a five-component system that brings big-company analytics, AI, and strategy to owner-run businesses, done for you.",
      },
      {
        term: "Fractional intelligence department",
        def: "The idea behind Aperture: the outsourced business-and-marketing-intelligence function a $1–20M business could never staff in-house.",
      },
      {
        term: "The Arc (MBA → GIS → DATA)",
        def: "The spine of the Method: from graduate-level analysis, through spatial/geographic intelligence, to a living data platform.",
      },
    ],
  },
  {
    id: "components",
    title: "The Five Components",
    terms: [
      { term: "Aperture Insights™", def: "Component 01: the business assessment that produces the Business X-Ray and Aperture Score and names your #1 constraint." },
      { term: "Aperture Analytics™", def: "Component 02: financial modeling (profit drivers, forecasting, scenario planning), delivered as the Profit Map." },
      { term: "Aperture Intelligence™", def: "Component 03: market and customer intelligence with GIS, delivered as the Customer & Market Map." },
      { term: "Aperture Compass™", def: "Component 04, strategic direction: a prioritized, board-ready roadmap (Opportunity Matrix + Focus Plan)." },
      { term: "Aperture Atlas™", def: "Component 05, the living Geographic Intelligence Platform: your performance and market on one always-on dashboard (Scoreboard)." },
    ],
  },
  {
    id: "deliverables",
    title: "The Deliverables",
    terms: [
      { term: "Business X-Ray™", def: "A seven-lens read of your whole business in one executive picture; names your single biggest constraint." },
      { term: "Key-person risk", def: "The revenue that depends on work only one person can do. We price it: what stops, and what it costs, if that role goes dark for ninety days, because it is the most common reason an owner-run business cannot be sold." },
      { term: "Aperture Score™", def: "A single, honest score of your business's health, a baseline you can track, re-scored later to prove progress." },
      { term: "Profit Map™", def: "A clear picture of where you make and lose money, plus a scenario and forecast model." },
      { term: "Customer & Market Map™", def: "Who your best customers are, where they are, and where to grow: market and competitors on real geography." },
      { term: "Opportunity Matrix™", def: "Every opportunity scored and ranked on value, complexity, risk, and impact." },
      { term: "Focus Plan™", def: "A board-ready Now / Next / Later roadmap with owners and milestones." },
      { term: "Scoreboard™", def: "Your always-on executive KPI dashboard, running on the Aperture Atlas platform." },
    ],
  },
  {
    id: "data",
    title: "Capabilities & Data",
    terms: [
      { term: "GIS (Geographic Information System)", def: "Mapping technology that places your business, customers, and market on real geography to reveal spatial patterns." },
      { term: "Spatial intelligence", def: "Analysis that uses location, where things are, to find opportunity a spreadsheet can't see." },
      { term: "Demographics", def: "Population characteristics: age, sex, income, household size, education, and more, used to profile and locate your market." },
      { term: "Human data", def: "Attributes about real people and households (age, sex, income, spending, behavior) layered onto geography." },
      { term: "Trade area", def: "The geographic zone a location actually draws its customers from." },
      { term: "Drive-time analysis", def: "Mapping how far customers will travel, in minutes, not miles, to reach you." },
      { term: "Market penetration", def: "How much of a given area's potential demand you've actually captured." },
      { term: "Site selection", def: "Using data to choose the best location for a new site before you sign a lease." },
      { term: "Customer segmentation", def: "Grouping customers by what they value so you can serve and market to each better." },
      { term: "Customer Lifetime Value (CLV)", def: "What a customer is worth to you over the whole relationship, not just one sale." },
      { term: "Cohort analysis", def: "Tracking groups of customers over time to see how their behavior changes." },
      { term: "Regression analysis", def: "A statistical method that measures which factors actually move an outcome, like sales." },
      { term: "Break-even & sensitivity", def: "The point a decision starts paying off, and how much room you have if the numbers shift." },
      { term: "TAM / SAM / SOM", def: "Total, serviceable, and obtainable market: the whole pie, the slice you can serve, and the slice you can win." },
      { term: "80/20 (Pareto) analysis", def: "Finding the vital few things, customers, products, costs, that drive most of your results." },
    ],
  },
  {
    id: "platform",
    title: "Platform & Technology",
    terms: [
      { term: "SyncPoint AI™", def: "The intelligence engine beneath Aperture. It collects, processes, and organizes data across the platform." },
      { term: "Aperture Platform", def: "The technology that runs beneath every component and becomes client-facing as Aperture Atlas." },
      { term: "KPI (Key Performance Indicator)", def: "The few numbers that prove you're hitting your goals, tracked live on the Scoreboard." },
    ],
  },
];
