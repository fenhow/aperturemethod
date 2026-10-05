import Link from "next/link";
import { METHOD_LAB_NOTICE } from "@/lib/methodLabChrome";

/**
 * The Method Lab bar and footer for the Lab's own React pages (the study and
 * website dashboards).
 *
 * The gated HTML documents get the same bar and footer injected at serve time
 * in src/lib/methodLabChrome.ts; this is the same thing in JSX, reading the same
 * METHOD_LAB_NOTICE, so the wording can only ever be changed in one place.
 * Anything behind the passphrase should carry both.
 */

export function MethodLabBar() {
  return (
    <div className="sticky top-0 z-50 flex flex-wrap items-center gap-3 bg-maroon px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-paper">
      <a
        href="https://www.aperturemethod.com/"
        className="rounded-[3px] border border-white/50 px-3 py-1 transition-colors hover:border-white hover:bg-white/15"
      >
        &larr; Back to the site
      </a>
      <span className="order-3 w-full text-left sm:order-none sm:w-auto sm:flex-1 sm:text-center">
        {METHOD_LAB_NOTICE}
      </span>
      <Link
        href="/method-lab"
        className="rounded-[3px] border border-white/50 px-3 py-1 transition-colors hover:border-white hover:bg-white/15"
      >
        Method Lab home
      </Link>
      <form method="POST" action="/api/method-lab/signout" className="m-0">
        <button
          type="submit"
          className="rounded-[3px] border border-white/50 px-3 py-1 font-bold uppercase tracking-[0.14em] transition-colors hover:border-white hover:bg-white/15"
        >
          &times; Exit Method Lab
        </button>
      </form>
    </div>
  );
}

export function MethodLabFooter() {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line px-7 py-6 pb-10 text-caption text-muted">
      <span>The Aperture Method&trade; · Method Lab · {METHOD_LAB_NOTICE}</span>
      <span className="flex flex-wrap gap-4">
        <Link href="/method-lab" className="font-semibold text-maroon hover:underline">
          Method Lab home
        </Link>
        <a
          href="https://www.aperturemethod.com/"
          className="font-semibold text-maroon hover:underline"
        >
          Back to the site
        </a>
        <form method="POST" action="/api/method-lab/signout" className="m-0">
          <button type="submit" className="font-semibold text-maroon hover:underline">
            Exit Method Lab
          </button>
        </form>
      </span>
    </div>
  );
}
