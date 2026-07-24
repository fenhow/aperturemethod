"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { primaryNav, primaryCta, type NavItem } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { Menu } from "@/components/ui/icons";
import { NavDropdown } from "./NavDropdown";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

/**
 * Sticky site header. White with a hairline bottom border; condenses on
 * scroll (88 → 64). Logo left, primary nav right-of-center, persistent maroon
 * CTA far right (Bain-style placement). Industries is a dropdown; the mobile
 * trigger opens the full-screen accessible menu.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = useCallback(
    (href: string) =>
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(href + "/"),
    [pathname]
  );

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-300",
        scrolled ? "border-maroon-hover bg-maroon text-paper" : "border-line bg-paper/95 text-ink"
      )}
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between transition-[height] duration-fast",
            scrolled ? "h-16" : "h-20 md:h-[88px]"
          )}
        >
          <Link href="/" aria-label="The Aperture Method — home" className="shrink-0 rounded-sm">
            <Logo
              priority
              tone={scrolled ? "light" : "dark"}
              className={cn(
                "transition-all duration-fast",
                scrolled ? "h-[clamp(18px,5vw,24px)]" : "h-[clamp(20px,5.5vw,28px)]"
              )}
            />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-8">
            {primaryNav.map((item: NavItem) =>
              item.href === "/industries" ? (
                <NavDropdown key={item.href} item={item} active={isActive(item.href)} onDark={scrolled} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "group relative py-1 text-[15px] font-medium transition-colors duration-fast",
                    scrolled ? "text-white/90 hover:text-white" : "text-ink hover:text-maroon"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-0.5 transition-all duration-fast",
                      scrolled ? "bg-white" : "bg-maroon",
                      isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              )
            )}
            <Link
              href={primaryCta.href}
              className={cn(
                "ml-1 rounded-sm px-5 py-2.5 text-sm font-semibold transition-colors duration-fast",
                scrolled
                  ? "bg-paper text-maroon hover:bg-white"
                  : "bg-maroon text-paper hover:bg-maroon-hover"
              )}
            >
              {primaryCta.label}
            </Link>
          </nav>

          {/* Mobile trigger */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-haspopup="dialog"
            className={cn(
              "rounded-sm p-2 transition-colors duration-fast lg:hidden",
              scrolled ? "text-paper hover:text-white/80" : "text-ink hover:text-maroon"
            )}
          >
            <Menu />
          </button>
        </div>
      </Container>

      <MobileMenu open={mobileOpen} onClose={closeMobile} isActive={isActive} />
    </header>
  );
}
