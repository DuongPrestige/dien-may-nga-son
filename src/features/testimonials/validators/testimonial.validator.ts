import { z } from "zod";

import { TESTIMONIAL_LIMITS } from "@/src/features/testimonials/constants";
import { isValidImageSrc } from "@/src/lib/image-src";

function emptyToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

export const testimonialFormSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(
      TESTIMONIAL_LIMITS.customerNameMin,
      `Tên khách hàng tối thiểu ${TESTIMONIAL_LIMITS.customerNameMin} ký tự`,
    )
    .max(
      TESTIMONIAL_LIMITS.customerNameMax,
      `Tên khách hàng tối đa ${TESTIMONIAL_LIMITS.customerNameMax} ký tự`,
    ),
  area: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .max(
        TESTIMONIAL_LIMITS.areaMax,
        `Khu vực tối đa ${TESTIMONIAL_LIMITS.areaMax} ký tự`,
      )
      .optional(),
  ),
  content: z
    .string()
    .trim()
    .min(
      TESTIMONIAL_LIMITS.contentMin,
      `Nội dung đánh giá tối thiểu ${TESTIMONIAL_LIMITS.contentMin} ký tự`,
    )
    .max(
      TESTIMONIAL_LIMITS.contentMax,
      `Nội dung đánh giá tối đa ${TESTIMONIAL_LIMITS.contentMax} ký tự`,
    ),
  imageUrl: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .refine(
        isValidImageSrc,
        "Ảnh phải là URL http/https hoặc đường dẫn bắt đầu bằng /",
      )
      .optional(),
  ),
  sortOrder: z.preprocess(
    (value) => emptyToUndefined(value) ?? 0,
    z.coerce
      .number({ message: "Thứ tự phải là số" })
      .int("Thứ tự phải là số nguyên")
      .min(0, "Thứ tự không được âm")
      .max(
        TESTIMONIAL_LIMITS.sortOrderMax,
        `Thứ tự tối đa ${TESTIMONIAL_LIMITS.sortOrderMax}`,
      ),
  ),
  isActive: z.boolean(),
});

export const testimonialIdSchema = z
  .string()
  .uuid("Mã đánh giá không hợp lệ");

export type TestimonialFormSchema = z.infer<typeof testimonialFormSchema>;
