import type { Post, PostCategory } from "@prisma/client";

export type BlogCategoryData = Pick<PostCategory, "id" | "name" | "slug">;

export type BlogPostCardData = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "thumbnailUrl"
  | "excerpt"
  | "publishedAt"
  | "createdAt"
> & {
  category: BlogCategoryData | null;
};

export type BlogPostDetailData = BlogPostCardData &
  Pick<Post, "content" | "seoTitle" | "seoDescription">;

export type BlogPostFilters = {
  category?: string;
  limit?: number;
};
