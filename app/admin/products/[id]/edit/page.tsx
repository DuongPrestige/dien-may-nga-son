import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductForm } from "@/src/features/products/components/admin/product-form";
import {
  getAdminProductById,
  getProductAdminOptions,
} from "@/src/features/products/services/products.service";

export const metadata: Metadata = {
  title: "Edit product | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getAdminProductById(id);
  const options = await getProductAdminOptions();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Edit product</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Update catalog, pricing, SEO, specs, and gallery fields.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <ProductForm
          product={product}
          categories={options.categories}
          brands={options.brands}
        />
      </div>
    </div>
  );
}
