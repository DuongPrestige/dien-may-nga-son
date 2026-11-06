import { MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbNav } from "@/src/components/shared/breadcrumb-nav";
import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { getActiveServiceAreas } from "@/src/features/service-areas/services/service-areas.service";
import { getStoreContactLinks } from "@/src/features/settings/services/settings.service";
import { BreadcrumbSchema, serializeJsonLd } from "@/src/lib/schema";
import { SITE_NAME, buildMetadata } from "@/src/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: `Khu vực phục vụ: Kinh Môn, Quang Thành | ${SITE_NAME}`,
  description:
    "Các xã, phường Điện Máy Nga Sơn lắp đặt, bảo dưỡng và sửa điều hòa, điện lạnh tận nhà tại Kinh Môn, Hải Dương.",
  path: "/khu-vuc",
});

const breadcrumbItems = [
  { name: "Trang chủ", href: "/" },
  { name: "Khu vực", href: "/khu-vuc" },
];

export default async function ServiceAreasPage() {
  const [areas, contactLinks] = await Promise.all([
    getActiveServiceAreas().catch(() => []),
    getStoreContactLinks(),
  ]);
  const breadcrumbSchema = BreadcrumbSchema(
    breadcrumbItems.map((item) => ({ name: item.name, url: item.href })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <Section padding="none" className="bg-[#F8FAFC] py-8 sm:py-12">
        <Container>
          <BreadcrumbNav items={breadcrumbItems} />
          <h1 className="mt-4 text-2xl font-bold leading-tight text-[#111827] sm:text-4xl">
            Khu vực phục vụ
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#6B7280]">
            Lắp đặt, sửa điều hòa và điện lạnh tận nhà tại các khu vực sau.
          </p>

          {areas.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              {areas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/khu-vuc/${area.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#BAE6FD] bg-white px-4 text-sm font-bold text-[#0C4A6E] transition-colors hover:border-[#0EA5E9] hover:bg-[#E0F2FE]"
                  >
                    <MapPin aria-hidden="true" className="h-4 w-4 text-[#0369A1]" />
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-[#6B7280]">
              Danh sách khu vực đang được cập nhật.
            </p>
          )}

          <a
            href={contactLinks.phoneHref}
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#C2410C] px-5 text-sm font-bold text-white transition-colors hover:bg-[#9A3412]"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            Gọi hỏi khu vực của bạn
          </a>
        </Container>
      </Section>
    </>
  );
}
