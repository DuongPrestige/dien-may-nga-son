import { z } from "zod";

import { BANNER_POSITION_VALUES } from "@/src/features/banners/constants";
import { isValidImageSrc } from "@/src/lib/image-src";

const MAX_SORT_ORDER = 999;

function emptyToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

function isSafeHref(value: string): boolean {
  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const bannerFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tiêu đề banner")
    .max(255, "Tiêu đề tối đa 255 ký tự"),
  imageUrl: z
    .string()
    .trim()
    .min(1, "Vui lòng tải ảnh hoặc nhập URL ảnh")
    .refine(
      isValidImageSrc,
      "Ảnh phải là URL http/https hoặc đường dẫn bắt đầu bằng /",
    ),
  targetUrl: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .refine(
        isSafeHref,
        "Link phải là URL http/https hoặc đường dẫn bắt đầu bằng /",
      )
      .optional(),
  ),
  position: z.enum(BANNER_POSITION_VALUES, {
    message: "Vui lòng chọn vị trí hiển thị",
  }),
  sortOrder: z.preprocess(
    (value) => emptyToUndefined(value) ?? 0,
    z.coerce
      .number({ message: "Thứ tự phải là số" })
      .int("Thứ tự phải là số nguyên")
      .min(0, "Thứ tự không được âm")
      .max(MAX_SORT_ORDER, `Thứ tự tối đa ${MAX_SORT_ORDER}`),
  ),
  isActive: z.boolean(),
});

export const bannerIdSchema = z.string().uuid("Mã banner không hợp lệ");

export const bannerPositionFilterSchema = z
  .enum(BANNER_POSITION_VALUES)
  .optional()
  .catch(undefined);

export type BannerFormSchema = z.infer<typeof bannerFormSchema>;
