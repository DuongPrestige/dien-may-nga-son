import { ProjectType } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { ProjectCard } from "@/src/features/projects/components/project-card";
import { PROJECT_TYPE_OPTIONS } from "@/src/features/projects/constants";
import { getPublishedProjects } from "@/src/features/projects/services/projects.service";
import type { ProjectFilters } from "@/src/features/projects/types/projects.types";
import { getStoreContactLinks } from "@/src/features/settings/services/settings.service";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Công trình điện lạnh thực tế tại Kinh Môn | Điện Máy Nga Sơn",
  description:
    "Xem các công trình lắp đặt, bảo dưỡng và sửa chữa điều hòa, máy giặt, tủ lạnh thực tế tại Kinh Môn, Quang Thành, Hải Dương.",
  path: "/cong-trinh-thuc-te",
});

export const revalidate = 3600;

type ProjectsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
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

function buildPageHref(filters: ProjectFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.projectType) params.set("projectType", filters.projectType);
  params.set("page", String(page));
  return `/cong-trinh-thuc-te?${params.toString()}`;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = (await searchParams) ?? {};
  const filters: ProjectFilters = {
    search: getValue(params, "search"),
    projectType: getProjectType(getValue(params, "projectType")),
    page: getPage(getValue(params, "page")),
  };
  const [result, contactLinks] = await Promise.all([
    getPublishedProjects(filters),
    getStoreContactLinks(),
  ]);

  return (
    <>
      <Section padding="none" className="bg-[#F8FAFC] py-10 sm:py-14">
        <Container>
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-bold uppercase text-[#0369A1]">
              Công trình thực tế
            </p>
            <h1 className="text-3xl font-bold leading-tight text-[#111827] sm:text-5xl">
              Công trình điện lạnh đã thực hiện tại Kinh Môn
            </h1>
            <p className="text-base leading-7 text-[#6B7280]">
              Ảnh thực tế lắp đặt, bảo dưỡng, sửa chữa tại Kinh Môn.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={contactLinks.phoneHref}
                className="inline-flex min-h-11 items-center justify-center rounded-md cta-orange px-5 text-sm font-bold text-white"
              >
                Gọi tư vấn
              </a>
              <a
                href={contactLinks.zaloHref}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-5 text-sm font-bold text-[#0369A1] hover:bg-[#E0F2FE]"
              >
                Nhắn Zalo
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <form
            className="grid gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4 sm:grid-cols-[1fr_16rem_auto]"
          >
            <label className="space-y-2 text-sm font-semibold text-[#111827]">
              Tìm công trình
              <input
                name="search"
                defaultValue={filters.search ?? ""}
                placeholder="Tiêu đề hoặc địa điểm"
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-[#111827]">
              Loại công trình
              <select
                name="projectType"
                defaultValue={filters.projectType ?? ""}
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm font-normal"
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
                className="min-h-11 rounded-md bg-[#111827] px-5 text-sm font-bold text-white hover:bg-[#374151]"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {result.items.length ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-8 text-center">
              <h2 className="text-xl font-bold text-[#111827]">
                Chưa tìm thấy công trình phù hợp
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                Thử thay đổi từ khóa hoặc loại công trình để xem thêm kết quả.
              </p>
            </div>
          )}

          {result.totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-between gap-3">
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
        </Container>
      </Section>
    </>
  );
}
