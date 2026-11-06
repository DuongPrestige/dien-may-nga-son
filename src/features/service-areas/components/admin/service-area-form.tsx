"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createServiceAreaAction,
  updateServiceAreaAction,
} from "@/src/features/service-areas/actions/service-areas.actions";
import type {
  AdminServiceAreaDetail,
  ServiceAreaActionState,
} from "@/src/features/service-areas/types/service-areas.types";
import { usePreservedFormAction } from "@/src/hooks/use-preserved-form-action";

type ServiceAreaFormProps = {
  area?: AdminServiceAreaDetail;
};

const initialState: ServiceAreaActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const inputClassName =
  "w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0284C7]/20";

export function ServiceAreaForm({ area }: ServiceAreaFormProps) {
  const action = area
    ? updateServiceAreaAction.bind(null, area.id)
    : createServiceAreaAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const handleSubmit = usePreservedFormAction(formAction);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Tên khu vực"
          name="name"
          defaultValue={area?.name}
          placeholder="Ví dụ: Quang Thành"
          error={state.fieldErrors.name}
          disabled={isPending}
          required
        />
        <Field
          label="Slug (để trống sẽ tự tạo từ tên)"
          name="slug"
          defaultValue={area?.slug}
          placeholder="quang-thanh"
          error={state.fieldErrors.slug}
          disabled={isPending}
        />
        <TextAreaField
          label="Mô tả ngắn (1 câu, hiển thị dưới tiêu đề trang)"
          name="description"
          defaultValue={area?.description ?? ""}
          error={state.fieldErrors.description}
          disabled={isPending}
          rows={2}
        />
        <Field
          label="Thứ tự (số nhỏ hiển thị trước)"
          name="sortOrder"
          type="number"
          defaultValue={String(area?.sortOrder ?? 0)}
          error={state.fieldErrors.sortOrder}
          disabled={isPending}
        />
        <Field
          label="SEO title"
          name="seoTitle"
          defaultValue={area?.seoTitle ?? ""}
          placeholder="Sửa, lắp điều hòa tại Quang Thành | Điện Máy Nga Sơn"
          error={state.fieldErrors.seoTitle}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <TextAreaField
          label="SEO description"
          name="seoDescription"
          defaultValue={area?.seoDescription ?? ""}
          error={state.fieldErrors.seoDescription}
          disabled={isPending}
          rows={3}
        />
        <label className="flex items-center gap-3 text-sm font-semibold text-[#111827] lg:col-span-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={area?.isActive ?? true}
            disabled={isPending}
            className="h-4 w-4 rounded border-[#E5E7EB] accent-[#0EA5E9]"
          />
          Đang hiển thị trên website
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
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending
            ? "Đang lưu..."
            : area
              ? "Cập nhật khu vực"
              : "Tạo khu vực"}
        </button>
        <Link
          href="/admin/service-areas"
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
  type?: "text" | "number";
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

function Field({
  label,
  name,
  type = "text",
  defaultValue = "",
  placeholder,
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
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={type === "number" ? 0 : undefined}
        className={inputClassName}
      />
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

type TextAreaFieldProps = {
  label: string;
  name: string;
  defaultValue: string;
  rows: number;
  error?: string;
  disabled?: boolean;
};

function TextAreaField({
  label,
  name,
  defaultValue,
  rows,
  error,
  disabled,
}: TextAreaFieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#111827] lg:col-span-2">
      {label}
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        disabled={disabled}
        className={inputClassName}
      />
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
