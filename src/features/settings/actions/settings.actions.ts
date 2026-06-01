"use server";

import { updateTag } from "next/cache";

import type { ActionResult } from "@/src/features/settings/types/settings.types";
import {
  SETTINGS_CACHE_TAG,
  updateSetting,
} from "@/src/features/settings/services/settings.service";
import { updateSettingSchema } from "@/src/features/settings/validators/settings.validator";

type UpdateSettingActionInput = {
  key: string;
  value: string;
};

export async function updateSettingAction(
  input: UpdateSettingActionInput,
): Promise<ActionResult> {
  const parsedInput = updateSettingSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      message: parsedInput.error.issues[0]?.message ?? "Dữ liệu không hợp lệ",
    };
  }

  try {
    await updateSetting(parsedInput.data);
    updateTag(SETTINGS_CACHE_TAG);

    return {
      success: true,
      message: "Cập nhật cài đặt thành công",
      data: undefined,
    };
  } catch (error) {
    console.error("Failed to update setting", error);

    return {
      success: false,
      message: "Không thể cập nhật cài đặt",
    };
  }
}
