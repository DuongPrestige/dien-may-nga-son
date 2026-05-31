"use client";

import type { LeadSourceType } from "@prisma/client";
import { useActionState, useEffect, useRef } from "react";

import { createLeadAction } from "@/src/features/leads/actions/leads.actions";
import type { LeadFormState } from "@/src/features/leads/types/leads.types";
import { cn } from "@/src/lib/utils";

type LeadFormProps = {
  sourceType: LeadSourceType;
  sourceUrl?: string;
  productId?: string;
  serviceId?: string;
  className?: string;
};

const initialState: LeadFormState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function LeadForm({
  sourceType,
  sourceUrl = "",
  productId = "",
  serviceId = "",
  className,
}: LeadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createLeadAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={cn("space-y-4", className)}
      noValidate
    >
      <input type="hidden" name="sourceType" value={sourceType} />
      <input type="hidden" name="sourceUrl" value={sourceUrl} />
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="serviceId" value={serviceId} />

      <div className="space-y-2">
        <label htmlFor="lead-name" className="text-sm font-semibold">
          Họ tên
        </label>
        <input
          id="lead-name"
          name="name"
          type="text"
          autoComplete="name"
          className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm outline-none transition-colors focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
          aria-invalid={Boolean(state.fieldErrors.name)}
          aria-describedby={
            state.fieldErrors.name ? "lead-name-error" : undefined
          }
          disabled={isPending}
        />
        {state.fieldErrors.name ? (
          <p id="lead-name-error" className="text-sm text-red-600">
            {state.fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="lead-phone" className="text-sm font-semibold">
          Số điện thoại
        </label>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm outline-none transition-colors focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
          aria-invalid={Boolean(state.fieldErrors.phone)}
          aria-describedby={
            state.fieldErrors.phone ? "lead-phone-error" : undefined
          }
          disabled={isPending}
        />
        {state.fieldErrors.phone ? (
          <p id="lead-phone-error" className="text-sm text-red-600">
            {state.fieldErrors.phone}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="lead-message" className="text-sm font-semibold">
          Nội dung
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          className="w-full resize-y rounded-md border border-[#E5E7EB] px-3 py-2 text-sm outline-none transition-colors focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
          aria-invalid={Boolean(state.fieldErrors.message)}
          aria-describedby={
            state.fieldErrors.message ? "lead-message-error" : undefined
          }
          disabled={isPending}
        />
        {state.fieldErrors.message ? (
          <p id="lead-message-error" className="text-sm text-red-600">
            {state.fieldErrors.message}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p
          className={cn(
            "rounded-md px-3 py-2 text-sm",
            state.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700",
          )}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-md bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
      >
        {isPending ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
      </button>
    </form>
  );
}
