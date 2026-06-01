import { unstable_cache } from "next/cache";
import { cache } from "react";

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

export const SETTINGS_CACHE_TAG = "settings";
const SETTINGS_CACHE_REVALIDATE_SECONDS = 3600;
const CONTACT_SETTINGS_CACHE_REVALIDATE_SECONDS = 300;

export type ContactSettings = {
  storeInfo: StoreInfo;
  googleMapEmbed: string;
};

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

function logSettingsTiming(label: string, startedAt: number) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.log(`[perf:settings] ${label}: ${Date.now() - startedAt}ms`);
}

async function fetchSettings(): Promise<SettingsMap> {
  const startedAt = Date.now();
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
  logSettingsTiming("settings query", startedAt);

  return mapSettings(records);
}

function toStoreInfo(settings: SettingsMap): StoreInfo {
  return {
    storeName: settings.store_name,
    phone: settings.phone,
    zaloUrl: settings.zalo_url,
    facebookUrl: settings.facebook_url,
    address: settings.address,
    workingHours: settings.working_hours,
  };
}

const getCachedSettings = unstable_cache(fetchSettings, ["store-settings"], {
  revalidate: SETTINGS_CACHE_REVALIDATE_SECONDS,
  tags: [SETTINGS_CACHE_TAG],
});

export const getSettings = cache(async (): Promise<SettingsMap> => {
  return getCachedSettings();
});

async function fetchSettingByKey(key: StoreSettingKey): Promise<string> {
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

const getCachedSettingByKey = unstable_cache(
  fetchSettingByKey,
  ["store-setting-by-key"],
  {
    revalidate: SETTINGS_CACHE_REVALIDATE_SECONDS,
    tags: [SETTINGS_CACHE_TAG],
  },
);

export const getSettingByKey = cache(
  async (key: StoreSettingKey): Promise<string> => {
    return getCachedSettingByKey(key);
  },
);

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

async function fetchStoreInfo(): Promise<StoreInfo> {
  const startedAt = Date.now();
  const settings = await fetchSettings();
  logSettingsTiming("store info loading", startedAt);

  return toStoreInfo(settings);
}

const getCachedStoreInfo = unstable_cache(fetchStoreInfo, ["store-info"], {
  revalidate: SETTINGS_CACHE_REVALIDATE_SECONDS,
  tags: [SETTINGS_CACHE_TAG],
});

export const getStoreInfo = cache(async (): Promise<StoreInfo> => {
  return getCachedStoreInfo();
});

async function fetchContactSettings(): Promise<ContactSettings> {
  const settings = await fetchSettings();

  return {
    storeInfo: toStoreInfo(settings),
    googleMapEmbed: settings.google_map_embed,
  };
}

const getCachedContactSettings = unstable_cache(
  fetchContactSettings,
  ["contact-settings"],
  {
    revalidate: CONTACT_SETTINGS_CACHE_REVALIDATE_SECONDS,
    tags: [SETTINGS_CACHE_TAG],
  },
);

export const getContactSettings = cache(
  async (): Promise<ContactSettings> => {
    return getCachedContactSettings();
  },
);
