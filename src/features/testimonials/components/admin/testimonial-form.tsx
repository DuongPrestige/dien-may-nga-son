"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createTestimonialAction,
  updateTestimonialAction,
} from "@/src/features/testimonials/actions/testimonials.actions";
import { TESTIMONIAL_LIMITS } from "@/src/features/testimonials/constants";
import type {
  AdminTestimonialDetail,
  TestimonialActionState,
} from "@/src/features/testimonials/types/testimonials.types";
import { ImageUploadField } from "@/src/features/uploads/components/image-upload-field";
import { usePreservedFormAction } from "@/src/hooks/use-preserved-form-action";

type TestimonialFormProps = {
  testimonial?: AdminTestimonialDetail;
};

const initialState: TestimonialActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const inputClassName =
  "w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0284C7]/20";

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const action = testimonial
    ? updateTestimonialAction.bind(null, testimonial.id)
    : createTestimonialAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const handleSubmit = usePreservedFormAction(formAction);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Tên khách hàng"
          name="customerName"
          defaultValue={testimonial?.customerName}
          placeholder="Anh Minh"
          maxLength={TESTIMONIAL_LIMITS.customerNameMax}
          error={state.fieldErrors.customerName}
          disabled={isPending}
          required
        />
        <Field
          label="Khu vực (xã/phường)"
          name="area"
          defaultValue={testimonial?.area ?? ""}
          placeholder="Hiệp An"
          maxLength={TESTIMONIAL_LIMITS.areaMax}
          error={state.fieldErrors.area}
          disabled={isPending}
        />
        <label className="space-y-2 text-sm font-semibold text-[#111827] lg:col-span-2">
          Nội dung đánh giá
          <textarea
            name="content"
            rows={5}
            defaultValue={testimonial?.content ?? ""}
            maxLength={TESTIMONIAL_LIMITS.contentMax}
            placeholder="Khách hàng chia sẻ trải nghiệm mua hàng hoặc sử dụng dịch vụ..."
            required
            disabled={isPending}
            className={inputClassName}
          />
          <span className="block text-xs font-normal text-[#6B7280]">
            Từ {TESTIMONIAL_LIMITS.contentMin} đến{" "}
            {TESTIMONIAL_LIMITS.contentMax} ký tự. Chỉ đăng đánh giá thật đã
            được khách đồng ý.
          </span>
          {state.fieldErrors.content ? (
            <p className="text-sm font-normal text-red-600">
              {state.fieldErrors.content}
            </p>
          ) : null}
        </label>
        <Field
          label="URL ảnh khách hàng (không bắt buộc)"
          name="imageUrl"
          defaultValue={testimonial?.imageUrl ?? ""}
          error={state.fieldErrors.imageUrl}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <div className="space-y-2 lg:col-span-2">
          <ImageUploadField
            targetName="imageUrl"
            folder="testimonials"
            initialUrl={testimonial?.imageUrl ?? ""}
            disabled={isPending}
            label="Tải ảnh khách hàng lên Cloudinary"
          />
          <p className="text-xs text-[#6B7280]">
            Ảnh vuông, tối thiểu 160×160px, JPG/PNG/WebP tối đa 5MB.
          </p>
        </div>
        <Field
          label="Thứ tự (số nhỏ hiển thị trước)"
          name="sortOrder"
          type="number"
          defaultValue={String(testimonial?.sortOrder ?? 0)}
          error={state.fieldErrors.sortOrder}
          disabled={isPending}
        />
        <label className="flex items-center gap-3 text-sm font-semibold text-[#111827] lg:col-span-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={testimonial?.isActive ?? true}
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
            : testimonial
              ? "Cập nhật đánh giá"
              : "Tạo đánh giá"}
        </button>
        <Link
          href="/admin/testimonials"
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
  maxLength?: number;
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
  maxLength,
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
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        min={type === "number" ? 0 : undefined}
        max={type === "number" ? TESTIMONIAL_LIMITS.sortOrderMax : undefined}
        className={inputClassName}
      />
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
