import { LeadSourceType } from "@prisma/client";
import { MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { BannerStrip } from "@/src/features/banners/components/banner-strip";
import { BlogPostCard } from "@/src/features/blog/components/blog-post-card";
import { getHomepagePosts } from "@/src/features/blog/services/blog.service";
import { getPublicBrands } from "@/src/features/brands/services/brands.service";
import { HomeBrands } from "@/src/features/home/components/home-brands";
import { HomeCategories } from "@/src/features/home/components/home-categories";
import { HomeHero } from "@/src/features/home/components/home-hero";
import { HomeReasons } from "@/src/features/home/components/home-reasons";
import { HomeServices } from "@/src/features/home/components/home-services";
import { SectionHeading } from "@/src/features/home/components/section-heading";
import { LeadForm } from "@/src/features/leads/components/lead-form";
import { ProductCard } from "@/src/features/products/components/product-card";
import { AIR_CONDITIONER_CATEGORY_SLUG } from "@/src/features/products/lib/product-highlights";
import { getFeaturedProducts } from "@/src/features/products/services/products.service";
import type { ProductCardData } from "@/src/features/products/types/products.types";
import { ProjectCard } from "@/src/features/projects/components/project-card";
import { getPublishedProjects } from "@/src/features/projects/services/projects.service";
import {
  getFeaturedServices,
  getServices,
} from "@/src/features/services/services/services.service";
import type { ServiceCardData } from "@/src/features/services/types/services.types";
import { getStoreContactLinks } from "@/src/features/settings/services/settings.service";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Điện Máy Nga Sơn | Điều hòa, điện máy Kinh Môn",
  description:
    "Điện Máy Nga Sơn tư vấn điều hòa, tivi, tủ lạnh, máy giặt, sửa chữa và bảo dưỡng điện lạnh tại Kinh Môn, Quang Thành, Hải Dương.",
  path: "/",
});

export const revalidate = 3600;

const FEATURED_PRODUCT_LIMIT = 8;
const HOME_SERVICE_LIMIT = 4;
const HOME_PROJECT_LIMIT = 3;

/** Air conditioners first (70% of the business), keeping original order. */
function sortAirConditionersFirst(
  products: ProductCardData[],
): ProductCardData[] {
  const isAirConditioner = (product: ProductCardData) =>
    product.category.slug === AIR_CONDITIONER_CATEGORY_SLUG;

  return [
    ...products.filter(isAirConditioner),
    ...products.filter((product) => !isAirConditioner(product)),
  ];
}

async function getHomeServices(): Promise<ServiceCardData[]> {
  const featured = await getFeaturedServices(HOME_SERVICE_LIMIT);

  if (featured.length > 0) {
    return featured;
  }

  const all = await getServices();
  return all.slice(0, HOME_SERVICE_LIMIT);
}

export default async function Home() {
  const [
    featuredProducts,
    services,
    projectResult,
    brands,
    latestPosts,
    contactLinks,
  ] = await Promise.all([
    getFeaturedProducts(FEATURED_PRODUCT_LIMIT).catch(() => []),
    getHomeServices().catch(() => []),
    getPublishedProjects({ page: 1 }).catch(() => null),
    getPublicBrands().catch(() => []),
    getHomepagePosts().catch(() => []),
    getStoreContactLinks(),
  ]);
  const projects = projectResult?.items.slice(0, HOME_PROJECT_LIMIT) ?? [];
  const products = sortAirConditionersFirst(featuredProducts);

  return (
    <>
      <HomeHero contactLinks={contactLinks} />

      <HomeBrands brands={brands} />

      <HomeCategories />

      {products.length > 0 ? (
        <Section padding="compact" className="bg-[#F8FAFC]">
          <Container>
            <BannerStrip position="home" className="mb-8" />
            <SectionHeading
              title="Điều hòa & điện máy nổi bật"
              description="Các mẫu cửa hàng đang giới thiệu. Gọi hoặc nhắn Zalo để nhận báo giá kèm lắp đặt."
              action={{ href: "/products", label: "Xem tất cả" }}
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  contactLinks={contactLinks}
                  headingLevel="h3"
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : (
        <Section padding="none" className="py-6">
          <Container>
            <BannerStrip position="home" />
          </Container>
        </Section>
      )}

      <HomeServices services={services} />

      {projects.length > 0 ? (
        <Section padding="compact" className="bg-[#F8FAFC]">
          <Container>
            <SectionHeading
              title="Công trình thực tế"
              description="Hình ảnh lắp đặt, bảo dưỡng và sửa chữa đã thực hiện cho khách hàng địa phương."
              action={{ href: "/cong-trinh-thuc-te", label: "Xem thêm công trình" }}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <HomeReasons />

      {latestPosts.length > 0 ? (
        <Section padding="compact">
          <Container>
            <SectionHeading
              title="Kinh nghiệm điện máy"
              description="Mẹo chọn mua, sử dụng và bảo dưỡng thiết bị điện máy cho gia đình."
              action={{ href: "/blog", label: "Xem tất cả bài viết" }}
            />
            <div className="grid gap-4 md:grid-cols-3">
              {latestPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section
        id="bao-gia"
        padding="compact"
        className="scroll-mt-20 bg-[#F8FAFC]"
      >
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#111827] sm:text-3xl">
              Cần tư vấn điều hòa hoặc sửa chữa điện lạnh?
            </h2>
            <p className="text-sm leading-6 text-[#6B7280]">
              Để lại họ tên và số điện thoại, Điện Máy Nga Sơn sẽ gọi lại tư
              vấn. Cần gấp, hãy gọi hoặc nhắn Zalo trực tiếp.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <a
                href={contactLinks.phoneHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#F97316] px-5 text-sm font-bold text-white transition-colors hover:bg-[#ea580c]"
              >
                <Phone aria-hidden="true" className="h-4 w-4" />
                Gọi ngay
              </a>
              <a
                href={contactLinks.zaloHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#0EA5E9] bg-white px-5 text-sm font-bold text-[#0284C7] transition-colors hover:bg-[#E0F2FE]"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Nhắn Zalo
              </a>
            </div>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)]">
            <LeadForm sourceType={LeadSourceType.HOME} sourceUrl="/" />
          </div>
        </Container>
      </Section>
    </>
  );
}
