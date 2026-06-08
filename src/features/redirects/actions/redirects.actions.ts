"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  createRedirect,
  deleteRedirect,
  REDIRECTS_CACHE_TAG,
} from "@/src/features/redirects/services/redirects.service";
import type {
  DeleteRedirectResult,
  RedirectActionState,
} from "@/src/features/redirects/types/redirects.types";
import {
  redirectFormSchema,
  redirectIdSchema,
} from "@/src/features/redirects/validators/redirect.validator";

const defaultRedirectActionState: RedirectActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

async function requireAdminSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }
}

function invalidateRedirectCache() {
  revalidatePath("/admin/redirects");
  updateTag(REDIRECTS_CACHE_TAG);
}

export async function createRedirectAction(
  _previousState: RedirectActionState = defaultRedirectActionState,
  formData: FormData,
): Promise<RedirectActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedInput = redirectFormSchema.safeParse({
    sourcePath: formData.get("sourcePath"),
    targetPath: formData.get("targetPath"),
  });

  if (!parsedInput.success) {
    const fieldErrors = parsedInput.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Vui lòng kiểm tra đường dẫn chuyển hướng.",
      fieldErrors: {
        sourcePath: fieldErrors.sourcePath?.[0],
        targetPath: fieldErrors.targetPath?.[0],
      },
    };
  }

  try {
    await createRedirect(parsedInput.data);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error && error.message === "REDIRECT_LOOP"
          ? "Không thể tạo vì chuyển hướng này gây vòng lặp."
          : "Không thể tạo chuyển hướng. Vui lòng thử lại.",
      fieldErrors: {},
    };
  }

  invalidateRedirectCache();
  redirect("/admin/redirects");
}

export async function deleteRedirectAction(
  formData: FormData,
): Promise<DeleteRedirectResult> {
  await requireAdminSession();

  const parsedId = redirectIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return {
      success: false,
      message: "Mã chuyển hướng không hợp lệ.",
    };
  }

  try {
    await deleteRedirect(parsedId.data);
  } catch {
    return {
      success: false,
      message: "Không thể xóa chuyển hướng. Vui lòng thử lại.",
    };
  }

  invalidateRedirectCache();
  return {
    success: true,
    message: "Đã xóa chuyển hướng.",
  };
}
