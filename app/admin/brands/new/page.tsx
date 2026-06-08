import type { Metadata } from "next";

import { BrandForm } from "@/src/features/brands/components/admin/brand-form";

export const metadata: Metadata = {
  title: "New brand | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewBrandPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">New brand</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Create a brand for product organization and filtering.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <BrandForm />
      </div>
    </div>
  );
}
