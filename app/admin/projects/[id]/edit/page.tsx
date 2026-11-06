import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/src/features/projects/components/admin/project-form";
import { getAdminProjectById } from "@/src/features/projects/services/projects.service";

export const metadata: Metadata = {
  title: "Sửa công trình | Admin",
  robots: { index: false, follow: false },
};

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const project = await getAdminProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Sửa công trình</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Cập nhật nội dung, hình ảnh, trạng thái và thông tin SEO.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
