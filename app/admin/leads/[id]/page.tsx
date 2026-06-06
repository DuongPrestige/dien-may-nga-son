import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LeadStatusBadge } from "@/src/features/leads/components/admin/lead-status-badge";
import { LeadStatusForm } from "@/src/features/leads/components/admin/lead-status-form";
import { getLeadById } from "@/src/features/leads/services/leads.service";

export const metadata: Metadata = {
  title: "Lead Details | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLeadDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(value);
}

function getSafeSourceHref(value: string | null): string | null {
  if (!value) {
    return null;
  }

  if (value.startsWith("/")) {
    return value;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

export default async function AdminLeadDetailPage({
  params,
}: AdminLeadDetailPageProps) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  const sourceHref = getSafeSourceHref(lead.sourceUrl);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/leads"
          className="text-sm font-bold text-[#0284C7] hover:text-[#0369A1]"
        >
          Back to leads
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold text-[#111827]">{lead.name}</h2>
          <LeadStatusBadge status={lead.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-lg border border-[#E5E7EB] bg-white">
          <dl className="divide-y divide-[#E5E7EB]">
            <DetailRow label="Name" value={lead.name} />
            <DetailRow
              label="Phone"
              value={
                <a
                  href={`tel:${lead.phone}`}
                  className="font-bold text-[#0284C7] hover:underline"
                >
                  {lead.phone}
                </a>
              }
            />
            <DetailRow
              label="Message"
              value={
                <span className="whitespace-pre-wrap">
                  {lead.message ?? "No message provided"}
                </span>
              }
            />
            <DetailRow
              label="Source Type"
              value={lead.sourceType ?? "Unknown"}
            />
            <DetailRow
              label="Source URL"
              value={
                sourceHref ? (
                  <Link
                    href={sourceHref}
                    className="break-all font-bold text-[#0284C7] hover:underline"
                  >
                    {lead.sourceUrl}
                  </Link>
                ) : (
                  <span className="break-all">
                    {lead.sourceUrl ?? "Not available"}
                  </span>
                )
              }
            />
            <DetailRow
              label="Product / Service"
              value={
                lead.product ? (
                  <Link
                    href={`/products/${lead.product.slug}`}
                    className="font-bold text-[#0284C7] hover:underline"
                  >
                    Product: {lead.product.name}
                  </Link>
                ) : lead.service ? (
                  <Link
                    href={`/services/${lead.service.slug}`}
                    className="font-bold text-[#0284C7] hover:underline"
                  >
                    Service: {lead.service.name}
                  </Link>
                ) : (
                  "Not available"
                )
              }
            />
            <DetailRow label="Created At" value={formatDate(lead.createdAt)} />
            <DetailRow
              label="Status"
              value={<LeadStatusBadge status={lead.status} />}
            />
          </dl>
        </section>

        <aside className="h-fit rounded-lg border border-[#E5E7EB] bg-white p-5">
          <h3 className="text-lg font-bold text-[#111827]">Update status</h3>
          <p className="mb-4 mt-1 text-sm text-[#6B7280]">
            Keep the follow-up state current for other admin users.
          </p>
          <LeadStatusForm leadId={lead.id} currentStatus={lead.status} />
        </aside>
      </div>
    </div>
  );
}

type DetailRowProps = {
  label: string;
  value: React.ReactNode;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm font-bold text-[#6B7280]">{label}</dt>
      <dd className="min-w-0 text-sm text-[#111827]">{value}</dd>
    </div>
  );
}
