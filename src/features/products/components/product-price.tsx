type PriceValue =
  | {
      toNumber: () => number;
    }
  | number
  | string
  | null
  | undefined;

type ProductPriceProps = {
  price: PriceValue;
  salePrice?: PriceValue;
};

function toSafeNumber(value: PriceValue): number | null {
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

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductPrice({ price, salePrice }: ProductPriceProps) {
  const normalPrice = toSafeNumber(price);
  const discountedPrice = toSafeNumber(salePrice);

  if (normalPrice === null) {
    return <p className="text-lg font-bold text-[#F97316]">Liên hệ</p>;
  }

  if (discountedPrice !== null) {
    return (
      <div className="space-y-1">
        <p className="text-lg font-bold text-[#F97316]">
          {formatPrice(discountedPrice)}
        </p>
        <p className="text-sm text-[#6B7280] line-through">
          {formatPrice(normalPrice)}
        </p>
      </div>
    );
  }

  return (
    <p className="text-lg font-bold text-[#F97316]">
      {formatPrice(normalPrice)}
    </p>
  );
}
