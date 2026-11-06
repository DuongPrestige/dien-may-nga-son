"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { FacebookImportError } from "@/src/features/projects/lib/facebook-fetch";
import { importFacebookPostAsDraft } from "@/src/features/projects/services/facebook-import.service";
import type { FacebookImportActionState } from "@/src/features/projects/types/projects.types";
import { facebookImportSchema } from "@/src/features/projects/validators/facebook-import.validator";

async function requireAdminSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }
}

export async function importFacebookProjectAction(
  _state: FacebookImportActionState,
  formData: FormData,
): Promise<FacebookImportActionState> {
  await requireAdminSession();

  const rawUrl = formData.get("url");
  const submittedUrl = typeof rawUrl === "string" ? rawUrl : "";
  const result = facebookImportSchema.safeParse({ url: rawUrl });

  if (!result.success) {
    return {
      success: false,
      message:
        result.error.issues[0]?.message ?? "Liên kết Facebook không hợp lệ.",
      url: submittedUrl,
    };
  }

  let destination: string;
  try {
    const project = await importFacebookPostAsDraft(result.data.url);
    const notice = project.hasImage ? "facebook" : "facebook-no-image";
    destination = `/admin/projects/${project.id}/edit?imported=${notice}`;
  } catch (error) {
    if (error instanceof FacebookImportError) {
      return { success: false, message: error.message, url: submittedUrl };
    }

    console.error("Failed to import Facebook post as project draft", error);
    return {
      success: false,
      message: "Không thể tạo bản nháp công trình. Vui lòng thử lại.",
      url: submittedUrl,
    };
  }

  revalidatePath("/admin/projects");
  redirect(destination);
}
