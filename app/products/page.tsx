import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { BannerStrip } from "@/src/features/banners/components/banner-strip";
import { ProductCard } from "@/src/features/products/components/product-card";
import { AcBuyingGuide } from "@/src/features/products/components/ac-buying-guide";
import { ProductFilterPanel } from "@/src/features/products/components/product-filters";
import {
  AIR_CONDITIONER_CAPACITIES,
  AIR_CONDITIONER_CATEGORY_SLUG,
} from "@/src/features/products/lib/product-highlights";
import { getProducts } from "@/src/features/products/services/products.service";
import type {
  ProductFilters,
  ProductListResult,
  ProductSort,
} from "@/src/features/products/types/products.types";
import { getStoreContactLinks } from "@/src/features/settings/services/settings.service";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sản phẩm điện máy | Điện Máy Nga Sơn",
  description:
    "Danh mục điều hòa, tivi, tủ lạnh, máy giặt tại Điện Máy Nga Sơn. Tư vấn nhanh cho khách hàng Kinh Môn, Hải Dương.",
  path: "/products",
});

export const revalidate = 300;

type ProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const emptyProductList: ProductListResult = {
  products: [],
  categories: [],
  brands: [],
};

function getSearchValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = searchParams[key];

  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function parsePrice(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const price = Number(value);

  return Number.isFinite(price) && price >= 0 ? price : undefined;
}

function parseCapacity(value: string | undefined): number | undefined {
  const capacity = Number(value);

  return AIR_CONDITIONER_CAPACITIES.some((option) => option.btu === capacity)
    ? capacity
    : undefined;
}

function parseSort(value: string | undefined): ProductSort | undefined {
  if (value === "price_asc" || value === "price_desc" || value === "latest") {
    return value;
  }

  return undefined;
}

async function getSafeProducts(
  filters: ProductFilters,
): Promise<ProductListResult> {
  try {
    return await getProducts(filters);
  } catch {
    return emptyProductList;
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters: ProductFilters = {
    category: getSearchValue(resolvedSearchParams, "category"),
    brand: getSearchValue(resolvedSearchParams, "brand"),
    capacity: parseCapacity(getSearchValue(resolvedSearchParams, "capacity")),
    minPrice: parsePrice(getSearchValue(resolvedSearchParams, "minPrice")),
    maxPrice: parsePrice(getSearchValue(resolvedSearchParams, "maxPrice")),
    sort: parseSort(getSearchValue(resolvedSearchParams, "sort")) ?? "latest",
    page: 1,
    limit: 12,
  };
  const showAcGuide =
    !filters.category || filters.category === AIR_CONDITIONER_CATEGORY_SLUG;
  const [{ products, categories, brands }, contactLinks] = await Promise.all([
    getSafeProducts(filters),
    getStoreContactLinks(),
  ]);

  return (
    <>
      <Section padding="none" className="bg-[#F8FAFC] py-6 sm:py-10">
        <Container>
          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl font-bold leading-tight text-[#111827] sm:text-4xl">
              Điều hòa, điện máy chính hãng tại Kinh Môn
            </h1>
            <p className="text-sm leading-6 text-[#6B7280] sm:text-base">
              Chọn điều hòa đúng công suất cho từng phòng.
            </p>
          </div>
        </Container>
      </Section>

      <Section
        id="danh-sach"
        padding="none"
        className="scroll-mt-20 py-6 sm:py-10"
      >
        <Container>
          <BannerStrip position="products" className="mb-6" />
          <ProductFilterPanel
            filters={filters}
            categories={categories}
            brands={brands}
          />

          {products.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  contactLinks={contactLinks}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-6 text-center">
              <h2 className="text-xl font-bold text-[#111827]">
                Chưa có sản phẩm phù hợp
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                Chưa có mẫu phù hợp bộ lọc. Gọi để cửa hàng tư vấn mẫu khác.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={contactLinks.phoneHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md cta-orange px-5 text-sm font-bold text-white"
                >
                  Gọi ngay
                </a>
                <Link
                  href="/#bao-gia"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-5 text-sm font-bold text-[#0369A1] hover:bg-[#E0F2FE]"
                >
                  Gửi yêu cầu báo giá
                </Link>
              </div>
            </div>
          )}

          {showAcGuide ? (
            <div className="mt-8">
              <AcBuyingGuide />
            </div>
          ) : null}
        </Container>
      </Section>

      <Section className="bg-[#F8FAFC]">
        <Container>
          <div className="rounded-lg border border-[#BAE6FD] bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#111827]">
              Cần tư vấn chọn sản phẩm?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
              Gọi hoặc nhắn Zalo để được tư vấn nhanh, báo giá rõ ràng.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={contactLinks.phoneHref}
                className="inline-flex min-h-11 items-center justify-center rounded-md cta-orange px-5 text-sm font-bold text-white"
              >
                Gọi ngay
              </a>
              <a
                href={contactLinks.zaloHref}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-5 text-sm font-bold text-[#0369A1] hover:bg-[#E0F2FE]"
              >
                Nhắn Zalo
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
