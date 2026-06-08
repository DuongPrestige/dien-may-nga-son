import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandForm } from "@/src/features/brands/components/admin/brand-form";
import { getAdminBrandById } from "@/src/features/brands/services/brands.service";

export const metadata: Metadata = {
  title: "Edit brand | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditBrandPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = await params;
  const brand = await getAdminBrandById(id);

  if (!brand) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Edit brand</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Update product brand content and public filter labels.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <BrandForm brand={brand} />
      </div>
    </div>
  );
}
