"use client";

import { ProjectStatus } from "@prisma/client";
import { useActionState } from "react";

import {
  createProjectAction,
  updateProjectAction,
} from "@/src/features/projects/actions/projects.actions";
import { PROJECT_TYPE_OPTIONS } from "@/src/features/projects/constants";
import type {
  AdminProjectDetail,
  ProjectActionState,
} from "@/src/features/projects/types/projects.types";
import { BlogContentField } from "@/src/features/blog/components/admin/blog-content-field";
import { ImageUploadField } from "@/src/features/uploads/components/image-upload-field";
import { usePreservedFormAction } from "@/src/hooks/use-preserved-form-action";

type ProjectFormProps = {
  project?: AdminProjectDetail;
};

const initialState: ProjectActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

function formatDateInput(date: Date | undefined) {
  const value = date ?? new Date();
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const action = project ? updateProjectAction : createProjectAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const handleSubmit = usePreservedFormAction(formAction);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Tiêu đề"
          name="title"
          defaultValue={project?.title}
          error={state.fieldErrors?.title}
          disabled={isPending}
          required
        />
        <Field
          label="Slug"
          name="slug"
          defaultValue={project?.slug}
          error={state.fieldErrors?.slug}
          disabled={isPending}
          required
        />
        <SelectField
          label="Loại công trình"
          name="projectType"
          defaultValue={project?.projectType}
          error={state.fieldErrors?.projectType}
          disabled={isPending}
          options={PROJECT_TYPE_OPTIONS}
        />
        <SelectField
          label="Trạng thái"
          name="status"
          defaultValue={project?.status ?? ProjectStatus.DRAFT}
          error={state.fieldErrors?.status}
          disabled={isPending}
          options={[
            { value: ProjectStatus.DRAFT, label: "Bản nháp" },
            { value: ProjectStatus.PUBLISHED, label: "Đã xuất bản" },
          ]}
        />
        <Field
          label="Địa điểm"
          name="location"
          defaultValue={project?.location}
          error={state.fieldErrors?.location}
          disabled={isPending}
          required
        />
        <Field
          label="Khu vực khách hàng"
          name="customerArea"
          defaultValue={project?.customerArea ?? ""}
          error={state.fieldErrors?.customerArea}
          disabled={isPending}
        />
        <Field
          label="Ngày thực hiện"
          name="performedAt"
          type="date"
          defaultValue={formatDateInput(project?.performedAt)}
          error={state.fieldErrors?.performedAt}
          disabled={isPending}
          required
        />
        <Field
          label="URL bài đăng Facebook"
          name="facebookUrl"
          type="url"
          defaultValue={project?.facebookUrl ?? ""}
          error={state.fieldErrors?.facebookUrl}
          disabled={isPending}
        />
        <TextareaField
          label="Mô tả ngắn"
          name="excerpt"
          rows={3}
          defaultValue={project?.excerpt ?? ""}
          error={state.fieldErrors?.excerpt}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <Field
          label="URL ảnh đại diện"
          name="thumbnailUrl"
          type="url"
          defaultValue={project?.thumbnailUrl ?? ""}
          error={state.fieldErrors?.thumbnailUrl}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <div className="lg:col-span-2">
          <ImageUploadField
            targetName="thumbnailUrl"
            folder="projects"
            initialUrl={project?.thumbnailUrl ?? ""}
            disabled={isPending}
            label="Tải ảnh đại diện lên Cloudinary"
          />
        </div>
        <BlogContentField
          defaultValue={project?.content ?? ""}
          error={state.fieldErrors?.content}
          disabled={isPending}
          label="Nội dung công trình"
          manualAriaLabel="Nội dung HTML công trình"
          helpText="Mô tả quá trình thực hiện bằng đoạn văn, H2/H3 và hình ảnh có alt text rõ ràng."
        />
        <Field
          label="SEO title"
          name="seoTitle"
          defaultValue={project?.seoTitle ?? ""}
          error={state.fieldErrors?.seoTitle}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <TextareaField
          label="SEO description"
          name="seoDescription"
          rows={3}
          defaultValue={project?.seoDescription ?? ""}
          error={state.fieldErrors?.seoDescription}
          disabled={isPending}
          className="lg:col-span-2"
        />
      </div>

      {state.message ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            state.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
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
            : project
              ? "Cập nhật công trình"
              : "Tạo công trình"}
        </button>
        <a
          href="/admin/projects"
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
  type?: "text" | "url" | "date";
  defaultValue?: string;
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
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
      />
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

type TextareaFieldProps = FieldProps & {
  rows: number;
};

function TextareaField({
  label,
  name,
  rows,
  defaultValue = "",
  error,
  disabled,
  required,
  className = "",
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
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
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
  options: readonly { value: string; label: string }[];
};

function SelectField({
  label,
  name,
  defaultValue,
  error,
  disabled,
  options,
}: SelectFieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#111827]">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
