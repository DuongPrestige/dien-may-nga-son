export const TESTIMONIALS_CACHE_TAG = "testimonials";

export const DEFAULT_PUBLIC_TESTIMONIALS_LIMIT = 6;

export const MAX_PUBLIC_TESTIMONIALS_LIMIT = 12;

export const TESTIMONIAL_LIMITS = {
  customerNameMin: 2,
  customerNameMax: 100,
  areaMax: 100,
  contentMin: 10,
  contentMax: 600,
  sortOrderMax: 999,
} as const;
