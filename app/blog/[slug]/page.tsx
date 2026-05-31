import { LeadSourceType } from "@prisma/client";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { BlogPostCard } from "@/src/features/blog/components/blog-post-card";
import {
  getPostBySlug,
  getPostSlugs,
  getRelatedPosts,
} from "@/src/features/blog/services/blog.service";
import type {
  BlogPostCardData,
  BlogPostDetailData,
} from "@/src/features/blog/types/blog.types";
import { LeadForm } from "@/src/features/leads/components/lead-form";
import { buildMetadata } from "@/src/lib/seo";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type TocItem = {
  id: string;
  title: string;
};

type ContentBlock =
  | {
      type: "heading";
      id: string;
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    };

function formatPostDate(date: Date | null): string {
  if (!date) {
    return "Đang cập nhật";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function createAnchorId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseContent(content: string): {
  blocks: ContentBlock[];
  tocItems: TocItem[];
} {
  const blocks: ContentBlock[] = [];
  const tocItems: TocItem[] = [];
  const sections = content
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean);

  for (const section of sections) {
    if (section.startsWith("## ")) {
      const title = section.replace(/^##\s+/, "").trim();
      const id = createAnchorId(title);

      blocks.push({ type: "heading", id, text: title });
      tocItems.push({ id, title });
    } else {
      blocks.push({ type: "paragraph", text: section });
    }
  }

  return { blocks, tocItems };
}

function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

function buildArticleSchema(post: BlogPostDetailData) {
  const baseUrl = getBaseUrl();
  const publishedDate = post.publishedAt ?? post.createdAt;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? post.seoDescription ?? post.title,
    image: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
    datePublished: publishedDate.toISOString(),
    dateModified: publishedDate.toISOString(),
    author: {
      "@type": "Organization",
      name: "Điện Máy Nga Sơn",
    },
    publisher: {
      "@type": "Organization",
      name: "Điện Máy Nga Sơn",
    },
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
  };
}

function buildBreadcrumbSchema(post: BlogPostDetailData) {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${post.slug}`,
      },
    ],
  };
}

async function getSafePost(slug: string): Promise<BlogPostDetailData | null> {
  try {
    return await getPostBySlug(slug);
  } catch {
    return null;
  }
}

async function getSafeRelatedPosts(
  post: BlogPostDetailData,
): Promise<BlogPostCardData[]> {
  try {
    return await getRelatedPosts(post.id, post.category?.slug);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs();

    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getSafePost(slug);

  if (!post) {
    return {
      title: "Blog | Điện Máy Nga Sơn",
    };
  }

  const title =
    post.seoTitle ?? `${post.title} | Kinh nghiệm điện máy`;
  const description =
    post.seoDescription ??
    post.excerpt ??
    "Bài viết tư vấn điện máy từ Điện Máy Nga Sơn cho khách hàng tại Kinh Môn, Quang Thành, Hải Dương.";

  return buildMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
    images: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getSafePost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getSafeRelatedPosts(post);
  const { blocks, tocItems } = parseContent(post.content);
  const articleSchema = buildArticleSchema(post);
  const breadcrumbSchema = buildBreadcrumbSchema(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Section className="bg-[#F8FAFC] py-8 sm:py-12">
        <Container>
          <article className="mx-auto max-w-4xl">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 text-sm font-semibold text-[#0284C7]">
                {post.category ? <span>{post.category.name}</span> : null}
                <time dateTime={(post.publishedAt ?? post.createdAt).toISOString()}>
                  {formatPostDate(post.publishedAt ?? post.createdAt)}
                </time>
              </div>
              <h1 className="text-3xl font-bold leading-tight text-[#111827] sm:text-5xl">
                {post.title}
              </h1>
              {post.excerpt ? (
                <p className="text-base leading-7 text-[#6B7280]">
                  {post.excerpt}
                </p>
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="tel:#"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
                >
                  Gọi tư vấn
                </a>
                <Link
                  href="#tu-van"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-5 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
                >
                  Gửi câu hỏi
                </Link>
              </div>
            </div>

            {post.thumbnailUrl ? (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-[#E0F2FE]">
                <Image
                  src={post.thumbnailUrl}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 896px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </article>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-[0.78fr_0.22fr]">
          <article className="max-w-3xl">
            {tocItems.length > 0 ? (
              <nav
                aria-label="Mục lục bài viết"
                className="mb-8 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-5"
              >
                <h2 className="text-lg font-bold text-[#111827]">Mục lục</h2>
                <ol className="mt-3 space-y-2 text-sm leading-6 text-[#374151]">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="hover:text-[#0284C7]">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            <div className="space-y-6 text-base leading-8 text-[#374151]">
              {blocks.map((block) =>
                block.type === "heading" ? (
                  <h2
                    key={block.id}
                    id={block.id}
                    className="scroll-mt-24 pt-2 text-2xl font-bold leading-tight text-[#111827]"
                  >
                    {block.text}
                  </h2>
                ) : (
                  <p key={block.text} className="whitespace-pre-line">
                    {block.text}
                  </p>
                ),
              )}
            </div>

            <div className="mt-10 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-[#111827]">
                Cần tư vấn thêm từ Điện Máy Nga Sơn?
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#374151]">
                Nếu bạn đang chọn mua điều hòa, cần bảo dưỡng thiết bị hoặc gặp
                lỗi khi sử dụng điện máy tại Kinh Môn, Quang Thành, Hải Dương,
                hãy để lại thông tin để được tư vấn phù hợp.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href="tel:#"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
                >
                  Gọi ngay
                </a>
                <a
                  href="#tu-van"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#F97316] px-5 text-sm font-bold text-[#C2410C] hover:bg-white"
                >
                  Gửi yêu cầu tư vấn
                </a>
              </div>
            </div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div
              id="tu-van"
              className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)]"
            >
              <h2 className="text-xl font-bold text-[#111827]">
                Gửi yêu cầu tư vấn
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                Mô tả nhu cầu hoặc lỗi thiết bị để Điện Máy Nga Sơn liên hệ hỗ
                trợ.
              </p>
              <LeadForm
                className="mt-5"
                sourceType={LeadSourceType.BLOG}
                sourceUrl={`/blog/${post.slug}`}
              />
            </div>

            <div className="rounded-lg border border-[#BAE6FD] bg-[#F0F9FF] p-5">
              <h2 className="text-xl font-bold text-[#111827]">
                Khu vực hỗ trợ
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#374151]">
                Nội dung tư vấn ưu tiên khách hàng gia đình tại Kinh Môn, Quang
                Thành và Hải Dương.
              </p>
            </div>
          </aside>
        </Container>
      </Section>

      {relatedPosts.length > 0 ? (
        <Section className="bg-[#F8FAFC]">
          <Container>
            <h2 className="text-2xl font-bold text-[#111827]">
              Bài viết liên quan
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
