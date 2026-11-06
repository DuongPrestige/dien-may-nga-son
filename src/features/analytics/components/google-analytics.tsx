import Script from "next/script";

import { AnalyticsTracker } from "@/src/features/analytics/components/analytics-tracker";
import { getValidMeasurementId } from "@/src/features/analytics/lib/analytics-events";

/**
 * Loads GA4 only when GOOGLE_ANALYTICS_ID holds a valid "G-..." id.
 * Page views are sent manually by AnalyticsTracker so admin pages are
 * excluded and client-side navigations are counted once.
 */
export function GoogleAnalytics() {
  const measurementId = getValidMeasurementId(process.env.GOOGLE_ANALYTICS_ID);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      {/* Inline so window.gtag exists before hydration; the id is validated. */}
      <script
        id="ga-init"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag("js",new Date());window.gtag("config","${measurementId}",{send_page_view:false});`,
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <AnalyticsTracker />
    </>
  );
}
