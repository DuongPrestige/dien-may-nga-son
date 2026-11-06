import type {
  AnalyticsEventName,
  AnalyticsEventParams,
} from "@/src/features/analytics/lib/analytics-events";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      target: string | Date,
      params?: Record<string, unknown>,
    ) => void;
  }
}

/**
 * Sends a GA4 event. No-op when Google Analytics is not configured, so
 * callers never need to check whether tracking is enabled.
 */
export function trackEvent(
  name: AnalyticsEventName | "page_view",
  params: AnalyticsEventParams = {},
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", name, params);
}
