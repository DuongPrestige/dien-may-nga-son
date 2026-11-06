const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  middot: "·",
  bull: "•",
  copy: "©",
  reg: "®",
};

const ENTITY_PATTERN = /&(#x[\da-f]{1,6}|#\d{1,7}|[a-z]{2,8});/gi;
const MAX_CODE_POINT = 0x10ffff;

function decodeCodePoint(codePoint: number, fallback: string): string {
  if (
    !Number.isFinite(codePoint) ||
    codePoint <= 0 ||
    codePoint > MAX_CODE_POINT ||
    (codePoint >= 0xd800 && codePoint <= 0xdfff)
  ) {
    return fallback;
  }

  return String.fromCodePoint(codePoint);
}

/**
 * Decodes the HTML entities that commonly appear in meta tags and sanitized
 * HTML (named basics plus decimal/hex numeric references). Unknown entities
 * are left untouched.
 */
export function decodeHtmlEntities(value: string): string {
  return value.replace(ENTITY_PATTERN, (entity, code: string) => {
    if (code[0] === "#") {
      const isHex = code[1] === "x" || code[1] === "X";
      const codePoint = isHex
        ? Number.parseInt(code.slice(2), 16)
        : Number.parseInt(code.slice(1), 10);
      return decodeCodePoint(codePoint, entity);
    }

    return NAMED_ENTITIES[code.toLowerCase()] ?? entity;
  });
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
