import {
  formatPrice,
  type PriceValue,
  toSafePriceNumber,
} from "@/src/features/products/utils/price";

type ProductPriceProps = {
  price: PriceValue;
  salePrice?: PriceValue;
};

export function ProductPrice({ price, salePrice }: ProductPriceProps) {
  const normalPrice = toSafePriceNumber(price);
  const discountedPrice = toSafePriceNumber(salePrice);

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
