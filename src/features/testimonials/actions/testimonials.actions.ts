"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { TESTIMONIALS_CACHE_TAG } from "@/src/features/testimonials/constants";
import {
  createTestimonial,
  deleteTestimonial,
  setTestimonialActive,
  updateTestimonial,
} from "@/src/features/testimonials/services/testimonials.service";
import type {
  TestimonialActionState,
  TestimonialFormValues,
  TestimonialMutationResult,
} from "@/src/features/testimonials/types/testimonials.types";
import {
  testimonialFormSchema,
  testimonialIdSchema,
} from "@/src/features/testimonials/validators/testimonial.validator";

const defaultTestimonialActionState: TestimonialActionState = {
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

function formDataToTestimonialInput(
  formData: FormData,
): TestimonialFormValues {
  return {
    customerName: getFormString(formData, "customerName"),
    area: getFormString(formData, "area"),
    content: getFormString(formData, "content"),
    imageUrl: getFormString(formData, "imageUrl"),
    sortOrder: getFormString(formData, "sortOrder"),
    isActive: formData.get("isActive") === "on",
  };
}

function getTestimonialFieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): TestimonialActionState["fieldErrors"] {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    customerName: fieldErrors.customerName?.[0],
    area: fieldErrors.area?.[0],
    content: fieldErrors.content?.[0],
    imageUrl: fieldErrors.imageUrl?.[0],
    sortOrder: fieldErrors.sortOrder?.[0],
  };
}

function invalidateTestimonialCaches() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  updateTag(TESTIMONIALS_CACHE_TAG);
}

export async function createTestimonialAction(
  _previousState: TestimonialActionState = defaultTestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedInput = testimonialFormSchema.safeParse(
    formDataToTestimonialInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin đánh giá.",
      fieldErrors: getTestimonialFieldErrors(parsedInput.error),
    };
  }

  try {
    await createTestimonial(parsedInput.data);
  } catch (error) {
    console.error("Failed to create testimonial", error);
    return {
      success: false,
      message: "Không thể tạo đánh giá. Vui lòng thử lại.",
      fieldErrors: {},
    };
  }

  invalidateTestimonialCaches();
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(
  id: string,
  _previousState: TestimonialActionState = defaultTestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedId = testimonialIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      success: false,
      message: "Mã đánh giá không hợp lệ.",
      fieldErrors: {},
    };
  }

  const parsedInput = testimonialFormSchema.safeParse(
    formDataToTestimonialInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra thông tin đánh giá.",
      fieldErrors: getTestimonialFieldErrors(parsedInput.error),
    };
  }

  try {
    await updateTestimonial(parsedId.data, parsedInput.data);
  } catch (error) {
    console.error("Failed to update testimonial", error);
    return {
      success: false,
      message: "Không thể cập nhật đánh giá. Vui lòng thử lại.",
      fieldErrors: {},
    };
  }

  invalidateTestimonialCaches();
  revalidatePath(`/admin/testimonials/${parsedId.data}/edit`);
  redirect("/admin/testimonials");
}

export async function toggleTestimonialActiveAction(
  formData: FormData,
): Promise<TestimonialMutationResult> {
  await requireAdminSession();

  const parsedId = testimonialIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return { success: false, message: "Mã đánh giá không hợp lệ." };
  }

  const isActive = formData.get("isActive") === "true";

  try {
    await setTestimonialActive(parsedId.data, isActive);
  } catch (error) {
    console.error("Failed to toggle testimonial", error);
    return {
      success: false,
      message: "Không thể đổi trạng thái đánh giá. Vui lòng thử lại.",
    };
  }

  invalidateTestimonialCaches();
  return {
    success: true,
    message: isActive ? "Đã bật đánh giá." : "Đã tắt đánh giá.",
  };
}

export async function deleteTestimonialAction(
  formData: FormData,
): Promise<TestimonialMutationResult> {
  await requireAdminSession();

  const parsedId = testimonialIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return { success: false, message: "Mã đánh giá không hợp lệ." };
  }

  try {
    await deleteTestimonial(parsedId.data);
  } catch (error) {
    console.error("Failed to delete testimonial", error);
    return {
      success: false,
      message: "Không thể xóa đánh giá. Vui lòng thử lại.",
    };
  }

  invalidateTestimonialCaches();
  return { success: true, message: "Đã xóa đánh giá." };
}
