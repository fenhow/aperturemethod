/**
 * Central site configuration — the single source of truth for global,
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
    "The Aperture Method brings the analytics, AI, and strategy big companies rely on to owner-run businesses ($1M–$20M) — in plain language, done for you, at a price that fits.",
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
export type MegaLink = { label: string; href: string; desc?: string };
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
    label: "Our Approach",
    href: "/the-aperture-method",
    hub: {
      eyebrow: "The engagement",
      title: "The Aperture Method",
      blurb:
        "One continuous arc — from a first honest read of the business to hands-on execution.",
      linkLabel: "Understand · Quantify · Reveal · Navigate · Perform",
    },
    links: [
      { label: "The Method", href: "/the-aperture-method", desc: "How the five phases work" },
      { label: "What We Do", href: "/what-we-do", desc: "Seven capabilities, one firm" },
      { label: "What You Get", href: "/what-you-get", desc: "The tangible deliverables" },
      { label: "Working Together", href: "/working-together", desc: "What an engagement is like" },
    ],
  },
  { kind: "link", label: "AI", href: "/ai" },
  {
    kind: "group",
    label: "Industries",
    href: "/industries",
    hub: {
      eyebrow: "Who we help",
      title: "Examples, not limits",
      blurb:
        "Sectors we know well — but if you don't see yours, we very likely still work with you.",
      linkLabel: "See all industries",
    },
    links: [
      { label: "Industrial & Manufacturing", href: "/industries/industrial-manufacturing", desc: "Owner-run makers & fabricators" },
      { label: "Retail & Consumer", href: "/industries/retail-consumer", desc: "Multi-location & consumer brands" },
      { label: "Professional Services", href: "/industries/professional-services", desc: "Founder-led firms & practices" },
      { label: "Healthcare Practices", href: "/industries/healthcare", desc: "Clinician-owned practices" },
      { label: "Case Studies", href: "/case-studies", desc: "Illustrative engagements, end to end" },
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
      { label: "Insights", href: "/insights", desc: "Plain thinking, by the numbers" },
      { label: "Contact", href: "/contact", desc: "Start a conversation" },
    ],
  },
];

/** Footer link columns (Step 4 approved). */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "The Firm",
    items: [
      { label: "About", href: "/about" },
      { label: "What We Believe", href: "/what-we-believe" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "What We Offer",
    items: [
      { label: "The Aperture Method", href: "/the-aperture-method" },
      { label: "What We Do", href: "/what-we-do" },
      { label: "What You Get", href: "/what-you-get" },
      { label: "AI, Without the Black Box", href: "/ai" },
      { label: "Working Together", href: "/working-together" },
      { label: "Industries", href: "/industries" },
      { label: "Case Studies", href: "/case-studies" },
    ],
  },
  {
    heading: "Get Started",
    items: [
      { label: "Book a consultation", href: "/contact#book" },
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
