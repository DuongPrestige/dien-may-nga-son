const MAX_SLUG_BASE_LENGTH = 80;
const FALLBACK_SLUG = "cong-trinh";

/** Converts Vietnamese text into a URL slug matching the project slug rules. */
export function toProjectSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_BASE_LENGTH)
    .replace(/-+$/g, "");

  return slug || FALLBACK_SLUG;
}

/** Picks `base`, or `base-N` with the smallest free N, given taken slugs. */
export function pickAvailableSlug(
  base: string,
  takenSlugs: ReadonlySet<string>,
): string {
  if (!takenSlugs.has(base)) {
    return base;
  }

  let suffix = 2;
  while (takenSlugs.has(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
}
