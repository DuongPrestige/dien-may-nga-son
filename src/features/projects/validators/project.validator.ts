import { ProjectStatus, ProjectType } from "@prisma/client";
import { z } from "zod";

import { isValidImageSrc } from "@/src/lib/image-src";

const optionalText = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().optional(),
);

const optionalImageUrl = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .trim()
    .refine(
      isValidImageSrc,
      "Ảnh phải là URL HTTP/HTTPS hoặc đường dẫn bắt đầu bằng /",
    )
    .optional(),
);

const optionalHttpUrl = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .url("Vui lòng nhập URL hợp lệ")
    .refine(
      (value) => value.startsWith("https://") || value.startsWith("http://"),
      "URL phải bắt đầu bằng http:// hoặc https://",
    )
    .optional(),
);

export const projectFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tiêu đề")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  slug: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập slug")
    .max(255, "Slug không được vượt quá 255 ký tự")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug chỉ gồm chữ thường, số và dấu gạch ngang",
    ),
  excerpt: optionalText,
  content: z.string().trim().min(1, "Vui lòng nhập nội dung"),
  status: z.enum([ProjectStatus.DRAFT, ProjectStatus.PUBLISHED]),
  projectType: z.enum([
    ProjectType.AIRCON_INSTALL,
    ProjectType.AIRCON_MAINTENANCE,
    ProjectType.AIRCON_REPAIR,
    ProjectType.WASHING_MACHINE_REPAIR,
    ProjectType.REFRIGERATOR_REPAIR,
    ProjectType.TV_INSTALL,
    ProjectType.DELIVERY,
    ProjectType.OTHER,
  ]),
  location: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa điểm")
    .max(255, "Địa điểm không được vượt quá 255 ký tự"),
  customerArea: optionalText,
  performedAt: z.coerce.date({
    error: "Vui lòng chọn ngày thực hiện hợp lệ",
  }),
  thumbnailUrl: optionalImageUrl,
  facebookUrl: optionalHttpUrl,
  seoTitle: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z
      .string()
      .trim()
      .max(255, "SEO title không được vượt quá 255 ký tự")
      .optional(),
  ),
  seoDescription: optionalText,
});

export const projectIdSchema = z.string().uuid("Mã công trình không hợp lệ");

export type ProjectFormSchema = z.infer<typeof projectFormSchema>;
