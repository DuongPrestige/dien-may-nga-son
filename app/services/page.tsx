import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { ServiceCard } from "@/src/features/services/components/service-card";
import { getServices } from "@/src/features/services/services/services.service";
import type { ServiceCardData } from "@/src/features/services/types/services.types";
import { getStoreContactLinks } from "@/src/features/settings/services/settings.service";

export const metadata: Metadata = {
  title: "Dịch vụ sửa chữa điện lạnh Kinh Môn | Điện Máy Nga Sơn",
  description:
    "Dịch vụ sửa điều hòa, bảo dưỡng điều hòa, lắp đặt điều hòa, sửa tủ lạnh và sửa máy giặt tại Kinh Môn, Quang Thành, Hải Dương.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Dịch vụ sửa chữa điện lạnh Kinh Môn | Điện Máy Nga Sơn",
    description:
      "Điện Máy Nga Sơn hỗ trợ tư vấn dịch vụ điện lạnh, điện máy cho khách hàng tại Kinh Môn, Quang Thành, Hải Dương.",
    type: "website",
  },
};

export const revalidate = 3600;

async function getSafeServices(): Promise<ServiceCardData[]> {
  try {
    return await getServices();
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const [services, contactLinks] = await Promise.all([
    getSafeServices(),
    getStoreContactLinks(),
  ]);

  return (
    <>
      <Section className="bg-[#F8FAFC] py-10 sm:py-14">
        <Container>
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-bold uppercase text-[#0284C7]">
              Dịch vụ điện lạnh tại Kinh Môn
            </p>
            <h1 className="text-3xl font-bold leading-tight text-[#111827] sm:text-5xl">
              Dịch vụ sửa chữa, bảo dưỡng và lắp đặt điện máy
            </h1>
            <p className="text-base leading-7 text-[#6B7280]">
              Điện Máy Nga Sơn phục vụ khách hàng tại Kinh Môn, Quang Thành và
              khu vực Hải Dương với các dịch vụ trọng tâm như sửa điều hòa, bảo
              dưỡng điều hòa, lắp đặt điều hòa, sửa tủ lạnh và sửa máy giặt.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={contactLinks.phoneHref}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
              >
                Gọi tư vấn dịch vụ
              </a>
              <Link
                href="/#bao-gia"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-5 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
              >
                Gửi yêu cầu hỗ trợ
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">
                Danh sách dịch vụ
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                Chọn dịch vụ phù hợp để xem quy trình, tình huống thường gặp và
                gửi thông tin cần hỗ trợ.
              </p>
            </div>
          </div>

          {services.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  contactLinks={contactLinks}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-6 text-center">
              <h2 className="text-xl font-bold text-[#111827]">
                Dịch vụ đang được cập nhật
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                Danh sách dịch vụ sẽ được hiển thị từ dữ liệu quản trị. Bạn vẫn
                có thể gọi hoặc gửi yêu cầu để Điện Máy Nga Sơn tư vấn hỗ trợ
                tại Kinh Môn, Quang Thành và Hải Dương.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={contactLinks.phoneHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
                >
                  Gọi ngay
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
              Cần kiểm tra thiết bị tại nhà?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
              Hãy mô tả tình trạng thiết bị. Điện Máy Nga Sơn sẽ liên hệ tư vấn
              hướng xử lý phù hợp trước khi thực hiện dịch vụ.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={contactLinks.phoneHref}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#ea580c]"
              >
                Gọi ngay
              </a>
              <a
                href={contactLinks.zaloHref}
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
