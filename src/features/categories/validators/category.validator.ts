import { z } from "zod";

const optionalText = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().optional(),
);

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên danh mục"),
  slug: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập slug")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug chỉ dùng chữ thường, số và dấu gạch ngang",
    ),
  description: optionalText,
});

export const categoryIdSchema = z.string().uuid("Mã danh mục không hợp lệ");

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;
