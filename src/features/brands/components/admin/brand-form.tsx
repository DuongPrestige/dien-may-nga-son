"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createBrandAction,
  updateBrandAction,
} from "@/src/features/brands/actions/brands.actions";
import type {
  AdminBrandDetail,
  BrandActionState,
} from "@/src/features/brands/types/brands.types";

type BrandFormProps = {
  brand?: AdminBrandDetail;
};

const initialState: BrandActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function BrandForm({ brand }: BrandFormProps) {
  const action = brand
    ? updateBrandAction.bind(null, brand.id)
    : createBrandAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isEditing = Boolean(brand);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Name"
          name="name"
          defaultValue={brand?.name}
          error={state.fieldErrors.name}
          disabled={isPending}
          required
        />
        <Field
          label="Slug"
          name="slug"
          defaultValue={brand?.slug}
          error={state.fieldErrors.slug}
          disabled={isPending}
          required
        />
        <Field
          label="Logo URL"
          name="logoUrl"
          defaultValue={brand?.logoUrl ?? ""}
          error={state.fieldErrors.logoUrl}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <label className="space-y-2 text-sm font-semibold text-[#111827] lg:col-span-2">
          Description
          <textarea
            name="description"
            rows={5}
            defaultValue={brand?.description ?? ""}
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
              ? "Cập nhật thương hiệu"
              : "Tạo thương hiệu"}
        </button>
        <Link
          href="/admin/brands"
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
  className?: string;
};

function Field({
  label,
  name,
  defaultValue = "",
  error,
  disabled,
  required,
  className = "",
}: FieldProps) {
  return (
    <label
      className={`space-y-2 text-sm font-semibold text-[#111827] ${className}`}
    >
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
