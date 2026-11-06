import { ProductStatus } from "@prisma/client";
import { z } from "zod";

import { parsePriceTable } from "@/src/features/services/lib/price-table";
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
      "Thumbnail must be an HTTP/HTTPS URL or a relative path starting with /",
    )
    .optional(),
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
  thumbnailUrl: optionalUrl,
  shortDescription: optionalText,
  content: optionalText,
  isFeatured: z.preprocess(
    (value) => value === "on" || value === true,
    z.boolean(),
  ),
  status: serviceStatusSchema,
  seoTitle: optionalText,
  seoDescription: optionalText,
  priceTable: z
    .preprocess((value) => (typeof value === "string" ? value : ""), z.string())
    .transform((value, context) => {
      const result = parsePriceTable(value);

      if (!result.success) {
        context.addIssue({ code: "custom", message: result.error });
        return z.NEVER;
      }

      return result.items;
    }),
});

export const serviceIdSchema = z.string().uuid("Invalid service id");

export type ServiceFormSchema = z.infer<typeof serviceFormSchema>;
