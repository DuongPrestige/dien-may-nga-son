import type { Decimal } from "@prisma/client/runtime/library";

type ProductPriceProps = {
  price: Decimal;
  salePrice?: Decimal | null;
};

function formatPrice(price: Decimal): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price.toNumber());
}

export function ProductPrice({ price, salePrice }: ProductPriceProps) {
  if (salePrice) {
    return (
      <div className="space-y-1">
        <p className="text-lg font-bold text-[#F97316]">
          {formatPrice(salePrice)}
        </p>
        <p className="text-sm text-[#6B7280] line-through">
          {formatPrice(price)}
        </p>
      </div>
    );
  }

  return <p className="text-lg font-bold text-[#F97316]">{formatPrice(price)}</p>;
}

