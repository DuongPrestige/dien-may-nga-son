import { ArrowRight, Wrench } from "lucide-react";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { SectionHeading } from "@/src/features/home/components/section-heading";
import type { ServiceCardData } from "@/src/features/services/types/services.types";

type HomeServicesProps = {
  services: ServiceCardData[];
};

export function HomeServices({ services }: HomeServicesProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <Section padding="compact">
      <Container>
        <SectionHeading
          title="Dịch vụ điện lạnh tại Kinh Môn"
          description="Sửa chữa, bảo dưỡng và lắp đặt điều hòa, tủ lạnh, máy giặt cho gia đình."
          action={{ href: "/services", label: "Tất cả dịch vụ" }}
        />
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.id}>
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col rounded-xl border border-[#E5E7EB] bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-[#7DD3FC] hover:shadow-[0_12px_32px_rgba(14,165,233,0.10)] sm:p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#F97316]">
                  <Wrench aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-base font-bold leading-6 text-[#111827]">
                  {service.name}
                </h3>
                {service.shortDescription ? (
                  <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-6 text-[#6B7280]">
                    {service.shortDescription}
                  </p>
                ) : (
                  <span className="flex-1" />
                )}
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#0284C7]">
                  Xem chi tiết & giá
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
