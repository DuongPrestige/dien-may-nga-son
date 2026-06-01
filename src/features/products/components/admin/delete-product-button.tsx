"use client";

import { useTransition } from "react";

import { deleteProductAction } from "@/src/features/products/actions/products.actions";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`,
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.set("id", productId);

    startTransition(() => {
      void deleteProductAction(formData);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm font-bold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Đang xóa..." : "Delete"}
    </button>
  );
}
