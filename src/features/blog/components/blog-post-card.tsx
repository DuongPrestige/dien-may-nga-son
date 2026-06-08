import Image from "next/image";
import Link from "next/link";

import { formatBlogDate } from "@/src/features/blog/lib/blog-date";
import type { BlogPostCardData } from "@/src/features/blog/types/blog.types";
import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";

type BlogPostCardProps = {
  post: BlogPostCardData;
};

export function BlogPostCard({ post }: BlogPostCardProps) {
  const thumbnailSrc = getSafeImageSrc(post.thumbnailUrl);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#E5E7EB] bg-white transition-colors hover:border-[#0EA5E9]">
      <div className="relative aspect-[16/10] bg-[#E0F2FE]">
        {thumbnailSrc ? (
          <Image
            src={thumbnailSrc}
            alt={post.title}
            fill
            unoptimized={shouldUseUnoptimizedImage(thumbnailSrc)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-5 text-center">
            <span className="text-sm font-bold text-[#0369A1]">
              Kinh nghiệm điện máy
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#0284C7]">
          {post.category ? <span>{post.category.name}</span> : null}
          <span>{formatBlogDate(post.publishedAt ?? post.createdAt)}</span>
        </div>
        <h2 className="mt-2 text-lg font-bold leading-7 text-[#111827]">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-[#6B7280]">
          {post.excerpt ??
            "Bài viết chia sẻ kinh nghiệm chọn mua, sử dụng và bảo dưỡng thiết bị điện máy cho gia đình."}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md border border-[#0EA5E9] px-4 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
        >
          Đọc bài viết
        </Link>
      </div>
    </article>
  );
}
