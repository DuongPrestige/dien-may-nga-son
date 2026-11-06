import { z } from "zod";

import {
  AI_SEO_ENTITY_TYPES,
  AI_SEO_LIMITS,
} from "@/src/features/ai-seo/types/ai-seo.types";

const MAX_RAW_CONTENT_LENGTH = 200_000;

export const aiSeoInputSchema = z.object({
  entityType: z.enum(AI_SEO_ENTITY_TYPES, {
    error: "Loại nội dung không hợp lệ",
  }),
  title: z
    .string({ error: "Vui lòng nhập tiêu đề trước khi tạo gợi ý SEO" })
    .trim()
    .min(1, "Vui lòng nhập tiêu đề trước khi tạo gợi ý SEO")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  location: z
    .string()
    .trim()
    .max(255, "Địa điểm không được vượt quá 255 ký tự")
    .optional(),
  content: z
    .string()
    .max(MAX_RAW_CONTENT_LENGTH, "Nội dung quá dài để tạo gợi ý SEO")
    .optional(),
});

export type AiSeoInputSchema = z.infer<typeof aiSeoInputSchema>;

/** Shape requested from the model via structured outputs. */
export const aiSeoModelOutputSchema = z.object({
  seoTitle: z.string(),
  seoDescription: z.string(),
  excerpt: z.string(),
});

/** Final contract returned to the admin UI after length enforcement. */
export const aiSeoSuggestionSchema = z.object({
  seoTitle: z.string().trim().min(1).max(AI_SEO_LIMITS.seoTitle),
  seoDescription: z.string().trim().min(1).max(AI_SEO_LIMITS.seoDescription),
  excerpt: z.string().trim().min(1).max(AI_SEO_LIMITS.excerpt),
});
