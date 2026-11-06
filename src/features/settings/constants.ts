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
  "logo_url",
  "stat_years",
  "stat_projects",
  "stat_response_time",
  "warranty_policy",
  "ac_install_policy",
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
  logo_url: "",
  stat_years: "",
  stat_projects: "",
  stat_response_time: "",
  warranty_policy: "",
  ac_install_policy: "",
};

export const MAX_POLICY_LINES = 6;

