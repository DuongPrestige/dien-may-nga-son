import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { getStoreContactLinks } from "@/src/features/settings/services/settings.service";

export const metadata: Metadata = {
  title: "Không tìm thấy trang | Điện Máy Nga Sơn",
  robots: {
    index: false,
    follow: true,
  },
};

const quickLinks = [
  {
    href: "/products",
    title: "Sản phẩm điện máy",
    description: "Điều hòa, tivi, tủ lạnh, máy giặt chính hãng.",
  },
  {
    href: "/services",
    title: "Dịch vụ sửa chữa",
    description: "Sửa, bảo dưỡng, lắp đặt điều hòa tại Kinh Môn.",
  },
  {
    href: "/cong-trinh-thuc-te",
    title: "Công trình thực tế",
    description: "Các công trình lắp đặt và sửa chữa đã thực hiện.",
  },
  {
    href: "/blog",
    title: "Kinh nghiệm & tư vấn",
    description: "Bài viết hướng dẫn chọn mua và sử dụng thiết bị.",
  },
] as const;

export default async function NotFound() {
  const contactLinks = await getStoreContactLinks();

  return (
    <Section padding="none" className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20">
      <Container className="max-w-4xl">
        <div className="space-y-5 text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-[#0369A1]">
            Lỗi 404
          </p>
          <h1 className="text-3xl font-bold leading-tight text-[#111827] sm:text-4xl">
            Không tìm thấy trang bạn cần
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#6B7280]">
            Trang có thể đã được đổi địa chỉ hoặc không còn tồn tại. Bạn có thể
            quay lại trang chủ hoặc gọi ngay để được tư vấn điều hòa, sửa chữa
            điện lạnh nhanh.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white transition-colors hover:bg-[#075985]"
            >
              Về trang chủ
            </Link>
            <a
              href={contactLinks.phoneHref}
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#EA580C] px-5 text-sm font-bold text-white transition-colors hover:bg-[#C2410C]"
            >
              Gọi ngay
            </a>
            <a
              href={contactLinks.zaloHref}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#0EA5E9] bg-white px-5 text-sm font-bold text-[#0369A1] transition-colors hover:bg-[#E0F2FE]"
            >
              Nhắn Zalo
            </a>
          </div>
        </div>

        <nav aria-label="Liên kết gợi ý" className="mt-10">
          <ul className="grid gap-4 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block h-full rounded-lg border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#0EA5E9]"
                >
                  <span className="block text-lg font-bold text-[#111827]">
                    {link.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[#6B7280]">
                    {link.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </Section>
  );
}
