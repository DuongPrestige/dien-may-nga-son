import type { StoreInfo } from "@/src/features/settings/types/settings.types";

export type StoreContactLinks = {
  phoneHref: string;
  zaloHref: string;
  facebookHref: string;
};

function getHttpHref(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "/contact";
  }

  try {
    const url = new URL(trimmed);

    return url.protocol === "http:" || url.protocol === "https:"
      ? trimmed
      : "/contact";
  } catch {
    return "/contact";
  }
}

export function getStoreContactLinks(
  storeInfo: StoreInfo,
): StoreContactLinks {
  const phone = storeInfo.phone.trim();

  return {
    phoneHref: phone ? `tel:${phone}` : "/contact",
    zaloHref: getHttpHref(storeInfo.zaloUrl),
    facebookHref: getHttpHref(storeInfo.facebookUrl),
  };
}

export const DEFAULT_STORE_NAME = "Điện Máy Nga Sơn";

const PHONE_GROUPS_10_DIGITS = /^(\d{4})(\d{3})(\d{3})$/;

/**
 * Formats a Vietnamese phone number for display, e.g. "0367965606" →
 * "0367 965 606". Returns the trimmed input unchanged for other formats.
 */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const match = PHONE_GROUPS_10_DIGITS.exec(digits);

  return match ? `${match[1]} ${match[2]} ${match[3]}` : phone.trim();
}
