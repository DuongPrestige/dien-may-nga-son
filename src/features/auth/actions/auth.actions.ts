"use server";

import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { signIn, signOut } from "@/auth";
import type { LoginActionState } from "@/src/features/auth/types/auth.types";
import { loginSchema } from "@/src/features/auth/validators/auth.validator";

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsedInput = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedInput.success) {
    const fieldErrors = parsedInput.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin đăng nhập.",
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  try {
    await signIn("credentials", {
      email: parsedInput.data.email,
      password: parsedInput.data.password,
      redirectTo: "/admin",
    });

    return {
      success: true,
      message: "",
      fieldErrors: {},
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Email hoặc mật khẩu không đúng.",
        fieldErrors: {},
      };
    }

    return {
      success: false,
      message: "Không thể đăng nhập. Vui lòng thử lại.",
      fieldErrors: {},
    };
  }
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/admin/login",
  });
}
