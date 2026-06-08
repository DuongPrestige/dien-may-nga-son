"use client";

import { useState, useTransition } from "react";

import { deleteBrandAction } from "@/src/features/brands/actions/brands.actions";

type DeleteBrandButtonProps = {
  brandId: string;
  brandName: string;
};

export function DeleteBrandButton({
  brandId,
  brandName,
}: DeleteBrandButtonProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa thương hiệu "${brandName}"?`,
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    const formData = new FormData();
    formData.set("id", brandId);

    startTransition(async () => {
      const result = await deleteBrandAction(formData);

      if (!result.success) {
        setMessage(result.message);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-sm font-bold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Đang xóa..." : "Delete"}
      </button>
      {message ? (
        <p className="mt-1 max-w-64 text-xs text-red-600" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
