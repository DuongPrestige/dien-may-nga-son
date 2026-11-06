const ELLIPSIS = "…";
const MIN_WORD_BOUNDARY_RATIO = 0.6;

/**
 * Truncates text to at most `maxLength` characters (code points), preferring a
 * word boundary and appending an ellipsis when content was cut.
 */
export function truncateText(value: string, maxLength: number): string {
  const text = value.replace(/\s+/g, " ").trim();
  const characters = Array.from(text);

  if (characters.length <= maxLength) {
    return text;
  }

  if (maxLength <= ELLIPSIS.length) {
    return characters.slice(0, maxLength).join("");
  }

  const hardCut = characters.slice(0, maxLength - ELLIPSIS.length).join("");
  const lastSpace = hardCut.lastIndexOf(" ");
  const cut =
    lastSpace >= hardCut.length * MIN_WORD_BOUNDARY_RATIO
      ? hardCut.slice(0, lastSpace)
      : hardCut;

  return `${cut.replace(/[\s,.;:–—-]+$/, "")}${ELLIPSIS}`;
}

/** Cuts text to at most `maxLength` code points without adding an ellipsis. */
export function limitText(value: string, maxLength: number): string {
  return Array.from(value).slice(0, maxLength).join("");
}
