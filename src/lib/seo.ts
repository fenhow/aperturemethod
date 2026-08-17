/**
 * SEO helpers: absolute URLs, the shared social image, and JSON-LD builders.
 * Structured data follows schema.org so search engines can render rich results
 * and understand the firm, its founder, and its articles.
 */

import type { Metadata } from "next";
import { siteConfig } from "./site";

export const OG_IMAGE = "/og-default.png";

/**
 * Build a page's metadata with a canonical URL and complete Open Graph / Twitter
 * cards. Next merges metadata shallowly per top-level key, so a page that sets
 * `openGraph` replaces the layout's entirely. This helper keeps every social
 * field intact while making title, description, and URL page-specific.
 */
export function pageMeta(input: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
}): Metadata {
  const image = input.image ?? OG_IMAGE;
  const url = absoluteUrl(input.path);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      type: input.type ?? "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title: input.title,
      description: input.description,
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}

/** Resolve a path to an absolute URL against the configured site origin. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

/** The firm, Organization / ProfessionalService. Rendered site-wide. */
export function ldOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    description: siteConfig.description,
    slogan: siteConfig.positioningLine,
    logo: absoluteUrl(OG_IMAGE),
    image: absoluteUrl(OG_IMAGE),
    founder: {
      "@type": "Person",
      name: siteConfig.founder,
      jobTitle: "Founder",
    },
    areaServed: { "@type": "Country", name: "United States" },
    knowsAbout: [
      "Business analytics",
      "Artificial intelligence",
      "Strategy consulting",
      "Data-driven decision making",
      "Small and medium-sized business",
    ],
  };
}

/** The site itself enables sitelinks / name understanding. */
export function ldWebsite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en-US",
  };
}

/** The founder, Person schema for the founder page. */
export function ldPerson() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/founder#person`,
    name: siteConfig.founder,
    jobTitle: "Founder",
    worksFor: { "@id": `${siteConfig.url}/#organization` },
    url: absoluteUrl("/founder"),
    description:
      "Founder of The Aperture Method, an entrepreneur and operator bringing big-company analytics and strategy to owner-run businesses.",
  };
}

/** An article for Insights posts. */
export function ldArticle(input: {
  title: string;
  description: string;
  path: string;
  section?: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    url: absoluteUrl(input.path),
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    image: absoluteUrl(OG_IMAGE),
    author: { "@type": "Person", name: siteConfig.founder },
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

/** Breadcrumb trail for a page. Items are { name, path }. */
export function ldBreadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
