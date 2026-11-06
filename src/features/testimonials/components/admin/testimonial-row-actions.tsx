"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import {
  deleteTestimonialAction,
  toggleTestimonialActiveAction,
} from "@/src/features/testimonials/actions/testimonials.actions";
import type { TestimonialMutationResult } from "@/src/features/testimonials/types/testimonials.types";

type TestimonialRowActionsProps = {
  testimonialId: string;
  customerName: string;
  isActive: boolean;
};

export function TestimonialRowActions({
  testimonialId,
  customerName,
  isActive,
}: TestimonialRowActionsProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function runAction(
    action: (formData: FormData) => Promise<TestimonialMutationResult>,
    extraFields: Record<string, string> = {},
  ) {
    setMessage("");
    const formData = new FormData();
    formData.set("id", testimonialId);

    for (const [key, value] of Object.entries(extraFields)) {
      formData.set(key, value);
    }

    startTransition(async () => {
      const result = await action(formData);

      if (!result.success) {
        setMessage(result.message);
      }
    });
  }

  function handleToggle() {
    runAction(toggleTestimonialActiveAction, { isActive: String(!isActive) });
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa đánh giá của "${customerName}"?`,
    );

    if (confirmed) {
      runAction(deleteTestimonialAction);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start gap-3">
        <Link
          href={`/admin/testimonials/${testimonialId}/edit`}
          className="text-sm font-bold text-[#0369A1] hover:text-[#075985]"
        >
          Sửa
        </Link>
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          className="text-sm font-bold text-[#374151] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isActive ? "Tắt" : "Bật"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="text-sm font-bold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Xóa
        </button>
      </div>
      {message ? (
        <p className="mt-1 max-w-64 text-xs text-red-600" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
