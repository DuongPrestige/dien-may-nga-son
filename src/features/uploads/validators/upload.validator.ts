import { z } from "zod";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

export const uploadFolderSchema = z.enum([
  "products",
  "services",
  "blog",
  "settings",
]);

export const uploadImageSchema = z.object({
  folder: uploadFolderSchema,
  file: z
    .instanceof(File, { message: "Select an image to upload" })
    .refine((file) => file.size > 0, "Select an image to upload")
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
      "Image must be 5MB or smaller",
    )
    .refine(
      (file) =>
        allowedMimeTypes.includes(
          file.type as (typeof allowedMimeTypes)[number],
        ),
      "Image must be JPG, JPEG, PNG, or WebP",
    )
    .refine((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();

      return extension ? allowedExtensions.has(extension) : false;
    }, "Image must have a .jpg, .jpeg, .png, or .webp extension"),
});
