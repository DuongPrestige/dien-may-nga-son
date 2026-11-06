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
    description: "Theo diện tích phòng và ngân sách.",
  },
  {
    icon: Snowflake,
    title: "Chuyên điều hòa",
    description: "Bán, lắp, bảo dưỡng, sửa chữa.",
  },
  {
    icon: FileText,
    title: "Báo giá rõ ràng",
    description: "Báo chi phí trước khi làm.",
  },
  {
    icon: MapPin,
    title: "Gần nhà bạn",
    description: "Có mặt nhanh tại Kinh Môn.",
  },
];

export function HomeReasons() {
  return (
    <Section padding="compact" className="bg-[#F8FAFC]">
      <Container>
        <SectionHeading title="Vì sao chọn Điện Máy Nga Sơn" />
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="rounded-xl border border-[#E5E7EB] bg-white p-3 sm:p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0369A1]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-base font-bold text-[#111827]">
                {title}
              </h3>
              <p className="mt-0.5 text-sm leading-6 text-[#6B7280]">
                {description}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4 sm:flex-row sm:items-center sm:p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-[#0C4A6E]">
            <MapPin aria-hidden="true" className="h-5 w-5 text-[#0369A1]" />
            Khu vực phục vụ:
          </p>
          <ul className="flex flex-wrap gap-2">
            {SERVICE_AREAS.map((area) => (
              <li
                key={area}
                className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-[#0369A1]"
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
