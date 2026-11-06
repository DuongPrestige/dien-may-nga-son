export const SERVICE_AREAS_CACHE_TAG = "service-areas";

export const SERVICE_AREA_SLUG_PATTERN = /^[a-z0-9-]+$/;

/**
 * Top-level route segments an area slug must never take, so areas can be
 * promoted to root-level URLs later without colliding with existing routes.
 */
export const RESERVED_SERVICE_AREA_SLUGS: ReadonlySet<string> = new Set([
  "about",
  "admin",
  "api",
  "blog",
  "cong-trinh-thuc-te",
  "contact",
  "products",
  "services",
  "_next",
  "tim-kiem",
  "hinh-anh-thuc-te",
  "khu-vuc",
]);

export const SERVICE_AREA_PROJECT_LIMIT = 6;
