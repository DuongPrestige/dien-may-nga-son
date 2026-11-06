"use client";

import Link from "next/link";
import { useActionState } from "react";

import { usePreservedFormAction } from "@/src/hooks/use-preserved-form-action";
import {
  createUserAction,
  updateUserAction,
} from "@/src/features/users/actions/users.actions";
import {
  MIN_PASSWORD_LENGTH,
  USER_ROLE_OPTIONS,
} from "@/src/features/users/constants";
import type {
  AdminUserDetail,
  UserActionState,
} from "@/src/features/users/types/users.types";

type UserFormProps = {
  user?: AdminUserDetail;
  isSelf?: boolean;
};

const initialState: UserActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const inputClassName =
  "w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 disabled:bg-[#F8FAFC]";

export function UserForm({ user, isSelf = false }: UserFormProps) {
  const action = user ? updateUserAction.bind(null, user.id) : createUserAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const handleSubmit = usePreservedFormAction(formAction);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextField
          label="Email đăng nhập"
          name="email"
          type="email"
          autoComplete="off"
          defaultValue={user?.email}
          error={state.fieldErrors.email}
          disabled={isPending}
        />
        <TextField
          label="Họ tên"
          name="fullName"
          defaultValue={user?.fullName ?? ""}
          error={state.fieldErrors.fullName}
          disabled={isPending}
        />
        <TextField
          label={user ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
          name="password"
          type="password"
          autoComplete="new-password"
          helpText={`Tối thiểu ${MIN_PASSWORD_LENGTH} ký tự.`}
          error={state.fieldErrors.password}
          disabled={isPending}
        />
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Vai trò
          <select
            name="role"
            defaultValue={user?.role ?? USER_ROLE_OPTIONS[0].value}
            disabled={isPending || isSelf}
            className={inputClassName}
          >
            {USER_ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} — {option.description}
              </option>
            ))}
          </select>
          {isSelf ? (
            <>
              <input type="hidden" name="role" value={user?.role} />
              <p className="text-xs font-normal text-[#6B7280]">
                Bạn không thể tự đổi vai trò của tài khoản đang đăng nhập.
              </p>
            </>
          ) : null}
          {state.fieldErrors.role ? (
            <p className="text-sm font-normal text-red-600">
              {state.fieldErrors.role}
            </p>
          ) : null}
        </label>
        <div className="space-y-1 lg:col-span-2">
          <label className="flex items-center gap-3 text-sm font-semibold text-[#111827]">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={user?.isActive ?? true}
              disabled={isPending || isSelf}
              className="h-4 w-4 rounded border-[#E5E7EB] accent-[#0EA5E9]"
            />
            Tài khoản đang hoạt động
          </label>
          {isSelf ? (
            <input type="hidden" name="isActive" value="on" />
          ) : (
            <p className="text-xs text-[#6B7280]">
              Bỏ chọn để vô hiệu hóa: người dùng sẽ bị đăng xuất ngay và không
              thể đăng nhập lại.
            </p>
          )}
        </div>
      </div>

      {state.message ? (
        <p
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
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
            : user
              ? "Cập nhật người dùng"
              : "Tạo người dùng"}
        </button>
        <Link
          href="/admin/users"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#E5E7EB] px-5 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}

type TextFieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  defaultValue?: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
};

function TextField({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue = "",
  helpText,
  error,
  disabled,
}: TextFieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#111827]">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        disabled={disabled}
        className={inputClassName}
      />
      {helpText ? (
        <p className="text-xs font-normal text-[#6B7280]">{helpText}</p>
      ) : null}
      {error ? (
        <p className="text-sm font-normal text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
