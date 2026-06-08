import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryForm } from "@/src/features/categories/components/admin/category-form";
import { getAdminCategoryById } from "@/src/features/categories/services/categories.service";

export const metadata: Metadata = {
  title: "Edit category | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const category = await getAdminCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Edit category</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Update product category content and public filter labels.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
