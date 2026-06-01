import { LeadSourceType } from "@prisma/client";
import type { Metadata } from "next";
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
import { buildMetadata } from "@/src/lib/seo";

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

const commonProblems = [
  "Thiết bị hoạt động yếu, làm lạnh chậm hoặc giặt không sạch.",
  "Máy phát tiếng ồn, rung mạnh hoặc có mùi bất thường.",
  "Thiết bị chảy nước, báo lỗi hoặc ngắt liên tục khi sử dụng.",
  "Tiền điện tăng cao do thiết bị vận hành kém hiệu quả.",
  "Cần kiểm tra, vệ sinh hoặc lắp đặt đúng kỹ thuật trước mùa cao điểm.",
] as const;

const processSteps = [
  "Tiếp nhận thông tin thiết bị và khu vực cần hỗ trợ.",
  "Tư vấn sơ bộ qua điện thoại hoặc Zalo để xác định tình trạng ban đầu.",
  "Kiểm tra thực tế nếu cần thiết và giải thích nguyên nhân rõ ràng.",
  "Báo phương án xử lý, chi phí tham khảo và thời gian thực hiện.",
  "Thực hiện dịch vụ sau khi khách hàng đồng ý.",
  "Bàn giao, hướng dẫn sử dụng và lưu ý bảo dưỡng sau dịch vụ.",
] as const;

const reasons = [
  "Tập trung phục vụ khách hàng địa phương tại Kinh Môn và Quang Thành.",
  "Ưu tiên tư vấn đúng nhu cầu, không xây dựng quy trình mua hàng online phức tạp.",
  "Báo rõ tình trạng và phương án trước khi sửa chữa hoặc lắp đặt.",
  "Kết hợp kinh nghiệm bán thiết bị điện máy với dịch vụ điện lạnh thực tế.",
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
    const slugs = await getServiceSlugs();

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

  return buildMetadata({
    title,
    description,
    path: `/services/${service.slug}`,
    images: service.thumbnailUrl ? [service.thumbnailUrl] : undefined,
  });
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getSafeService(slug);

  if (!service) {
    notFound();
  }

  const localizedName = getLocalizedServiceName(service.name);
  const relatedServices = await getSafeRelatedServices(service);
  const faqSchema = buildFaqSchema();
  const breadcrumbSchema = buildBreadcrumbSchema(service);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Section className="bg-[#F8FAFC] py-8 sm:py-12">
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
                  href="tel:#"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-4 text-sm font-bold text-white hover:bg-[#ea580c]"
                >
                  Gọi ngay
                </a>
                <a
                  href="#"
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
                {service.thumbnailUrl ? (
                  <Image
                    src={service.thumbnailUrl}
                    alt={service.name}
                    fill
                    priority
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
              <div className="p-5">
                <p className="text-sm font-semibold leading-6 text-[#374151]">
                  Phục vụ tư vấn dịch vụ cho khách hàng khu vực Kinh Môn,
                  Quang Thành, Hải Dương.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-[1fr_0.78fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Tình huống thường gặp
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {commonProblems.map((problem) => (
                  <div
                    key={problem}
                    className="rounded-lg border border-[#E5E7EB] bg-white p-4 text-sm leading-6 text-[#374151]"
                  >
                    {problem}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Quy trình dịch vụ
              </h2>
              <ol className="mt-5 grid gap-3">
                {processSteps.map((step, index) => (
                  <li
                    key={step}
                    className="grid grid-cols-[2.5rem_1fr] gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0EA5E9] text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="pt-2 text-sm leading-6 text-[#374151]">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-[#FED7AA] bg-[#FFF7ED] p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-[#111827]">
                Tham khảo chi phí
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#374151]">
                Giá dịch vụ phụ thuộc vào tình trạng thực tế của thiết bị, mức
                độ xử lý và linh kiện nếu phát sinh. Điện Máy Nga Sơn ưu tiên
                tư vấn rõ phương án và chi phí tham khảo trước khi thực hiện để
                khách hàng chủ động quyết định.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href="tel:#"
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
              <h2 className="text-2xl font-bold text-[#111827]">
                Vì sao chọn Điện Máy Nga Sơn?
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {reasons.map((reason) => (
                  <div
                    key={reason}
                    className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#374151]"
                  >
                    {reason}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Nội dung dịch vụ
              </h2>
              <div className="mt-3 whitespace-pre-line text-sm leading-7 text-[#6B7280]">
                {service.content ??
                  `${localizedName} được xây dựng cho nhu cầu gia đình tại Kinh Môn, Quang Thành và Hải Dương. Khách hàng có thể mô tả tình trạng thiết bị để Điện Máy Nga Sơn tư vấn bước xử lý phù hợp.`}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
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
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                Để lại thông tin và tình trạng thiết bị. Điện Máy Nga Sơn sẽ
                liên hệ tư vấn trong thời gian sớm nhất.
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
              <p className="mt-2 text-sm leading-6 text-[#374151]">
                Gọi hoặc nhắn Zalo để mô tả lỗi thiết bị và nhận hướng xử lý ban
                đầu.
              </p>
              <div className="mt-4 grid gap-3">
                <a
                  href="tel:#"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
                >
                  Gọi ngay
                </a>
                <a
                  href="#"
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
                <ServiceCard key={relatedService.id} service={relatedService} />
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
                href="tel:#"
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
