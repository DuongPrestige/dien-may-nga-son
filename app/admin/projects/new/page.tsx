import type { Metadata } from "next";

import { isAiSeoEnabled } from "@/src/features/ai-seo/lib/ai-seo-config";
import { ProjectForm } from "@/src/features/projects/components/admin/project-form";

export const metadata: Metadata = {
  title: "Thêm công trình | Admin",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">
          Thêm công trình thực tế
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Ghi lại công trình đã hoàn thành và tối ưu nội dung tìm kiếm địa
          phương.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <ProjectForm isAiSeoEnabled={isAiSeoEnabled()} />
      </div>
    </div>
  );
}
