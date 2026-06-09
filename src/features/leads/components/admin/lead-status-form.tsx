"use client";

import { LeadStatus } from "@prisma/client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateLeadStatusAction } from "@/src/features/leads/actions/leads.actions";
import type { LeadStatusActionState } from "@/src/features/leads/types/leads.types";

const initialState: LeadStatusActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const statusOptions = [
  { value: LeadStatus.NEW, label: "New" },
  { value: LeadStatus.CONTACTED, label: "Contacted" },
  { value: LeadStatus.QUALIFIED, label: "Qualified" },
  { value: LeadStatus.CLOSED, label: "Closed" },
  { value: LeadStatus.LOST, label: "Lost" },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-10 rounded-md bg-[#111827] px-4 text-sm font-bold text-white hover:bg-[#374151] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Updating..." : "Update status"}
    </button>
  );
}

type LeadStatusFormProps = {
  leadId: string;
  currentStatus: LeadStatus;
};

export function LeadStatusForm({
  leadId,
  currentStatus,
}: LeadStatusFormProps) {
  const updateAction = updateLeadStatusAction.bind(null, leadId);
  const [state, formAction] = useActionState(updateAction, initialState);
  const savedStatus = state.savedStatus ?? currentStatus;

  return (
    <form action={formAction} className="space-y-3">
      <label className="block space-y-2 text-sm font-semibold text-[#111827]">
        Status
        <select
          key={savedStatus}
          name="status"
          defaultValue={savedStatus}
          aria-invalid={Boolean(state.fieldErrors.status)}
          aria-describedby="lead-status-message"
          className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-normal"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <SubmitButton />
      {state.message ? (
        <p
          id="lead-status-message"
          role="status"
          className={`text-sm font-semibold ${
            state.success ? "text-[#166534]" : "text-[#B91C1C]"
          }`}
        >
          {state.fieldErrors.status ?? state.message}
        </p>
      ) : null}
    </form>
  );
}
