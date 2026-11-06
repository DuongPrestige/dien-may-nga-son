import {
  FileText,
  Headset,
  MapPin,
  Snowflake,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { SectionHeading } from "@/src/features/home/components/section-heading";
import { SERVICE_AREAS } from "@/src/lib/service-areas";

type Reason = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const REASONS: readonly Reason[] = [
  {
    icon: Headset,
    title: "Tư vấn dễ hiểu",
    description: "Tư vấn theo diện tích phòng, thói quen dùng và ngân sách.",
  },
  {
    icon: Snowflake,
    title: "Chuyên điều hòa",
    description: "Ưu tiên mua bán, lắp đặt, bảo dưỡng và sửa chữa điều hòa.",
  },
  {
    icon: FileText,
    title: "Báo giá rõ ràng",
    description: "Báo phương án và chi phí trước khi khách quyết định.",
  },
  {
    icon: MapPin,
    title: "Gần nhà bạn",
    description: "Hỗ trợ nhanh tại Kinh Môn và khu vực lân cận.",
  },
];

export function HomeReasons() {
  return (
    <Section padding="compact" className="bg-[#F8FAFC]">
      <Container>
        <SectionHeading
          title="Vì sao khách hàng chọn Điện Máy Nga Sơn"
          description="Cách làm rõ ràng, gần khách hàng địa phương và ưu tiên phản hồi nhanh."
        />
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-base font-bold text-[#111827]">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#6B7280]">
                {description}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4 sm:flex-row sm:items-center sm:p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-[#0C4A6E]">
            <MapPin aria-hidden="true" className="h-5 w-5 text-[#0284C7]" />
            Khu vực phục vụ:
          </p>
          <ul className="flex flex-wrap gap-2">
            {SERVICE_AREAS.map((area) => (
              <li
                key={area}
                className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-[#0284C7]"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
