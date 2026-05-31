import { SITE_NAME, SITE_URL, buildCanonicalUrl } from "@/src/lib/seo";

type SchemaValue =
  | string
  | number
  | boolean
  | null
  | SchemaObject
  | SchemaValue[];

export type SchemaObject = {
  [key: string]: SchemaValue | undefined;
};

type LocalBusinessSchemaInput = {
  name?: string;
  url?: string;
  telephone?: string;
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
  openingHours?: string;
  hasMap?: string;
  sameAs?: string[];
  areaServed?: string[];
  makesOffer?: string[];
};

type ProductSchemaInput = {
  name: string;
  description: string;
  image?: string[];
  brandName?: string;
  category?: string;
  price?: number;
  url: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type BreadcrumbItem = {
  name: string;
  url: string;
};

type ArticleSchemaInput = {
  title: string;
  description: string;
  url: string;
  image?: string[];
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  publisherName?: string;
};

export function LocalBusinessSchema({
  name = SITE_NAME,
  url = SITE_URL,
  telephone,
  streetAddress = "Quang Thành - Kinh Môn - Hải Dương",
  addressLocality = "Kinh Môn",
  addressRegion = "Hải Dương",
  addressCountry = "VN",
  openingHours,
  hasMap,
  sameAs,
  areaServed = ["Quang Thành", "Kinh Môn", "Hải Dương"],
  makesOffer,
}: LocalBusinessSchemaInput = {}): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    url,
    telephone: telephone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressRegion,
      addressCountry,
    },
    openingHours: openingHours || undefined,
    hasMap: hasMap || undefined,
    sameAs: sameAs && sameAs.length > 0 ? sameAs : undefined,
    areaServed,
    makesOffer:
      makesOffer && makesOffer.length > 0
        ? makesOffer.map((offerName) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: offerName,
            },
          }))
        : undefined,
  };
}

export function ProductSchema({
  name,
  description,
  image,
  brandName,
  category,
  price,
  url,
}: ProductSchemaInput): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image,
    description,
    brand: brandName
      ? {
          "@type": "Brand",
          name: brandName,
        }
      : undefined,
    category,
    offers:
      price !== undefined
        ? {
            "@type": "Offer",
            priceCurrency: "VND",
            price,
            availability: "https://schema.org/InStock",
            url: buildCanonicalUrl(url),
          }
        : undefined,
  };
}

export function FAQSchema(items: FAQItem[]): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function BreadcrumbSchema(items: BreadcrumbItem[]): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.url),
    })),
  };
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified = datePublished,
  authorName = SITE_NAME,
  publisherName = SITE_NAME,
}: ArticleSchemaInput): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
    },
    mainEntityOfPage: buildCanonicalUrl(url),
  };
}
