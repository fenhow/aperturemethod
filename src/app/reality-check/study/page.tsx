import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { RealityCheck } from "@/components/reality/RealityCheck";
import { pageMeta } from "@/lib/seo";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { STUDY_TARGET } from "@/lib/realityStudy";

/**
 * /reality-check/study — the capstone research version of the Reality Check.
 *
 * Shared as ONE link, aperturemethod.com/study (a redirect in next.config),
 * not found by search: noindex keeps organic visitors out of the research
 * cohort. The channel is asked in the profile ("How did you hear about this
 * study?") rather than carried in tagged URLs. ?src=test still marks test runs.
 *
 * Responses land in Supabase `reality_check_responses` with cohort = 'study'.
 * Read the results from the views in supabase/migrations/0004.
 */

export const revalidate = 600;

export const metadata: Metadata = {
  ...pageMeta({
    title: "Executive MBA Capstone Research: How well do owners know their own businesses?",
    description: `Executive MBA capstone research: an anonymous ${STUDY_TARGET}-business survey. Take the Reality Check, see your own Clarity Score and biggest blind spot instantly, and get the benchmark report free.`,
    path: "/reality-check/study",
  }),
  robots: { index: false, follow: true },
};

async function studyCount(): Promise<number | undefined> {
  if (!serviceRoleConfigured) return undefined;
  try {
    const { count, error } = await createAdminClient()
      .from("reality_check_responses")
      .select("run_id", { count: "exact", head: true })
      .eq("cohort", "study")
      .eq("repeat_taker", false);
    return error ? undefined : count ?? undefined;
  } catch {
    return undefined;
  }
}

export default async function RealityCheckStudyPage() {
  const count = await studyCount();
  return (
    <Section className="pt-28 md:pt-36">
      <RealityCheck mode="study" studyCount={count} />
    </Section>
  );
}
