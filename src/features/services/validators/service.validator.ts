import { ProductStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().optional(),
);

export const serviceStatusSchema = z.enum([
  ProductStatus.ACTIVE,
  ProductStatus.INACTIVE,
]);

export const serviceFormSchema = z.object({
  name: z.string().trim().min(1, "Service name is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only use lowercase letters, numbers, and hyphens",
    ),
  shortDescription: optionalText,
  content: optionalText,
  isFeatured: z.preprocess(
    (value) => value === "on" || value === true,
    z.boolean(),
  ),
  status: serviceStatusSchema,
  seoTitle: optionalText,
  seoDescription: optionalText,
});

export const serviceIdSchema = z.string().uuid("Invalid service id");

export type ServiceFormSchema = z.infer<typeof serviceFormSchema>;
