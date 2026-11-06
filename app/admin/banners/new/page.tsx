import type { Metadata } from "next";

import { BannerForm } from "@/src/features/banners/components/admin/banner-form";

export const metadata: Metadata = {
  title: "New banner | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">New banner</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Tạo banner khuyến mãi hiển thị trên website.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <BannerForm />
      </div>
    </div>
  );
}
