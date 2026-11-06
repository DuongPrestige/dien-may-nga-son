import { ProjectStatus, ProjectType } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";

import { DeleteProjectButton } from "@/src/features/projects/components/admin/delete-project-button";
import {
  getProjectTypeLabel,
  PROJECT_TYPE_OPTIONS,
} from "@/src/features/projects/constants";
import { getAdminProjects } from "@/src/features/projects/services/projects.service";
import type { AdminProjectFilters } from "@/src/features/projects/types/projects.types";

export const metadata: Metadata = {
  title: "Công trình thực tế | Admin",
  robots: { index: false, follow: false },
};

type AdminProjectsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getStatus(value: string | undefined) {
  return value === ProjectStatus.DRAFT || value === ProjectStatus.PUBLISHED
    ? value
    : undefined;
}

function getProjectType(value: string | undefined) {
  return Object.values(ProjectType).includes(value as ProjectType)
    ? (value as ProjectType)
    : undefined;
}

function getPage(value: string | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function buildPageHref(filters: AdminProjectFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.projectType) params.set("projectType", filters.projectType);
  params.set("page", String(page));
  return `/admin/projects?${params.toString()}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
}

export default async function AdminProjectsPage({
  searchParams,
}: AdminProjectsPageProps) {
  const params = (await searchParams) ?? {};
  const filters: AdminProjectFilters = {
    search: getValue(params, "search"),
    status: getStatus(getValue(params, "status")),
    projectType: getProjectType(getValue(params, "projectType")),
    page: getPage(getValue(params, "page")),
  };
  const result = await getAdminProjects(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">
            Công trình thực tế
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Quản lý các công trình đã lắp đặt, bảo dưỡng và sửa chữa.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7]"
        >
          Thêm công trình
        </Link>
      </div>

      <form
        action="/admin/projects"
        className="grid gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4 md:grid-cols-[1fr_12rem_15rem_auto]"
      >
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Tìm kiếm
          <input
            name="search"
            defaultValue={filters.search ?? ""}
            placeholder="Tiêu đề, slug, địa điểm"
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Trạng thái
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
          >
            <option value="">Tất cả</option>
            <option value={ProjectStatus.DRAFT}>Bản nháp</option>
            <option value={ProjectStatus.PUBLISHED}>Đã xuất bản</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-semibold text-[#111827]">
          Loại công trình
          <select
            name="projectType"
            defaultValue={filters.projectType ?? ""}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm font-normal"
          >
            <option value="">Tất cả</option>
            {PROJECT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
        {result.items.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
              <thead className="bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Công trình</th>
                  <th className="px-4 py-3">Loại</th>
                  <th className="px-4 py-3">Địa điểm</th>
                  <th className="px-4 py-3">Ngày thực hiện</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {result.items.map((project) => (
                  <tr key={project.id}>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#111827]">
                        {project.title}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        {project.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {getProjectTypeLabel(project.projectType)}
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {project.location}
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {formatDate(project.performedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-[#F0F9FF] px-2 py-1 text-xs font-bold text-[#0284C7]">
                        {project.status === ProjectStatus.PUBLISHED
                          ? "Đã xuất bản"
                          : "Bản nháp"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="text-sm font-bold text-[#0284C7] hover:text-[#0369A1]"
                        >
                          Sửa
                        </Link>
                        <DeleteProjectButton
                          projectId={project.id}
                          projectTitle={project.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-lg font-bold text-[#111827]">
              Chưa có công trình phù hợp
            </h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              Tạo công trình đầu tiên hoặc thay đổi điều kiện lọc.
            </p>
            <Link
              href="/admin/projects/new"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#0EA5E9] px-5 text-sm font-bold text-white hover:bg-[#0284C7]"
            >
              Thêm công trình
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
            Trước
          </Link>
          <span className="text-sm font-semibold text-[#6B7280]">
            Trang {result.page}/{result.totalPages}
          </span>
          <Link
            href={buildPageHref(
              filters,
              Math.min(result.totalPages, result.page + 1),
            )}
            className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
          >
            Sau
          </Link>
        </div>
      ) : null}
    </div>
  );
}
