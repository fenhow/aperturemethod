"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { primaryNav, primaryCta, industriesNav } from "@/lib/site";
import { Logo } from "@/components/brand/Logo";
import { Close } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Full-screen mobile navigation overlay. Accessible modal dialog:
 * locks body scroll, traps focus, closes on Escape, and returns focus to the
 * trigger on close (handled by the parent Header).
 */
export function MobileMenu({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    focusables?.[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && focusables && focusables.length > 0) {
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] bg-paper lg:hidden"
    >
      <div ref={panelRef} className="flex h-[100dvh] flex-col">
        <div className="flex h-20 items-center justify-between border-b border-line px-6">
          <Logo className="h-6" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-sm p-2 text-ink transition-colors duration-fast hover:text-maroon"
          >
            <Close />
          </button>
        </div>

        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-6 py-8">
          <ul className="space-y-1">
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "block py-3 text-h3 font-semibold transition-colors",
                    isActive(link.href) ? "text-maroon" : "text-ink"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-line pt-6">
            <p className="eyebrow mb-3">Industries</p>
            <ul className="space-y-1">
              {industriesNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block py-2 text-body-lg text-body transition-colors hover:text-maroon"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="border-t border-line px-6 py-6">
          <Link href={primaryCta.href} onClick={onClose} className="btn w-full">
            {primaryCta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
