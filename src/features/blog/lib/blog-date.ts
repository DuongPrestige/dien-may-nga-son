export type BlogDateValue = Date | string | null | undefined;

export function parseBlogDate(value: BlogDateValue): Date | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatBlogDate(
  value: BlogDateValue,
  fallback = "Đang cập nhật",
): string {
  const date = parseBlogDate(value);

  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getBlogDateIso(value: BlogDateValue): string | undefined {
  return parseBlogDate(value)?.toISOString();
}
