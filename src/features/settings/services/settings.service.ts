import { prisma } from "@/src/lib/prisma";
import {
  EMPTY_SETTINGS,
  STORE_SETTING_KEYS,
  type StoreSettingKey,
} from "@/src/features/settings/constants";
import type {
  SettingRecord,
  SettingsMap,
  StoreInfo,
  UpdateSettingInput,
} from "@/src/features/settings/types/settings.types";

function mapSettings(records: SettingRecord[]): SettingsMap {
  const settings = { ...EMPTY_SETTINGS };

  for (const record of records) {
    if (isStoreSettingKey(record.settingKey)) {
      settings[record.settingKey] = record.settingValue ?? "";
    }
  }

  return settings;
}

function isStoreSettingKey(key: string): key is StoreSettingKey {
  return STORE_SETTING_KEYS.includes(key as StoreSettingKey);
}

export async function getSettings(): Promise<SettingsMap> {
  const records = await prisma.setting.findMany({
    where: {
      settingKey: {
        in: [...STORE_SETTING_KEYS],
      },
    },
    select: {
      settingKey: true,
      settingValue: true,
    },
  });

  return mapSettings(records);
}

export async function getSettingByKey(
  key: StoreSettingKey,
): Promise<string> {
  const setting = await prisma.setting.findUnique({
    where: {
      settingKey: key,
    },
    select: {
      settingValue: true,
    },
  });

  return setting?.settingValue ?? "";
}

export async function updateSetting({
  key,
  value,
}: UpdateSettingInput): Promise<SettingRecord> {
  return prisma.setting.upsert({
    where: {
      settingKey: key,
    },
    update: {
      settingValue: value,
    },
    create: {
      settingKey: key,
      settingValue: value,
    },
    select: {
      settingKey: true,
      settingValue: true,
    },
  });
}

export async function getStoreInfo(): Promise<StoreInfo> {
  const settings = await getSettings();

  return {
    storeName: settings.store_name,
    phone: settings.phone,
    zaloUrl: settings.zalo_url,
    facebookUrl: settings.facebook_url,
    address: settings.address,
    workingHours: settings.working_hours,
  };
}

