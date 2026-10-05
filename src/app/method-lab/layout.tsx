import type { Metadata } from "next";
import { MethodLabHeader, MethodLabFooter } from "@/components/methodlab/MethodLabChrome";

/**
 * Everything under /method-lab is the Method Lab, and wears the Lab's chrome
 * instead of the website's. The site header and footer hide themselves on these
 * paths, so a Lab page carries no marketing nav, no booking button, and no way
 * to wander out of the Lab except the explicit "Back to the site" link.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function MethodLabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <MethodLabHeader />
      {/* The Lab's React pages were written under the site header, so their first
          section carries its clearance (pt-28/36). The Lab header is shorter, so
          that becomes a hole. Pull the first section up; anything after it keeps
          its own rhythm. */}
      <main className="flex-1 [&>section:first-child]:pt-10 md:[&>section:first-child]:pt-14">
        {children}
      </main>
      <MethodLabFooter />
    </div>
  );
}
