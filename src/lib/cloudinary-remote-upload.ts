import "server-only";

import { getCloudinaryClient } from "@/src/lib/cloudinary";

const REMOTE_UPLOAD_TIMEOUT_MS = 20000;

/**
 * Asks Cloudinary to fetch a remote https image and store a permanent copy.
 * The download happens on Cloudinary's side, so no remote bytes pass through
 * this server. Returns the secure Cloudinary URL.
 */
export async function uploadRemoteImageToCloudinary(
  remoteUrl: string,
  folder: string,
): Promise<string> {
  const url = new URL(remoteUrl);
  if (url.protocol !== "https:") {
    throw new Error("Only https image URLs can be uploaded");
  }

  const cloudinary = getCloudinaryClient();
  const result = await cloudinary.uploader.upload(url.toString(), {
    folder,
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    timeout: REMOTE_UPLOAD_TIMEOUT_MS,
  });

  if (!result.secure_url) {
    throw new Error("Cloudinary did not return an image URL");
  }

  return result.secure_url;
}
