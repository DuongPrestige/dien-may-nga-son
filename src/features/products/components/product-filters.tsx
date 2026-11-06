import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import {
  AIR_CONDITIONER_CAPACITIES,
  AIR_CONDITIONER_CATEGORY_SLUG,
} from "@/src/features/products/lib/product-highlights";
import type {
  ProductFilters as ProductFilterValues,
  ProductListResult,
} from "@/src/features/products/types/products.types";

type ProductFilterPanelProps = {
  filters: ProductFilterValues;
  categories: ProductListResult["categories"];
  brands: ProductListResult["brands"];
};

type FilterOverrides = Partial<
  Pick<ProductFilterValues, "category" | "capacity">
>;

function buildFilterHref(
  filters: ProductFilterValues,
  overrides: FilterOverrides,
): string {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (next.category) {
    params.set("category", next.category);
  }

  if (next.capacity) {
    params.set("capacity", String(next.capacity));
  }

  if (next.brand) {
    params.set("brand", next.brand);
  }

  if (next.minPrice !== undefined) {
    params.set("minPrice", String(next.minPrice));
  }

  if (next.maxPrice !== undefined) {
    params.set("maxPrice", String(next.maxPrice));
  }

  if (next.sort && next.sort !== "latest") {
    params.set("sort", next.sort);
  }

  const query = params.toString();
  return query ? `/products?${query}#danh-sach` : "/products#danh-sach";
}

function chipClassName(isActive: boolean): string {
  return `inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors ${
    isActive
      ? "border-[#0284C7] bg-[#0284C7] text-white"
      : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#0EA5E9] hover:text-[#0284C7]"
  }`;
}

export function ProductFilterPanel({
  filters,
  categories,
  brands,
}: ProductFilterPanelProps) {
  const showCapacityChips =
    !filters.category || filters.category === AIR_CONDITIONER_CATEGORY_SLUG;
  const hasAdvancedFilter =
    Boolean(filters.brand) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    (filters.sort !== undefined && filters.sort !== "latest");

  return (
    <div className="space-y-4">
      <nav aria-label="Lọc theo danh mục">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <li>
            <Link
              href={buildFilterHref(filters, {
                category: undefined,
                capacity: undefined,
              })}
              aria-current={!filters.category ? "page" : undefined}
              className={chipClassName(!filters.category)}
            >
              Tất cả
            </Link>
          </li>
          {categories.map((category) => {
            const isActive = filters.category === category.slug;

            return (
              <li key={category.slug}>
                <Link
                  href={buildFilterHref(filters, {
                    category: category.slug,
                    capacity:
                      category.slug === AIR_CONDITIONER_CATEGORY_SLUG
                        ? filters.capacity
                        : undefined,
                  })}
                  aria-current={isActive ? "page" : undefined}
                  className={chipClassName(isActive)}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {showCapacityChips ? (
        <div className="rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-3 sm:p-4">
          <p className="text-sm font-bold text-[#0C4A6E]">
            Chọn điều hòa theo diện tích phòng
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {AIR_CONDITIONER_CAPACITIES.map((option) => {
              const isActive = filters.capacity === option.btu;

              return (
                <li key={option.btu}>
                  <Link
                    href={buildFilterHref(filters, {
                      category: AIR_CONDITIONER_CATEGORY_SLUG,
                      capacity: isActive ? undefined : option.btu,
                    })}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex min-h-14 flex-col justify-center rounded-lg border px-3 py-2 transition-colors ${
                      isActive
                        ? "border-[#0284C7] bg-[#0284C7] text-white"
                        : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#0EA5E9]"
                    }`}
                  >
                    <span className="text-sm font-bold">
                      Phòng {option.roomSize.charAt(0).toLowerCase()}
                      {option.roomSize.slice(1)}
                    </span>
                    <span
                      className={`text-xs ${isActive ? "text-sky-100" : "text-[#6B7280]"}`}
                    >
                      {option.btu.toLocaleString("vi-VN")} BTU ·{" "}
                      {option.horsepower}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <details
        className="group rounded-xl border border-[#E5E7EB] bg-white"
        open={hasAdvancedFilter}
      >
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 text-sm font-bold text-[#111827] [&::-webkit-details-marker]:hidden">
          <SlidersHorizontal
            aria-hidden="true"
            className="h-4 w-4 text-[#0284C7]"
          />
          Lọc thêm: thương hiệu, giá, sắp xếp
          <span className="ml-auto text-xs font-semibold text-[#0284C7] group-open:hidden">
            Mở
          </span>
          <span className="ml-auto hidden text-xs font-semibold text-[#0284C7] group-open:inline">
            Đóng
          </span>
        </summary>
        <form
          action="/products"
          className="grid gap-3 border-t border-[#E5E7EB] p-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {filters.category ? (
            <input type="hidden" name="category" value={filters.category} />
          ) : null}
          {filters.capacity ? (
            <input
              type="hidden"
              name="capacity"
              value={String(filters.capacity)}
            />
          ) : null}
          <label className="space-y-2 text-sm font-semibold text-[#111827]">
            Thương hiệu
            <select
              name="brand"
              defaultValue={filters.brand ?? ""}
              className="min-h-11 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm font-normal"
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
            Giá từ (đ)
            <input
              name="minPrice"
              type="number"
              min="0"
              step="100000"
              inputMode="numeric"
              defaultValue={filters.minPrice ?? ""}
              className="min-h-11 w-full rounded-md border border-[#E5E7EB] px-3 text-sm font-normal"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold text-[#111827]">
            Giá đến (đ)
            <input
              name="maxPrice"
              type="number"
              min="0"
              step="100000"
              inputMode="numeric"
              defaultValue={filters.maxPrice ?? ""}
              className="min-h-11 w-full rounded-md border border-[#E5E7EB] px-3 text-sm font-normal"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold text-[#111827]">
            Sắp xếp
            <select
              name="sort"
              defaultValue={filters.sort}
              className="min-h-11 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm font-normal"
            >
              <option value="latest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="min-h-11 w-full rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7]"
            >
              Áp dụng
            </button>
          </div>
        </form>
      </details>
    </div>
  );
}
