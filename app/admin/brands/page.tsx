import type { Metadata } from "next";
import Link from "next/link";

import { DeleteBrandButton } from "@/src/features/brands/components/admin/delete-brand-button";
import { getAdminBrands } from "@/src/features/brands/services/brands.service";
import type { AdminBrandFilters } from "@/src/features/brands/types/brands.types";

export const metadata: Metadata = {
  title: "Brands | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminBrandsPageProps = {
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

function getPage(value: string | undefined): number {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function buildPageHref(filters: AdminBrandFilters, page: number): string {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  params.set("page", String(page));
  return `/admin/brands?${params.toString()}`;
}

export default async function AdminBrandsPage({
  searchParams,
}: AdminBrandsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters: AdminBrandFilters = {
    search: getSearchValue(resolvedSearchParams, "search"),
    page: getPage(getSearchValue(resolvedSearchParams, "page")),
    limit: 10,
  };
  const result = await getAdminBrands(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Brands</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Manage product brands used by the catalog and public filters.
          </p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7]"
        >
          Add brand
        </Link>
      </div>

      <form
        action="/admin/brands"
        className="grid gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4 sm:grid-cols-[1fr_auto]"
      >
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Search by name
          <input
            name="search"
            defaultValue={filters.search ?? ""}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="min-h-10 rounded-md bg-[#111827] px-4 text-sm font-bold text-white hover:bg-[#374151]"
          >
            Search
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        {result.brands.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
              <thead className="bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Logo URL</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {result.brands.map((brand) => (
                  <tr key={brand.id}>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#111827]">
                        {brand.name}
                      </div>
                      <div className="text-xs text-[#6B7280]">{brand.slug}</div>
                      {brand.description ? (
                        <div className="mt-1 max-w-xl text-xs text-[#6B7280]">
                          {brand.description}
                        </div>
                      ) : null}
                    </td>
                    <td className="max-w-64 truncate px-4 py-3 text-xs text-[#6B7280]">
                      {brand.logoUrl ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {brand._count.products}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <Link
                          href={`/admin/brands/${brand.id}/edit`}
                          className="text-sm font-bold text-[#0284C7] hover:text-[#0369A1]"
                        >
                          Edit
                        </Link>
                        <DeleteBrandButton
                          brandId={brand.id}
                          brandName={brand.name}
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
              No brands found
            </h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              Create a brand so products can be organized and filtered.
            </p>
            <Link
              href="/admin/brands/new"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7]"
            >
              Add brand
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
