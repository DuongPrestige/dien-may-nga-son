export const ANALYTICS_EVENTS = {
  phoneClick: "phone_click",
  zaloClick: "zalo_click",
  facebookClick: "facebook_click",
  quoteClick: "quote_click",
  generateLead: "generate_lead",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsEventParams = Record<string, string | number | boolean>;

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{4,20}$/;

const FACEBOOK_HOSTS = new Set([
  "facebook.com",
  "www.facebook.com",
  "m.facebook.com",
  "fb.com",
  "m.me",
]);

const QUOTE_ANCHOR = "#bao-gia";

export const ANALYTICS_EVENT_ATTRIBUTE = "data-analytics-event";

export function getValidMeasurementId(
  value: string | undefined,
): string | null {
  const trimmed = value?.trim().toUpperCase();

  return trimmed && GA_MEASUREMENT_ID_PATTERN.test(trimmed) ? trimmed : null;
}

export function isTrackedPath(pathname: string): boolean {
  return pathname !== "/admin" && !pathname.startsWith("/admin/");
}

function getHostname(href: string): string | null {
  try {
    return new URL(href).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Maps a clicked link to a lead-intent analytics event, or null when the
 * link is not a contact/quote call-to-action.
 */
export function getClickEventName(
  href: string,
  explicitEvent: string | null,
): AnalyticsEventName | null {
  const knownEvents = Object.values(ANALYTICS_EVENTS) as string[];

  if (explicitEvent && knownEvents.includes(explicitEvent)) {
    return explicitEvent as AnalyticsEventName;
  }

  const normalizedHref = href.trim().toLowerCase();

  if (normalizedHref.startsWith("tel:")) {
    return ANALYTICS_EVENTS.phoneClick;
  }

  if (normalizedHref.endsWith(QUOTE_ANCHOR)) {
    return ANALYTICS_EVENTS.quoteClick;
  }

  const hostname = getHostname(normalizedHref);

  if (!hostname) {
    return null;
  }

  if (hostname === "zalo.me" || hostname.endsWith(".zalo.me")) {
    return ANALYTICS_EVENTS.zaloClick;
  }

  if (FACEBOOK_HOSTS.has(hostname)) {
    return ANALYTICS_EVENTS.facebookClick;
  }

  return null;
}
