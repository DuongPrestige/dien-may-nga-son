"use client";

import { useActionState } from "react";

import {
  createProductAction,
  updateProductAction,
} from "@/src/features/products/actions/products.actions";
import type {
  AdminProductDetail,
  AdminProductOption,
  ProductActionState,
} from "@/src/features/products/types/products.types";

type ProductFormProps = {
  product?: AdminProductDetail;
  categories: AdminProductOption[];
  brands: AdminProductOption[];
};

const initialState: ProductActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

function decimalToInput(value: { toString: () => string } | null): string {
  return value?.toString() ?? "";
}

function specsToText(product?: AdminProductDetail): string {
  return (
    product?.specs
      .map((spec) => `${spec.specName}:${spec.specValue}`)
      .join("\n") ?? ""
  );
}

function galleryToText(product?: AdminProductDetail): string {
  return product?.images.map((image) => image.imageUrl).join("\n") ?? "";
}

export function ProductForm({ product, categories, brands }: ProductFormProps) {
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isEditing = Boolean(product);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Name"
          name="name"
          defaultValue={product?.name}
          error={state.fieldErrors.name}
          disabled={isPending}
          required
        />
        <Field
          label="Slug"
          name="slug"
          defaultValue={product?.slug}
          error={state.fieldErrors.slug}
          disabled={isPending}
          required
        />
        <SelectField
          label="Category"
          name="categoryId"
          defaultValue={product?.categoryId}
          options={categories}
          error={state.fieldErrors.categoryId}
          disabled={isPending}
        />
        <SelectField
          label="Brand"
          name="brandId"
          defaultValue={product?.brandId}
          options={brands}
          error={state.fieldErrors.brandId}
          disabled={isPending}
        />
        <Field
          label="SKU"
          name="sku"
          defaultValue={product?.sku ?? ""}
          error={state.fieldErrors.sku}
          disabled={isPending}
        />
        <SelectField
          label="Status"
          name="status"
          defaultValue={product?.status ?? "ACTIVE"}
          options={[
            { id: "ACTIVE", name: "Active" },
            { id: "INACTIVE", name: "Inactive" },
          ]}
          error={state.fieldErrors.status}
          disabled={isPending}
        />
        <Field
          label="Price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={decimalToInput(product?.price ?? null)}
          error={state.fieldErrors.price}
          disabled={isPending}
          required
        />
        <Field
          label="Sale price"
          name="salePrice"
          type="number"
          step="0.01"
          min="0"
          defaultValue={decimalToInput(product?.salePrice ?? null)}
          error={state.fieldErrors.salePrice}
          disabled={isPending}
        />
        <Field
          label="Thumbnail URL"
          name="thumbnailUrl"
          defaultValue={product?.thumbnailUrl ?? ""}
          error={state.fieldErrors.thumbnailUrl}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <TextareaField
          label="Short description"
          name="shortDescription"
          rows={3}
          defaultValue={product?.shortDescription ?? ""}
          error={state.fieldErrors.shortDescription}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <TextareaField
          label="Description"
          name="description"
          rows={6}
          defaultValue={product?.description ?? ""}
          error={state.fieldErrors.description}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <TextareaField
          label="Specs"
          name="specsText"
          rows={6}
          defaultValue={specsToText(product)}
          error={state.fieldErrors.specsText}
          disabled={isPending}
          helpText="One spec per line, format: key:value"
        />
        <TextareaField
          label="Gallery image URLs"
          name="galleryText"
          rows={6}
          defaultValue={galleryToText(product)}
          error={state.fieldErrors.galleryText}
          disabled={isPending}
          helpText="One image URL per line"
        />
        <Field
          label="SEO title"
          name="seoTitle"
          defaultValue={product?.seoTitle ?? ""}
          error={state.fieldErrors.seoTitle}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <TextareaField
          label="SEO description"
          name="seoDescription"
          rows={3}
          defaultValue={product?.seoDescription ?? ""}
          error={state.fieldErrors.seoDescription}
          disabled={isPending}
          className="lg:col-span-2"
        />
      </div>

      <label className="flex items-center gap-3 text-sm font-semibold text-[#111827]">
        <input
          name="isFeatured"
          type="checkbox"
          defaultChecked={product?.isFeatured ?? false}
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
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
        >
          {isPending
            ? "Đang lưu..."
            : isEditing
              ? "Cập nhật sản phẩm"
              : "Tạo sản phẩm"}
        </button>
        <a
          href="/admin/products"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#E5E7EB] px-5 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
        >
          Hủy
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
  type?: string;
  min?: string;
  step?: string;
  className?: string;
};

function Field({
  label,
  name,
  defaultValue = "",
  error,
  disabled,
  required,
  type = "text",
  min,
  step,
  className = "",
}: FieldProps) {
  return (
    <label className={`space-y-2 text-sm font-semibold text-[#111827] ${className}`}>
      {label}
      <input
        name={name}
        type={type}
        min={min}
        step={step}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
      />
      {error ? <p className="text-sm font-normal text-red-600">{error}</p> : null}
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
  helpText?: string;
  className?: string;
};

function TextareaField({
  label,
  name,
  rows,
  defaultValue = "",
  error,
  disabled,
  helpText,
  className = "",
}: TextareaFieldProps) {
  return (
    <label className={`space-y-2 text-sm font-semibold text-[#111827] ${className}`}>
      {label}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        disabled={disabled}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
      />
      {helpText ? (
        <p className="text-xs font-normal text-[#6B7280]">{helpText}</p>
      ) : null}
      {error ? <p className="text-sm font-normal text-red-600">{error}</p> : null}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  options: AdminProductOption[];
  error?: string;
  disabled?: boolean;
};

function SelectField({
  label,
  name,
  defaultValue = "",
  options,
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
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
      >
        <option value="">Chọn</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm font-normal text-red-600">{error}</p> : null}
    </label>
  );
}
