import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { TestimonialRowActions } from "@/src/features/testimonials/components/admin/testimonial-row-actions";
import { getAdminTestimonials } from "@/src/features/testimonials/services/testimonials.service";
import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";

export const metadata: Metadata = {
  title: "Đánh giá khách hàng | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminTestimonialsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 20;

function getPage(value: string | string[] | undefined): number {
  const page = Number(typeof value === "string" ? value.trim() : undefined);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function buildPageHref(page: number): string {
  const params = new URLSearchParams({ page: String(page) });

  return `/admin/testimonials?${params.toString()}`;
}

export default async function AdminTestimonialsPage({
  searchParams,
}: AdminTestimonialsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const result = await getAdminTestimonials({
    page: getPage(resolvedSearchParams.page),
    limit: PAGE_SIZE,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">
            Đánh giá khách hàng
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Quản lý cảm nhận của khách hàng hiển thị trên trang chủ. Đánh giá
            đang bật được hiển thị theo thứ tự tăng dần.
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white hover:bg-[#075985]"
        >
          Thêm đánh giá
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        {result.testimonials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
              <thead className="bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Khách hàng</th>
                  <th className="px-4 py-3">Nội dung</th>
                  <th className="px-4 py-3">Thứ tự</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {result.testimonials.map((testimonial) => {
                  const imageSrc = getSafeImageSrc(testimonial.imageUrl);

                  return (
                    <tr key={testimonial.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#E0F2FE]">
                            {imageSrc ? (
                              <Image
                                src={imageSrc}
                                alt={testimonial.customerName}
                                fill
                                unoptimized={shouldUseUnoptimizedImage(imageSrc)}
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[#111827]">
                              {testimonial.customerName}
                            </div>
                            <div className="text-xs text-[#6B7280]">
                              {testimonial.area ?? "Chưa ghi khu vực"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#374151]">
                        <p className="line-clamp-2 min-w-56 max-w-md">
                          {testimonial.content}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[#374151]">
                        {testimonial.sortOrder}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-xs font-bold ${
                            testimonial.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-[#F3F4F6] text-[#6B7280]"
                          }`}
                        >
                          {testimonial.isActive ? "Đang bật" : "Đã tắt"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <TestimonialRowActions
                          testimonialId={testimonial.id}
                          customerName={testimonial.customerName}
                          isActive={testimonial.isActive}
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
              Chưa có đánh giá nào
            </h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              Thêm cảm nhận thật của khách hàng để tăng độ tin cậy trên trang
              chủ.
            </p>
            <Link
              href="/admin/testimonials/new"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white hover:bg-[#075985]"
            >
              Thêm đánh giá
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
            Trước
          </Link>
          <span className="text-sm font-semibold text-[#6B7280]">
            Trang {result.page} / {result.totalPages}
          </span>
          <Link
            href={buildPageHref(Math.min(result.totalPages, result.page + 1))}
            className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
          >
            Sau
          </Link>
        </div>
      ) : null}
    </div>
  );
}
