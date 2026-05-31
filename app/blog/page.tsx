import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { BlogPostCard } from "@/src/features/blog/components/blog-post-card";
import {
  getPostCategories,
  getPublishedPosts,
} from "@/src/features/blog/services/blog.service";
import type {
  BlogCategoryData,
  BlogPostCardData,
  BlogPostFilters,
} from "@/src/features/blog/types/blog.types";

export const metadata: Metadata = {
  title: "Kinh nghiệm điện máy | Điện Máy Nga Sơn",
  description:
    "Bài viết tư vấn chọn mua điều hòa, sử dụng thiết bị điện máy, bảo dưỡng và xử lý lỗi thường gặp cho khách hàng Kinh Môn, Hải Dương.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Kinh nghiệm điện máy | Điện Máy Nga Sơn",
    description:
      "Tư vấn điện máy thực tế cho gia đình tại Kinh Môn, Quang Thành, Hải Dương.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinh nghiệm điện máy | Điện Máy Nga Sơn",
    description:
      "Tư vấn chọn mua, sử dụng, bảo dưỡng và sửa chữa thiết bị điện máy gia đình.",
  },
};

type BlogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type BlogPageData = {
  posts: BlogPostCardData[];
  categories: BlogCategoryData[];
};

const emptyBlogPageData: BlogPageData = {
  posts: [],
  categories: [],
};

function getSearchValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = searchParams[key];

  return typeof value === "string" && value.length > 0 ? value : undefined;
}

async function getSafeBlogPageData(
  filters: BlogPostFilters,
): Promise<BlogPageData> {
  try {
    const [posts, categories] = await Promise.all([
      getPublishedPosts(filters),
      getPostCategories(),
    ]);

    return { posts, categories };
  } catch {
    return emptyBlogPageData;
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters: BlogPostFilters = {
    category: getSearchValue(resolvedSearchParams, "category"),
  };
  const { posts, categories } = await getSafeBlogPageData(filters);

  return (
    <>
      <Section className="bg-[#F8FAFC] py-10 sm:py-14">
        <Container>
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-bold uppercase text-[#0284C7]">
              Kinh nghiệm điện máy gia đình
            </p>
            <h1 className="text-3xl font-bold leading-tight text-[#111827] sm:text-5xl">
              Tư vấn chọn mua, sử dụng và bảo dưỡng điện máy
            </h1>
            <p className="text-base leading-7 text-[#6B7280]">
              Điện Máy Nga Sơn chia sẻ nội dung thực tế về điều hòa, tủ lạnh,
              máy giặt và các lỗi thường gặp để khách hàng tại Kinh Môn, Quang
              Thành, Hải Dương dễ chọn đúng giải pháp.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          {categories.length > 0 ? (
            <form
              action="/blog"
              className="rounded-lg border border-[#E5E7EB] bg-white p-4"
            >
              <label className="grid gap-2 text-sm font-semibold text-[#111827] sm:max-w-sm">
                Chuyên mục
                <select
                  name="category"
                  defaultValue={filters.category ?? ""}
                  className="min-h-11 rounded-md border border-[#E5E7EB] px-3 text-sm font-normal"
                >
                  <option value="">Tất cả bài viết</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="mt-4 min-h-11 rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7]"
              >
                Lọc bài viết
              </button>
            </form>
          ) : null}

          {posts.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-6 text-center">
              <h2 className="text-xl font-bold text-[#111827]">
                Chưa có bài viết phù hợp
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                Blog sẽ hiển thị các bài viết đã xuất bản từ hệ thống quản trị.
                Trong thời gian cập nhật nội dung, bạn có thể liên hệ Điện Máy
                Nga Sơn để được tư vấn trực tiếp về điều hòa, tủ lạnh hoặc máy
                giặt.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="tel:#"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
                >
                  Gọi tư vấn
                </a>
                <Link
                  href="/#bao-gia"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-5 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
                >
                  Gửi yêu cầu báo giá
                </Link>
              </div>
            </div>
          )}
        </Container>
      </Section>

      <Section className="bg-[#F8FAFC]">
        <Container>
          <div className="rounded-lg border border-[#BAE6FD] bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#111827]">
              Cần tư vấn thiết bị cho gia đình?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
              Gửi tình trạng thiết bị hoặc nhu cầu mua điều hòa để Điện Máy Nga
              Sơn tư vấn phương án phù hợp cho khu vực Kinh Môn, Quang Thành và
              Hải Dương.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:#"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
              >
                Gọi ngay
              </a>
              <a
                href="#"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-5 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
              >
                Nhắn Zalo
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
