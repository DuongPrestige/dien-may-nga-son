"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isAiSeoEnabled } from "@/src/features/ai-seo/lib/ai-seo-config";
import { generateSeoSuggestion } from "@/src/features/ai-seo/services/ai-seo.service";
import type {
  AiSeoInput,
  AiSeoResult,
} from "@/src/features/ai-seo/types/ai-seo.types";
import { aiSeoInputSchema } from "@/src/features/ai-seo/validators/ai-seo.validator";

async function requireAdminSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }
}

export async function generateSeoSuggestionAction(
  input: AiSeoInput,
): Promise<AiSeoResult> {
  await requireAdminSession();

  if (!isAiSeoEnabled()) {
    return {
      success: false,
      message: "Tính năng AI SEO chưa được bật trên máy chủ.",
    };
  }

  const parsed = aiSeoInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
    };
  }

  return generateSeoSuggestion(parsed.data);
}
