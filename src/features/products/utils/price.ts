export type PriceValue =
  | {
      toNumber: () => number;
    }
  | number
  | string
  | null
  | undefined;

export function toSafePriceNumber(value: PriceValue): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return null;
    }

    const parsedValue = Number(trimmedValue);

    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  try {
    const parsedValue = value.toNumber();

    return Number.isFinite(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}
