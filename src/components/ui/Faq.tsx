import { JsonLd } from "@/components/seo/JsonLd";
import { ldFaq } from "@/lib/seo";

/**
 * Accessible FAQ built on native <details>/<summary>, keyboard-operable and
 * zero JavaScript. The maroon "+" rotates into an "×" when open.
 *
 * It also emits FAQPage structured data from the same array it renders, so the
 * markup and the schema cannot disagree and a new FAQ cannot ship without one.
 * Pass `schema={false}` on the rare page that carries a second FAQ block:
 * search engines expect one FAQPage per page, not several.
 */
export function Faq({
  items,
  schema = true,
}: {
  items: { q: string; a: string }[];
  schema?: boolean;
}) {
  return (
    <div className="border-y border-line">
      {schema && items.length > 0 && <JsonLd data={ldFaq(items)} />}
      {items.map((item, i) => (
        <details
          key={i}
          className="group border-b border-line last:border-b-0 py-5"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-h4 font-semibold text-ink transition-colors hover:text-maroon [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              className="shrink-0 text-2xl font-light leading-none text-maroon transition-transform duration-fast group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-measure text-body text-body">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
