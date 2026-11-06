import {
  BadgeCheck,
  FileText,
  MapPin,
  MessageCircle,
  Phone,
  Snowflake,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import {
  AIR_CONDITIONER_CAPACITIES,
  AIR_CONDITIONER_CATEGORY_SLUG,
} from "@/src/features/products/lib/product-highlights";
import type { StoreContactLinks } from "@/src/features/settings/lib/store-contact";

type HomeHeroProps = {
  contactLinks: StoreContactLinks;
};

const commitments = [
  { icon: BadgeCheck, label: "Tư vấn đúng nhu cầu gia đình" },
  { icon: FileText, label: "Báo giá rõ trước khi quyết định" },
  { icon: MapPin, label: "Hỗ trợ nhanh tại Kinh Môn" },
] as const;

function lowerFirst(text: string): string {
  return `${text.charAt(0).toLowerCase()}${text.slice(1)}`;
}

export function HomeHero({ contactLinks }: HomeHeroProps) {
  return (
    <section className="bg-gradient-to-b from-[#F0F9FF] to-[#F8FAFC] py-8 sm:py-14 lg:py-20">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-5 sm:space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-white px-3 py-1 text-xs font-semibold text-[#0369A1] sm:text-sm">
            <Snowflake aria-hidden="true" className="h-4 w-4" />
            Điện máy & điện lạnh tại Kinh Môn
          </p>
          <div className="space-y-3 sm:space-y-4">
            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-[#111827] sm:text-5xl lg:text-[56px]">
              Điều hòa chính hãng, sửa chữa điện lạnh nhanh tại Hải Dương
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#4B5563] sm:text-lg">
              Mua, lắp đặt, bảo dưỡng, sửa chữa điều hòa tại Kinh Môn –
              Quang Thành.
            </p>
          </div>

          <div className="grid gap-3 sm:flex">
            <a
              href={contactLinks.phoneHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md cta-orange px-6 text-base font-bold text-white"
            >
              <Phone aria-hidden="true" className="h-5 w-5" />
              Gọi ngay
            </a>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <a
                href={contactLinks.zaloHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#0EA5E9] bg-white px-5 text-sm font-bold text-[#0369A1] transition-colors hover:bg-[#E0F2FE]"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Nhắn Zalo
              </a>
              <a
                href="#bao-gia"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-5 text-sm font-bold text-[#111827] transition-colors hover:border-[#CBD5E1]"
              >
                <FileText aria-hidden="true" className="h-4 w-4" />
                Báo giá
              </a>
            </div>
          </div>

          <ul className="grid gap-2 text-sm text-[#374151] sm:grid-cols-3 sm:gap-4">
            {commitments.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-[#22C55E]"
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_20px_60px_rgba(14,165,233,0.12)] sm:p-6">
          <p className="text-lg font-bold text-[#111827]">
            Chọn điều hòa theo diện tích phòng
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            {AIR_CONDITIONER_CAPACITIES.map((option) => (
              <li key={option.btu}>
                <Link
                  href={`/products?category=${AIR_CONDITIONER_CATEGORY_SLUG}&capacity=${option.btu}#danh-sach`}
                  className="flex min-h-[72px] flex-col justify-center rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 transition-colors hover:border-[#0EA5E9] hover:bg-[#F0F9FF]"
                >
                  <span className="text-sm font-bold text-[#111827] sm:text-base">
                    Phòng {lowerFirst(option.roomSize)}
                  </span>
                  <span className="mt-0.5 text-xs text-[#6B7280] sm:text-sm">
                    {option.btu.toLocaleString("vi-VN")} BTU · {option.horsepower}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/products?category=${AIR_CONDITIONER_CATEGORY_SLUG}#danh-sach`}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#0369A1] px-4 text-sm font-bold text-white transition-colors hover:bg-[#075985]"
          >
            Xem tất cả điều hòa
          </Link>
        </div>
      </Container>
    </section>
  );
}
