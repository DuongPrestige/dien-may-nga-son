import type { Setting } from "@prisma/client";

import type { StoreSettingKey } from "@/src/features/settings/constants";

export type SettingRecord = Pick<Setting, "settingKey" | "settingValue">;

export type SettingsMap = Record<StoreSettingKey, string>;

export type UpdateSettingInput = {
  key: StoreSettingKey;
  value: string;
};

export type StoreInfo = {
  storeName: string;
  phone: string;
  zaloUrl: string;
  facebookUrl: string;
  address: string;
  workingHours: string;
};

export type ActionResult<TData = undefined> =
  | {
      success: true;
      message?: string;
      data: TData;
    }
  | {
      success: false;
      message: string;
    };

