"use server";

import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSuperAdmin } from "@/src/features/users/lib/require-super-admin";
import {
  createUser,
  updateUser,
} from "@/src/features/users/services/users.service";
import type {
  UserActionState,
  UserMutationResult,
} from "@/src/features/users/types/users.types";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "@/src/features/users/validators/user.validator";

type FailedMutation = Extract<UserMutationResult, { ok: false }>;

const MUTATION_ERROR_MESSAGES: Record<FailedMutation["reason"], string> = {
  EMAIL_TAKEN: "Email này đã được sử dụng cho tài khoản khác.",
  LAST_SUPER_ADMIN:
    "Không thể hạ quyền hoặc vô hiệu hóa Super Admin cuối cùng đang hoạt động.",
  NOT_FOUND: "Không tìm thấy người dùng.",
};

function formDataToUserInput(formData: FormData) {
  return {
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
    isActive: formData.get("isActive") === "on",
    password: formData.get("password"),
  };
}

function getUserFieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): UserActionState["fieldErrors"] {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    email: fieldErrors.email?.[0],
    fullName: fieldErrors.fullName?.[0],
    role: fieldErrors.role?.[0],
    password: fieldErrors.password?.[0],
  };
}

function failure(message: string): UserActionState {
  return { success: false, message, fieldErrors: {} };
}

export async function createUserAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  void _previousState;
  await requireSuperAdmin();

  const parsedInput = createUserSchema.safeParse(formDataToUserInput(formData));

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin người dùng.",
      fieldErrors: getUserFieldErrors(parsedInput.error),
    };
  }

  try {
    const result = await createUser(parsedInput.data);

    if (!result.ok) {
      return failure(MUTATION_ERROR_MESSAGES[result.reason]);
    }
  } catch (error) {
    console.error("Failed to create user", error);
    return failure("Không thể tạo người dùng. Vui lòng thử lại.");
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUserAction(
  id: string,
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  void _previousState;
  const { userId } = await requireSuperAdmin();

  const parsedId = userIdSchema.safeParse(id);

  if (!parsedId.success) {
    return failure("Mã người dùng không hợp lệ.");
  }

  const parsedInput = updateUserSchema.safeParse(formDataToUserInput(formData));

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin người dùng.",
      fieldErrors: getUserFieldErrors(parsedInput.error),
    };
  }

  const isSelf = parsedId.data === userId;

  if (
    isSelf &&
    (!parsedInput.data.isActive ||
      parsedInput.data.role !== UserRole.SUPER_ADMIN)
  ) {
    return failure(
      "Bạn không thể tự vô hiệu hóa hoặc tự hạ quyền tài khoản đang đăng nhập.",
    );
  }

  try {
    const result = await updateUser(parsedId.data, parsedInput.data);

    if (!result.ok) {
      return failure(MUTATION_ERROR_MESSAGES[result.reason]);
    }
  } catch (error) {
    console.error("Failed to update user", error);
    return failure("Không thể cập nhật người dùng. Vui lòng thử lại.");
  }

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${parsedId.data}/edit`);
  redirect("/admin/users");
}
