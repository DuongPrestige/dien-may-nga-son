import "server-only";

import { v2 as cloudinary } from "cloudinary";

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getCloudinaryClient() {
  cloudinary.config({
    cloud_name: getRequiredEnvironmentVariable("CLOUDINARY_CLOUD_NAME"),
    api_key: getRequiredEnvironmentVariable("CLOUDINARY_API_KEY"),
    api_secret: getRequiredEnvironmentVariable("CLOUDINARY_API_SECRET"),
    secure: true,
  });

  return cloudinary;
}
