import {
  Refrigerator,
  Snowflake,
  Tv,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { SectionHeading } from "@/src/features/home/components/section-heading";

type HomeCategory = {
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
};

const HOME_CATEGORIES: readonly HomeCategory[] = [
  {
    name: "Điều hòa",
    slug: "dieu-hoa",
    description: "Tư vấn công suất, lắp đặt",
    icon: Snowflake,
  },
  {
    name: "Tivi",
    slug: "tivi",
    description: "Phòng khách, phòng ngủ",
    icon: Tv,
  },
  {
    name: "Tủ lạnh",
    slug: "tu-lanh",
    description: "Tiết kiệm điện, bền bỉ",
    icon: Refrigerator,
  },
  {
    name: "Máy giặt",
    slug: "may-giat",
    description: "Cửa trên, cửa trước",
    icon: WashingMachine,
  },
];

export function HomeCategories() {
  return (
    <Section padding="compact">
      <Container>
        <SectionHeading title="Danh mục sản phẩm" />
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {HOME_CATEGORIES.map(({ name, slug, description, icon: Icon }) => (
            <li key={slug}>
              <Link
                href={`/products?category=${slug}#danh-sach`}
                className="flex h-full flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-[#7DD3FC] hover:shadow-[0_12px_32px_rgba(14,165,233,0.10)] sm:flex-row sm:items-center sm:p-5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7]">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-base font-bold text-[#111827]">
                    {name}
                  </span>
                  <span className="mt-0.5 hidden text-sm leading-5 text-[#6B7280] sm:block">
                    {description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
