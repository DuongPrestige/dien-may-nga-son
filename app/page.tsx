import { LeadSourceType } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { LeadForm } from "@/src/features/leads/components/lead-form";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Điện Máy Nga Sơn | Điều hòa, điện máy Kinh Môn",
  description:
    "Điện Máy Nga Sơn tư vấn điều hòa, tivi, tủ lạnh, máy giặt, sửa chữa và bảo dưỡng điện lạnh tại Kinh Môn, Quang Thành, Hải Dương.",
  path: "/",
});

const categories = [
  {
    name: "Điều hòa",
    description: "Máy lạnh gia đình, tư vấn công suất và lắp đặt.",
    href: "/products",
  },
  {
    name: "Tivi",
    description: "Gợi ý chọn tivi phù hợp phòng khách, phòng ngủ.",
    href: "/products",
  },
  {
    name: "Tủ lạnh",
    description: "Tủ lạnh gia đình, tiết kiệm điện, dễ sử dụng.",
    href: "/products",
  },
  {
    name: "Máy giặt",
    description: "Máy giặt cửa trên, cửa trước cho nhu cầu hằng ngày.",
    href: "/products",
  },
] as const;

const featuredAirConditioners = [
  {
    name: "Điều hòa 9000BTU",
    detail: "Phù hợp phòng ngủ nhỏ, nhu cầu sử dụng cơ bản.",
  },
  {
    name: "Điều hòa 12000BTU",
    detail: "Lựa chọn phổ biến cho phòng khách nhỏ hoặc phòng ngủ lớn.",
  },
  {
    name: "Điều hòa inverter",
    detail: "Ưu tiên vận hành êm, ổn định và tiết kiệm điện.",
  },
] as const;

const services = [
  {
    name: "Sửa điều hòa Kinh Môn",
    detail: "Kiểm tra máy không mát, chảy nước, báo lỗi, kêu to.",
  },
  {
    name: "Bảo dưỡng điều hòa Kinh Môn",
    detail: "Vệ sinh dàn lạnh, dàn nóng, kiểm tra gas và vận hành.",
  },
  {
    name: "Lắp đặt điều hòa Kinh Môn",
    detail: "Tư vấn vị trí lắp, vật tư phù hợp và bàn giao rõ ràng.",
  },
  {
    name: "Sửa tủ lạnh, máy giặt",
    detail: "Hỗ trợ kiểm tra lỗi thường gặp cho khách hàng địa phương.",
  },
] as const;

const reasons = [
  "Tư vấn dễ hiểu theo nhu cầu gia đình",
  "Ưu tiên điều hòa, sửa chữa và bảo dưỡng tại địa phương",
  "Báo giá rõ trước khi khách quyết định",
  "Hỗ trợ nhanh tại Kinh Môn và khu vực lân cận",
] as const;

const blogPlaceholders = [
  "Cách chọn công suất điều hòa theo diện tích phòng",
  "Khi nào nên bảo dưỡng điều hòa tại nhà",
  "Các lỗi điều hòa thường gặp vào mùa nóng",
] as const;

export default function Home() {
  return (
    <>
      <Section className="bg-[#F8FAFC] py-10 sm:py-14 lg:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex rounded-md border border-[#BAE6FD] bg-white px-3 py-1 text-sm font-semibold text-[#0284C7]">
              Điện máy và điện lạnh tại Kinh Môn
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-[#111827] sm:text-5xl lg:text-6xl">
                Điều hòa chính hãng, sửa chữa điện lạnh nhanh tại Hải Dương
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#6B7280] sm:text-lg">
                Điện Máy Nga Sơn tư vấn mua điều hòa, lắp đặt, bảo dưỡng và sửa
                chữa điện lạnh cho khách hàng tại Kinh Môn, Quang Thành và Hải
                Dương.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:#"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white transition-colors hover:bg-[#ea580c]"
              >
                Gọi ngay
              </a>
              <a
                href="#"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#0EA5E9] bg-white px-5 text-sm font-bold text-[#0284C7] transition-colors hover:bg-[#E0F2FE]"
              >
                Nhắn Zalo
              </a>
              <a
                href="#bao-gia"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-5 text-sm font-bold text-[#111827] transition-colors hover:bg-white"
              >
                Gửi yêu cầu báo giá
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-[0_20px_60px_rgba(14,165,233,0.12)]">
            <div className="rounded-md bg-[#0EA5E9] p-5 text-white">
              <p className="text-sm font-semibold">Ưu tiên kinh doanh</p>
              <p className="mt-3 text-4xl font-bold">70%</p>
              <p className="mt-2 text-sm leading-6 text-sky-50">
                Tập trung vào điều hòa, tư vấn công suất, lắp đặt và hỗ trợ sau
                bán cho khách hàng gia đình.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-[#E5E7EB] p-4">
                <p className="text-2xl font-bold text-[#111827]">20%</p>
                <p className="mt-1 text-sm text-[#6B7280]">Dịch vụ sửa chữa</p>
              </div>
              <div className="rounded-md border border-[#E5E7EB] p-4">
                <p className="text-2xl font-bold text-[#111827]">10%</p>
                <p className="mt-1 text-sm text-[#6B7280]">Điện máy khác</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">
              Danh mục cần tư vấn nhanh
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[#6B7280]">
              Chọn nhóm sản phẩm để được tư vấn theo nhu cầu sử dụng trong gia
              đình.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="rounded-lg border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#0EA5E9] hover:bg-[#F8FAFC]"
              >
                <p className="text-lg font-bold text-[#111827]">
                  {category.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-[#F8FAFC]">
        <Container>
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">
              Điều hòa nổi bật trên trang chủ
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[#6B7280]">
              Các thẻ bên dưới là nội dung hiển thị trang chủ để định hướng tư
              vấn, không phải sản phẩm trong cơ sở dữ liệu.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredAirConditioners.map((item) => (
              <article
                key={item.name}
                data-homepage-display="true"
                className="rounded-lg border border-[#E5E7EB] bg-white p-5"
              >
                <span className="rounded-md bg-[#E0F2FE] px-2 py-1 text-xs font-semibold text-[#0284C7]">
                  Hiển thị trang chủ
                </span>
                <h3 className="mt-4 text-xl font-bold text-[#111827]">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  {item.detail}
                </p>
                <a
                  href="#bao-gia"
                  className="mt-4 inline-flex text-sm font-bold text-[#0284C7]"
                >
                  Gửi yêu cầu báo giá
                </a>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">
              Dịch vụ điện lạnh tại Kinh Môn
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[#6B7280]">
              Tập trung vào sửa điều hòa, bảo dưỡng điều hòa và lắp đặt điều hòa
              cho khách hàng địa phương.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.name}
                className="rounded-lg border border-[#E5E7EB] bg-white p-5"
              >
                <h3 className="text-lg font-bold text-[#111827]">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  {service.detail}
                </p>
                <a
                  href="tel:#"
                  className="mt-4 inline-flex text-sm font-bold text-[#F97316]"
                >
                  Gọi ngay
                </a>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-[#F8FAFC]">
        <Container className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">
              Vì sao khách hàng chọn Điện Máy Nga Sơn
            </h2>
            <p className="text-sm leading-6 text-[#6B7280]">
              Cách làm rõ ràng, gần khách hàng địa phương và ưu tiên phản hồi
              nhanh khi gia đình cần tư vấn hoặc kiểm tra thiết bị.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {reasons.map((reason) => (
              <div
                key={reason}
                className="rounded-lg border border-[#E5E7EB] bg-white p-4 text-sm font-semibold leading-6 text-[#111827]"
              >
                {reason}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="rounded-lg border border-[#BAE6FD] bg-[#F0F9FF] p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">
              Khu vực phục vụ
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#374151]">
              Điện Máy Nga Sơn hỗ trợ tư vấn mua điều hòa, lắp đặt, bảo dưỡng và
              sửa chữa điện lạnh tại Kinh Môn, Quang Thành, Hải Dương và các khu
              vực lân cận.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Kinh Môn", "Quang Thành", "Hải Dương"].map((area) => (
                <span
                  key={area}
                  className="rounded-md bg-white px-3 py-2 text-sm font-bold text-[#0284C7]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-[#F8FAFC]">
        <Container>
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">
              Kinh nghiệm điện máy sắp cập nhật
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[#6B7280]">
              Khu vực bài viết sẽ dùng cho nội dung tư vấn mua điều hòa, bảo
              dưỡng và xử lý lỗi thường gặp.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {blogPlaceholders.map((title) => (
              <article
                key={title}
                className="rounded-lg border border-[#E5E7EB] bg-white p-5"
              >
                <span className="text-xs font-semibold text-[#0284C7]">
                  Bài viết dự kiến
                </span>
                <h3 className="mt-3 text-lg font-bold leading-7 text-[#111827]">
                  {title}
                </h3>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="bao-gia">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">
              Cần tư vấn điều hòa hoặc sửa chữa điện lạnh?
            </h2>
            <p className="text-sm leading-6 text-[#6B7280]">
              Gửi thông tin để Điện Máy Nga Sơn liên hệ lại. Form chỉ cần họ tên,
              số điện thoại và nội dung cần hỗ trợ.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:#"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white transition-colors hover:bg-[#ea580c]"
              >
                Gọi ngay
              </a>
              <a
                href="#"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#0EA5E9] px-5 text-sm font-bold text-[#0284C7] transition-colors hover:bg-[#E0F2FE]"
              >
                Nhắn Zalo
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)]">
            <LeadForm sourceType={LeadSourceType.HOME} sourceUrl="/" />
          </div>
        </Container>
      </Section>
    </>
  );
}
