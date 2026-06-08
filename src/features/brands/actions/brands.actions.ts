"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  createBrand,
  deleteBrand,
  updateBrand,
} from "@/src/features/brands/services/brands.service";
import type {
  BrandActionState,
  DeleteBrandResult,
} from "@/src/features/brands/types/brands.types";
import {
  brandFormSchema,
  brandIdSchema,
} from "@/src/features/brands/validators/brand.validator";
import { PRODUCTS_CACHE_TAG } from "@/src/features/products/services/products.service";

const defaultBrandActionState: BrandActionState = {
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

function formDataToBrandInput(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    logoUrl: formData.get("logoUrl"),
    description: formData.get("description"),
  };
}

function getBrandFieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): BrandActionState["fieldErrors"] {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    name: fieldErrors.name?.[0],
    slug: fieldErrors.slug?.[0],
    logoUrl: fieldErrors.logoUrl?.[0],
    description: fieldErrors.description?.[0],
  };
}

function invalidateBrandCaches() {
  revalidatePath("/admin/brands");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  updateTag(PRODUCTS_CACHE_TAG);
}

export async function createBrandAction(
  _previousState: BrandActionState = defaultBrandActionState,
  formData: FormData,
): Promise<BrandActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedInput = brandFormSchema.safeParse(formDataToBrandInput(formData));

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin thương hiệu.",
      fieldErrors: getBrandFieldErrors(parsedInput.error),
    };
  }

  try {
    await createBrand(parsedInput.data);
  } catch {
    return {
      success: false,
      message: "Không thể tạo thương hiệu. Vui lòng kiểm tra slug.",
      fieldErrors: {},
    };
  }

  invalidateBrandCaches();
  redirect("/admin/brands");
}

export async function updateBrandAction(
  id: string,
  _previousState: BrandActionState = defaultBrandActionState,
  formData: FormData,
): Promise<BrandActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedId = brandIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      success: false,
      message: "Mã thương hiệu không hợp lệ.",
      fieldErrors: {},
    };
  }

  const parsedInput = brandFormSchema.safeParse(formDataToBrandInput(formData));

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin thương hiệu.",
      fieldErrors: getBrandFieldErrors(parsedInput.error),
    };
  }

  try {
    await updateBrand(parsedId.data, parsedInput.data);
  } catch {
    return {
      success: false,
      message: "Không thể cập nhật thương hiệu. Vui lòng kiểm tra slug.",
      fieldErrors: {},
    };
  }

  invalidateBrandCaches();
  revalidatePath(`/admin/brands/${parsedId.data}/edit`);
  redirect("/admin/brands");
}

export async function deleteBrandAction(
  formData: FormData,
): Promise<DeleteBrandResult> {
  await requireAdminSession();

  const parsedId = brandIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return {
      success: false,
      message: "Mã thương hiệu không hợp lệ.",
    };
  }

  try {
    const deleted = await deleteBrand(parsedId.data);

    if (!deleted) {
      return {
        success: false,
        message: "Không thể xóa vì đang có sản phẩm sử dụng mục này.",
      };
    }
  } catch {
    return {
      success: false,
      message: "Không thể xóa thương hiệu. Vui lòng thử lại.",
    };
  }

  invalidateBrandCaches();
  return {
    success: true,
    message: "Đã xóa thương hiệu.",
  };
}
