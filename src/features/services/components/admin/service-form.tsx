"use client";

import { useActionState } from "react";

import {
  createServiceAction,
  updateServiceAction,
} from "@/src/features/services/actions/services.actions";
import type {
  AdminServiceDetail,
  ServiceActionState,
} from "@/src/features/services/types/services.types";
import { AiSeoButton } from "@/src/features/ai-seo/components/ai-seo-button";
import { formatPriceTable } from "@/src/features/services/lib/price-table";
import { ImageUploadField } from "@/src/features/uploads/components/image-upload-field";
import { usePreservedFormAction } from "@/src/hooks/use-preserved-form-action";

type ServiceFormProps = {
  service?: AdminServiceDetail;
  isAiSeoEnabled?: boolean;
};

const AI_SEO_TARGET_FIELD_NAMES = {
  seoTitle: "seoTitle",
  seoDescription: "seoDescription",
  excerpt: "shortDescription",
} as const;

const initialState: ServiceActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function ServiceForm({
  service,
  isAiSeoEnabled = false,
}: ServiceFormProps) {
  const action = service
    ? updateServiceAction.bind(null, service.id)
    : createServiceAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const handleSubmit = usePreservedFormAction(formAction);
  const isEditing = Boolean(service);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Name"
          name="name"
          defaultValue={service?.name}
          error={state.fieldErrors.name}
          disabled={isPending}
          required
        />
        <Field
          label="Slug"
          name="slug"
          defaultValue={service?.slug}
          error={state.fieldErrors.slug}
          disabled={isPending}
          required
        />
        <SelectField
          label="Status"
          name="status"
          defaultValue={service?.status ?? "ACTIVE"}
          error={state.fieldErrors.status}
          disabled={isPending}
        />
        <div className="hidden lg:block" />
        <Field
          label="Thumbnail URL"
          name="thumbnailUrl"
          defaultValue={service?.thumbnailUrl ?? ""}
          error={state.fieldErrors.thumbnailUrl}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <div className="lg:col-span-2">
          <ImageUploadField
            targetName="thumbnailUrl"
            folder="services"
            initialUrl={service?.thumbnailUrl ?? ""}
            disabled={isPending}
            label="Upload service thumbnail"
          />
        </div>
        <TextareaField
          label="Short description"
          name="shortDescription"
          rows={3}
          defaultValue={service?.shortDescription ?? ""}
          error={state.fieldErrors.shortDescription}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <TextareaField
          label="Description"
          name="content"
          rows={8}
          defaultValue={service?.content ?? ""}
          error={state.fieldErrors.content}
          disabled={isPending}
          className="lg:col-span-2"
        />
        {isAiSeoEnabled ? (
          <div className="lg:col-span-2">
            <AiSeoButton
              entityType="service"
              titleFieldName="name"
              targetFieldNames={AI_SEO_TARGET_FIELD_NAMES}
              disabled={isPending}
            />
          </div>
        ) : null}
        <Field
          label="SEO title"
          name="seoTitle"
          defaultValue={service?.seoTitle ?? ""}
          error={state.fieldErrors.seoTitle}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <TextareaField
          label="Bảng giá tham khảo (mỗi dòng: Hạng mục | Giá | Ghi chú)"
          name="priceTable"
          rows={6}
          defaultValue={formatPriceTable(service?.priceItems ?? [])}
          error={state.fieldErrors.priceTable}
          disabled={isPending}
          className="lg:col-span-2"
          placeholder={"Vệ sinh điều hòa treo tường | 150.000đ | Mỗi máy\nNạp gas R32 | Từ 250.000đ | Tùy lượng gas"}
        />
        <TextareaField
          label="SEO description"
          name="seoDescription"
          rows={3}
          defaultValue={service?.seoDescription ?? ""}
          error={state.fieldErrors.seoDescription}
          disabled={isPending}
          className="lg:col-span-2"
        />
      </div>

      <label className="flex items-center gap-3 text-sm font-semibold text-[#111827]">
        <input
          name="isFeatured"
          type="checkbox"
          defaultChecked={service?.isFeatured ?? false}
          className="h-4 w-4 rounded border-[#E5E7EB]"
          disabled={isPending}
        />
        Featured
      </label>

      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
        >
          {isPending
            ? "Saving..."
            : isEditing
              ? "Update service"
              : "Create service"}
        </button>
        <a
          href="/admin/services"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#E5E7EB] px-5 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
        >
          Cancel
        </a>
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
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0284C7]/20"
      />
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

type TextareaFieldProps = {
  label: string;
  name: string;
  rows: number;
  defaultValue?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

function TextareaField({
  label,
  name,
  rows,
  defaultValue = "",
  error,
  disabled,
  className = "",
  placeholder,
}: TextareaFieldProps) {
  return (
    <label
      className={`space-y-2 text-sm font-semibold text-[#111827] ${className}`}
    >
      {label}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0284C7]/20"
      />
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  disabled?: boolean;
};

function SelectField({
  label,
  name,
  defaultValue = "",
  error,
  disabled,
}: SelectFieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#111827]">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0284C7]/20"
      >
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
