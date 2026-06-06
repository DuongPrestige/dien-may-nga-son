"use client";

import { useActionState } from "react";

import {
  createBlogPostAction,
  updateBlogPostAction,
} from "@/src/features/blog/actions/blog.actions";
import type {
  AdminBlogPostDetail,
  BlogCategoryData,
  BlogPostActionState,
} from "@/src/features/blog/types/blog.types";

type BlogPostFormProps = {
  post?: AdminBlogPostDetail;
  categories: BlogCategoryData[];
};

const initialState: BlogPostActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function BlogPostForm({
  post,
  categories,
}: BlogPostFormProps) {
  const action = post
    ? updateBlogPostAction.bind(null, post.id)
    : createBlogPostAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isEditing = Boolean(post);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Title"
          name="title"
          defaultValue={post?.title}
          error={state.fieldErrors.title}
          disabled={isPending}
          required
        />
        <Field
          label="Slug"
          name="slug"
          defaultValue={post?.slug}
          error={state.fieldErrors.slug}
          disabled={isPending}
          required
        />
        <CategoryField
          categories={categories}
          defaultValue={post?.categoryId ?? ""}
          error={state.fieldErrors.categoryId}
          disabled={isPending}
        />
        <Field
          label="Featured image URL"
          name="thumbnailUrl"
          type="url"
          defaultValue={post?.thumbnailUrl ?? ""}
          error={state.fieldErrors.thumbnailUrl}
          disabled={isPending}
        />
        <TextareaField
          label="Excerpt"
          name="excerpt"
          rows={3}
          defaultValue={post?.excerpt ?? ""}
          error={state.fieldErrors.excerpt}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <TextareaField
          label="Content"
          name="content"
          rows={16}
          defaultValue={post?.content ?? ""}
          error={state.fieldErrors.content}
          disabled={isPending}
          required
          className="lg:col-span-2"
        />
        <Field
          label="SEO title"
          name="seoTitle"
          defaultValue={post?.seoTitle ?? ""}
          error={state.fieldErrors.seoTitle}
          disabled={isPending}
          className="lg:col-span-2"
        />
        <TextareaField
          label="SEO description"
          name="seoDescription"
          rows={3}
          defaultValue={post?.seoDescription ?? ""}
          error={state.fieldErrors.seoDescription}
          disabled={isPending}
          className="lg:col-span-2"
        />
      </div>

      <label className="flex items-center gap-3 text-sm font-semibold text-[#111827]">
        <input
          name="isPublished"
          type="checkbox"
          defaultChecked={post?.isPublished ?? false}
          className="h-4 w-4 rounded border-[#E5E7EB]"
          disabled={isPending}
        />
        Published
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
          disabled={isPending || categories.length === 0}
        >
          {isPending
            ? "Saving..."
            : isEditing
              ? "Update post"
              : "Create post"}
        </button>
        <a
          href="/admin/blog"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#E5E7EB] px-5 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
        >
          Cancel
        </a>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Create at least one post category before saving a blog post.
        </p>
      ) : null}
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "url";
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
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
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
  required?: boolean;
  className?: string;
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
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
      />
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

type CategoryFieldProps = {
  categories: BlogCategoryData[];
  defaultValue: string;
  error?: string;
  disabled?: boolean;
};

function CategoryField({
  categories,
  defaultValue,
  error,
  disabled,
}: CategoryFieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#111827]">
      Category
      <select
        name="categoryId"
        defaultValue={defaultValue}
        required
        disabled={disabled}
        className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
      >
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
