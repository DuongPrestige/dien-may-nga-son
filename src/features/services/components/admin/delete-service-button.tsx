"use client";

import { useTransition } from "react";

import { deleteServiceAction } from "@/src/features/services/actions/services.actions";

type DeleteServiceButtonProps = {
  serviceId: string;
  serviceName: string;
};

export function DeleteServiceButton({
  serviceId,
  serviceName,
}: DeleteServiceButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${serviceName}"?`,
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.set("id", serviceId);

    startTransition(() => {
      void deleteServiceAction(formData);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm font-bold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
