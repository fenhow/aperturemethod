"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { METHOD_LAB_NOTICE, METHOD_LAB_PUBLIC_NOTICE, METHOD_LAB_NAV, isPublicMethodLabPath } from "@/lib/methodLabNav";

/**
 * The Method Lab's own header and footer.
 *
 * The Lab is a separate place from the website. Oct 2026: it used to be half
 * and half, and which half you got depended on how the page happened to be
 * built. The HTML documents had a confidential bar and no site nav; the study
 * and website dashboards had the full marketing header, main nav and all, as
 * though a prospect might wander in; the workbench had nothing at all. Three
 * doors into one room.
 *
 * Now every /method-lab path wears this and only this: the site header and
 * footer hide themselves inside the Lab (see Header.tsx and SiteChrome.tsx),
 * and the gated HTML documents get the same two rows injected at serve time
 * (src/lib/methodLabChrome.ts), so a document and a dashboard look like one
 * system.
 *
 * Two of the Lab's pages are public on purpose (Coursework, and the published
 * workbench examples): they are meant to be shared with the cohort and with
 * prospects. They keep the Lab's header so they still read as part of the Lab,
 * but they must never be stamped "confidential", so the notice line changes and
 * the sign-out control is dropped.
 */

export function MethodLabHeader() {
  const pathname = usePathname() ?? "";
  const isPublic = isPublicMethodLabPath(pathname);

  return (
    <header className="sticky top-0 z-50">
      {/* Row 1: what this place is. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-maroon px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-paper">
        <a
          href="https://www.aperturemethod.com/"
          className="rounded-[3px] border border-white/50 px-3 py-1 transition-colors hover:border-white hover:bg-white/15"
        >
          &larr; Back to the site
        </a>
        <span className="order-3 w-full sm:order-none sm:w-auto sm:flex-1 sm:text-center">
          {isPublic ? METHOD_LAB_PUBLIC_NOTICE : METHOD_LAB_NOTICE}
        </span>
        {isPublic ? null : (
          <form method="POST" action="/api/method-lab/signout" className="m-0">
            <button
              type="submit"
              className="rounded-[3px] border border-white/50 px-3 py-1 font-bold uppercase tracking-[0.14em] transition-colors hover:border-white hover:bg-white/15"
            >
              &times; Exit Method Lab
            </button>
          </form>
        )}
      </div>

      {/* Row 2: where you are, and everything else in here. */}
      <div className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-6 gap-y-3 px-7 py-3">
          <Link href="/method-lab" className="flex items-center gap-3">
            <Image
              src="/logo-icon-black.png"
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px]"
            />
            <span className="text-small font-semibold tracking-[0.12em] text-ink">
              METHOD LAB
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {METHOD_LAB_NAV.map((item) => {
              const here = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    here
                      ? "text-caption font-semibold text-maroon"
                      : "text-caption text-muted transition-colors hover:text-ink"
                  }
                  aria-current={here ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

export function MethodLabFooter() {
  const pathname = usePathname() ?? "";
  const isPublic = isPublicMethodLabPath(pathname);

  return (
    <footer className="mt-12 border-t border-line">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-7 py-6 pb-12 text-caption text-muted">
        <span>
          The Aperture Method&trade; · Method Lab ·{" "}
          {isPublic ? METHOD_LAB_PUBLIC_NOTICE : METHOD_LAB_NOTICE}
        </span>
        <span className="flex flex-wrap items-center gap-4">
          <Link href="/method-lab" className="font-semibold text-maroon hover:underline">
            Method Lab home
          </Link>
          <a
            href="https://www.aperturemethod.com/"
            className="font-semibold text-maroon hover:underline"
          >
            Back to the site
          </a>
          {isPublic ? null : (
            <form method="POST" action="/api/method-lab/signout" className="m-0">
              <button type="submit" className="font-semibold text-maroon hover:underline">
                Exit Method Lab
              </button>
            </form>
          )}
        </span>
      </div>
    </footer>
  );
}
