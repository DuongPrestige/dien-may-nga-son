import { Phone, Search } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { BlogPostCard } from "@/src/features/blog/components/blog-post-card";
import { ProductCard } from "@/src/features/products/components/product-card";
import {
  normalizeSearchQuery,
  SEARCH_MAX_LENGTH,
  SEARCH_MIN_LENGTH,
  searchSite,
  type SearchResults,
} from "@/src/features/search/services/search.service";
import { ServiceCard } from "@/src/features/services/components/service-card";
import { getStoreContactLinks } from "@/src/features/settings/services/settings.service";
import {
  consumeRateLimit,
  getClientIp,
  RATE_LIMIT_RULES,
} from "@/src/lib/rate-limit";
import { buildMetadata } from "@/src/lib/seo";

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

const SUGGESTIONS = ["Điều hòa 12000BTU", "Daikin", "Tủ lạnh", "Vệ sinh điều hòa"];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Tìm kiếm | Điện Máy Nga Sơn",
    description: "Tìm điều hòa, điện máy và dịch vụ điện lạnh tại Điện Máy Nga Sơn.",
    path: "/tim-kiem",
  }),
  robots: { index: false, follow: true },
};

async function getSafeResults(query: string): Promise<SearchResults | null> {
  const limit = await consumeRateLimit(
    RATE_LIMIT_RULES.searchByIp,
    getClientIp(await headers()),
  );

  if (!limit.allowed) {
    return null;
  }

  try {
    return await searchSite(query);
  } catch (error) {
    console.error("Search failed", error);
    return null;
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = normalizeSearchQuery(
    Array.isArray(params.q) ? params.q[0] : params.q,
  );
  const hasQuery = query.length >= SEARCH_MIN_LENGTH;
  const [results, contactLinks] = await Promise.all([
    hasQuery ? getSafeResults(query) : Promise.resolve(null),
    getStoreContactLinks(),
  ]);

  return (
    <>
      <Section padding="none" className="bg-[#F0F9FF] py-6 sm:py-10">
        <Container className="max-w-3xl">
          <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
            {hasQuery ? `Kết quả cho “${query}”` : "Tìm kiếm"}
          </h1>
          <form action="/tim-kiem" role="search" className="mt-4 flex gap-2">
            <label htmlFor="search-page-input" className="sr-only">
              Từ khóa tìm kiếm
            </label>
            <input
              id="search-page-input"
              name="q"
              type="search"
              defaultValue={query}
              maxLength={SEARCH_MAX_LENGTH}
              placeholder="Tên sản phẩm, hãng, dịch vụ…"
              className="min-h-12 min-w-0 flex-1 rounded-md border border-[#CBD5E1] bg-white px-4 text-base outline-none focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
            />
            <button
              type="submit"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-md bg-[#0369A1] px-4 text-sm font-bold text-white hover:bg-[#075985]"
            >
              <Search aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">Tìm</span>
              <span className="sr-only sm:hidden">Tìm</span>
            </button>
          </form>
          {!hasQuery ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <li key={suggestion}>
                  <a
                    href={`/tim-kiem?q=${encodeURIComponent(suggestion)}`}
                    className="inline-flex min-h-9 items-center rounded-full border border-[#BAE6FD] bg-white px-3 text-sm text-[#0369A1] hover:bg-[#E0F2FE]"
                  >
                    {suggestion}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </Section>

      {hasQuery ? (
        <Section padding="compact">
          <Container className="space-y-10">
            {results === null || results.total === 0 ? (
              <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-6 text-center">
                <p className="text-base font-semibold text-[#111827]">
                  {results === null
                    ? "Chưa tìm được lúc này. Vui lòng thử lại."
                    : "Không tìm thấy kết quả phù hợp."}
                </p>
                <p className="mt-1 text-sm text-[#4B5563]">
                  Gọi cửa hàng để được tư vấn nhanh.
                </p>
                <a
                  href={contactLinks.phoneHref}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md cta-orange px-5 text-sm font-bold text-white"
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Gọi ngay
                </a>
              </div>
            ) : null}

            {results && results.products.length > 0 ? (
              <section aria-labelledby="ket-qua-san-pham">
                <h2
                  id="ket-qua-san-pham"
                  className="text-xl font-bold text-[#111827]"
                >
                  Sản phẩm ({results.products.length})
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {results.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      contactLinks={contactLinks}
                      headingLevel="h3"
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {results && results.services.length > 0 ? (
              <section aria-labelledby="ket-qua-dich-vu">
                <h2
                  id="ket-qua-dich-vu"
                  className="text-xl font-bold text-[#111827]"
                >
                  Dịch vụ ({results.services.length})
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      contactLinks={contactLinks}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {results && results.posts.length > 0 ? (
              <section aria-labelledby="ket-qua-bai-viet">
                <h2
                  id="ket-qua-bai-viet"
                  className="text-xl font-bold text-[#111827]"
                >
                  Bài viết ({results.posts.length})
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {results.posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            ) : null}
          </Container>
        </Section>
      ) : null}
    </>
  );
}
