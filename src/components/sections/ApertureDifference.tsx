import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { apertureDifference as d } from "@/lib/content";

/**
 * "The Aperture Difference" — a bold positioning statement contrasting ordinary
 * consulting ("recommendations") with the Method ("executive intelligence").
 * Dark by default for emphasis; verbs match the approved tagline.
 */
export function ApertureDifference({ tone = "dark" }: { tone?: "dark" | "surface" }) {
  const onDark = tone === "dark";
  return (
    <Section tone={tone}>
      <Reveal className="max-w-measure">
        <p className={onDark ? "eyebrow eyebrow--on-dark mb-5" : "eyebrow mb-5"}>
          The Aperture Difference&trade;
        </p>
        <h2 className="text-h1 font-semibold">
          <span className={onDark ? "text-white/55" : "text-muted"}>{d.them}</span>
          <br />
          <span className={onDark ? "text-paper" : "text-ink"}>{d.us}</span>
        </h2>
        <p className={`mt-7 text-body-lg ${onDark ? "text-white/75" : "text-body"}`}>{d.body}</p>
        <p className={`mt-5 text-body-lg font-medium ${onDark ? "text-paper" : "text-ink"}`}>
          {d.result}
        </p>
      </Reveal>

      <Reveal className="mt-10 flex flex-wrap gap-2.5">
        {d.pillars.map((p) => (
          <span
            key={p}
            className={
              onDark
                ? "rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-small font-medium text-white/85"
                : "rounded-full border border-line bg-surface px-4 py-1.5 text-small font-medium text-ink"
            }
          >
            {p}
          </span>
        ))}
      </Reveal>

      <Reveal>
        <p className={`mt-8 text-small ${onDark ? "text-white/50" : "text-muted"}`}>{d.verbsLine}</p>
      </Reveal>
    </Section>
  );
}
