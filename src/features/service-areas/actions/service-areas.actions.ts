"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SERVICE_AREAS_CACHE_TAG } from "@/src/features/service-areas/constants";
import {
  createServiceArea,
  deleteServiceArea,
  setServiceAreaActive,
  updateServiceArea,
} from "@/src/features/service-areas/services/service-areas.service";
import type {
  ServiceAreaActionState,
  ServiceAreaFormValues,
  ServiceAreaMutationResult,
} from "@/src/features/service-areas/types/service-areas.types";
import {
  serviceAreaFormSchema,
  serviceAreaIdSchema,
} from "@/src/features/service-areas/validators/service-area.validator";

const defaultServiceAreaActionState: ServiceAreaActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};

const DUPLICATE_SLUG_STATE: ServiceAreaActionState = {
  success: false,
  message: "Slug đã tồn tại. Vui lòng chọn slug khác.",
  fieldErrors: { slug: "Slug đã tồn tại." },
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

function formDataToServiceAreaInput(formData: FormData): ServiceAreaFormValues {
  return {
    name: getFormString(formData, "name"),
    slug: getFormString(formData, "slug"),
    description: getFormString(formData, "description"),
    sortOrder: getFormString(formData, "sortOrder"),
    isActive: formData.get("isActive") === "on",
    seoTitle: getFormString(formData, "seoTitle"),
    seoDescription: getFormString(formData, "seoDescription"),
  };
}

function getServiceAreaFieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): ServiceAreaActionState["fieldErrors"] {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    name: fieldErrors.name?.[0],
    slug: fieldErrors.slug?.[0],
    description: fieldErrors.description?.[0],
    sortOrder: fieldErrors.sortOrder?.[0],
    seoTitle: fieldErrors.seoTitle?.[0],
    seoDescription: fieldErrors.seoDescription?.[0],
  };
}

function isDuplicateSlugError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function invalidateServiceAreaCaches(slugs: string[]) {
  revalidatePath("/admin/service-areas");
  revalidatePath("/khu-vuc");
  revalidatePath("/sitemap.xml");

  for (const slug of slugs) {
    revalidatePath(`/khu-vuc/${slug}`);
  }

  updateTag(SERVICE_AREAS_CACHE_TAG);
}

export async function createServiceAreaAction(
  _previousState: ServiceAreaActionState = defaultServiceAreaActionState,
  formData: FormData,
): Promise<ServiceAreaActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedInput = serviceAreaFormSchema.safeParse(
    formDataToServiceAreaInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin khu vực.",
      fieldErrors: getServiceAreaFieldErrors(parsedInput.error),
    };
  }

  try {
    await createServiceArea(parsedInput.data);
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return DUPLICATE_SLUG_STATE;
    }

    console.error("Failed to create service area", error);
    return {
      success: false,
      message: "Không thể tạo khu vực. Vui lòng thử lại.",
      fieldErrors: {},
    };
  }

  invalidateServiceAreaCaches([parsedInput.data.slug]);
  redirect("/admin/service-areas");
}

export async function updateServiceAreaAction(
  id: string,
  _previousState: ServiceAreaActionState = defaultServiceAreaActionState,
  formData: FormData,
): Promise<ServiceAreaActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedId = serviceAreaIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      success: false,
      message: "Mã khu vực không hợp lệ.",
      fieldErrors: {},
    };
  }

  const parsedInput = serviceAreaFormSchema.safeParse(
    formDataToServiceAreaInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin khu vực.",
      fieldErrors: getServiceAreaFieldErrors(parsedInput.error),
    };
  }

  try {
    await updateServiceArea(parsedId.data, parsedInput.data);
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return DUPLICATE_SLUG_STATE;
    }

    console.error("Failed to update service area", error);
    return {
      success: false,
      message: "Không thể cập nhật khu vực. Vui lòng thử lại.",
      fieldErrors: {},
    };
  }

  invalidateServiceAreaCaches([parsedInput.data.slug]);
  revalidatePath(`/admin/service-areas/${parsedId.data}/edit`);
  redirect("/admin/service-areas");
}

export async function toggleServiceAreaActiveAction(
  formData: FormData,
): Promise<ServiceAreaMutationResult> {
  await requireAdminSession();

  const parsedId = serviceAreaIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return { success: false, message: "Mã khu vực không hợp lệ." };
  }

  const isActive = formData.get("isActive") === "true";

  try {
    const area = await setServiceAreaActive(parsedId.data, isActive);
    invalidateServiceAreaCaches([area.slug]);
  } catch (error) {
    console.error("Failed to toggle service area", error);
    return {
      success: false,
      message: "Không thể đổi trạng thái khu vực. Vui lòng thử lại.",
    };
  }

  return {
    success: true,
    message: isActive ? "Đã bật khu vực." : "Đã tắt khu vực.",
  };
}

export async function deleteServiceAreaAction(
  formData: FormData,
): Promise<ServiceAreaMutationResult> {
  await requireAdminSession();

  const parsedId = serviceAreaIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return { success: false, message: "Mã khu vực không hợp lệ." };
  }

  try {
    const area = await deleteServiceArea(parsedId.data);
    invalidateServiceAreaCaches([area.slug]);
  } catch (error) {
    console.error("Failed to delete service area", error);
    return {
      success: false,
      message: "Không thể xóa khu vực. Vui lòng thử lại.",
    };
  }

  return { success: true, message: "Đã xóa khu vực." };
}
