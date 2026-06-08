import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import type {
  AdminBlogPostDetail,
  AdminBlogPostFilters,
  AdminBlogPostListResult,
  BlogCategoryData,
  BlogPostCardData,
  BlogPostDetailData,
  BlogPostFilters,
} from "@/src/features/blog/types/blog.types";
import { sanitizeBlogContent } from "@/src/features/blog/lib/blog-content";
import type { BlogPostFormSchema } from "@/src/features/blog/validators/blog.validator";
import { syncSlugRedirect } from "@/src/features/redirects/services/redirects.service";
import { prisma } from "@/src/lib/prisma";

export const BLOG_CACHE_TAG = "blog";
export const BLOG_DETAIL_CACHE_TAG = "blog-detail";
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
    tags: [BLOG_CACHE_TAG, BLOG_DETAIL_CACHE_TAG],
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
    tags: [BLOG_CACHE_TAG, BLOG_DETAIL_CACHE_TAG],
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

function buildAdminBlogPostWhere(
  filters: AdminBlogPostFilters,
): Prisma.PostWhereInput {
  return {
    OR: filters.search
      ? [
          {
            title: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
          {
            slug: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        ]
      : undefined,
    isPublished:
      filters.status === "published"
        ? true
        : filters.status === "draft"
          ? false
          : undefined,
    categoryId: filters.categoryId,
  };
}

export async function getAdminBlogPosts(
  filters: AdminBlogPostFilters = {},
): Promise<AdminBlogPostListResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const where = buildAdminBlogPostWhere(filters);

  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        isPublished: true,
        publishedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
    prisma.postCategory.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ]);

  return {
    posts,
    categories,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getAdminBlogPostById(
  id: string,
): Promise<AdminBlogPostDetail | null> {
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      categoryId: true,
      title: true,
      slug: true,
      thumbnailUrl: true,
      excerpt: true,
      content: true,
      isPublished: true,
      seoTitle: true,
      seoDescription: true,
    },
  });

  return post
    ? {
        ...post,
        content: sanitizeBlogContent(post.content),
      }
    : null;
}

export async function getAdminBlogCategories(): Promise<BlogCategoryData[]> {
  return prisma.postCategory.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

function toBlogPostData(input: BlogPostFormSchema) {
  return {
    categoryId: input.categoryId,
    title: input.title,
    slug: input.slug,
    thumbnailUrl: input.thumbnailUrl,
    excerpt: input.excerpt,
    content: sanitizeBlogContent(input.content),
    isPublished: input.isPublished,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
  };
}

export async function createBlogPost(input: BlogPostFormSchema) {
  return prisma.post.create({
    data: {
      ...toBlogPostData(input),
      publishedAt: input.isPublished ? new Date() : null,
    },
    select: {
      slug: true,
    },
  });
}

export async function updateBlogPost(
  id: string,
  input: BlogPostFormSchema,
) {
  return prisma.$transaction(async (tx) => {
    const existingPost = await tx.post.findUniqueOrThrow({
      where: { id },
      select: {
        slug: true,
        publishedAt: true,
      },
    });
    const post = await tx.post.update({
      where: { id },
      data: {
        ...toBlogPostData(input),
        publishedAt: input.isPublished
          ? existingPost.publishedAt ?? new Date()
          : null,
      },
      select: {
        slug: true,
      },
    });

    await syncSlugRedirect(
      tx,
      `/blog/${existingPost.slug}`,
      `/blog/${post.slug}`,
    );

    return {
      previousSlug: existingPost.slug,
      slug: post.slug,
    };
  });
}

export async function deleteBlogPost(id: string) {
  return prisma.post.delete({
    where: { id },
    select: {
      slug: true,
    },
  });
}
