import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { ProductImage } from "@/src/features/products/components/product-image";
import { ProductPrice } from "@/src/features/products/components/product-price";
import {
  getDiscountPercent,
  getProductHighlights,
} from "@/src/features/products/lib/product-highlights";
import type { ProductCardData } from "@/src/features/products/types/products.types";
import type { StoreContactLinks } from "@/src/features/settings/lib/store-contact";

type ProductCardProps = {
  product: ProductCardData;
  contactLinks: StoreContactLinks;
  headingLevel?: "h2" | "h3";
};

export function ProductCard({
  product,
  contactLinks,
  headingLevel: Heading = "h2",
}: ProductCardProps) {
  const detailHref = `/products/${product.slug}`;
  const discountPercent = getDiscountPercent(product.price, product.salePrice);
  const highlights = getProductHighlights(product);

  return (
    <article className="group flex h-full flex-col rounded-xl border border-[#E5E7EB] bg-white p-2.5 transition-[border-color,box-shadow] duration-200 hover:border-[#7DD3FC] hover:shadow-[0_12px_32px_rgba(14,165,233,0.12)] sm:p-4">
      <Link
        href={detailHref}
        className="relative block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage
          src={product.thumbnailUrl}
          alt=""
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
        />
        {discountPercent ? (
          <span className="absolute left-2 top-2 rounded-md bg-[#DC2626] px-1.5 py-0.5 text-xs font-bold text-white">
            -{discountPercent}%
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <p className="text-xs font-semibold text-[#0369A1]">
          {product.brand.name}
        </p>
        <Heading className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-[#111827] sm:text-base sm:leading-6">
          <Link href={detailHref} className="hover:text-[#075985]">
            {product.name}
          </Link>
        </Heading>

        {highlights.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-1">
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[11px] font-medium leading-4 text-[#334155] sm:text-xs"
              >
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-3">
          <ProductPrice
            price={product.price}
            salePrice={product.salePrice}
            size="compact"
          />
        </div>

        <div className="mt-3 flex gap-2">
          <a
            href={contactLinks.phoneHref}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#C2410C] px-2 text-sm font-bold text-white transition-colors hover:bg-[#9A3412]"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            Gọi
          </a>
          <a
            href={contactLinks.zaloHref}
            aria-label={`Nhắn Zalo hỏi giá ${product.name}`}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-md border border-[#0EA5E9] px-2 text-sm font-bold text-[#0369A1] transition-colors hover:bg-[#F0F9FF] sm:flex-1"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">Zalo</span>
          </a>
        </div>
      </div>
    </article>
  );
}
