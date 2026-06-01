"use client";

import { useActionState } from "react";

import { loginAction } from "@/src/features/auth/actions/auth.actions";
import type { LoginActionState } from "@/src/features/auth/types/auth.types";

const initialState: LoginActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-[#111827]"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
          aria-invalid={Boolean(state.fieldErrors.email)}
          aria-describedby={
            state.fieldErrors.email ? "email-error" : undefined
          }
          disabled={isPending}
        />
        {state.fieldErrors.email ? (
          <p id="email-error" className="text-sm text-red-600">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-[#111827]"
        >
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
          aria-invalid={Boolean(state.fieldErrors.password)}
          aria-describedby={
            state.fieldErrors.password ? "password-error" : undefined
          }
          disabled={isPending}
        />
        {state.fieldErrors.password ? (
          <p id="password-error" className="text-sm text-red-600">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-md bg-[#0EA5E9] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
      >
        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
