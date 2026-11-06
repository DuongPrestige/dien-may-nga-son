import { z } from "zod";

import {
  RESERVED_SERVICE_AREA_SLUGS,
  SERVICE_AREA_SLUG_PATTERN,
} from "@/src/features/service-areas/constants";
import { slugify } from "@/src/lib/slugify";

const MAX_SORT_ORDER = 999;
const MAX_NAME_LENGTH = 255;
const MAX_SEO_TITLE_LENGTH = 255;
const MAX_SEO_DESCRIPTION_LENGTH = 500;
const MAX_DESCRIPTION_LENGTH = 1000;

function emptyToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

function optionalText(maxLength: number, message: string) {
  return z.preprocess(
    emptyToUndefined,
    z.string().trim().max(maxLength, message).optional(),
  );
}

export const serviceAreaFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập tên khu vực")
      .max(MAX_NAME_LENGTH, `Tên khu vực tối đa ${MAX_NAME_LENGTH} ký tự`),
    slug: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .toLowerCase()
        .max(MAX_NAME_LENGTH, `Slug tối đa ${MAX_NAME_LENGTH} ký tự`)
        .optional(),
    ),
    description: optionalText(
      MAX_DESCRIPTION_LENGTH,
      `Mô tả tối đa ${MAX_DESCRIPTION_LENGTH} ký tự`,
    ),
    sortOrder: z.preprocess(
      (value) => emptyToUndefined(value) ?? 0,
      z.coerce
        .number({ message: "Thứ tự phải là số" })
        .int("Thứ tự phải là số nguyên")
        .min(0, "Thứ tự không được âm")
        .max(MAX_SORT_ORDER, `Thứ tự tối đa ${MAX_SORT_ORDER}`),
    ),
    isActive: z.boolean(),
    seoTitle: optionalText(
      MAX_SEO_TITLE_LENGTH,
      `SEO title tối đa ${MAX_SEO_TITLE_LENGTH} ký tự`,
    ),
    seoDescription: optionalText(
      MAX_SEO_DESCRIPTION_LENGTH,
      `SEO description tối đa ${MAX_SEO_DESCRIPTION_LENGTH} ký tự`,
    ),
  })
  .transform((value, ctx) => {
    const slug = value.slug ?? slugify(value.name);

    if (!slug || !SERVICE_AREA_SLUG_PATTERN.test(slug)) {
      ctx.addIssue({
        code: "custom",
        path: ["slug"],
        message: "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang",
      });
      return z.NEVER;
    }

    if (RESERVED_SERVICE_AREA_SLUGS.has(slug)) {
      ctx.addIssue({
        code: "custom",
        path: ["slug"],
        message: "Slug này trùng với đường dẫn hệ thống, vui lòng chọn slug khác",
      });
      return z.NEVER;
    }

    return { ...value, slug };
  });

export const serviceAreaIdSchema = z.string().uuid("Mã khu vực không hợp lệ");

export const serviceAreaSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(MAX_NAME_LENGTH)
  .regex(SERVICE_AREA_SLUG_PATTERN);

export type ServiceAreaFormSchema = z.output<typeof serviceAreaFormSchema>;
