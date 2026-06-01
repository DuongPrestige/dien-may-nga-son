"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  SERVICES_CACHE_TAG,
  createService,
  deleteService,
  updateService,
} from "@/src/features/services/services/services.service";
import type { ServiceActionState } from "@/src/features/services/types/services.types";
import {
  serviceFormSchema,
  serviceIdSchema,
} from "@/src/features/services/validators/service.validator";

const defaultServiceActionState: ServiceActionState = {
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

function formDataToServiceInput(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    content: formData.get("content"),
    isFeatured: formData.get("isFeatured"),
    status: formData.get("status"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  };
}

function getServiceFieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): ServiceActionState["fieldErrors"] {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    name: fieldErrors.name?.[0],
    slug: fieldErrors.slug?.[0],
    shortDescription: fieldErrors.shortDescription?.[0],
    content: fieldErrors.content?.[0],
    status: fieldErrors.status?.[0],
    seoTitle: fieldErrors.seoTitle?.[0],
    seoDescription: fieldErrors.seoDescription?.[0],
  };
}

export async function createServiceAction(
  _previousState: ServiceActionState = defaultServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedInput = serviceFormSchema.safeParse(
    formDataToServiceInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Please check the service information.",
      fieldErrors: getServiceFieldErrors(parsedInput.error),
    };
  }

  try {
    await createService(parsedInput.data);
  } catch {
    return {
      success: false,
      message: "Could not create service. Please check the slug and input.",
      fieldErrors: {},
    };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  updateTag(SERVICES_CACHE_TAG);
  redirect("/admin/services");
}

export async function updateServiceAction(
  id: string,
  _previousState: ServiceActionState = defaultServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedId = serviceIdSchema.safeParse(id);

  if (!parsedId.success) {
    return {
      success: false,
      message: "Invalid service id.",
      fieldErrors: {},
    };
  }

  const parsedInput = serviceFormSchema.safeParse(
    formDataToServiceInput(formData),
  );

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Please check the service information.",
      fieldErrors: getServiceFieldErrors(parsedInput.error),
    };
  }

  try {
    await updateService(parsedId.data, parsedInput.data);
  } catch {
    return {
      success: false,
      message: "Could not update service. Please check the slug and input.",
      fieldErrors: {},
    };
  }

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${parsedId.data}/edit`);
  revalidatePath("/services");
  updateTag(SERVICES_CACHE_TAG);
  redirect("/admin/services");
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdminSession();

  const parsedId = serviceIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return;
  }

  try {
    await deleteService(parsedId.data);
  } catch {
    return;
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  updateTag(SERVICES_CACHE_TAG);
}
