"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { megaNav, primaryCta, siteConfig, type MegaEntry } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { Menu, ChevronDown } from "@/components/ui/icons";
import { MobileMenu } from "./MobileMenu";
import { AuthBar } from "./AuthBar";
import { LiveClock } from "./LiveClock";
import { cn } from "@/lib/utils";

/**
 * Sticky, two-row site header (Bain-style). A thin utility strip sits above the
 * main bar; grouped nav items open a full-width mega-panel with a left "hub"
 * descriptor box and a column of links. The main bar condenses and turns maroon
 * on scroll (the utility strip collapses away). The mobile trigger opens the
 * full-screen accessible menu (rendered as a sibling so `position: fixed` isn't
 * trapped by the header's backdrop-filter).
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mega-panel on route change and on Escape.
  useEffect(() => setOpenGroup(null), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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

  // Hover intent: small delay before closing so the pointer can cross the gap
  // between a trigger and its panel.
  const openNow = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenGroup(label);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenGroup(null), 120);
  };

  const active = megaNav.find((e) => e.kind === "group" && e.label === openGroup);
  const activeGroup = active && active.kind === "group" ? active : null;

  return (
    <>
      <header
        onMouseLeave={closeSoon}
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-300",
          scrolled ? "border-maroon-hover bg-maroon text-paper" : "border-line bg-paper/95 text-ink"
        )}
      >
        {/* Utility strip — collapses on scroll */}
        <div
          className={cn(
            "hidden overflow-hidden border-b border-white/10 bg-maroon text-paper transition-all duration-300 lg:block",
            scrolled ? "max-h-0 border-b-0 opacity-0" : "max-h-10 opacity-100"
          )}
        >
          <Container>
            <div className="grid h-9 grid-cols-3 items-center text-[12px] tracking-[0.01em] text-white/80">
              <span className="justify-self-start">Founder-led · Analytics, AI &amp; strategy for owner-run businesses</span>
              <LiveClock className="justify-self-center text-white/90" />
              <div className="flex items-center gap-5 justify-self-end">
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-white">
                  {siteConfig.email}
                </a>
                <a
                  href="https://www.linkedin.com/in/fenhow"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="transition-colors hover:text-white"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                  </svg>
                </a>
                <AuthBar />
              </div>
            </div>
          </Container>
        </div>

        {/* Main bar */}
        <Container>
          <div
            className={cn(
              "flex items-center justify-between transition-[height] duration-fast",
              scrolled ? "h-16" : "h-20 md:h-[76px]"
            )}
          >
            <Link href="/" aria-label="The Aperture Method — home" className="shrink-0 rounded-sm">
              <Logo
                tone={scrolled ? "light" : "dark"}
                className={cn(
                  "transition-all duration-fast",
                  scrolled ? "text-[clamp(15px,4vw,17px)]" : "text-[clamp(16px,4.4vw,19px)]"
                )}
              />
            </Link>

            {/* Desktop navigation */}
            <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-8">
              {megaNav.map((entry: MegaEntry) =>
                entry.kind === "link" ? (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    aria-current={isActive(entry.href) ? "page" : undefined}
                    onMouseEnter={() => openNow("")}
                    className={cn(
                      "group relative py-1 text-[15px] font-medium transition-colors duration-fast",
                      scrolled ? "text-white/90 hover:text-white" : "text-ink hover:text-maroon"
                    )}
                  >
                    {entry.label}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-0.5 transition-all duration-fast",
                        scrolled ? "bg-white" : "bg-maroon",
                        isActive(entry.href) ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                ) : (
                  <div
                    key={entry.href}
                    className="relative"
                    onMouseEnter={() => openNow(entry.label)}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={openGroup === entry.label}
                      onClick={() =>
                        setOpenGroup((v) => (v === entry.label ? null : entry.label))
                      }
                      className={cn(
                        "group relative flex items-center gap-1 py-1 text-[15px] font-medium transition-colors duration-fast",
                        scrolled ? "text-white/90 hover:text-white" : "text-ink hover:text-maroon"
                      )}
                    >
                      {entry.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-fast",
                          openGroup === entry.label && "rotate-180"
                        )}
                      />
                      <span
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-0.5 transition-all duration-fast",
                          scrolled ? "bg-white" : "bg-maroon",
                          isActive(entry.href) || openGroup === entry.label
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        )}
                      />
                    </button>
                  </div>
                )
              )}
              <Link
                href={primaryCta.href}
                onMouseEnter={() => openNow("")}
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

        {/* Mega-panel (full width, anchored to the header) */}
        {activeGroup && (
          <div
            className="absolute left-0 right-0 top-full hidden border-b border-line bg-paper shadow-subtle lg:block"
            onMouseEnter={() => openNow(activeGroup.label)}
            onMouseLeave={closeSoon}
          >
            <Container>
              <div className="grid grid-cols-[0.9fr_1.5fr] gap-10 py-8">
                {/* Hub descriptor box */}
                <Link
                  href={activeGroup.href}
                  className="group flex flex-col justify-between rounded-lg bg-surface p-6 transition-colors hover:bg-maroon/[0.06]"
                >
                  <div>
                    <p className="eyebrow mb-3">{activeGroup.hub.eyebrow}</p>
                    <p className="text-h4 font-semibold text-ink">{activeGroup.hub.title}</p>
                    <p className="mt-3 text-small leading-relaxed text-muted">
                      {activeGroup.hub.blurb}
                    </p>
                  </div>
                  <p className="mt-6 text-small font-medium text-maroon">
                    {activeGroup.hub.linkLabel}{" "}
                    <span className="inline-block transition-transform duration-fast group-hover:translate-x-0.5">
                      &rarr;
                    </span>
                  </p>
                </Link>

                {/* Link columns */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 self-center">
                  {activeGroup.links.map((l) => {
                    const inner = (
                      <>
                        <span className="block text-[15px] font-semibold text-ink group-hover:text-maroon">
                          {l.label}
                        </span>
                        {l.desc && (
                          <span className="mt-0.5 block text-small text-muted">{l.desc}</span>
                        )}
                      </>
                    );
                    const cls = "group rounded-md px-3 py-3 transition-colors hover:bg-surface";
                    return l.external ? (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cls}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link
                        key={l.href}
                        href={l.href}
                        aria-current={isActive(l.href) ? "page" : undefined}
                        className={cls}
                      >
                        {inner}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </Container>
          </div>
        )}
      </header>

      <MobileMenu open={mobileOpen} onClose={closeMobile} isActive={isActive} />
    </>
  );
}
