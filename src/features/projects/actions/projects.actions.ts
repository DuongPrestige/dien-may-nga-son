"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  hasMeaningfulBlogContent,
  sanitizeBlogContent,
} from "@/src/features/blog/lib/blog-content";
import {
  createProject,
  deleteProject,
  PROJECT_DETAIL_CACHE_TAG,
  PROJECTS_CACHE_TAG,
  updateProject,
} from "@/src/features/projects/services/projects.service";
import {
  projectFormSchema,
  projectIdSchema,
} from "@/src/features/projects/validators/project.validator";
import { REDIRECTS_CACHE_TAG } from "@/src/features/redirects/services/redirects.service";
import type { ProjectActionState } from "@/src/features/projects/types/projects.types";

async function requireAdminSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }
}

function fieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}) {
  return Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).map(([key, messages]) => [
      key,
      messages?.[0],
    ]),
  );
}

function invalidateProjectPaths(slugs: string[]) {
  revalidatePath("/admin/projects");
  revalidatePath("/cong-trinh-thuc-te");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) {
    revalidatePath(`/cong-trinh-thuc-te/${slug}`);
  }
  updateTag(PROJECTS_CACHE_TAG);
  updateTag(PROJECT_DETAIL_CACHE_TAG);
}

export async function createProjectAction(
  _state: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  await requireAdminSession();

  const result = projectFormSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin công trình.",
      fieldErrors: fieldErrors(result.error),
    };
  }

  if (!hasMeaningfulBlogContent(result.data.content)) {
    return {
      success: false,
      message: "Nội dung công trình không được để trống.",
      fieldErrors: { content: "Vui lòng nhập nội dung công trình." },
    };
  }

  try {
    const project = await createProject({
      ...result.data,
      content: sanitizeBlogContent(result.data.content),
    });
    invalidateProjectPaths([project.slug]);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Slug đã tồn tại. Vui lòng chọn slug khác.",
        fieldErrors: { slug: "Slug đã tồn tại." },
      };
    }
    return {
      success: false,
      message: "Không thể tạo công trình. Vui lòng thử lại.",
    };
  }

  redirect("/admin/projects");
}

export async function updateProjectAction(
  _state: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  await requireAdminSession();

  const idResult = projectIdSchema.safeParse(formData.get("id"));
  const formResult = projectFormSchema.safeParse(Object.fromEntries(formData));
  if (!idResult.success || !formResult.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin công trình.",
      fieldErrors: formResult.success
        ? undefined
        : fieldErrors(formResult.error),
    };
  }

  if (!hasMeaningfulBlogContent(formResult.data.content)) {
    return {
      success: false,
      message: "Nội dung công trình không được để trống.",
      fieldErrors: { content: "Vui lòng nhập nội dung công trình." },
    };
  }

  try {
    const project = await updateProject(idResult.data, {
      ...formResult.data,
      content: sanitizeBlogContent(formResult.data.content),
    });
    invalidateProjectPaths([project.previousSlug, project.slug]);
    if (project.previousSlug !== project.slug) {
      updateTag(REDIRECTS_CACHE_TAG);
      revalidatePath("/admin/redirects");
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Slug đã tồn tại. Vui lòng chọn slug khác.",
        fieldErrors: { slug: "Slug đã tồn tại." },
      };
    }
    return {
      success: false,
      message: "Không thể cập nhật công trình. Vui lòng thử lại.",
    };
  }

  redirect("/admin/projects");
}

export async function deleteProjectAction(
  _state: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  await requireAdminSession();

  const result = projectIdSchema.safeParse(formData.get("id"));
  if (!result.success) {
    return { success: false, message: "Công trình không hợp lệ." };
  }

  try {
    const project = await deleteProject(result.data);
    invalidateProjectPaths([project.slug]);
    return { success: true, message: "Đã xóa công trình." };
  } catch {
    return {
      success: false,
      message: "Không thể xóa công trình. Vui lòng thử lại.",
    };
  }
}
