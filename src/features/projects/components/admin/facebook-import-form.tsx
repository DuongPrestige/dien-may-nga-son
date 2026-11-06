"use client";

import { useActionState } from "react";

import { importFacebookProjectAction } from "@/src/features/projects/actions/facebook-import.actions";
import type { FacebookImportActionState } from "@/src/features/projects/types/projects.types";
import { usePreservedFormAction } from "@/src/hooks/use-preserved-form-action";

const initialState: FacebookImportActionState = {
  success: false,
  message: "",
};

export function FacebookImportForm() {
  const [state, formAction, isPending] = useActionState(
    importFacebookProjectAction,
    initialState,
  );
  const handleSubmit = usePreservedFormAction(formAction);

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <label className="block space-y-2 text-sm font-semibold text-[#111827]">
        Liên kết bài đăng Facebook
        <input
          name="url"
          type="url"
          inputMode="url"
          autoComplete="off"
          required
          defaultValue={state.url ?? ""}
          disabled={isPending}
          placeholder="https://www.facebook.com/.../posts/..."
          aria-invalid={Boolean(state.message) && !state.success}
          aria-describedby="facebook-import-help"
          className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0284C7]/20"
        />
      </label>
      <p id="facebook-import-help" className="text-sm text-[#6B7280]">
        Bài đăng cần ở chế độ Công khai. Hệ thống đọc tiêu đề, mô tả và ảnh đại
        diện rồi tạo bản nháp để bạn chỉnh sửa trước khi xuất bản.
      </p>

      {state.message ? (
        <p
          role="alert"
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
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Đang đọc bài đăng..." : "Tạo bản nháp"}
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
