"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { industriesNav, type NavItem } from "@/lib/site";
import { ChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The "Industries" nav item: a real link to the hub, plus a disclosure panel
 * of sector pages. Opens on hover (pointer) and via the chevron toggle
 * (keyboard). Closes on Escape, outside click, and route change.
 */
export function NavDropdown({
  item,
  active,
  onDark = false,
}: {
  item: NavItem;
  active: boolean;
  onDark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close when navigation changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape / outside click while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="group inline-flex items-center gap-1">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "relative py-1 text-[15px] font-medium transition-colors duration-fast",
            onDark ? "text-white/90 hover:text-white" : "text-ink hover:text-maroon"
          )}
        >
          {item.label}
          <span
            className={cn(
              "absolute -bottom-0.5 left-0 h-0.5 transition-all duration-fast",
              onDark ? "bg-white" : "bg-maroon",
              active ? "w-full" : "w-0 group-hover:w-full"
            )}
          />
        </Link>
        <button
          ref={buttonRef}
          type="button"
          aria-label={`${item.label} menu`}
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls="industries-menu"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "rounded-sm p-0.5 transition-colors duration-fast",
            onDark ? "text-white/90 hover:text-white" : "text-ink hover:text-maroon"
          )}
        >
          <ChevronDown className={cn("transition-transform duration-fast", open && "rotate-180")} />
        </button>
      </span>

      {open && (
        <div className="absolute left-0 top-full pt-3">
          <div id="industries-menu" className="w-64 rounded border border-line bg-paper p-2 shadow-subtle">
            {industriesNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-sm px-3 py-2 text-[15px] text-body transition-colors duration-fast hover:bg-surface hover:text-maroon"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
