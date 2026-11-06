"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { BANNERS_CACHE_TAG } from "@/src/features/banners/constants";
import {
  createBanner,
  deleteBanner,
  setBannerActive,
  updateBanner,
} from "@/src/features/banners/services/banners.service";
import type {
  BannerActionState,
  BannerFormValues,
  BannerMutationResult,
} from "@/src/features/banners/types/banners.types";
import {
  bannerFormSchema,
  bannerIdSchema,
} from "@/src/features/banners/validators/banner.validator";

const defaultBannerActionState: BannerActionState = {
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

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function formDataToBannerInput(formData: FormData): BannerFormValues {
  return {
    title: getFormString(formData, "title"),
    imageUrl: getFormString(formData, "imageUrl"),
    targetUrl: getFormString(formData, "targetUrl"),
    position: getFormString(formData, "position"),
    sortOrder: getFormString(formData, "sortOrder"),
    isActive: formData.get("isActive") === "on",
  };
}

function getBannerFieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): BannerActionState["fieldErrors"] {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    title: fieldErrors.title?.[0],
    imageUrl: fieldErrors.imageUrl?.[0],
    targetUrl: fieldErrors.targetUrl?.[0],
    position: fieldErrors.position?.[0],
    sortOrder: fieldErrors.sortOrder?.[0],
  };
}

function invalidateBannerCaches() {
  revalidatePath("/admin/banners");
  revalidatePath("/");
  revalidatePath("/products");
  updateTag(BANNERS_CACHE_TAG);
}

export async function createBannerAction(
  _previousState: BannerActionState = defaultBannerActionState,
  formData: FormData,
): Promise<BannerActionState> {
  void _previousState;
  await requireAdminSession();

  const values = formDataToBannerInput(formData);
  const parsedInput = bannerFormSchema.safeParse(values);

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin banner.",
      values,
      fieldErrors: getBannerFieldErrors(parsedInput.error),
    };
  }

  try {
    await createBanner(parsedInput.data);
  } catch (error) {
    console.error("Failed to create banner", error);
    return {
      success: false,
      message: "Không thể tạo banner. Vui lòng thử lại.",
      values,
      fieldErrors: {},
    };
  }

  invalidateBannerCaches();
  redirect("/admin/banners");
}

export async function updateBannerAction(
  id: string,
  _previousState: BannerActionState = defaultBannerActionState,
  formData: FormData,
): Promise<BannerActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedId = bannerIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      success: false,
      message: "Mã banner không hợp lệ.",
      fieldErrors: {},
    };
  }

  const values = formDataToBannerInput(formData);
  const parsedInput = bannerFormSchema.safeParse(values);

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin banner.",
      values,
      fieldErrors: getBannerFieldErrors(parsedInput.error),
    };
  }

  try {
    await updateBanner(parsedId.data, parsedInput.data);
  } catch (error) {
    console.error("Failed to update banner", error);
    return {
      success: false,
      message: "Không thể cập nhật banner. Vui lòng thử lại.",
      values,
      fieldErrors: {},
    };
  }

  invalidateBannerCaches();
  revalidatePath(`/admin/banners/${parsedId.data}/edit`);
  redirect("/admin/banners");
}

export async function toggleBannerActiveAction(
  formData: FormData,
): Promise<BannerMutationResult> {
  await requireAdminSession();

  const parsedId = bannerIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return { success: false, message: "Mã banner không hợp lệ." };
  }

  const isActive = formData.get("isActive") === "true";

  try {
    await setBannerActive(parsedId.data, isActive);
  } catch (error) {
    console.error("Failed to toggle banner", error);
    return {
      success: false,
      message: "Không thể đổi trạng thái banner. Vui lòng thử lại.",
    };
  }

  invalidateBannerCaches();
  return {
    success: true,
    message: isActive ? "Đã bật banner." : "Đã tắt banner.",
  };
}

export async function deleteBannerAction(
  formData: FormData,
): Promise<BannerMutationResult> {
  await requireAdminSession();

  const parsedId = bannerIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return { success: false, message: "Mã banner không hợp lệ." };
  }

  try {
    await deleteBanner(parsedId.data);
  } catch (error) {
    console.error("Failed to delete banner", error);
    return {
      success: false,
      message: "Không thể xóa banner. Vui lòng thử lại.",
    };
  }

  invalidateBannerCaches();
  return { success: true, message: "Đã xóa banner." };
}
