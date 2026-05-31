export const STORE_SETTING_KEYS = [
  "store_name",
  "phone",
  "zalo_url",
  "facebook_url",
  "address",
  "working_hours",
  "google_map_embed",
  "default_seo_title",
  "default_seo_description",
] as const;

export type StoreSettingKey = (typeof STORE_SETTING_KEYS)[number];

export const EMPTY_SETTINGS: Record<StoreSettingKey, string> = {
  store_name: "",
  phone: "",
  zalo_url: "",
  facebook_url: "",
  address: "",
  working_hours: "",
  google_map_embed: "",
  default_seo_title: "",
  default_seo_description: "",
};

