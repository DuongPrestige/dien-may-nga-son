import { z } from "zod";

function normalizeInternalPath(value: string): string {
  const trimmedValue = value.trim();
  const path = trimmedValue.startsWith("/") ? trimmedValue : `/${trimmedValue}`;

  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

const internalPathSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập đường dẫn")
  .transform(normalizeInternalPath)
  .refine(
    (value) =>
      value.startsWith("/") &&
      !value.startsWith("//") &&
      !value.includes("?") &&
      !value.includes("#") &&
      !/\s/.test(value),
    "Chỉ dùng đường dẫn nội bộ, ví dụ: /blog/bai-viet",
  );

export const redirectFormSchema = z
  .object({
    sourcePath: internalPathSchema,
    targetPath: internalPathSchema,
  })
  .refine((value) => value.sourcePath !== value.targetPath, {
    message: "Đường dẫn nguồn và đích phải khác nhau",
    path: ["targetPath"],
  });

export const redirectIdSchema = z.string().uuid("Mã chuyển hướng không hợp lệ");

export type RedirectFormSchema = z.infer<typeof redirectFormSchema>;
