/**
 * The ONE canonical page for each of the five components.
 *
 * Each component used to have a sales page (/profit-map, /scoreboard, …) and an
 * explainer page (/method/analytics, /method/atlas, …), which left two pages
 * competing to be "the page for it". The plain-English URL wins: it is what the
 * menu, the footer and the structured data already point at, and it is what an
 * owner would search for. As each /method/<slug> page is folded in, add its
 * component here and redirect the old path in next.config.mjs.
 *
 * Atlas is folded in (Sept 2026). The other four still live at /method/<slug>.
 */
export const COMPONENT_HREF: Record<string, string> = {
  Insights: "/method/insights",
  Analytics: "/method/analytics",
  Intelligence: "/method/intelligence",
  Compass: "/method/compass",
  Atlas: "/scoreboard",
};

export const componentHref = (short: string) =>
  COMPONENT_HREF[short] ?? `/method/${short.toLowerCase()}`;

/** Same lookup from the lower-case component slug used by the deliverables data. */
export const componentHrefFromSlug = (slug: string) => {
  const short = Object.keys(COMPONENT_HREF).find((k) => k.toLowerCase() === slug.toLowerCase());
  return short ? COMPONENT_HREF[short]! : `/method/${slug}`;
};
