"use client";

import { useRef, useState, useTransition } from "react";

import { uploadImageAction } from "@/src/features/uploads/actions/upload.actions";
import type { UploadFolder } from "@/src/features/uploads/types/upload.types";

type ImageUploadFieldProps = {
  targetName: string;
  folder: UploadFolder;
  initialUrl?: string;
  append?: boolean;
  disabled?: boolean;
  label?: string;
};

export function ImageUploadField({
  targetName,
  folder,
  initialUrl = "",
  append = false,
  disabled = false,
  label = "Upload image",
}: ImageUploadFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateTargetField(url: string) {
    const form = containerRef.current?.closest("form");
    const field = form?.elements.namedItem(targetName);

    if (
      !(field instanceof HTMLInputElement) &&
      !(field instanceof HTMLTextAreaElement)
    ) {
      setError(`Could not find the ${targetName} form field.`);
      return false;
    }

    const currentValue = field.value.trim();
    field.value =
      append && currentValue ? `${currentValue}\n${url}` : url;
    field.dispatchEvent(new Event("input", { bubbles: true }));

    return true;
  }

  function handleUpload() {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setError("Select an image to upload.");
      return;
    }

    setError("");

    startTransition(async () => {
      const formData = new FormData();
      formData.set("folder", folder);
      formData.set("file", file);

      const result = await uploadImageAction(formData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      if (updateTargetField(result.url)) {
        setPreviewUrl(result.url);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  }

  return (
    <div
      ref={containerRef}
      className="space-y-3 rounded-md border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 space-y-2 text-sm font-semibold text-[#111827]">
          {label}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            disabled={disabled || isPending}
            className="block w-full text-sm font-normal text-[#374151] file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-bold file:text-[#111827] hover:file:bg-[#E5E7EB]"
          />
        </label>
        <button
          type="button"
          onClick={handleUpload}
          disabled={disabled || isPending}
          className="min-h-10 rounded-md bg-[#111827] px-4 text-sm font-bold text-white hover:bg-[#374151] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Uploading..." : "Upload"}
        </button>
      </div>

      <p className="text-xs text-[#6B7280]">
        JPG, JPEG, PNG, or WebP. Maximum size 5MB.
      </p>

      {previewUrl ? (
        <div
          role="img"
          aria-label="Uploaded image preview"
          className="aspect-[16/9] w-full max-w-xs rounded-md border border-[#E5E7EB] bg-white bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${previewUrl}")` }}
        />
      ) : null}

      {error ? (
        <p role="alert" className="text-sm font-semibold text-[#B91C1C]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
