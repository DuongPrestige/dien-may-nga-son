import { z } from "zod";

import {
  MAX_POLICY_LINES,
  STORE_SETTING_KEYS,
} from "@/src/features/settings/constants";
import { isValidImageSrc } from "@/src/lib/image-src";
import {
  isGoogleMapsEmbedUrl,
  isGoogleMapsShareUrl,
} from "@/src/features/settings/lib/google-map";

export const settingKeySchema = z.enum(STORE_SETTING_KEYS);

const optionalHttpUrlSchema = z
  .string()
  .trim()
  .max(2000, "URL must be 2,000 characters or fewer")
  .refine((value) => {
    if (!value) {
      return true;
    }

    try {
      const url = new URL(value);

      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid HTTP or HTTPS URL");

const statSchema = z
  .string()
  .trim()
  .max(24, "Keep this value short (24 characters or fewer)");

const policySchema = z
  .string()
  .trim()
  .max(800, "Policy must be 800 characters or fewer")
  .refine(
    (value) =>
      value.split(/\r?\n/).filter((line) => line.trim()).length <=
      MAX_POLICY_LINES,
    `Use at most ${MAX_POLICY_LINES} lines`,
  );

export const updateSettingsSchema = z.object({
  store_name: z
    .string()
    .trim()
    .min(1, "Store name is required")
    .max(255, "Store name must be 255 characters or fewer"),
  phone: z
    .string()
    .trim()
    .min(8, "Phone number must be at least 8 characters")
    .max(20, "Phone number must be 20 characters or fewer")
    .regex(
      /^[+\d\s().-]+$/,
      "Phone number may only contain digits and common phone symbols",
    ),
  address: z
    .string()
    .trim()
    .max(500, "Address must be 500 characters or fewer"),
  working_hours: z
    .string()
    .trim()
    .max(255, "Working hours must be 255 characters or fewer"),
  zalo_url: optionalHttpUrlSchema,
  facebook_url: optionalHttpUrlSchema,
  google_map_embed: optionalHttpUrlSchema.superRefine((value, context) => {
    if (!value || isGoogleMapsEmbedUrl(value)) {
      return;
    }

    context.addIssue({
      code: "custom",
      message: isGoogleMapsShareUrl(value)
        ? "Google Maps share links cannot be embedded. Paste the URL from Share > Embed a map."
        : "Enter a valid Google Maps embed URL.",
    });
  }),
  default_seo_title: z
    .string()
    .trim()
    .max(255, "SEO title must be 255 characters or fewer"),
  default_seo_description: z
    .string()
    .trim()
    .max(500, "SEO description must be 500 characters or fewer"),
  logo_url: z
    .string()
    .trim()
    .refine(
      (value) => !value || isValidImageSrc(value),
      "Enter an http/https image URL or a path starting with /",
    ),
  stat_years: statSchema,
  stat_projects: statSchema,
  stat_response_time: statSchema,
  warranty_policy: policySchema,
  ac_install_policy: policySchema,
});

export const updateSettingSchema = z
  .object({
    key: settingKeySchema,
    value: z.string().trim(),
  })
  .superRefine((input, context) => {
    const result = updateSettingsSchema.shape[input.key].safeParse(input.value);

    if (!result.success) {
      context.addIssue({
        code: "custom",
        path: ["value"],
        message: result.error.issues[0]?.message ?? "Invalid setting value",
      });
    }
  });

export type UpdateSettingSchema = z.infer<typeof updateSettingSchema>;
export type UpdateSettingsSchema = z.infer<typeof updateSettingsSchema>;

