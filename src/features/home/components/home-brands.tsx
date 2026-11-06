import Image from "next/image";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import type { PublicBrand } from "@/src/features/brands/services/brands.service";
import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";

type HomeBrandsProps = {
  brands: PublicBrand[];
};

export function HomeBrands({ brands }: HomeBrandsProps) {
  if (brands.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="home-brands-heading"
      className="border-y border-[#E5E7EB] bg-white py-6 sm:py-8"
    >
      <Container>
        <h2
          id="home-brands-heading"
          className="text-center text-sm font-semibold text-[#6B7280]"
        >
          Thương hiệu đang kinh doanh
        </h2>
        <ul className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
          {brands.map((brand) => {
            const logoSrc = getSafeImageSrc(brand.logoUrl);

            return (
              <li key={brand.slug}>
                <Link
                  href={`/products?brand=${brand.slug}#danh-sach`}
                  className="flex h-12 min-w-24 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-bold text-[#334155] transition-colors hover:border-[#0EA5E9] hover:text-[#0284C7]"
                >
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={brand.name}
                      width={96}
                      height={32}
                      unoptimized={shouldUseUnoptimizedImage(logoSrc)}
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    brand.name
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
