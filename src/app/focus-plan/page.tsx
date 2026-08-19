import type { Metadata } from "next";
import { LandingView } from "@/components/landing/LandingView";
import { focusPlan as page } from "@/lib/landing";
import { pageMeta } from "@/lib/seo";

/**
 * Single-intent landing page. Structure and schema live in LandingView; the
 * words live in src/lib/landing.ts. Nothing page-specific belongs in this file.
 */
export const metadata: Metadata = pageMeta({
  title: page.meta.title,
  description: page.meta.description,
  path: page.slug,
});

export default function Page() {
  return <LandingView page={page} />;
}
