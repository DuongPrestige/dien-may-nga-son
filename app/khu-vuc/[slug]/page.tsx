import { LeadSourceType } from "@prisma/client";
import { ArrowRight, MessageCircle, Phone, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BreadcrumbNav } from "@/src/components/shared/breadcrumb-nav";
import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { SectionHeading } from "@/src/features/home/components/section-heading";
import { LeadForm } from "@/src/features/leads/components/lead-form";
import { ProductCard } from "@/src/features/products/components/product-card";
import { AIR_CONDITIONER_CATEGORY_SLUG } from "@/src/features/products/lib/product-highlights";
import {
  getFeaturedProducts,
  getProducts,
} from "@/src/features/products/services/products.service";
import type { ProductCardData } from "@/src/features/products/types/products.types";
import { ProjectCard } from "@/src/features/projects/components/project-card";
import {
  getServiceAreaBySlug,
  getServiceAreaProjects,
} from "@/src/features/service-areas/services/service-areas.service";
import type { PublicServiceAreaDetail } from "@/src/features/service-areas/types/service-areas.types";
import { serviceAreaSlugSchema } from "@/src/features/service-areas/validators/service-area.validator";
import {
  getFeaturedServices,
  getServices,
} from "@/src/features/services/services/services.service";
import type { ServiceCardData } from "@/src/features/services/types/services.types";
import {
  getSafeStoreInfo,
  getStoreContactLinks,
} from "@/src/features/settings/services/settings.service";
import {
  BreadcrumbSchema,
  LocalBusinessSchema,
  serializeJsonLd,
} from "@/src/lib/schema";
import { SITE_NAME, buildMetadata } from "@/src/lib/seo";

export const revalidate = 3600;

const AREA_SERVICE_LIMIT = 4;
const AREA_PRODUCT_LIMIT = 4;
const FEATURED_PRODUCT_POOL = 12;

type ServiceAreaPageProps = {
  params: Promise<{ slug: string }>;
};

async function getSafeArea(
  slug: string,
): Promise<PublicServiceAreaDetail | null> {
  const parsedSlug = serviceAreaSlugSchema.safeParse(slug);

  if (!parsedSlug.success) {
    return null;
  }

  try {
    return await getServiceAreaBySlug(parsedSlug.data);
  } catch {
    return null;
  }
}

async function getAreaServices(): Promise<ServiceCardData[]> {
  const featured = await getFeaturedServices(AREA_SERVICE_LIMIT);

  if (featured.length > 0) {
    return featured;
  }

  const all = await getServices();
  return all.slice(0, AREA_SERVICE_LIMIT);
}

async function getAreaAirConditioners(): Promise<ProductCardData[]> {
  const featured = await getFeaturedProducts(FEATURED_PRODUCT_POOL);
  const featuredAirConditioners = featured
    .filter((product) => product.category.slug === AIR_CONDITIONER_CATEGORY_SLUG)
    .slice(0, AREA_PRODUCT_LIMIT);

  if (featuredAirConditioners.length > 0) {
    return featuredAirConditioners;
  }

  const result = await getProducts({
    category: AIR_CONDITIONER_CATEGORY_SLUG,
    limit: AREA_PRODUCT_LIMIT,
  });
  return result.products.slice(0, AREA_PRODUCT_LIMIT);
}

function getAreaTitle(area: PublicServiceAreaDetail): string {
  return area.seoTitle ?? `Sửa, lắp điều hòa tại ${area.name} | ${SITE_NAME}`;
}

function getAreaDescription(area: PublicServiceAreaDetail): string {
  return (
    area.description ??
    `Lắp đặt, bảo dưỡng, sửa điều hòa và điện lạnh tận nhà tại ${area.name}. Báo giá trước khi làm.`
  );
}

export async function generateMetadata({
  params,
}: ServiceAreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = await getSafeArea(slug);

  if (!area) {
    return {
      title: `Khu vực phục vụ | ${SITE_NAME}`,
      robots: { index: false, follow: true },
    };
  }

  return buildMetadata({
    title: getAreaTitle(area),
    description: area.seoDescription ?? getAreaDescription(area),
    path: `/khu-vuc/${area.slug}`,
  });
}

export default async function ServiceAreaPage({
  params,
}: ServiceAreaPageProps) {
  const { slug } = await params;
  const area = await getSafeArea(slug);

  if (!area) {
    notFound();
  }

  const areaPath = `/khu-vuc/${area.slug}`;
  const [projects, services, products, contactLinks, storeInfo] =
    await Promise.all([
      getServiceAreaProjects(area.name).catch(() => []),
      getAreaServices().catch(() => []),
      getAreaAirConditioners().catch(() => []),
      getStoreContactLinks(),
      getSafeStoreInfo(),
    ]);

  const breadcrumbItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Khu vực", href: "/khu-vuc" },
    { name: area.name, href: areaPath },
  ];
  const breadcrumbSchema = BreadcrumbSchema(
    breadcrumbItems.map((item) => ({ name: item.name, url: item.href })),
  );
  const localBusinessSchema = LocalBusinessSchema({
    name: storeInfo.storeName || SITE_NAME,
    telephone: storeInfo.phone,
    areaServed: [area.name],
    makesOffer: services.map((service) => service.name),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(localBusinessSchema) }}
      />

      <Section padding="none" className="bg-[#F8FAFC] py-8 sm:py-12">
        <Container>
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="mt-4 max-w-3xl">
            <h1 className="text-2xl font-bold leading-tight text-[#111827] sm:text-4xl">
              Điều hòa &amp; sửa điện lạnh tại {area.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-[#6B7280]">
              {getAreaDescription(area)}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex">
              <a
                href={contactLinks.phoneHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#C2410C] px-5 text-sm font-bold text-white transition-colors hover:bg-[#9A3412]"
              >
                <Phone aria-hidden="true" className="h-4 w-4" />
                Gọi ngay
              </a>
              <a
                href={contactLinks.zaloHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#0EA5E9] bg-white px-5 text-sm font-bold text-[#0369A1] transition-colors hover:bg-[#E0F2FE]"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Nhắn Zalo
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {projects.length > 0 ? (
        <Section padding="compact">
          <Container>
            <SectionHeading
              title={`Công trình tại ${area.name}`}
              action={{ href: "/cong-trinh-thuc-te", label: "Xem tất cả" }}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  headingLevel="h3"
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {services.length > 0 ? (
        <Section
          padding="compact"
          className={projects.length > 0 ? "bg-[#F8FAFC]" : undefined}
        >
          <Container>
            <SectionHeading
              title="Dịch vụ"
              action={{ href: "/services", label: "Tất cả dịch vụ" }}
            />
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex h-full items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-[#7DD3FC]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#C2410C]">
                      <Wrench aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h3 className="min-w-0 flex-1 text-sm font-bold leading-6 text-[#111827] sm:text-base">
                      {service.name}
                    </h3>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[#0369A1] transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {products.length > 0 ? (
        <Section padding="compact">
          <Container>
            <SectionHeading
              title="Điều hòa bán chạy"
              action={{
                href: `/products?category=${AIR_CONDITIONER_CATEGORY_SLUG}`,
                label: "Xem tất cả",
              }}
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
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
      ) : null}

      <Section
        id="bao-gia"
        padding="compact"
        className="scroll-mt-20 bg-[#F8FAFC]"
      >
        <Container className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#111827] sm:text-3xl">
              Cần thợ tại {area.name}?
            </h2>
            <p className="text-sm leading-6 text-[#6B7280]">
              Để lại số điện thoại, cửa hàng sẽ gọi lại ngay.
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)]">
            <LeadForm sourceType={LeadSourceType.HOME} sourceUrl={areaPath} />
          </div>
        </Container>
      </Section>
    </>
  );
}
