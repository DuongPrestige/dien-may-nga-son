import "server-only";

import { ProductStatus } from "@prisma/client";

import { blogPostCardSelect } from "@/src/features/blog/services/blog.service";
import type { BlogPostCardData } from "@/src/features/blog/types/blog.types";
import { productCardSelect } from "@/src/features/products/services/products.service";
import type { ProductCardData } from "@/src/features/products/types/products.types";
import { serviceCardSelect } from "@/src/features/services/services/services.service";
import type { ServiceCardData } from "@/src/features/services/types/services.types";
import { prisma } from "@/src/lib/prisma";
import { slugify } from "@/src/lib/slugify";

export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_MAX_LENGTH = 80;
const PRODUCT_RESULT_LIMIT = 12;
const SERVICE_RESULT_LIMIT = 6;
const POST_RESULT_LIMIT = 6;

export type SearchResults = {
  products: ProductCardData[];
  services: ServiceCardData[];
  posts: BlogPostCardData[];
  total: number;
};

const EMPTY_RESULTS: SearchResults = {
  products: [],
  services: [],
  posts: [],
  total: 0,
};

export function normalizeSearchQuery(raw: string | undefined): string {
  return (raw ?? "").replace(/\s+/g, " ").trim().slice(0, SEARCH_MAX_LENGTH);
}

type TextMatch = { contains: string; mode: "insensitive" };

/**
 * Matches the accented text and the unaccented slug, so "dieu hoa" finds
 * "Điều hòa" the same way "điều hòa" does.
 */
function slugMatch(query: string): Array<{ slug: { contains: string } }> {
  const slugQuery = slugify(query);

  return slugQuery ? [{ slug: { contains: slugQuery } }] : [];
}

function textMatch(query: string): TextMatch {
  return { contains: query, mode: "insensitive" };
}

export async function searchSite(rawQuery: string): Promise<SearchResults> {
  const query = normalizeSearchQuery(rawQuery);

  if (query.length < SEARCH_MIN_LENGTH) {
    return EMPTY_RESULTS;
  }

  const [products, services, posts] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: ProductStatus.ACTIVE,
        OR: [{ name: textMatch(query) }, ...slugMatch(query)],
      },
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
      take: PRODUCT_RESULT_LIMIT,
      select: productCardSelect,
    }),
    prisma.service.findMany({
      where: {
        status: ProductStatus.ACTIVE,
        OR: [{ name: textMatch(query) }, ...slugMatch(query)],
      },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      take: SERVICE_RESULT_LIMIT,
      select: serviceCardSelect,
    }),
    prisma.post.findMany({
      where: {
        isPublished: true,
        OR: [{ title: textMatch(query) }, ...slugMatch(query)],
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: POST_RESULT_LIMIT,
      select: blogPostCardSelect,
    }),
  ]);

  return {
    products,
    services,
    posts,
    total: products.length + services.length + posts.length,
  };
}
