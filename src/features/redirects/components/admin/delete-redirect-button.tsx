"use client";

import { useState, useTransition } from "react";

import { deleteRedirectAction } from "@/src/features/redirects/actions/redirects.actions";

type DeleteRedirectButtonProps = {
  redirectId: string;
  sourcePath: string;
};

export function DeleteRedirectButton({
  redirectId,
  sourcePath,
}: DeleteRedirectButtonProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Xóa chuyển hướng từ "${sourcePath}"?`)) {
      return;
    }

    setMessage("");
    const formData = new FormData();
    formData.set("id", redirectId);

    startTransition(async () => {
      const result = await deleteRedirectAction(formData);

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
        <p className="mt-1 text-xs text-red-600" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
