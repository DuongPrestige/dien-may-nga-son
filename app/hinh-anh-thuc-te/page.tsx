import { MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BreadcrumbNav } from "@/src/components/shared/breadcrumb-nav";
import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import {
  GALLERY_FILTERS,
  getGalleryFilter,
} from "@/src/features/projects/lib/gallery-filters";
import {
  getGalleryProjects,
  type GalleryResult,
} from "@/src/features/projects/services/gallery.service";
import { getStoreContactLinks } from "@/src/features/settings/services/settings.service";
import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";
import { BreadcrumbSchema, serializeJsonLd } from "@/src/lib/schema";
import { SITE_NAME, buildMetadata } from "@/src/lib/seo";

const GALLERY_PATH = "/hinh-anh-thuc-te";

export const metadata: Metadata = buildMetadata({
  title: `Hình ảnh thực tế lắp đặt, sửa điều hòa Kinh Môn | ${SITE_NAME}`,
  description:
    "Ảnh thực tế lắp đặt, bảo dưỡng, sửa điều hòa, máy giặt, tủ lạnh và giao hàng tại Kinh Môn, Quang Thành, Hải Dương.",
  path: GALLERY_PATH,
});

const breadcrumbItems = [
  { name: "Trang chủ", href: "/" },
  { name: "Hình ảnh thực tế", href: GALLERY_PATH },
];

type GalleryPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];

  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getPage(value: string | undefined): number {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function buildGalleryHref(filter: string | undefined, page = 1): string {
  const params = new URLSearchParams();

  if (filter) {
    params.set("loai", filter);
  }

  if (page > 1) {
    params.set("trang", String(page));
  }

  const query = params.toString();
  return query ? `${GALLERY_PATH}?${query}` : GALLERY_PATH;
}

const EMPTY_RESULT: GalleryResult = {
  items: [],
  total: 0,
  page: 1,
  hasMore: false,
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = (await searchParams) ?? {};
  const activeFilter = getGalleryFilter(getSearchValue(params, "loai"));
  const page = getPage(getSearchValue(params, "trang"));
  const [result, contactLinks] = await Promise.all([
    getGalleryProjects(activeFilter?.value, page).catch(() => EMPTY_RESULT),
    getStoreContactLinks(),
  ]);
  const breadcrumbSchema = BreadcrumbSchema(
    breadcrumbItems.map((item) => ({ name: item.name, url: item.href })),
  );
  const chips = [
    { value: undefined, label: "Tất cả" },
    ...GALLERY_FILTERS.map((filter) => ({
      value: filter.value,
      label: filter.label,
    })),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <Section padding="none" className="py-8 sm:py-12">
        <Container>
          <BreadcrumbNav items={breadcrumbItems} />
          <h1 className="mt-4 text-2xl font-bold leading-tight text-[#111827] sm:text-4xl">
            Hình ảnh thực tế
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#6B7280] sm:text-base">
            Ảnh công trình cửa hàng đã làm tại Kinh Môn và lân cận.
          </p>

          <nav aria-label="Lọc hình ảnh" className="mt-5">
            <ul className="flex flex-wrap gap-2">
              {chips.map((chip) => {
                const isActive = chip.value === activeFilter?.value;

                return (
                  <li key={chip.label}>
                    <Link
                      href={buildGalleryHref(chip.value)}
                      aria-current={isActive ? "page" : undefined}
                      scroll={false}
                      className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-bold transition-colors ${
                        isActive
                          ? "border-[#0EA5E9] bg-[#0369A1] text-white"
                          : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#0EA5E9] hover:text-[#075985]"
                      }`}
                    >
                      {chip.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {result.items.length > 0 ? (
            <>
              <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                {result.items.map((item, index) => {
                  const imageSrc = getSafeImageSrc(item.thumbnailUrl);

                  return (
                    <li key={item.id}>
                      <Link
                        href={`/cong-trinh-thuc-te/${item.slug}`}
                        className="group relative block aspect-square overflow-hidden rounded-lg bg-[#E0F2FE]"
                      >
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={item.title}
                            fill
                            priority={index < 4}
                            unoptimized={shouldUseUnoptimizedImage(imageSrc)}
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : null}
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-2.5 pb-2 pt-8 text-white sm:px-3">
                          <span className="line-clamp-1 text-xs font-bold sm:text-sm">
                            {item.title}
                          </span>
                          <span className="mt-0.5 flex items-center gap-1 text-[11px] text-white/85 sm:text-xs">
                            <MapPin aria-hidden="true" className="h-3 w-3 shrink-0" />
                            <span className="line-clamp-1">{item.location}</span>
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {result.hasMore ? (
                <div className="mt-6 flex justify-center">
                  <Link
                    href={buildGalleryHref(activeFilter?.value, result.page + 1)}
                    scroll={false}
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] bg-white px-6 text-sm font-bold text-[#0369A1] hover:bg-[#E0F2FE]"
                  >
                    Xem thêm
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-6 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-6 text-center">
              <p className="text-sm text-[#374151]">
                Chưa có ảnh cho mục này. Gọi để xem thêm công trình thực tế.
              </p>
              <a
                href={contactLinks.phoneHref}
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#C2410C] px-5 text-sm font-bold text-white hover:bg-[#9A3412]"
              >
                <Phone aria-hidden="true" className="h-4 w-4" />
                Gọi ngay
              </a>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
