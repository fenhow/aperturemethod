import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * robots.txt (served at /robots.txt). Allows crawling everywhere except the API
 * routes and the private areas, and points crawlers at the sitemap.
 *
 * The /method-lab prefix is confidential EXCEPT for published work, which is
 * deliberately public and is the point of publishing it. Without the explicit
 * allow below, the Financial Analysis Workbench page inherits the block from its
 * parent path: free, ungated, listed in the sitemap, and invisible to search.
 * Add any future published lab page to PUBLIC_LAB_PATHS here and to the
 * PUBLIC_METHOD_LAB allowlist in src/middleware.ts; the two must agree.
 */
const PUBLIC_LAB_PATHS = ["/method-lab/financial-analysis-workbench"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // More specific Allow rules win over a broader Disallow, so these carve
      // the published pages back out of the /method-lab block.
      allow: ["/", ...PUBLIC_LAB_PATHS],
      disallow: ["/api/", "/method-lab", "/admin", "/portal"],
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
    host: siteConfig.url,
  };
}
