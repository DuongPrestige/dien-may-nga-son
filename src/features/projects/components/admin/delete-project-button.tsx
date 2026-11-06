"use client";

import { useActionState } from "react";

import { deleteProjectAction } from "@/src/features/projects/actions/projects.actions";
import type { ProjectActionState } from "@/src/features/projects/types/projects.types";

type DeleteProjectButtonProps = {
  projectId: string;
  projectTitle: string;
};

const initialState: ProjectActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function DeleteProjectButton({
  projectId,
  projectTitle,
}: DeleteProjectButtonProps) {
  const [state, action, isPending] = useActionState(
    deleteProjectAction,
    initialState,
  );

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Xóa công trình "${projectTitle}"?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={projectId} />
      <button
        type="submit"
        disabled={isPending}
        title={state.message || undefined}
        className="text-sm font-bold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Đang xóa..." : "Xóa"}
      </button>
    </form>
  );
}
