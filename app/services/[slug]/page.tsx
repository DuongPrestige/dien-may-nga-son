import { LeadSourceType } from "@prisma/client";
import type { Metadata } from "next";
import {
  AlertCircle,
  FileText,
  Headset,
  MapPin,
  Snowflake,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { LeadForm } from "@/src/features/leads/components/lead-form";
import { ServiceCard } from "@/src/features/services/components/service-card";
import {
  getRelatedServices,
  getServiceBySlug,
  getServiceSlugs,
} from "@/src/features/services/services/services.service";
import type {
  ServiceCardData,
  ServiceDetailData,
} from "@/src/features/services/types/services.types";
import { getStoreContactLinks } from "@/src/features/settings/lib/store-contact";
import { getSafeStoreInfo } from "@/src/features/settings/services/settings.service";
import type { StoreInfo } from "@/src/features/settings/types/settings.types";
import { serializeJsonLd } from "@/src/lib/schema";
import { buildMetadata } from "@/src/lib/seo";
import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

const serviceProblemGroups = {
  airConditioner: [
    "Làm lạnh chậm, gió yếu",
    "Chảy nước, đóng tuyết, có mùi",
    "Kêu to, rung, tự bật tắt",
    "Báo lỗi, không nhận điều khiển",
    "Tốn điện bất thường",
  ],
  washingMachine: [
    "Không cấp nước, không xả, không vắt",
    "Rung mạnh, kêu to khi vắt",
    "Giặt không sạch, còn mùi",
    "Báo lỗi, dừng giữa chừng",
    "Rò rỉ nước, mất nguồn",
  ],
  refrigerator: [
    "Kém lạnh, ngăn đá không đông",
    "Kêu to, chạy liên tục, đóng tuyết",
    "Rò rỉ nước ra sàn",
    "Có mùi khó chịu",
    "Mất nguồn, báo lỗi",
  ],
  general: [
    "Hoạt động yếu, kém hiệu quả",
    "Kêu to, rung, có mùi lạ",
    "Chảy nước, báo lỗi, ngắt liên tục",
    "Tốn điện bất thường",
    "Cần vệ sinh, lắp đặt trước mùa cao điểm",
  ],
} as const;

function getCommonProblems(service: ServiceDetailData): readonly string[] {
  const searchableText = `${service.name} ${service.slug}`.toLowerCase();

  if (
    searchableText.includes("máy giặt") ||
    searchableText.includes("may-giat")
  ) {
    return serviceProblemGroups.washingMachine;
  }

  if (
    searchableText.includes("tủ lạnh") ||
    searchableText.includes("tu-lanh")
  ) {
    return serviceProblemGroups.refrigerator;
  }

  if (
    searchableText.includes("điều hòa") ||
    searchableText.includes("dieu-hoa")
  ) {
    return serviceProblemGroups.airConditioner;
  }

  return serviceProblemGroups.general;
}

const processSteps = [
  { title: "Tiếp nhận", detail: "Qua điện thoại, Zalo hoặc form" },
  { title: "Kiểm tra & báo giá", detail: "Báo phương án trước khi làm" },
  { title: "Thực hiện", detail: "Sau khi khách đồng ý" },
  { title: "Bàn giao", detail: "Chạy thử, hướng dẫn sử dụng" },
] as const;

const reasons = [
  { icon: MapPin, label: "Phục vụ tại Kinh Môn" },
  { icon: FileText, label: "Báo giá trước khi làm" },
  { icon: Headset, label: "Tư vấn đúng nhu cầu" },
  { icon: Snowflake, label: "Chuyên điện lạnh" },
] as const;

const faqs = [
  {
    question: "Điện Máy Nga Sơn có hỗ trợ dịch vụ tại Kinh Môn không?",
    answer:
      "Có. Nội dung dịch vụ trên website tập trung cho khách hàng tại Kinh Môn, Quang Thành và các khu vực phù hợp tại Hải Dương.",
  },
  {
    question: "Chi phí dịch vụ được tính như thế nào?",
    answer:
      "Chi phí phụ thuộc vào tình trạng thiết bị, hạng mục cần xử lý và linh kiện nếu có. Khách hàng nên liên hệ để được tư vấn và báo giá rõ trước khi thực hiện.",
  },
  {
    question: "Có cần mang thiết bị đến cửa hàng không?",
    answer:
      "Tùy loại thiết bị và lỗi gặp phải. Với điều hòa, tủ lạnh hoặc máy giặt, Điện Máy Nga Sơn sẽ tư vấn hướng kiểm tra phù hợp trước.",
  },
  {
    question: "Có thể gửi yêu cầu qua form thay vì gọi điện không?",
    answer:
      "Có. Bạn có thể để lại tên, số điện thoại và mô tả tình trạng thiết bị để cửa hàng liên hệ lại trong thời gian sớm nhất.",
  },
  {
    question: "Dịch vụ có phù hợp cho điều hòa gia đình không?",
    answer:
      "Có. Các nội dung dịch vụ ưu tiên nhu cầu gia đình như sửa điều hòa, bảo dưỡng điều hòa và lắp đặt điều hòa đúng kỹ thuật.",
  },
] as const;

function getLocalizedServiceName(name: string): string {
  return name.toLowerCase().includes("kinh môn") ? name : `${name} Kinh Môn`;
}

function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function buildBreadcrumbSchema(service: ServiceDetailData) {
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
        name: "Dịch vụ",
        item: `${baseUrl}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.name,
        item: `${baseUrl}/services/${service.slug}`,
      },
    ],
  };
}

function buildServiceSchema(
  service: ServiceDetailData,
  storeInfo: StoreInfo,
) {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: getLocalizedServiceName(service.name),
    description:
      service.shortDescription ??
      service.seoDescription ??
      getLocalizedServiceName(service.name),
    url: `${baseUrl}/services/${service.slug}`,
    image: getSafeImageSrc(service.thumbnailUrl) ?? undefined,
    areaServed: ["Kinh Môn", "Quang Thành", "Hải Dương"],
    provider: {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/contact#local-business`,
      name: storeInfo.storeName || "Điện Máy Nga Sơn",
      telephone: storeInfo.phone || undefined,
      address: storeInfo.address || undefined,
      url: `${baseUrl}/contact`,
    },
  };
}

function logServiceDetailTiming(
  label: string,
  startedAt: number,
  details?: Record<string, number | string | boolean | undefined>,
) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const detailsText = details ? ` ${JSON.stringify(details)}` : "";

  console.log(
    `[perf:/services/[slug]] ${label}: ${Date.now() - startedAt}ms${detailsText}`,
  );
}

async function getSafeService(
  slug: string,
): Promise<ServiceDetailData | null> {
  try {
    return await getServiceBySlug(slug);
  } catch {
    return null;
  }
}

async function getSafeRelatedServices(
  service: ServiceDetailData,
): Promise<ServiceCardData[]> {
  try {
    return await getRelatedServices(service.id);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const startedAt = Date.now();
    const slugs = await getServiceSlugs();
    logServiceDetailTiming("generateStaticParams getServiceSlugs", startedAt, {
      rows: slugs.length,
    });

    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getSafeService(slug);

  if (!service) {
    return {
      title: "Dịch vụ | Điện Máy Nga Sơn",
    };
  }

  const localizedName = getLocalizedServiceName(service.name);
  const title =
    service.seoTitle ?? `${localizedName} | Điện Máy Nga Sơn`;
  const description =
    service.seoDescription ??
    service.shortDescription ??
    `${localizedName} cho khách hàng tại Kinh Môn, Quang Thành, Hải Dương. Liên hệ Điện Máy Nga Sơn để được tư vấn dịch vụ phù hợp.`;
  const thumbnailSrc = getSafeImageSrc(service.thumbnailUrl);

  return buildMetadata({
    title,
    description,
    path: `/services/${service.slug}`,
    images: thumbnailSrc ? [thumbnailSrc] : undefined,
  });
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const [service, storeInfo] = await Promise.all([
    getSafeService(slug),
    getSafeStoreInfo(),
  ]);

  if (!service) {
    notFound();
  }

  const localizedName = getLocalizedServiceName(service.name);
  const thumbnailSrc = getSafeImageSrc(service.thumbnailUrl);
  const relatedServices = await getSafeRelatedServices(service);
  const contactLinks = getStoreContactLinks(storeInfo);
  const commonProblems = getCommonProblems(service);
  const serviceSchema = buildServiceSchema(service, storeInfo);
  const faqSchema = buildFaqSchema();
  const breadcrumbSchema = buildBreadcrumbSchema(service);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />

      <Section padding="none" className="bg-[#F8FAFC] py-8 sm:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-[#0284C7]">
                Dịch vụ điện lạnh địa phương
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-[#111827] sm:text-5xl">
                {localizedName}
              </h1>
              <p className="mt-4 text-base leading-7 text-[#6B7280]">
                {service.shortDescription ??
                  "Điện Máy Nga Sơn tiếp nhận tư vấn dịch vụ điện lạnh, điện máy cho khách hàng tại Kinh Môn, Quang Thành và khu vực Hải Dương."}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <a
                  href={contactLinks.phoneHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-4 text-sm font-bold text-white hover:bg-[#ea580c]"
                >
                  Gọi ngay
                </a>
                <a
                  href={contactLinks.zaloHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-4 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
                >
                  Nhắn Zalo
                </a>
                <a
                  href="#bao-gia"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#E5E7EB] px-4 text-sm font-bold text-[#111827] hover:bg-white"
                >
                  Báo giá
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
              <div className="relative aspect-[4/3] bg-[#E0F2FE]">
                {thumbnailSrc ? (
                  <Image
                    src={thumbnailSrc}
                    alt={service.name}
                    fill
                    priority
                    unoptimized={shouldUseUnoptimizedImage(thumbnailSrc)}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center">
                    <span className="text-lg font-bold text-[#0369A1]">
                      Điện Máy Nga Sơn
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-[1fr_0.78fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                Dấu hiệu cần gọi thợ
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {commonProblems.map((problem) => (
                  <li
                    key={problem}
                    className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm font-medium text-[#374151]"
                  >
                    <AlertCircle
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[#F97316]"
                    />
                    {problem}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                Quy trình 4 bước
              </h2>
              <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {processSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="rounded-lg border border-[#E5E7EB] bg-white p-3"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0EA5E9] text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="mt-2 text-sm font-bold text-[#111827]">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-[#6B7280]">
                      {step.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-[#FED7AA] bg-[#FFF7ED] p-5 sm:p-6">
              <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                Chi phí
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#374151]">
                Tùy tình trạng máy và linh kiện. Báo giá rõ trước khi làm.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={contactLinks.phoneHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
                >
                  Gọi hỏi chi phí
                </a>
                <a
                  href="#bao-gia"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#F97316] px-5 text-sm font-bold text-[#C2410C] hover:bg-white"
                >
                  Gửi tình trạng thiết bị
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                Vì sao chọn Điện Máy Nga Sơn?
              </h2>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {reasons.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 rounded-lg bg-[#F0F9FF] px-3 py-2.5 text-sm font-semibold text-[#0C4A6E]"
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[#0284C7]"
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                Nội dung dịch vụ
              </h2>
              <div className="mt-3 whitespace-pre-line text-sm leading-7 text-[#6B7280]">
                {service.content ??
                  `${localizedName} được xây dựng cho nhu cầu gia đình tại Kinh Môn, Quang Thành và Hải Dương. Khách hàng có thể mô tả tình trạng thiết bị để Điện Máy Nga Sơn tư vấn bước xử lý phù hợp.`}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                Câu hỏi thường gặp
              </h2>
              <div className="mt-4 space-y-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="rounded-lg border border-[#E5E7EB] bg-white p-4"
                  >
                    <summary className="cursor-pointer text-sm font-bold text-[#111827]">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-[#6B7280]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div
              id="bao-gia"
              className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)]"
            >
              <h2 className="text-xl font-bold text-[#111827]">
                Gửi yêu cầu dịch vụ
              </h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Cửa hàng sẽ gọi lại tư vấn.
              </p>
              <LeadForm
                className="mt-5"
                sourceType={LeadSourceType.SERVICE}
                sourceUrl={`/services/${service.slug}`}
                serviceId={service.id}
              />
            </div>

            <div className="rounded-lg border border-[#BAE6FD] bg-[#F0F9FF] p-5">
              <h2 className="text-xl font-bold text-[#111827]">
                Cần hỗ trợ nhanh?
              </h2>
              <div className="mt-4 grid gap-3">
                <a
                  href={contactLinks.phoneHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
                >
                  Gọi ngay
                </a>
                <a
                  href={contactLinks.zaloHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] bg-white px-5 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
                >
                  Nhắn Zalo
                </a>
              </div>
            </div>
          </aside>
        </Container>
      </Section>

      {relatedServices.length > 0 ? (
        <Section className="bg-[#F8FAFC]">
          <Container>
            <h2 className="text-2xl font-bold text-[#111827]">
              Dịch vụ liên quan
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((relatedService) => (
                <ServiceCard
                  key={relatedService.id}
                  service={relatedService}
                  contactLinks={contactLinks}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section className="bg-[#0F172A]">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-white">
              Cần xử lý thiết bị trong hôm nay?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#CBD5E1]">
              Gửi yêu cầu hoặc gọi trực tiếp để Điện Máy Nga Sơn tư vấn phương
              án phù hợp cho khu vực Kinh Môn, Quang Thành và Hải Dương.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={contactLinks.phoneHref}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
              >
                Gọi ngay
              </a>
              <Link
                href="#bao-gia"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/25 px-5 text-sm font-bold text-white hover:bg-white/10"
              >
                Gửi yêu cầu báo giá
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
