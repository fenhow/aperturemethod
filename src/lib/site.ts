/**
 * Central site configuration: the single source of truth for global,
 * CMS-ready content (name, URLs, navigation, footer). Later stages read from
 * here so structure stays consistent and is trivial to move into Sanity.
 */

export const siteConfig = {
  name: "The Aperture Method",
  legalName: "The Aperture Method™",
  founder: "Fenwick How",
  tagline: "Bring your business into focus.",
  positioningLine: "Big-company intelligence, built for your business.",
  description:
    "The Aperture Method brings the analytics, AI, and strategy big companies rely on to owner-run businesses ($5M–$20M), in plain language, done for you, at a price that fits.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://aperturemethod.com",
  email: "hello@aperturemethod.com",
  locale: "en_US",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/** Primary top-bar navigation (Step 4 approved IA). */
export const primaryNav: NavItem[] = [
  { label: "The Method", href: "/the-aperture-method" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "What You Get", href: "/what-you-get" },
  { label: "AI", href: "/ai" },
  { label: "Insights", href: "/insights" },
  { label: "Working Together", href: "/working-together" },
  { label: "About", href: "/about" },
];

/** The single, persistent primary call to action. */
/**
 * The one call to action, used in the header and at the foot of every page.
 *
 * It says what the visitor gets to do, not what we sell. "Start with an X-Ray"
 * was tried here and reverted: it names a product a stranger has not heard of,
 * and a button whose label has to be explained before it can be clicked is a
 * button that does not get clicked. Booking a conversation is understood by
 * everybody and commits to nothing, which is the whole job of this button.
 *
 * The landing pages are reached through the nav, the footer and the body of
 * every page, and their own calls to action land on this same booking form. So
 * nothing was lost by pointing this back at the conversation.
 */
export const primaryCta: NavItem = {
  label: "Book a consultation",
  href: "/contact#book",
};

/** Industries dropdown / sub-navigation (Step 9 launch set + case studies). */
export const industriesNav: NavItem[] = [
  { label: "Industrial & Manufacturing", href: "/industries/industrial-manufacturing" },
  { label: "Retail & Consumer", href: "/industries/retail-consumer" },
  { label: "Professional Services", href: "/industries/professional-services" },
  { label: "Healthcare Practices", href: "/industries/healthcare" },
  { label: "Case Studies", href: "/case-studies" },
];

/**
 * Two-row mega-menu navigation (Bain-style). Each entry is either a standalone
 * link or a group that opens a mega-panel with a left "hub" descriptor box and
 * a column of links. `primaryNav` above is retained for any legacy consumers.
 */
export type MegaLink = {
  label: string;
  href: string;
  desc?: string;
  external?: boolean;
  /**
   * A short marker shown before the label, for sets that have an order worth
   * seeing. Used by the five components, where the sequence is the product.
   */
  step?: string;
};

/**
 * An optional named column inside a mega panel.
 *
 * Without this the links flow across a two-column grid, which reads 1, 3, 5
 * down the left and 2, 4, 6 down the right. That is fine for a list of
 * unrelated pages and wrong for a set with an order, because the order stops
 * being visible. A group that supplies columns gets each one laid out and
 * headed separately.
 */
export type MegaColumn = { heading: string; links: MegaLink[] };
export type MegaHub = {
  eyebrow: string;
  title: string;
  blurb: string;
  linkLabel: string;
  /**
   * Where the hub panel points, when that is not the group's own page.
   * The Method group is the case this exists for: the nav item belongs on the
   * overview, and the panel belongs on the page that starts an engagement.
   */
  href?: string;
};
export type MegaEntry =
  | { kind: "link"; label: string; href: string }
  | {
      kind: "group";
      label: string;
      href: string;
      hub: MegaHub;
      links: MegaLink[];
      /** When present, the panel renders these instead of the flat `links` grid. */
      columns?: MegaColumn[];
    };

export const megaNav: MegaEntry[] = [
  {
    kind: "group",
    label: "The Method",
    href: "/the-aperture-method",
    /*
     * The panel says what the Method IS, not what to buy first.
     *
     * It used to lead with the Business X-Ray, which is the right FIRST
     * PURCHASE and the wrong first sentence. Someone opening this menu has
     * usually just arrived: they have seen a name they do not recognise and
     * they are trying to work out what kind of firm this is. Selling them the
     * entry product answers a question they have not asked yet, and the five
     * numbered components sitting to the right only mean something once the
     * shape of the thing is clear. The X-Ray is still one hover away, first in
     * the components column, and it is the hub on its own pages.
     */
    hub: {
      eyebrow: "What it is",
      title: "The Aperture Method\u2122",
      blurb:
        "Five phases that take an owner-run business from what is actually happening, to why, to what the market makes possible, to the few moves worth making, to a live scoreboard that shows whether they worked. The analysis a large company buys from a consultancy, run on a business your size, in language you can act on.",
      linkLabel: "See the five phases, start to finish",
      href: "/the-aperture-method",
    },
    /*
     * Two columns, each with its own heading, rather than one list flowing
     * across a grid. The five components are a sequence, so they run down a
     * single column in Method order with their phase number visible. The pages
     * that explain the firm sit beside them, clearly a different kind of thing.
     *
     * Order, Sept 2026: the explanatory pages come FIRST, left to right, and
     * the numbered components second. Someone opening this menu is usually
     * still working out what the Method is; the sequence only means something
     * once they do, and the numbers hold their own order wherever they sit.
     *
     * No fees here, deliberately. A price belongs on the page that justifies
     * it, next to what you get for it. In a dropdown it is a number with no
     * argument attached, which invites a comparison rather than a read.
     *
     * Sept 2026: a LINK to /pricing is a different thing from a figure, and it
     * belongs here. The fees were always on the site, but the word "pricing"
     * appeared in no menu, no footer and no page title, so a buyer looking for
     * the number had to hunt the homepage for it or ask. For a firm whose
     * differentiator is a fee agreed before any work starts, making them ask is
     * the one thing that cannot happen. It sits beside "Working Together"
     * because that is where a serious reader already is when the question
     * occurs to them. The link carries the word, never the number.
     */
    columns: [
      {
        heading: "How the Method works",
        links: [
          { label: "The Five Phases", href: "/the-aperture-method", desc: "The whole arc, explained" },
          { label: "What We Do", href: "/what-we-do", desc: "Seven capabilities, one firm" },
          { label: "What You Get", href: "/what-you-get", desc: "The tangible deliverables" },
          { label: "Working Together", href: "/working-together", desc: "What an engagement is like" },
          { label: "Pricing", href: "/pricing", desc: "Every fee, published" },
          { label: "Who It's For", href: "/who-its-for", desc: "The businesses we fit" },
          { label: "Why This Exists", href: "/the-intelligence-gap", desc: "The gap, and the data behind it" },
          { label: "By Industry", href: "/industries", desc: "How this reads in your sector" },
        ],
      },
      {
        heading: "The five components, in order",
        links: [
          { step: "01", label: "Business X-Ray", href: "/business-x-ray", desc: "Where is the money actually made?" },
          { step: "02", label: "Profit Map", href: "/profit-map", desc: "Which products and customers earn it?" },
          { step: "03", label: "Customer & Market Map", href: "/market-map", desc: "Where are the next customers?" },
          { step: "04", label: "Focus Plan", href: "/focus-plan", desc: "Which few moves actually matter?" },
          { step: "05", label: "Aperture Atlas", href: "/scoreboard", desc: "Is the strategy working?" },
        ],
      },
    ],
    /* Flat fallback: the mobile menu and anything else that reads `links`. */
    links: [
      { label: "Business X-Ray", href: "/business-x-ray", desc: "Where is the money actually made?" },
      { label: "Profit Map", href: "/profit-map", desc: "Which products and customers earn it?" },
      { label: "Customer & Market Map", href: "/market-map", desc: "Where are the next customers?" },
      { label: "Focus Plan", href: "/focus-plan", desc: "Which few moves actually matter?" },
      { label: "Aperture Atlas", href: "/scoreboard", desc: "Is the strategy working?" },
      { label: "The Five Phases", href: "/the-aperture-method", desc: "The whole arc, explained" },
      { label: "What We Do", href: "/what-we-do", desc: "Seven capabilities, one firm" },
      { label: "What You Get", href: "/what-you-get", desc: "The tangible deliverables" },
      { label: "Working Together", href: "/working-together", desc: "What an engagement is like" },
      { label: "Pricing", href: "/pricing", desc: "Every fee, published" },
      { label: "Who It's For", href: "/who-its-for", desc: "The businesses we fit" },
      { label: "Why This Exists", href: "/the-intelligence-gap", desc: "The gap, and the data behind it" },
      { label: "By Industry", href: "/industries", desc: "How this reads in your sector" },
    ],
  },
  {
    kind: "group",
    label: "AI",
    href: "/ai",
    hub: {
      eyebrow: "Practical AI",
      title: "AI, where it actually matters",
      blurb:
        "We help you integrate AI into your business, deliberately, only where it earns its place, and it stays yours to keep.",
      linkLabel: "AI for your business",
    },
    links: [
      { label: "AI for Your Business", href: "/ai", desc: "The overview: understand, implement, use" },
      { label: "Where It Pays Off", href: "/ai#in-practice", desc: "Practical jobs AI actually does" },
      { label: "How We Bring It In", href: "/ai#how", desc: "Adoption as part of the Method" },
      { label: "No Black Boxes", href: "/ai#trust", desc: "Explainable, and a person decides" },
    ],
  },
  {
    kind: "group",
    label: "Case Studies",
    href: "/case-studies/lumina-medical-aesthetics",
    hub: {
      eyebrow: "Featured · Full engagement",
      title: "Lumina Medical Aesthetics",
      blurb:
        "A complete engagement, start to finish: the constraint, the work across all five phases, and the plan that followed.",
      linkLabel: "Read the case study",
    },
    links: [
      { label: "Lumina: Full Engagement", href: "/case-studies/lumina-medical-aesthetics", desc: "The whole engagement, start to finish" },
      { label: "Financial Analysis Workbench", href: "/method-lab/financial-analysis-workbench", desc: "Two 44-page analyses, published in full" },
      { label: "The Deliverables", href: "/what-you-get", desc: "Every report and working file, up close" },
      { label: "Read the Full Report", href: "/reports/Lumina-Aperture-Method-Example-Report.pdf", desc: "The complete 80-page PDF", external: true },
      { label: "All Case Studies", href: "/case-studies", desc: "Illustrative examples across industries" },
    ],
  },
  /**
   * Pricing, top level and on its own.
   *
   * It was first filed inside the Method mega menu next to "Working Together",
   * which is defensible as information architecture and wrong as an answer to
   * the question this site is trying to settle. A link a buyer has to open a
   * dropdown to find is not a published price, it is a price one click less
   * hidden than before. The whole differentiator is a fee agreed before any
   * work starts, so the word sits in the header where nobody has to look for
   * it. It stays in the mega menu and the footer as well: this is the only
   * place it is unmissable.
   *
   * Placed before About because it is a buying-stage question, not a
   * who-are-you question.
   */
  { kind: "link", label: "Pricing", href: "/pricing" },
  {
    kind: "group",
    label: "About",
    href: "/about",
    hub: {
      eyebrow: "The firm",
      title: "Founder-led, analytics-first",
      blurb:
        "Big-company intelligence, brought to owner-run businesses in plain language.",
      linkLabel: "About the firm",
    },
    links: [
      { label: "About", href: "/about", desc: "Who's behind the Method" },
      { label: "Why This Exists", href: "/the-intelligence-gap", desc: "The gap, and the published data behind it" },
      { label: "What We Believe", href: "/what-we-believe", desc: "The principles we work by" },
      { label: "Aperture for Schools", href: "/business-lab", desc: "The free session we teach locally" },
      { label: "Insights", href: "/insights", desc: "Plain thinking, by the numbers" },
      { label: "Contact", href: "/contact", desc: "Start a conversation" },
    ],
  },
  { kind: "link", label: "New Client", href: "/onboarding" },
];

/**
 * Footer link columns (Step 4 approved).
 *
 * Sept 2026: "Where to Start" and "Get Started" read as two versions of the
 * same column. The first was never a start list, it was the five components.
 * "Get Started" keeps the actions, minus "Start with an X-Ray", which pointed
 * at the same page as "Business X-Ray" one column over, and minus "Client
 * login", which moved to the quiet row at the very bottom alongside Method
 * Lab: it is for people who already are clients.
 *
 * Second pass, same month: the "Components" heading is gone. The five products
 * ARE what the firm offers, so they became "What We Offer", and the pages that
 * explain the Method became "How It Works", the same split the mega menu uses.
 * No link was dropped, only re-filed.
 */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "The Firm",
    items: [
      { label: "About", href: "/about" },
      { label: "What We Believe", href: "/what-we-believe" },
      { label: "Why This Exists", href: "/the-intelligence-gap" },
      { label: "Insights", href: "/insights" },
      { label: "Aperture for Schools", href: "/business-lab" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "What We Offer",
    items: [
      { label: "Business X-Ray", href: "/business-x-ray" },
      { label: "Profit Map", href: "/profit-map" },
      { label: "Customer & Market Map", href: "/market-map" },
      { label: "Focus Plan", href: "/focus-plan" },
      { label: "Aperture Atlas", href: "/scoreboard" },
    ],
  },
  {
    heading: "How It Works",
    items: [
      { label: "The Aperture Method", href: "/the-aperture-method" },
      { label: "What We Do", href: "/what-we-do" },
      { label: "What You Get", href: "/what-you-get" },
      { label: "Working Together", href: "/working-together" },
      { label: "Pricing", href: "/pricing" },
      { label: "Who It's For", href: "/who-its-for" },
      { label: "By Industry", href: "/industries" },
      { label: "AI, Without the Black Box", href: "/ai" },
      { label: "Case Studies", href: "/case-studies" },
    ],
  },
  {
    heading: "Get Started",
    items: [
      { label: "Book a consultation", href: "/contact#book" },
      { label: "New Client", href: "/onboarding" },
      { label: "Email", href: "mailto:hello@aperturemethod.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/fenhow" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Cookies", href: "/cookies" },
      { label: "Terms", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

/**
 * The date the homepage was last read end to end and its claims confirmed:
 * the fees, the ranges, the timings, the FAQ answers.
 *
 * Bump it when that check actually happens, not on every deploy. It is rendered
 * to the visitor and emitted as dateModified in the page's structured data, so
 * it is a statement, not a timestamp.
 */
export const HOME_REVIEWED = "2026-08-19";
