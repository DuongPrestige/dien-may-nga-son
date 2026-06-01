import type { Metadata } from "next";

import { ProductForm } from "@/src/features/products/components/admin/product-form";
import { getProductAdminOptions } from "@/src/features/products/services/products.service";

export const metadata: Metadata = {
  title: "New product | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewProductPage() {
  const { categories, brands } = await getProductAdminOptions();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">New product</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Create a database product for the public catalog.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <ProductForm categories={categories} brands={brands} />
      </div>
    </div>
  );
}
