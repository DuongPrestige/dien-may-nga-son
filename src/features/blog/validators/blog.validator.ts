import { z } from "zod";

import { isValidImageSrc } from "@/src/lib/image-src";

const optionalText = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().optional(),
);

const optionalUrl = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .trim()
    .refine(
      isValidImageSrc,
      "Featured image must be an HTTP/HTTPS URL or a relative path starting with /",
    )
    .optional(),
);

export const blogPostFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or fewer"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(255, "Slug must be 255 characters or fewer")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only use lowercase letters, numbers, and hyphens",
    ),
  excerpt: optionalText,
  content: z.string().trim().min(1, "Content is required"),
  thumbnailUrl: optionalUrl,
  categoryId: z.string().uuid("Please select a valid category"),
  isPublished: z.preprocess(
    (value) => value === "on" || value === true,
    z.boolean(),
  ),
  seoTitle: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z
      .string()
      .trim()
      .max(255, "SEO title must be 255 characters or fewer")
      .optional(),
  ),
  seoDescription: optionalText,
});

export const blogPostIdSchema = z.string().uuid("Invalid blog post id");

export type BlogPostFormSchema = z.infer<typeof blogPostFormSchema>;
