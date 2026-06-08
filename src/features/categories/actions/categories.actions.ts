"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/src/features/categories/services/categories.service";
import type {
  CategoryActionState,
  DeleteCategoryResult,
} from "@/src/features/categories/types/categories.types";
import {
  categoryFormSchema,
  categoryIdSchema,
} from "@/src/features/categories/validators/category.validator";
import { PRODUCTS_CACHE_TAG } from "@/src/features/products/services/products.service";

const defaultCategoryActionState: CategoryActionState = {
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

function formDataToCategoryInput(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
  };
}

function getCategoryFieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): CategoryActionState["fieldErrors"] {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    name: fieldErrors.name?.[0],
    slug: fieldErrors.slug?.[0],
    description: fieldErrors.description?.[0],
  };
}

function invalidateCategoryCaches() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  updateTag(PRODUCTS_CACHE_TAG);
}

export async function createCategoryAction(
  _previousState: CategoryActionState = defaultCategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedInput = categoryFormSchema.safeParse(
    formDataToCategoryInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin danh mục.",
      fieldErrors: getCategoryFieldErrors(parsedInput.error),
    };
  }

  try {
    await createCategory(parsedInput.data);
  } catch {
    return {
      success: false,
      message: "Không thể tạo danh mục. Vui lòng kiểm tra slug.",
      fieldErrors: {},
    };
  }

  invalidateCategoryCaches();
  redirect("/admin/categories");
}

export async function updateCategoryAction(
  id: string,
  _previousState: CategoryActionState = defaultCategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedId = categoryIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      success: false,
      message: "Mã danh mục không hợp lệ.",
      fieldErrors: {},
    };
  }

  const parsedInput = categoryFormSchema.safeParse(
    formDataToCategoryInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin danh mục.",
      fieldErrors: getCategoryFieldErrors(parsedInput.error),
    };
  }

  try {
    await updateCategory(parsedId.data, parsedInput.data);
  } catch {
    return {
      success: false,
      message: "Không thể cập nhật danh mục. Vui lòng kiểm tra slug.",
      fieldErrors: {},
    };
  }

  invalidateCategoryCaches();
  revalidatePath(`/admin/categories/${parsedId.data}/edit`);
  redirect("/admin/categories");
}

export async function deleteCategoryAction(
  formData: FormData,
): Promise<DeleteCategoryResult> {
  await requireAdminSession();

  const parsedId = categoryIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return {
      success: false,
      message: "Mã danh mục không hợp lệ.",
    };
  }

  try {
    const deleted = await deleteCategory(parsedId.data);

    if (!deleted) {
      return {
        success: false,
        message: "Không thể xóa vì đang có sản phẩm sử dụng mục này.",
      };
    }
  } catch {
    return {
      success: false,
      message: "Không thể xóa danh mục. Vui lòng thử lại.",
    };
  }

  invalidateCategoryCaches();
  return {
    success: true,
    message: "Đã xóa danh mục.",
  };
}
