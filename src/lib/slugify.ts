const COMBINING_MARKS_PATTERN = /[̀-ͯ]/g;
const NON_SLUG_CHARACTERS_PATTERN = /[^a-z0-9]+/g;
const EDGE_DASHES_PATTERN = /^-+|-+$/g;

/**
 * Converts Vietnamese text into a URL slug ("Quang Thành" -> "quang-thanh").
 * Returns an empty string when the input has no slug-safe characters.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS_PATTERN, "")
    .replace(/đ/g, "d")
    .replace(NON_SLUG_CHARACTERS_PATTERN, "-")
    .replace(EDGE_DASHES_PATTERN, "");
}
