import type { Prisma } from "@prisma/client";

import type {
  BlogCategoryData,
  BlogPostCardData,
  BlogPostDetailData,
  BlogPostFilters,
} from "@/src/features/blog/types/blog.types";
import { prisma } from "@/src/lib/prisma";

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

export async function getPublishedPosts(
  filters: BlogPostFilters = {},
): Promise<BlogPostCardData[]> {
  return prisma.post.findMany({
    where: buildPublishedPostWhere(filters),
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: filters.limit,
    select: blogPostCardSelect,
  }) as Promise<BlogPostCardData[]>;
}

export async function getPostBySlug(
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

export async function getRelatedPosts(
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

export async function getPostCategories(): Promise<BlogCategoryData[]> {
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

export async function getPostSlugs(): Promise<string[]> {
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
