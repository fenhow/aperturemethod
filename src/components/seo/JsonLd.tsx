/**
 * Renders one or more JSON-LD blocks. Server component: the markup ships in the
 * initial HTML so crawlers see it without executing JavaScript.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Data is app-authored (no user input); safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
