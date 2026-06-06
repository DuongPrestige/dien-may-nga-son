"use client";

import { useTransition } from "react";

import { deleteBlogPostAction } from "@/src/features/blog/actions/blog.actions";

type DeleteBlogPostButtonProps = {
  postId: string;
  postTitle: string;
};

export function DeleteBlogPostButton({
  postId,
  postTitle,
}: DeleteBlogPostButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${postTitle}"?`,
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.set("id", postId);

    startTransition(() => {
      void deleteBlogPostAction(formData);
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
