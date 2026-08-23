import type { Metadata } from "next";
import { LandingView } from "@/components/landing/LandingView";
import { apertureSnapshot as page } from "@/lib/landing";
import { pageMeta } from "@/lib/seo";

/**
 * Single-intent landing page. Structure and schema live in LandingView; the
 * words live in src/lib/landing.ts. Nothing page-specific belongs in this file.
 *
 * Deliberately NOT in the top navigation. The Snapshot is channel-sold, so this
 * page's job is to receive a link forwarded by an accountant or a bookkeeper,
 * not to compete for the homepage visitor. It is in the sitemap so it can be
 * found on its own terms.
 */
export const metadata: Metadata = pageMeta({
  title: page.meta.title,
  description: page.meta.description,
  path: page.slug,
});

export default function Page() {
  return <LandingView page={page} />;
}
