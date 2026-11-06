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
import {
  consumeRateLimit,
  formatRetryAfter,
  RATE_LIMIT_RULES,
} from "@/src/lib/rate-limit";

async function requireAdminUserId(): Promise<string> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  return session.user.id;
}

export async function generateSeoSuggestionAction(
  input: AiSeoInput,
): Promise<AiSeoResult> {
  const userId = await requireAdminUserId();

  if (!isAiSeoEnabled()) {
    return {
      success: false,
      message: "Tính năng AI SEO chưa được bật trên máy chủ.",
    };
  }

  const limit = await consumeRateLimit(RATE_LIMIT_RULES.aiSeoByUser, userId);
  if (!limit.allowed) {
    return {
      success: false,
      message: `Đã dùng hết lượt gợi ý AI. Thử lại sau ${formatRetryAfter(
        limit.retryAfterSeconds,
      )}.`,
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
