"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  SETTINGS_CACHE_TAG,
  updateSetting,
  updateSettings,
} from "@/src/features/settings/services/settings.service";
import type {
  ActionResult,
  SettingsActionState,
} from "@/src/features/settings/types/settings.types";
import {
  updateSettingSchema,
  updateSettingsSchema,
} from "@/src/features/settings/validators/settings.validator";

type UpdateSettingActionInput = {
  key: string;
  value: string;
};

async function requireAdminSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }
}

function invalidateSettingsCaches() {
  updateTag(SETTINGS_CACHE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}

export async function updateSettingAction(
  input: UpdateSettingActionInput,
): Promise<ActionResult> {
  await requireAdminSession();

  const parsedInput = updateSettingSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      message: parsedInput.error.issues[0]?.message ?? "Dữ liệu không hợp lệ",
    };
  }

  try {
    await updateSetting(parsedInput.data);
    invalidateSettingsCaches();

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

export async function updateSettingsAction(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  void _previousState;
  await requireAdminSession();

  const parsedInput = updateSettingsSchema.safeParse(
    Object.fromEntries(
      Object.keys(updateSettingsSchema.shape).map((key) => [
        key,
        formData.get(key),
      ]),
    ),
  );

  if (!parsedInput.success) {
    const fieldErrors = parsedInput.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Please check the settings form.",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).flatMap(([key, messages]) => {
          const message = messages?.[0];

          return message ? [[key, message]] : [];
        }),
      ),
    };
  }

  try {
    await updateSettings(parsedInput.data);
    invalidateSettingsCaches();

    return {
      success: true,
      message: "Settings saved successfully.",
      fieldErrors: {},
    };
  } catch (error) {
    console.error("Failed to update settings", error);

    return {
      success: false,
      message: "Could not save settings. Please try again.",
      fieldErrors: {},
    };
  }
}
