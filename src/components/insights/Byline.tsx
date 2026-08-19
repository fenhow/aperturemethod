import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

/**
 * The author byline on an article.
 *
 * The Article schema has always named an author. The page never did, which is
 * the wrong way round: a reader deciding whether to trust a piece about their
 * own accounts should be able to see who wrote it without opening the source.
 * Photo, name, what qualifies him to say it, and a link to the full bio.
 *
 * Dates are here rather than in the header because they belong to the author
 * block: who said this, and when did they last stand behind it.
 */
export function Byline({
  published,
  updated,
  readingTime,
}: {
  published: string;
  updated?: string;
  readingTime: string;
}) {
  const fmt = (iso: string) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  const revised = updated && updated !== published;

  return (
    <div className="mt-8 flex items-start gap-4 border-y border-line py-5">
      <Image
        src="/fenwick-how.jpg"
        alt={`${siteConfig.founder}, founder of ${siteConfig.name}`}
        width={56}
        height={56}
        className="h-14 w-14 shrink-0 rounded-full object-cover"
      />
      <div className="text-small">
        <p className="text-ink">
          By{" "}
          <Link href="/founder" className="font-semibold link-inline">
            {siteConfig.founder}
          </Link>
          , Founder
        </p>
        <p className="mt-1 text-muted">
          BBA in Project Management, certified PMP, currently pursuing an MBA at Texas A&amp;M. He
          does the analysis on every engagement himself.
        </p>
        <p className="mt-2 text-muted">
          Published <time dateTime={published}>{fmt(published)}</time>
          {revised && (
            <>
              {" · Last updated "}
              <time dateTime={updated}>{fmt(updated!)}</time>
            </>
          )}
          {" · "}
          {readingTime}
        </p>
      </div>
    </div>
  );
}
