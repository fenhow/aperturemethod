import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { primaryNav, primaryCta } from "@/lib/site";

export default function NotFound() {
  return (
    <Section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-measure text-center">
        <p className="eyebrow mb-5">Error 404</p>
        <h1 className="heading-gradient text-display font-semibold">This page is out of focus.</h1>
        <p className="mx-auto mt-6 max-w-md text-body-lg text-body">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to
          something useful.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn">
            Back to home
          </Link>
          <Link href={primaryCta.href} className="btn--secondary">
            {primaryCta.label}
          </Link>
        </div>
        <nav aria-label="Helpful links" className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-small font-medium text-muted transition-colors hover:text-maroon"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </Section>
  );
}
