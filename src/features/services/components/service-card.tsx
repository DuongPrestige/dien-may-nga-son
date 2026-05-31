import Image from "next/image";
import Link from "next/link";

import type { ServiceCardData } from "@/src/features/services/types/services.types";

type ServiceCardProps = {
  service: ServiceCardData;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#E5E7EB] bg-white transition-colors hover:border-[#0EA5E9]">
      <div className="relative aspect-[4/3] bg-[#E0F2FE]">
        {service.thumbnailUrl ? (
          <Image
            src={service.thumbnailUrl}
            alt={service.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-5 text-center">
            <span className="text-sm font-bold text-[#0369A1]">
              Điện Máy Nga Sơn
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {service.isFeatured ? (
          <p className="text-xs font-semibold uppercase text-[#0284C7]">
            Dịch vụ nổi bật
          </p>
        ) : null}
        <h2 className="mt-2 text-lg font-bold leading-7 text-[#111827]">
          <Link href={`/services/${service.slug}`}>{service.name}</Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-[#6B7280]">
          {service.shortDescription ??
            "Tư vấn nhanh, kiểm tra rõ tình trạng và báo giá trước khi thực hiện."}
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <a
            href="tel:#"
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#F97316] px-3 text-sm font-bold text-white hover:bg-[#ea580c]"
          >
            Gọi
          </a>
          <a
            href="#"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#0EA5E9] px-3 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
          >
            Zalo
          </a>
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#E5E7EB] px-3 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}
