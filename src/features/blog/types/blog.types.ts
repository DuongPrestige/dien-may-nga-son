import type { Post, PostCategory } from "@prisma/client";

import type { BlogDateValue } from "@/src/features/blog/lib/blog-date";

export type BlogCategoryData = Pick<PostCategory, "id" | "name" | "slug">;

export type BlogPostCardData = Pick<
  Post,
  "id" | "title" | "slug" | "thumbnailUrl" | "excerpt"
> & {
  publishedAt: BlogDateValue;
  createdAt: BlogDateValue;
  category: BlogCategoryData | null;
};

export type BlogPostDetailData = BlogPostCardData &
  Pick<Post, "content" | "seoTitle" | "seoDescription">;

export type BlogPostFilters = {
  category?: string;
  limit?: number;
};

export type AdminBlogPostStatus = "published" | "draft";

export type AdminBlogPostFilters = {
  search?: string;
  status?: AdminBlogPostStatus;
  categoryId?: string;
  page?: number;
  limit?: number;
};

export type AdminBlogPostListItem = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "isPublished"
  | "publishedAt"
> & {
  category: Pick<PostCategory, "id" | "name"> | null;
};

export type AdminBlogPostDetail = Pick<
  Post,
  | "id"
  | "categoryId"
  | "title"
  | "slug"
  | "thumbnailUrl"
  | "excerpt"
  | "content"
  | "isPublished"
  | "seoTitle"
  | "seoDescription"
>;

export type AdminBlogPostListResult = {
  posts: AdminBlogPostListItem[];
  categories: BlogCategoryData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type BlogPostActionState = {
  success: boolean;
  message: string;
  fieldErrors: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    thumbnailUrl?: string;
    categoryId?: string;
    seoTitle?: string;
    seoDescription?: string;
  };
};
