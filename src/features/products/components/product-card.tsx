import Link from "next/link";

import { ProductImage } from "@/src/features/products/components/product-image";
import { ProductPrice } from "@/src/features/products/components/product-price";
import type { ProductCardData } from "@/src/features/products/types/products.types";

type ProductCardProps = {
  product: ProductCardData;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-[#0EA5E9]">
      <ProductImage src={product.thumbnailUrl} alt={product.name} />
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs font-semibold text-[#0284C7]">
          {product.brand.name} · {product.category.name}
        </p>
        <h2 className="mt-2 text-lg font-bold leading-7 text-[#111827]">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h2>
        {product.shortDescription ? (
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            {product.shortDescription}
          </p>
        ) : null}
        {product.specs.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm text-[#374151]">
            {product.specs.map((spec) => (
              <li key={`${product.id}-${spec.specName}`}>
                <span className="font-semibold">{spec.specName}:</span>{" "}
                {spec.specValue}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4">
          <ProductPrice price={product.price} salePrice={product.salePrice} />
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <a
            href="tel:#"
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#F97316] px-3 text-sm font-bold text-white hover:bg-[#ea580c]"
          >
            Gọi
          </a>
          <a
            href="#"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#0EA5E9] px-3 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
          >
            Zalo
          </a>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#E5E7EB] px-3 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}

