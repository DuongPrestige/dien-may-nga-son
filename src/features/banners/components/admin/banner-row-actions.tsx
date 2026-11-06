"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import {
  deleteBannerAction,
  toggleBannerActiveAction,
} from "@/src/features/banners/actions/banners.actions";
import type { BannerMutationResult } from "@/src/features/banners/types/banners.types";

type BannerRowActionsProps = {
  bannerId: string;
  bannerTitle: string;
  isActive: boolean;
};

export function BannerRowActions({
  bannerId,
  bannerTitle,
  isActive,
}: BannerRowActionsProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function runAction(
    action: (formData: FormData) => Promise<BannerMutationResult>,
    extraFields: Record<string, string> = {},
  ) {
    setMessage("");
    const formData = new FormData();
    formData.set("id", bannerId);

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
    runAction(toggleBannerActiveAction, { isActive: String(!isActive) });
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa banner "${bannerTitle}"?`,
    );

    if (confirmed) {
      runAction(deleteBannerAction);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start gap-3">
        <Link
          href={`/admin/banners/${bannerId}/edit`}
          className="text-sm font-bold text-[#0284C7] hover:text-[#0369A1]"
        >
          Edit
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
          Delete
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
