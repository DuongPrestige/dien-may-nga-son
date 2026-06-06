"use server";

import type { UploadApiResponse } from "cloudinary";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCloudinaryClient } from "@/src/lib/cloudinary";
import {
  UPLOAD_FOLDERS,
  type UploadImageResult,
} from "@/src/features/uploads/types/upload.types";
import { uploadImageSchema } from "@/src/features/uploads/validators/upload.validator";

async function requireAdminSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }
}

function uploadBuffer(
  buffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> {
  const cloudinary = getCloudinaryClient();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary did not return an image"));
          return;
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });
}

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadImageResult> {
  await requireAdminSession();

  const parsedInput = uploadImageSchema.safeParse({
    folder: formData.get("folder"),
    file: formData.get("file"),
  });

  if (!parsedInput.success) {
    return {
      success: false,
      message:
        parsedInput.error.issues[0]?.message ?? "Invalid image upload request",
    };
  }

  try {
    const buffer = Buffer.from(await parsedInput.data.file.arrayBuffer());
    const result = await uploadBuffer(
      buffer,
      UPLOAD_FOLDERS[parsedInput.data.folder],
    );

    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Failed to upload image to Cloudinary", error);

    return {
      success: false,
      message: "Could not upload the image. Check Cloudinary configuration.",
    };
  }
}
