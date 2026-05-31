import type { Metadata } from "next";

const PRODUCTION_SITE_URL = "https://dienmayngason.vn";
const DEVELOPMENT_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  return process.env.NODE_ENV === "production"
    ? PRODUCTION_SITE_URL
    : DEVELOPMENT_SITE_URL;
}

export const SITE_URL = getSiteUrl();
export const SITE_NAME = "Điện Máy Nga Sơn";

type OpenGraphType = "website" | "article";

type SeoImage = string | URL;

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  type?: OpenGraphType;
  images?: SeoImage[];
  publishedTime?: string;
};

export function buildCanonicalUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalizedPath, SITE_URL).toString();
}

export function buildOpenGraph({
  title,
  description,
  path = "/",
  type = "website",
  images,
  publishedTime,
}: BuildMetadataInput): Metadata["openGraph"] {
  return {
    title,
    description,
    url: buildCanonicalUrl(path),
    siteName: SITE_NAME,
    type,
    images,
    publishedTime: type === "article" ? publishedTime : undefined,
    locale: "vi_VN",
  };
}

export function buildTwitterMetadata({
  title,
  description,
  images,
}: Pick<BuildMetadataInput, "title" | "description" | "images">): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images,
  };
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: input.title,
    description: input.description,
    alternates: {
      canonical: buildCanonicalUrl(input.path),
    },
    openGraph: buildOpenGraph(input),
    twitter: buildTwitterMetadata(input),
  };
}
