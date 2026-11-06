"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createBannerAction,
  updateBannerAction,
} from "@/src/features/banners/actions/banners.actions";
import { BANNER_POSITIONS } from "@/src/features/banners/constants";
import type {
  AdminBannerDetail,
  BannerActionState,
} from "@/src/features/banners/types/banners.types";
import { ImageUploadField } from "@/src/features/uploads/components/image-upload-field";

type BannerFormProps = {
  banner?: AdminBannerDetail;
};

const initialState: BannerActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const inputClassName =
  "w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20";

export function BannerForm({ banner }: BannerFormProps) {
  const action = banner
    ? updateBannerAction.bind(null, banner.id)
    : createBannerAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const values = state.values;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Tiêu đề (dùng làm alt text của ảnh)"
          name="title"
          defaultValue={values?.title ?? banner?.title}
          error={state.fieldErrors.title}
          disabled={isPending}
          required
          className="lg:col-span-2"
        />
        <Field
          label="URL ảnh banner"
          name="imageUrl"
          defaultValue={values?.imageUrl ?? banner?.imageUrl}
          error={state.fieldErrors.imageUrl}
          disabled={isPending}
          required
          className="lg:col-span-2"
        />
        <div className="space-y-2 lg:col-span-2">
          <ImageUploadField
            targetName="imageUrl"
            folder="banners"
            initialUrl={values?.imageUrl ?? banner?.imageUrl ?? ""}
            disabled={isPending}
            label="Tải ảnh banner lên Cloudinary"
          />
          <p className="text-xs text-[#6B7280]">
            Kích thước khuyến nghị 1200×400px (tỉ lệ 3:1), JPG/PNG/WebP tối đa
            5MB.
          </p>
        </div>
        <Field
          label="Link khi bấm vào banner"
          name="targetUrl"
          defaultValue={values?.targetUrl ?? banner?.targetUrl ?? ""}
          placeholder="/services/sua-dieu-hoa hoặc https://..."
          error={state.fieldErrors.targetUrl}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Vị trí hiển thị
          <select
            name="position"
            defaultValue={
              values?.position ??
              banner?.position ??
              BANNER_POSITIONS[0].value
            }
            disabled={isPending}
            className={inputClassName}
          >
            {BANNER_POSITIONS.map((position) => (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            ))}
          </select>
          {state.fieldErrors.position ? (
            <p className="text-sm font-normal text-red-600">
              {state.fieldErrors.position}
            </p>
          ) : null}
        </label>
        <Field
          label="Thứ tự (số nhỏ hiển thị trước)"
          name="sortOrder"
          type="number"
          defaultValue={values?.sortOrder ?? String(banner?.sortOrder ?? 0)}
          error={state.fieldErrors.sortOrder}
          disabled={isPending}
        />
        <label className="flex items-center gap-3 text-sm font-semibold text-[#111827] lg:col-span-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={values?.isActive ?? banner?.isActive ?? true}
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
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending
            ? "Đang lưu..."
            : banner
              ? "Cập nhật banner"
              : "Tạo banner"}
        </button>
        <Link
          href="/admin/banners"
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
