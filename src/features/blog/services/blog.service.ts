import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import type {
  BlogCategoryData,
  BlogPostCardData,
  BlogPostDetailData,
  BlogPostFilters,
} from "@/src/features/blog/types/blog.types";
import { prisma } from "@/src/lib/prisma";

export const BLOG_CACHE_TAG = "blog";
const BLOG_CACHE_REVALIDATE_SECONDS = 600;

const blogPostCardSelect = {
  id: true,
  title: true,
  slug: true,
  thumbnailUrl: true,
  excerpt: true,
  publishedAt: true,
  createdAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.PostSelect;

function buildPublishedPostWhere(
  filters: BlogPostFilters,
): Prisma.PostWhereInput {
  return {
    isPublished: true,
    category: filters.category
      ? {
          slug: filters.category,
        }
      : undefined,
  };
}

async function fetchPublishedPosts(
  filters: BlogPostFilters = {},
): Promise<BlogPostCardData[]> {
  return prisma.post.findMany({
    where: buildPublishedPostWhere(filters),
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: filters.limit,
    select: blogPostCardSelect,
  }) as Promise<BlogPostCardData[]>;
}

const getCachedPublishedPosts = unstable_cache(
  fetchPublishedPosts,
  ["published-posts"],
  {
    revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
    tags: [BLOG_CACHE_TAG],
  },
);

export const getPublishedPosts = cache(
  async (filters: BlogPostFilters = {}): Promise<BlogPostCardData[]> => {
    return getCachedPublishedPosts(filters);
  },
);

async function fetchPostBySlug(
  slug: string,
): Promise<BlogPostDetailData | null> {
  return prisma.post.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    select: {
      ...blogPostCardSelect,
      content: true,
      seoTitle: true,
      seoDescription: true,
    },
  }) as Promise<BlogPostDetailData | null>;
}

const getCachedPostBySlug = unstable_cache(
  fetchPostBySlug,
  ["post-by-slug"],
  {
    revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
    tags: [BLOG_CACHE_TAG],
  },
);

export const getPostBySlug = cache(
  async (slug: string): Promise<BlogPostDetailData | null> => {
    return getCachedPostBySlug(slug);
  },
);

async function fetchRelatedPosts(
  postId: string,
  categorySlug?: string,
  limit = 3,
): Promise<BlogPostCardData[]> {
  return prisma.post.findMany({
    where: {
      id: {
        not: postId,
      },
      isPublished: true,
      category: categorySlug
        ? {
            slug: categorySlug,
          }
        : undefined,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: blogPostCardSelect,
  }) as Promise<BlogPostCardData[]>;
}

const getCachedRelatedPosts = unstable_cache(
  fetchRelatedPosts,
  ["related-posts"],
  {
    revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
    tags: [BLOG_CACHE_TAG],
  },
);

export const getRelatedPosts = cache(
  async (
    postId: string,
    categorySlug?: string,
    limit = 3,
  ): Promise<BlogPostCardData[]> => {
    return getCachedRelatedPosts(postId, categorySlug, limit);
  },
);

async function fetchPostCategories(): Promise<BlogCategoryData[]> {
  return prisma.postCategory.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

const getCachedPostCategories = unstable_cache(
  fetchPostCategories,
  ["post-categories"],
  {
    revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
    tags: [BLOG_CACHE_TAG],
  },
);

export const getPostCategories = cache(
  async (): Promise<BlogCategoryData[]> => {
    return getCachedPostCategories();
  },
);

async function fetchPostSlugs(): Promise<string[]> {
  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
    },
    select: {
      slug: true,
    },
  });

  return posts.map((post) => post.slug);
}

const getCachedPostSlugs = unstable_cache(fetchPostSlugs, ["post-slugs"], {
  revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
  tags: [BLOG_CACHE_TAG],
});

export const getPostSlugs = cache(async (): Promise<string[]> => {
  return getCachedPostSlugs();
});
