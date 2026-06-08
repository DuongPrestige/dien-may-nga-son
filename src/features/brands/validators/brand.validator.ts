import { z } from "zod";

import { isValidImageSrc } from "@/src/lib/image-src";

const optionalText = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().optional(),
);

const optionalImageSrc = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .trim()
    .refine(
      isValidImageSrc,
      "Logo phải là URL http/https hoặc đường dẫn tương đối bắt đầu bằng /",
    )
    .optional(),
);

export const brandFormSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên thương hiệu"),
  slug: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập slug")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug chỉ dùng chữ thường, số và dấu gạch ngang",
    ),
  logoUrl: optionalImageSrc,
  description: optionalText,
});

export const brandIdSchema = z.string().uuid("Mã thương hiệu không hợp lệ");

export type BrandFormSchema = z.infer<typeof brandFormSchema>;
