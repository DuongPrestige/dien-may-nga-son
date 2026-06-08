import { LeadStatus } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";

import { LeadStatusBadge } from "@/src/features/leads/components/admin/lead-status-badge";
import { getAdminDashboardData } from "@/src/features/admin/services/dashboard.service";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

const leadStatusOrder = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
  LeadStatus.CLOSED,
  LeadStatus.LOST,
] as const;

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(value);
}

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardData();
  const kpiCards = [
    {
      label: "Total Products",
      value: dashboard.totals.products,
      href: "/admin/products",
    },
    {
      label: "Total Services",
      value: dashboard.totals.services,
      href: "/admin/services",
    },
    {
      label: "Total Blog Posts",
      value: dashboard.totals.posts,
      href: "/admin/blog",
    },
    {
      label: "Total Leads",
      value: dashboard.totals.leads,
      href: "/admin/leads",
    },
  ] as const;

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-bold uppercase text-[#0284C7]">Dashboard</p>
        <h2 className="mt-2 text-3xl font-bold text-[#111827]">
          Business overview
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6B7280]">
          Current catalog totals and lead activity for Điện Máy Nga Sơn.
        </p>
      </div>

      <section aria-labelledby="dashboard-totals">
        <h3 id="dashboard-totals" className="sr-only">
          Content totals
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-lg border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#0EA5E9]"
            >
              <p className="text-sm font-semibold text-[#6B7280]">
                {card.label}
              </p>
              <p className="mt-3 text-3xl font-bold text-[#111827]">
                {card.value}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section
          aria-labelledby="lead-status-metrics"
          className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6"
        >
          <div>
            <h3
              id="lead-status-metrics"
              className="text-lg font-bold text-[#111827]"
            >
              Lead status
            </h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              Current follow-up distribution across all leads.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {leadStatusOrder.map((status) => (
              <Link
                key={status}
                href={`/admin/leads?status=${status}`}
                className="rounded-md border border-[#E5E7EB] p-4 hover:bg-[#F8FAFC]"
              >
                <LeadStatusBadge status={status} />
                <p className="mt-3 text-2xl font-bold text-[#111827]">
                  {dashboard.leadMetrics[status]}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="lead-activity"
          className="rounded-lg border border-[#E5E7EB] bg-white p-5 sm:p-6"
        >
          <h3 id="lead-activity" className="text-lg font-bold text-[#111827]">
            Lead activity
          </h3>
          <dl className="mt-5 space-y-4">
            <div className="border-b border-[#E5E7EB] pb-4">
              <dt className="text-sm font-semibold text-[#6B7280]">
                Created today
              </dt>
              <dd className="mt-2 text-3xl font-bold text-[#111827]">
                {dashboard.leadsToday}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-[#6B7280]">
                Created last 7 days
              </dt>
              <dd className="mt-2 text-3xl font-bold text-[#111827]">
                {dashboard.leadsLast7Days}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-[#6B7280]">
                Created last 30 days
              </dt>
              <dd className="mt-2 text-3xl font-bold text-[#111827]">
                {dashboard.leadsLast30Days}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section
        aria-labelledby="recent-leads"
        className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <h3 id="recent-leads" className="text-lg font-bold text-[#111827]">
              Recent leads
            </h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              The five most recently submitted enquiries.
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="whitespace-nowrap text-sm font-bold text-[#0284C7] hover:text-[#0369A1]"
          >
            View all
          </Link>
        </div>

        {dashboard.recentLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
              <thead className="bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source Type</th>
                  <th className="px-4 py-3">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {dashboard.recentLeads.map((lead) => (
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
                    <td className="px-4 py-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {lead.sourceType ?? "Unknown"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#374151]">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-10 text-center">
            <h4 className="font-bold text-[#111827]">No leads yet</h4>
            <p className="mt-2 text-sm text-[#6B7280]">
              New public form submissions will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
