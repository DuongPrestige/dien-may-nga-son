import { LeadStatus } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";

import { LeadStatusBadge } from "@/src/features/leads/components/admin/lead-status-badge";
import { getAdminLeads } from "@/src/features/leads/services/leads.service";
import type { AdminLeadFilters } from "@/src/features/leads/types/leads.types";

export const metadata: Metadata = {
  title: "Leads | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLeadsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const validStatuses = new Set<LeadStatus>(Object.values(LeadStatus));

function getSearchValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = searchParams[key];

  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function getStatus(value: string | undefined): LeadStatus | undefined {
  return value && validStatuses.has(value as LeadStatus)
    ? (value as LeadStatus)
    : undefined;
}

function getPage(value: string | undefined): number {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function buildPageHref(filters: AdminLeadFilters, page: number): string {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  params.set("page", String(page));

  return `/admin/leads?${params.toString()}`;
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminLeadsPage({
  searchParams,
}: AdminLeadsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters: AdminLeadFilters = {
    search: getSearchValue(resolvedSearchParams, "search"),
    status: getStatus(getSearchValue(resolvedSearchParams, "status")),
    page: getPage(getSearchValue(resolvedSearchParams, "page")),
    limit: 20,
  };
  const result = await getAdminLeads(filters);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Leads</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Review customer enquiries and track follow-up progress.
        </p>
      </div>

      <form
        action="/admin/leads"
        className="grid gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4 md:grid-cols-[1fr_14rem_auto]"
      >
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Search name, phone, or message
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
            <option value={LeadStatus.NEW}>New</option>
            <option value={LeadStatus.CONTACTED}>Contacted</option>
            <option value={LeadStatus.QUALIFIED}>Qualified</option>
            <option value={LeadStatus.CLOSED}>Closed</option>
            <option value={LeadStatus.LOST}>Lost</option>
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
        {result.leads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
              <thead className="bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Source Type</th>
                  <th className="px-4 py-3">Created Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {result.leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-bold text-[#0284C7] hover:text-[#0369A1]"
                      >
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      <a href={`tel:${lead.phone}`} className="hover:underline">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {lead.sourceType ?? "Unknown"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#374151]">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-lg font-bold text-[#111827]">
              No leads found
            </h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              Try changing the search or status filter.
            </p>
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
