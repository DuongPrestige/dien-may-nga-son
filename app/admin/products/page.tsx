import { ProductStatus } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";

import { DeleteProductButton } from "@/src/features/products/components/admin/delete-product-button";
import { getAdminProducts } from "@/src/features/products/services/products.service";
import type { AdminProductFilters } from "@/src/features/products/types/products.types";

export const metadata: Metadata = {
  title: "Products | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = searchParams[key];

  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function getStatus(value: string | undefined): ProductStatus | undefined {
  if (value === ProductStatus.ACTIVE || value === ProductStatus.INACTIVE) {
    return value;
  }

  return undefined;
}

function getPage(value: string | undefined): number {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function formatPrice(value: { toNumber: () => number }): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value.toNumber());
}

function buildPageHref(filters: AdminProductFilters, page: number): string {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.categoryId) {
    params.set("categoryId", filters.categoryId);
  }

  if (filters.brandId) {
    params.set("brandId", filters.brandId);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  params.set("page", String(page));

  return `/admin/products?${params.toString()}`;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters: AdminProductFilters = {
    search: getSearchValue(resolvedSearchParams, "search"),
    categoryId: getSearchValue(resolvedSearchParams, "categoryId"),
    brandId: getSearchValue(resolvedSearchParams, "brandId"),
    status: getStatus(getSearchValue(resolvedSearchParams, "status")),
    page: getPage(getSearchValue(resolvedSearchParams, "page")),
    limit: 10,
  };
  const result = await getAdminProducts(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Products</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Manage product catalog content used by public product pages.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7]"
        >
          Add product
        </Link>
      </div>

      <form
        action="/admin/products"
        className="grid gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4 md:grid-cols-5"
      >
        <label className="space-y-2 text-sm font-semibold text-[#111827] md:col-span-2">
          Search by name
          <input
            name="search"
            defaultValue={filters.search ?? ""}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Category
          <select
            name="categoryId"
            defaultValue={filters.categoryId ?? ""}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
          >
            <option value="">All</option>
            {result.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Brand
          <select
            name="brandId"
            defaultValue={filters.brandId ?? ""}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
          >
            <option value="">All</option>
            {result.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Status
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
          >
            <option value="">All</option>
            <option value={ProductStatus.ACTIVE}>Active</option>
            <option value={ProductStatus.INACTIVE}>Inactive</option>
          </select>
        </label>
        <div className="md:col-span-5">
          <button
            type="submit"
            className="min-h-10 rounded-md bg-[#111827] px-4 text-sm font-bold text-white hover:bg-[#374151]"
          >
            Filter
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        {result.products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
              <thead className="bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {result.products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#111827]">
                        {product.name}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        {product.sku ? `${product.sku} · ` : ""}
                        {product.slug}
                        {product.isFeatured ? " · Featured" : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {product.category.name}
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {product.brand.name}
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {product.salePrice
                        ? formatPrice(product.salePrice)
                        : formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-[#F0F9FF] px-2 py-1 text-xs font-bold text-[#0284C7]">
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm font-bold text-[#0284C7] hover:text-[#0369A1]"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-lg font-bold text-[#111827]">
              No products found
            </h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              Create the first real product so it can appear on public product
              pages.
            </p>
            <Link
              href="/admin/products/new"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7]"
            >
              Add product
            </Link>
          </div>
        )}
      </div>

      {result.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3">
          <Link
            href={buildPageHref(filters, Math.max(1, result.page - 1))}
            className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
          >
            Previous
          </Link>
          <span className="text-sm font-semibold text-[#6B7280]">
            Page {result.page} of {result.totalPages}
          </span>
          <Link
            href={buildPageHref(
              filters,
              Math.min(result.totalPages, result.page + 1),
            )}
            className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
          >
            Next
          </Link>
        </div>
      ) : null}
    </div>
  );
}
