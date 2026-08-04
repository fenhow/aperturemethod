import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { primaryCta } from "@/lib/site";

/**
 * Aperture parent-brand hero. A single, quiet full-bleed editorial frame (same
 * construction as the homepage HeroRotator slide) carrying the parent line.
 * Aperture is the roof; the Method and the Platform live beneath it.
 */
export function ApertureHero() {
  return (
    <section className="relative isolate flex min-h-[86vh] items-end overflow-hidden bg-dark text-paper">
      <Image
        src="/hero/hero-3-v7.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* legibility scrim */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />

      <Container className="relative z-10 w-full pb-16 pt-40 md:pb-24">
        <div className="max-w-3xl">
          <p className="eyebrow eyebrow--on-dark mb-5">One firm. One lens.</p>
          <h1 className="text-display font-semibold text-paper">
            Your fractional
            <br />
            intelligence department.
          </h1>
          <p className="mt-6 max-w-xl text-body-lg text-white/75">
            Enterprise analytics and strategy — right-sized for you. The MBA-level analytics, AI, and
            strategy big companies rely on, brought to owner-run businesses in plain language, and done
            for you.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href={primaryCta.href} className="btn--on-dark">
              {primaryCta.label}
            </Link>
            <Link href="#method" className="btn--ghost">
              Explore the five practices →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
