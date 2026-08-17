import { Section } from "@/components/ui/Section";
import { RealityCheck } from "@/components/reality/RealityCheck";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "The Reality Check: How well do you know your business?",
  description:
    "Ten questions you cannot bluff. A three-minute reality check on how well you actually know your own business, with a Clarity Score and your single biggest blind spot named. No email required to see your result.",
  path: "/reality-check",
});

export default function RealityCheckPage() {
  return (
    <Section className="pt-28 md:pt-36">
      <RealityCheck />
    </Section>
  );
}
