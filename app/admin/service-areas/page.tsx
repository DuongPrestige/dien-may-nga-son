import type { Metadata } from "next";
import Link from "next/link";

import { ServiceAreaRowActions } from "@/src/features/service-areas/components/admin/service-area-row-actions";
import { getAdminServiceAreas } from "@/src/features/service-areas/services/service-areas.service";

export const metadata: Metadata = {
  title: "Khu vực | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

const ADMIN_PAGE_SIZE = 20;

type AdminServiceAreasPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getPage(value: string | string[] | undefined): number {
  const page = Number(typeof value === "string" ? value : undefined);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function buildPageHref(page: number): string {
  return `/admin/service-areas?page=${page}`;
}

export default async function AdminServiceAreasPage({
  searchParams,
}: AdminServiceAreasPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const result = await getAdminServiceAreas({
    page: getPage(resolvedSearchParams.page),
    limit: ADMIN_PAGE_SIZE,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Khu vực</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Mỗi khu vực đang bật có trang riêng tại /khu-vuc/[slug] để tăng
            SEO địa phương.
          </p>
        </div>
        <Link
          href="/admin/service-areas/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white hover:bg-[#075985]"
        >
          Thêm khu vực
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        {result.areas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
              <thead className="bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Khu vực</th>
                  <th className="px-4 py-3">Thứ tự</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {result.areas.map((area) => (
                  <tr key={area.id}>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#111827]">{area.name}</div>
                      {area.isActive ? (
                        <Link
                          href={`/khu-vuc/${area.slug}`}
                          target="_blank"
                          className="text-xs text-[#0369A1] hover:text-[#075985]"
                        >
                          /khu-vuc/{area.slug}
                        </Link>
                      ) : (
                        <div className="text-xs text-[#6B7280]">
                          /khu-vuc/{area.slug}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {area.sortOrder}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${
                          area.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-[#F3F4F6] text-[#6B7280]"
                        }`}
                      >
                        {area.isActive ? "Đang bật" : "Đã tắt"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ServiceAreaRowActions
                        areaId={area.id}
                        areaName={area.name}
                        isActive={area.isActive}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-lg font-bold text-[#111827]">
              Chưa có khu vực nào
            </h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              Thêm các xã, phường đang phục vụ để tạo trang SEO địa phương.
            </p>
            <Link
              href="/admin/service-areas/new"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white hover:bg-[#075985]"
            >
              Thêm khu vực
            </Link>
          </div>
        )}
      </div>

      {result.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3">
          <Link
            href={buildPageHref(Math.max(1, result.page - 1))}
            className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
          >
            Trang trước
          </Link>
          <span className="text-sm font-semibold text-[#6B7280]">
            Trang {result.page} / {result.totalPages}
          </span>
          <Link
            href={buildPageHref(Math.min(result.totalPages, result.page + 1))}
            className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
          >
            Trang sau
          </Link>
        </div>
      ) : null}
    </div>
  );
}
