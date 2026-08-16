import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { articles } from "@/lib/insights";
import { deliverables } from "@/lib/deliverables";

/**
 * XML sitemap (served at /sitemap.xml). Generated from the same content sources
 * the pages render from, so it never drifts out of sync.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/the-aperture-method", priority: 0.9, changeFrequency: "monthly" },
    { path: "/what-we-do", priority: 0.9, changeFrequency: "monthly" },
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
    { path: "/look-closer", priority: 0.6, changeFrequency: "monthly" },
  ];

  const deliverableRoutes = deliverables.map((d) => ({
    path: `/deliverables/${d.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const articleRoutes = articles.map((a) => ({
    path: `/insights/${a.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...deliverableRoutes, ...articleRoutes].map((r) => ({
    url: url(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
