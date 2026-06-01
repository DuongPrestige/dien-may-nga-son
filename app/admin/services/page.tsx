import { ProductStatus } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";

import { DeleteServiceButton } from "@/src/features/services/components/admin/delete-service-button";
import { getAdminServices } from "@/src/features/services/services/services.service";
import type { AdminServiceFilters } from "@/src/features/services/types/services.types";

export const metadata: Metadata = {
  title: "Services | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminServicesPageProps = {
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

function buildPageHref(filters: AdminServiceFilters, page: number): string {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  params.set("page", String(page));

  return `/admin/services?${params.toString()}`;
}

export default async function AdminServicesPage({
  searchParams,
}: AdminServicesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters: AdminServiceFilters = {
    search: getSearchValue(resolvedSearchParams, "search"),
    status: getStatus(getSearchValue(resolvedSearchParams, "status")),
    page: getPage(getSearchValue(resolvedSearchParams, "page")),
    limit: 10,
  };
  const result = await getAdminServices(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Services</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Manage service landing pages used by the public website.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7]"
        >
          Add service
        </Link>
      </div>

      <form
        action="/admin/services"
        className="grid gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4 md:grid-cols-[1fr_14rem_auto]"
      >
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Search
          <input
            name="search"
            defaultValue={filters.search ?? ""}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
          />
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
        <div className="flex items-end">
          <button
            type="submit"
            className="min-h-10 rounded-md bg-[#111827] px-4 text-sm font-bold text-white hover:bg-[#374151]"
          >
            Filter
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        {result.services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
              <thead className="bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {result.services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#111827]">
                        {service.name}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        {service.slug}
                      </div>
                      {service.shortDescription ? (
                        <div className="mt-1 max-w-xl text-xs text-[#6B7280]">
                          {service.shortDescription}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {service.isFeatured ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-[#F0F9FF] px-2 py-1 text-xs font-bold text-[#0284C7]">
                        {service.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className="text-sm font-bold text-[#0284C7] hover:text-[#0369A1]"
                        >
                          Edit
                        </Link>
                        <DeleteServiceButton
                          serviceId={service.id}
                          serviceName={service.name}
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
              No services found
            </h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              Create the first service page for repair, maintenance, or
              installation content.
            </p>
            <Link
              href="/admin/services/new"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7]"
            >
              Add service
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
