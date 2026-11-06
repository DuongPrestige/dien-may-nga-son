"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  ANALYTICS_EVENT_ATTRIBUTE,
  getClickEventName,
  isTrackedPath,
} from "@/src/features/analytics/lib/analytics-events";
import { trackEvent } from "@/src/features/analytics/lib/track-event";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isTrackedPath(pathname)) {
      return;
    }

    trackEvent("page_view", {
      page_path: `${pathname}${window.location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!isTrackedPath(window.location.pathname)) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("a[href]");

      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const eventName = getClickEventName(
        link.href,
        link.getAttribute(ANALYTICS_EVENT_ATTRIBUTE),
      );

      if (!eventName) {
        return;
      }

      trackEvent(eventName, {
        link_url: link.href,
        link_text: link.textContent?.trim().slice(0, 100) ?? "",
        page_path: window.location.pathname,
      });
    }

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  return null;
}
