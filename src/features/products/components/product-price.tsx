import {
  formatPrice,
  type PriceValue,
  toSafePriceNumber,
} from "@/src/features/products/utils/price";

type ProductPriceProps = {
  price: PriceValue;
  salePrice?: PriceValue;
  size?: "default" | "compact";
};

const PRICE_CLASS_NAMES = {
  default: "text-lg font-bold text-[#F97316]",
  compact: "text-base font-bold text-[#F97316] sm:text-lg",
} as const;

const ORIGINAL_PRICE_CLASS_NAMES = {
  default: "text-sm text-[#6B7280] line-through",
  compact: "text-xs text-[#6B7280] line-through sm:text-sm",
} as const;

export function ProductPrice({
  price,
  salePrice,
  size = "default",
}: ProductPriceProps) {
  const priceClassName = PRICE_CLASS_NAMES[size];
  const originalPriceClassName = ORIGINAL_PRICE_CLASS_NAMES[size];
  const normalPrice = toSafePriceNumber(price);
  const discountedPrice = toSafePriceNumber(salePrice);

  if (normalPrice === null) {
    return <p className={priceClassName}>Liên hệ</p>;
  }

  if (discountedPrice !== null) {
    return (
      <div className="space-y-0.5">
        <p className={priceClassName}>
          {formatPrice(discountedPrice)}
        </p>
        <p className={originalPriceClassName}>
          {formatPrice(normalPrice)}
        </p>
      </div>
    );
  }

  return (
    <p className={priceClassName}>
      {formatPrice(normalPrice)}
    </p>
  );
}
