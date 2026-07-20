/**
 * JsonLd — renders one or more JSON-LD schema objects as a
 * <script type="application/ld+json"> tag. Server component (no "use client").
 *
 * The "<" characters are escaped so a venue name or description can never break
 * out of the <script> element. Safe because the data is our own structured
 * objects, not arbitrary user HTML.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export default JsonLd;
