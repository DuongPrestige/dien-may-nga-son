import { ProductStatus } from "@prisma/client";
import { z } from "zod";

import { isValidImageSrc } from "@/src/lib/image-src";

const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
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
      "Ảnh phải là URL http/https hoặc đường dẫn tương đối bắt đầu bằng /",
    )
    .optional(),
);

const galleryTextSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .transform((value) =>
      value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .superRefine((lines, context) => {
      lines.forEach((line, index) => {
        if (!isValidImageSrc(line)) {
          context.addIssue({
            code: "custom",
            message: `Dòng ảnh ${index + 1} phải là URL http/https hoặc đường dẫn bắt đầu bằng /`,
          });
        }
      });
    })
    .transform((lines) => lines.join("\n"))
    .optional(),
);

const priceSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.replace(/,/g, "").trim() : value),
  z
    .string()
    .min(1, "Vui lòng nhập giá")
    .regex(/^\d+(\.\d{1,2})?$/, "Giá không hợp lệ"),
);

const optionalPriceSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmedValue = value.replace(/,/g, "").trim();

    return trimmedValue === "" ? undefined : trimmedValue;
  },
  z.string().regex(/^\d+(\.\d{1,2})?$/, "Giá khuyến mãi không hợp lệ").optional(),
);

export const productStatusSchema = z.enum([
  ProductStatus.ACTIVE,
  ProductStatus.INACTIVE,
]);

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm"),
  slug: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập slug")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ dùng chữ thường, số và dấu gạch ngang"),
  categoryId: z.string().uuid("Danh mục không hợp lệ"),
  brandId: z.string().uuid("Thương hiệu không hợp lệ"),
  sku: optionalText,
  price: priceSchema,
  salePrice: optionalPriceSchema,
  thumbnailUrl: optionalImageSrc,
  shortDescription: optionalText,
  description: optionalText,
  isFeatured: z.preprocess((value) => value === "on" || value === true, z.boolean()),
  status: productStatusSchema,
  seoTitle: optionalText,
  seoDescription: optionalText,
  specsText: optionalText,
  galleryText: galleryTextSchema,
});

export const productIdSchema = z.string().uuid("Mã sản phẩm không hợp lệ");

export type ProductFormSchema = z.infer<typeof productFormSchema>;
