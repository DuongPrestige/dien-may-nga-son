"use client";

import { useActionState } from "react";

import { createRedirectAction } from "@/src/features/redirects/actions/redirects.actions";
import type { RedirectActionState } from "@/src/features/redirects/types/redirects.types";

const initialState: RedirectActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function RedirectForm() {
  const [state, formAction, isPending] = useActionState(
    createRedirectAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6 lg:grid-cols-[1fr_1fr_auto]"
      noValidate
    >
      <PathField
        label="Source path"
        name="sourcePath"
        placeholder="/blog/old-post"
        error={state.fieldErrors.sourcePath}
        disabled={isPending}
      />
      <PathField
        label="Target path"
        name="targetPath"
        placeholder="/blog/new-post"
        error={state.fieldErrors.targetPath}
        disabled={isPending}
      />
      <div className="flex items-end">
        <button
          type="submit"
          disabled={isPending}
          className="min-h-11 w-full rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto"
        >
          {isPending ? "Đang tạo..." : "Create redirect"}
        </button>
      </div>
      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 lg:col-span-3">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

type PathFieldProps = {
  label: string;
  name: string;
  placeholder: string;
  error?: string;
  disabled?: boolean;
};

function PathField({
  label,
  name,
  placeholder,
  error,
  disabled,
}: PathFieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#111827]">
      {label}
      <input
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
      />
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
