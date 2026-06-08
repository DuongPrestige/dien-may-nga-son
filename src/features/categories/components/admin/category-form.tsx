"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createCategoryAction,
  updateCategoryAction,
} from "@/src/features/categories/actions/categories.actions";
import type {
  AdminCategoryDetail,
  CategoryActionState,
} from "@/src/features/categories/types/categories.types";

type CategoryFormProps = {
  category?: AdminCategoryDetail;
};

const initialState: CategoryActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function CategoryForm({ category }: CategoryFormProps) {
  const action = category
    ? updateCategoryAction.bind(null, category.id)
    : createCategoryAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isEditing = Boolean(category);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Name"
          name="name"
          defaultValue={category?.name}
          error={state.fieldErrors.name}
          disabled={isPending}
          required
        />
        <Field
          label="Slug"
          name="slug"
          defaultValue={category?.slug}
          error={state.fieldErrors.slug}
          disabled={isPending}
          required
        />
        <label className="space-y-2 text-sm font-semibold text-[#111827] lg:col-span-2">
          Description
          <textarea
            name="description"
            rows={5}
            defaultValue={category?.description ?? ""}
            disabled={isPending}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
          />
          {state.fieldErrors.description ? (
            <p className="text-sm font-normal text-red-600">
              {state.fieldErrors.description}
            </p>
          ) : null}
        </label>
      </div>

      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending
            ? "Đang lưu..."
            : isEditing
              ? "Cập nhật danh mục"
              : "Tạo danh mục"}
        </button>
        <Link
          href="/admin/categories"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#E5E7EB] px-5 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
};

function Field({
  label,
  name,
  defaultValue = "",
  error,
  disabled,
  required,
}: FieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#111827]">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
      />
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
