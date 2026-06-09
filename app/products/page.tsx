import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { ProductCard } from "@/src/features/products/components/product-card";
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
    minPrice: parsePrice(getSearchValue(resolvedSearchParams, "minPrice")),
    maxPrice: parsePrice(getSearchValue(resolvedSearchParams, "maxPrice")),
    sort: parseSort(getSearchValue(resolvedSearchParams, "sort")) ?? "latest",
    page: 1,
    limit: 12,
  };
  const [{ products, categories, brands }, contactLinks] = await Promise.all([
    getSafeProducts(filters),
    getStoreContactLinks(),
  ]);

  return (
    <>
      <Section className="bg-[#F8FAFC] py-10 sm:py-14">
        <Container>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl font-bold leading-tight text-[#111827] sm:text-5xl">
              Sản phẩm điện máy tại Điện Máy Nga Sơn
            </h1>
            <p className="text-base leading-7 text-[#6B7280]">
              Điện Máy Nga Sơn tập trung tư vấn điều hòa cho gia đình tại Kinh
              Môn, đồng thời giới thiệu thêm tivi, tủ lạnh và máy giặt phù hợp
              nhu cầu sử dụng hằng ngày.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <form
            action="/products"
            className="grid gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4 md:grid-cols-5"
          >
            <label className="space-y-2 text-sm font-semibold text-[#111827]">
              Danh mục
              <select
                name="category"
                defaultValue={filters.category ?? ""}
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
              >
                <option value="">Tất cả</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#111827]">
              Thương hiệu
              <select
                name="brand"
                defaultValue={filters.brand ?? ""}
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
              >
                <option value="">Tất cả</option>
                {brands.map((brand) => (
                  <option key={brand.slug} value={brand.slug}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#111827]">
              Giá từ
              <input
                name="minPrice"
                type="number"
                min="0"
                defaultValue={filters.minPrice ?? ""}
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#111827]">
              Giá đến
              <input
                name="maxPrice"
                type="number"
                min="0"
                defaultValue={filters.maxPrice ?? ""}
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#111827]">
              Sắp xếp
              <select
                name="sort"
                defaultValue={filters.sort}
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
              >
                <option value="latest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
              </select>
            </label>
            <div className="md:col-span-5">
              <button
                type="submit"
                className="min-h-11 rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7]"
              >
                Lọc sản phẩm
              </button>
            </div>
          </form>

          {products.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                Danh mục sản phẩm đang được cập nhật. Bạn vẫn có thể gọi hoặc
                gửi yêu cầu báo giá để được tư vấn điều hòa, tivi, tủ lạnh hoặc
                máy giặt phù hợp.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={contactLinks.phoneHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
                >
                  Gọi ngay
                </a>
                <Link
                  href="/#bao-gia"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-5 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
                >
                  Gửi yêu cầu báo giá
                </Link>
              </div>
            </div>
          )}
        </Container>
      </Section>

      <Section className="bg-[#F8FAFC]">
        <Container>
          <div className="rounded-lg border border-[#BAE6FD] bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#111827]">
              Cần tư vấn chọn sản phẩm?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
              Điện Máy Nga Sơn ưu tiên tư vấn nhanh, báo giá rõ ràng và hỗ trợ
              khách hàng địa phương tại Kinh Môn, Hải Dương.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={contactLinks.phoneHref}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
              >
                Gọi ngay
              </a>
              <a
                href={contactLinks.zaloHref}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-5 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
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
