import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceAreaForm } from "@/src/features/service-areas/components/admin/service-area-form";
import { getAdminServiceAreaById } from "@/src/features/service-areas/services/service-areas.service";
import { serviceAreaIdSchema } from "@/src/features/service-areas/validators/service-area.validator";

export const metadata: Metadata = {
  title: "Sửa khu vực | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditServiceAreaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServiceAreaPage({
  params,
}: EditServiceAreaPageProps) {
  const { id } = await params;
  const parsedId = serviceAreaIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const area = await getAdminServiceAreaById(parsedId.data);

  if (!area) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Sửa khu vực</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Cập nhật tên, slug, mô tả và SEO của trang khu vực.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <ServiceAreaForm area={area} />
      </div>
    </div>
  );
}
