export function parseProjectDate(value: Date | string): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatProjectDate(value: Date | string): string {
  const date = parseProjectDate(value);

  if (!date) {
    return "Đang cập nhật";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
}

export function getProjectDateIso(value: Date | string): string {
  return parseProjectDate(value)?.toISOString() ?? new Date(0).toISOString();
}
