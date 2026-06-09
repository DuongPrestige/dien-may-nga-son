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
