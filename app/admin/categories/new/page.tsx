import type { Metadata } from "next";

import { CategoryForm } from "@/src/features/categories/components/admin/category-form";

export const metadata: Metadata = {
  title: "New category | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">New category</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Create a category for product organization and filtering.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <CategoryForm />
      </div>
    </div>
  );
}
