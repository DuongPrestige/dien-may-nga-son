import type { Metadata } from "next";

import { FacebookImportForm } from "@/src/features/projects/components/admin/facebook-import-form";

export const metadata: Metadata = {
  title: "Nhập công trình từ Facebook | Admin",
  robots: { index: false, follow: false },
};

export default function ImportProjectFromFacebookPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">
          Nhập công trình từ Facebook
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Dán liên kết bài đăng Facebook công khai để tạo nhanh bản nháp công
          trình thực tế.
        </p>
      </div>
      <div className="max-w-2xl rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <FacebookImportForm />
      </div>
    </div>
  );
}
