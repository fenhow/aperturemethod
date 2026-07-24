import Link from "next/link";
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
  const className =
    "text-small text-white/55 transition-colors duration-fast hover:text-white";
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
            <Logo tone="light" className="h-7" />
            <p className="mt-4 max-w-[260px] text-body-lg leading-snug text-white/70">
              {siteConfig.positioningLine}
            </p>
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
            <CookiePreferencesButton className="text-white/60 transition-colors duration-fast hover:text-white" />
            <p>{siteConfig.tagline}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
