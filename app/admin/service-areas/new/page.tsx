import type { Metadata } from "next";

import { ServiceAreaForm } from "@/src/features/service-areas/components/admin/service-area-form";

export const metadata: Metadata = {
  title: "Thêm khu vực | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewServiceAreaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Thêm khu vực</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Tạo trang SEO cho một xã, phường hoặc thị xã cửa hàng phục vụ.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <ServiceAreaForm />
      </div>
    </div>
  );
}
