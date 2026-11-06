import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isAiSeoEnabled } from "@/src/features/ai-seo/lib/ai-seo-config";
import { ProjectForm } from "@/src/features/projects/components/admin/project-form";
import { getAdminProjectById } from "@/src/features/projects/services/projects.service";

export const metadata: Metadata = {
  title: "Sửa công trình | Admin",
  robots: { index: false, follow: false },
};

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const IMPORT_NOTICES: Record<string, string> = {
  facebook:
    "Đã tạo bản nháp từ bài đăng Facebook. Hãy kiểm tra tiêu đề, loại công trình, địa điểm và nội dung trước khi xuất bản.",
  "facebook-no-image":
    "Đã tạo bản nháp từ bài đăng Facebook nhưng chưa lấy được ảnh. Hãy tải ảnh đại diện lên và kiểm tra nội dung trước khi xuất bản.",
};

export default async function EditProjectPage({
  params,
  searchParams,
}: EditProjectPageProps) {
  const { id } = await params;
  const query = (await searchParams) ?? {};
  const project = await getAdminProjectById(id);

  if (!project) {
    notFound();
  }

  const importedKey = typeof query.imported === "string" ? query.imported : "";
  const importNotice = IMPORT_NOTICES[importedKey];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Sửa công trình</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Cập nhật nội dung, hình ảnh, trạng thái và thông tin SEO.
        </p>
      </div>
      {importNotice ? (
        <p
          role="status"
          className="rounded-md border border-[#BAE6FD] bg-[#F0F9FF] px-4 py-3 text-sm text-[#0369A1]"
        >
          {importNotice}
        </p>
      ) : null}
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <ProjectForm project={project} isAiSeoEnabled={isAiSeoEnabled()} />
      </div>
    </div>
  );
}
