import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  BANNER_POSITIONS,
  getBannerPositionLabel,
} from "@/src/features/banners/constants";
import { BannerRowActions } from "@/src/features/banners/components/admin/banner-row-actions";
import { getAdminBanners } from "@/src/features/banners/services/banners.service";
import type { AdminBannerFilters } from "@/src/features/banners/types/banners.types";
import { bannerPositionFilterSchema } from "@/src/features/banners/validators/banner.validator";
import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";

export const metadata: Metadata = {
  title: "Banners | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminBannersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = searchParams[key];

  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function getPage(value: string | undefined): number {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function buildPageHref(filters: AdminBannerFilters, page: number): string {
  const params = new URLSearchParams();

  if (filters.position) {
    params.set("position", filters.position);
  }

  params.set("page", String(page));
  return `/admin/banners?${params.toString()}`;
}

export default async function AdminBannersPage({
  searchParams,
}: AdminBannersPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters: AdminBannerFilters = {
    position: bannerPositionFilterSchema.parse(
      getSearchValue(resolvedSearchParams, "position"),
    ),
    page: getPage(getSearchValue(resolvedSearchParams, "page")),
    limit: 20,
  };
  const result = await getAdminBanners(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Banners</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Quản lý banner khuyến mãi trên trang chủ và trang sản phẩm. Mỗi vị
            trí hiển thị tối đa 4 banner đang bật, theo thứ tự tăng dần.
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white hover:bg-[#075985]"
        >
          Add banner
        </Link>
      </div>

      <form
        action="/admin/banners"
        className="grid gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4 sm:grid-cols-[1fr_auto]"
      >
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Vị trí
          <select
            name="position"
            defaultValue={filters.position ?? ""}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
          >
            <option value="">Tất cả vị trí</option>
            {BANNER_POSITIONS.map((position) => (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="min-h-10 rounded-md bg-[#111827] px-4 text-sm font-bold text-white hover:bg-[#374151]"
          >
            Lọc
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        {result.banners.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
              <thead className="bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Banner</th>
                  <th className="px-4 py-3">Vị trí</th>
                  <th className="px-4 py-3">Thứ tự</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {result.banners.map((banner) => {
                  const imageSrc = getSafeImageSrc(banner.imageUrl);

                  return (
                    <tr key={banner.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative aspect-[3/1] w-32 shrink-0 overflow-hidden rounded-md bg-[#E0F2FE]">
                            {imageSrc ? (
                              <Image
                                src={imageSrc}
                                alt={banner.title}
                                fill
                                unoptimized={shouldUseUnoptimizedImage(imageSrc)}
                                sizes="128px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[#111827]">
                              {banner.title}
                            </div>
                            <div className="max-w-64 truncate text-xs text-[#6B7280]">
                              {banner.targetUrl ?? "Không gắn link"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#374151]">
                        {getBannerPositionLabel(banner.position)}
                      </td>
                      <td className="px-4 py-3 text-[#374151]">
                        {banner.sortOrder}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${
                            banner.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-[#F3F4F6] text-[#6B7280]"
                          }`}
                        >
                          {banner.isActive ? "Đang bật" : "Đã tắt"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <BannerRowActions
                          bannerId={banner.id}
                          bannerTitle={banner.title}
                          isActive={banner.isActive}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-lg font-bold text-[#111827]">
              Chưa có banner nào
            </h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              Tạo banner để giới thiệu khuyến mãi điều hòa hoặc dịch vụ sửa
              chữa.
            </p>
            <Link
              href="/admin/banners/new"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white hover:bg-[#075985]"
            >
              Add banner
            </Link>
          </div>
        )}
      </div>

      {result.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3">
          <Link
            href={buildPageHref(filters, Math.max(1, result.page - 1))}
            className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
          >
            Previous
          </Link>
          <span className="text-sm font-semibold text-[#6B7280]">
            Page {result.page} of {result.totalPages}
          </span>
          <Link
            href={buildPageHref(
              filters,
              Math.min(result.totalPages, result.page + 1),
            )}
            className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
          >
            Next
          </Link>
        </div>
      ) : null}
    </div>
  );
}
