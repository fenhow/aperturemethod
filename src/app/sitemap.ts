import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { articles } from "@/lib/insights";
import { deliverables } from "@/lib/deliverables";
import { aperturePractices } from "@/lib/content";

/**
 * XML sitemap (served at /sitemap.xml). Generated from the same content sources
 * the pages render from, so it never drifts out of sync.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  type Route = {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    /** Set only where a real revision date is known. Otherwise the build time. */
    lastModified?: Date;
  };

  const staticRoutes: Route[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/the-aperture-method", priority: 0.9, changeFrequency: "monthly" },
    { path: "/what-we-do", priority: 0.9, changeFrequency: "monthly" },
    { path: "/who-its-for", priority: 0.9, changeFrequency: "monthly" },
    { path: "/what-you-get", priority: 0.9, changeFrequency: "monthly" },
    { path: "/deliverables", priority: 0.9, changeFrequency: "monthly" },
    { path: "/ai", priority: 0.9, changeFrequency: "monthly" },
    { path: "/case-studies", priority: 0.7, changeFrequency: "monthly" },
    { path: "/case-studies/lumina-medical-aesthetics", priority: 0.8, changeFrequency: "monthly" },
    { path: "/method-lab/financial-analysis-workbench", priority: 0.7, changeFrequency: "monthly" },
    { path: "/insights", priority: 0.8, changeFrequency: "weekly" },
    { path: "/working-together", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/what-we-believe", priority: 0.7, changeFrequency: "monthly" },
    { path: "/founder", priority: 0.6, changeFrequency: "yearly" },
    { path: "/reality-check", priority: 0.9, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
    { path: "/glossary", priority: 0.5, changeFrequency: "monthly" },
    { path: "/business-lab", priority: 0.6, changeFrequency: "monthly" },
  ];

  /**
   * The five component pages. They are indexable, canonical to themselves and
   * substantial, and they were simply absent from this list, which meant the
   * deepest service pages on the site were the ones search engines were least
   * likely to find. Generated from the same source the routes are.
   */
  const componentRoutes: Route[] = aperturePractices.map((practice) => ({
    path: `/method/${practice.short.toLowerCase()}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const deliverableRoutes: Route[] = deliverables.map((d) => ({
    path: `/deliverables/${d.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  /**
   * Articles carry their real revision date rather than the build time. A
   * sitemap that stamps every URL with "changed today" on every deploy is not
   * a freshness signal, it is noise, and the pages where the date is actually
   * knowable are the ones where it is worth being accurate.
   */
  const articleRoutes: Route[] = articles.map((a) => ({
    path: `/insights/${a.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
    lastModified: new Date(`${a.updated ?? a.published}T12:00:00Z`),
  }));

  return [...staticRoutes, ...componentRoutes, ...deliverableRoutes, ...articleRoutes].map((r) => ({
    url: url(r.path),
    lastModified: r.lastModified ?? now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
