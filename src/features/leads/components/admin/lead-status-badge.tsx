import type { LeadStatus } from "@prisma/client";

const statusStyles: Record<LeadStatus, string> = {
  NEW: "bg-[#E0F2FE] text-[#0369A1]",
  CONTACTED: "bg-[#FEF3C7] text-[#92400E]",
  QUALIFIED: "bg-[#DCFCE7] text-[#166534]",
  CLOSED: "bg-[#E5E7EB] text-[#374151]",
  LOST: "bg-[#FEE2E2] text-[#991B1B]",
};

const statusLabels: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  CLOSED: "Closed",
  LOST: "Lost",
};

type LeadStatusBadgeProps = {
  status: LeadStatus;
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
