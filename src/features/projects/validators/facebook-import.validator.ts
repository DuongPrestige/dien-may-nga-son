import { z } from "zod";

import { isAllowedFacebookUrl } from "@/src/features/projects/lib/facebook-metadata";

const MAX_FACEBOOK_URL_LENGTH = 2048;

function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export const facebookImportSchema = z.object({
  url: z
    .string({ error: "Vui lòng dán liên kết bài đăng Facebook" })
    .trim()
    .min(1, "Vui lòng dán liên kết bài đăng Facebook")
    .max(MAX_FACEBOOK_URL_LENGTH, "Liên kết quá dài")
    .refine((value) => parseUrl(value) !== null, "Liên kết không hợp lệ")
    .refine((value) => {
      const url = parseUrl(value);
      return url !== null && isAllowedFacebookUrl(url);
    }, "Chỉ hỗ trợ liên kết HTTPS từ facebook.com hoặc fb.watch"),
});

export type FacebookImportSchema = z.infer<typeof facebookImportSchema>;
