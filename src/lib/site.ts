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
    "The Aperture Method brings the analytics, AI, and strategy big companies rely on to owner-run businesses ($1M–$20M), in plain language, done for you, at a price that fits.",
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
 * It used to go straight to the booking form. It now goes to the Business
 * X-Ray landing page, which is the only page on the site that answers one
 * question with one offer and one action, and which books the call at the end
 * of it. A visitor who is ready to book still gets there in one more click; a
 * visitor who is not gets the argument first instead of an empty form.
 */
export const primaryCta: NavItem = {
  label: "Start with an X-Ray",
  href: "/business-x-ray",
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
export type MegaLink = { label: string; href: string; desc?: string; external?: boolean };
export type MegaHub = {
  eyebrow: string;
  title: string;
  blurb: string;
  linkLabel: string;
};
export type MegaEntry =
  | { kind: "link"; label: string; href: string }
  | { kind: "group"; label: string; href: string; hub: MegaHub; links: MegaLink[] };

export const megaNav: MegaEntry[] = [
  {
    kind: "group",
    label: "The Method",
    href: "/the-aperture-method",
    hub: {
      eyebrow: "The engagement",
      title: "The Aperture Method",
      blurb:
        "One continuous arc, from a first honest read of the business to hands-on execution.",
      linkLabel: "Understand · Quantify · Reveal · Navigate · Perform",
    },
    links: [
      { label: "The Five Phases", href: "/the-aperture-method", desc: "How the Method works" },
      { label: "What We Do", href: "/what-we-do", desc: "Seven capabilities, one firm" },
      { label: "What You Get", href: "/what-you-get", desc: "The tangible deliverables" },
      { label: "Working Together", href: "/working-together", desc: "What an engagement is like" },
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
      { label: "Read the Full Report", href: "/reports/Lumina-Aperture-Method-Example-Report.pdf", desc: "The complete 41-page PDF", external: true },
      { label: "All Case Studies", href: "/case-studies", desc: "Illustrative examples across industries" },
    ],
  },
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
      { label: "What We Believe", href: "/what-we-believe", desc: "The principles we work by" },
      { label: "Aperture for Schools", href: "/business-lab", desc: "The free session we teach locally" },
      { label: "Insights", href: "/insights", desc: "Plain thinking, by the numbers" },
      { label: "Contact", href: "/contact", desc: "Start a conversation" },
    ],
  },
  { kind: "link", label: "New Client", href: "/onboarding" },
];

/** Footer link columns (Step 4 approved). */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "The Firm",
    items: [
      { label: "About", href: "/about" },
      { label: "What We Believe", href: "/what-we-believe" },
      { label: "Insights", href: "/insights" },
      { label: "Aperture for Schools", href: "/business-lab" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "What We Offer",
    items: [
      { label: "The Aperture Method", href: "/the-aperture-method" },
      { label: "What We Do", href: "/what-we-do" },
      { label: "What You Get", href: "/what-you-get" },
      { label: "Who It's For", href: "/who-its-for" },
      { label: "AI, Without the Black Box", href: "/ai" },
      { label: "Working Together", href: "/working-together" },
      { label: "Case Studies", href: "/case-studies" },
    ],
  },
  {
    heading: "Get Started",
    items: [
      { label: "Book a consultation", href: "/contact#book" },
      { label: "New Client", href: "/onboarding" },
      { label: "Client login", href: "/portal" },
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
