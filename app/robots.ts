import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/src/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/*", "/api/*"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
