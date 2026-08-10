import Link from "next/link";
import { BuildStamp } from "@/components/layout/BuildStamp";
import { footerNav, siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { CookiePreferencesButton } from "@/components/consent/CookiePreferencesButton";

/**
 * Dark bookend footer (design system §22). Aperture mark + positioning line,
 * four link columns, and a slim legal row. Muted links brighten to white on
 * hover; hairline dividers in near-black.
 */

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  // `inline-block` + vertical padding turns a 19px line of text into a ~27px
  // touch target on a phone. Without it, adjacent footer links are close
  // enough that a thumb regularly hits the wrong one.
  const className =
    "inline-block py-1 text-small text-white/55 transition-colors duration-fast hover:text-white";
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      <Container>
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 py-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,minmax(0,1fr))] lg:gap-8 lg:py-24">
          {/* Brand block */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo tone="light" className="text-[19px]" />
            <p className="mt-4 max-w-[260px] text-body-lg leading-snug text-white/70">
              {siteConfig.positioningLine}
            </p>

            {/* Direct contact */}
            <div className="mt-6 text-small leading-relaxed text-white/55">
              <p className="font-semibold text-white/80">Contact Fenwick How</p>
              <p className="mt-1">
                <a href="mailto:fhow@aperturemethod.com" className="inline-block py-1 transition-colors duration-fast hover:text-white">
                  fhow@aperturemethod.com
                </a>
              </p>
              <p>
                <a href="tel:+17133923923" className="inline-block py-1 transition-colors duration-fast hover:text-white">
                  Tel (713) 392-3923
                </a>
              </p>
              <a
                href="https://www.linkedin.com/in/fenhow"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Fenwick How on LinkedIn"
                className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-sm border border-white/15 text-white/70 transition-colors duration-fast hover:border-white/40 hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.55 4.78 5.86V21h-4v-5.2c0-1.24-.02-2.84-1.9-2.84-1.9 0-2.2 1.35-2.2 2.75V21H9z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerNav.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="mb-4 text-overline font-semibold uppercase tracking-overline text-white/90">
                {column.heading}
              </h2>
              <ul className="space-y-2.5">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <FooterLink href={item.href}>{item.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Legal row */}
        <div className="flex flex-col gap-3 py-8 text-small text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName} · Founded by {siteConfig.founder}
          </p>
          <div className="flex items-center gap-5">
            {/* Private area — passphrase-gated, unlinked from the main nav and
                excluded from the sitemap. rel="nofollow" keeps crawlers off it. */}
            <Link
              href="/method-lab"
              rel="nofollow"
              className="text-white/60 transition-colors duration-fast hover:text-white"
            >
              Method Lab
            </Link>
            <CookiePreferencesButton className="text-white/60 transition-colors duration-fast hover:text-white" />
            {/* Which build this is. Quiet, but on every page — so "is the deployed site the
                thing I pushed?" is answered by the site, not by a dashboard. */}
            <BuildStamp className="text-white/40" />
            <p>{siteConfig.tagline}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
