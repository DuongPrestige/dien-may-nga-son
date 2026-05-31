import { z } from "zod";

import { STORE_SETTING_KEYS } from "@/src/features/settings/constants";

export const settingKeySchema = z.enum(STORE_SETTING_KEYS);

export const updateSettingSchema = z.object({
  key: settingKeySchema,
  value: z.string().trim().max(10000, "Giá trị cài đặt quá dài"),
});

export type UpdateSettingSchema = z.infer<typeof updateSettingSchema>;

