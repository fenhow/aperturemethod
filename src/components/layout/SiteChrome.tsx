"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the website's own chrome inside the Method Lab.
 *
 * The Lab has its own header and footer (src/app/method-lab/layout.tsx) and is
 * deliberately a separate place: nothing in the Lab should offer the marketing
 * nav, the booking button or the public footer, and nothing in the Lab should
 * look like a page a prospect landed on by accident.
 *
 * The site header does this check itself because it is already a client
 * component; the footer is a server component, so it gets wrapped in this.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  if (pathname === "/method-lab" || pathname.startsWith("/method-lab/")) return null;
  return <>{children}</>;
}
