"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/src/features/products/services/products.service";
import type { ProductActionState } from "@/src/features/products/types/products.types";
import {
  productFormSchema,
  productIdSchema,
} from "@/src/features/products/validators/product.validator";

const defaultProductActionState: ProductActionState = {
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

function formDataToProductInput(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId"),
    sku: formData.get("sku"),
    price: formData.get("price"),
    salePrice: formData.get("salePrice"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    isFeatured: formData.get("isFeatured"),
    status: formData.get("status"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    specsText: formData.get("specsText"),
    galleryText: formData.get("galleryText"),
  };
}

function getProductFieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): ProductActionState["fieldErrors"] {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    name: fieldErrors.name?.[0],
    slug: fieldErrors.slug?.[0],
    categoryId: fieldErrors.categoryId?.[0],
    brandId: fieldErrors.brandId?.[0],
    sku: fieldErrors.sku?.[0],
    price: fieldErrors.price?.[0],
    salePrice: fieldErrors.salePrice?.[0],
    thumbnailUrl: fieldErrors.thumbnailUrl?.[0],
    shortDescription: fieldErrors.shortDescription?.[0],
    description: fieldErrors.description?.[0],
    status: fieldErrors.status?.[0],
    seoTitle: fieldErrors.seoTitle?.[0],
    seoDescription: fieldErrors.seoDescription?.[0],
    specsText: fieldErrors.specsText?.[0],
    galleryText: fieldErrors.galleryText?.[0],
  };
}

export async function createProductAction(
  _previousState: ProductActionState = defaultProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedInput = productFormSchema.safeParse(
    formDataToProductInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin sản phẩm.",
      fieldErrors: getProductFieldErrors(parsedInput.error),
    };
  }

  try {
    await createProduct(parsedInput.data);
  } catch {
    return {
      success: false,
      message: "Không thể tạo sản phẩm. Vui lòng kiểm tra slug hoặc dữ liệu nhập.",
      fieldErrors: {},
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _previousState: ProductActionState = defaultProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedId = productIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      success: false,
      message: "Mã sản phẩm không hợp lệ.",
      fieldErrors: {},
    };
  }

  const parsedInput = productFormSchema.safeParse(
    formDataToProductInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin sản phẩm.",
      fieldErrors: getProductFieldErrors(parsedInput.error),
    };
  }

  try {
    await updateProduct(parsedId.data, parsedInput.data);
  } catch {
    return {
      success: false,
      message: "Không thể cập nhật sản phẩm. Vui lòng kiểm tra slug hoặc dữ liệu nhập.",
      fieldErrors: {},
    };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${parsedId.data}/edit`);
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdminSession();

  const parsedId = productIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return;
  }

  try {
    await deleteProduct(parsedId.data);
  } catch {
    return;
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
