/**
 * Renders one or more JSON-LD blocks as a script tag.
 * JSON-LD is data, not user input, so dangerouslySetInnerHTML is the
 * documented Next.js pattern here.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
