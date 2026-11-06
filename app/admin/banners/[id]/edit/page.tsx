import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BannerForm } from "@/src/features/banners/components/admin/banner-form";
import { getAdminBannerById } from "@/src/features/banners/services/banners.service";
import { bannerIdSchema } from "@/src/features/banners/validators/banner.validator";

export const metadata: Metadata = {
  title: "Edit banner | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditBannerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;
  const parsedId = bannerIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const banner = await getAdminBannerById(parsedId.data);

  if (!banner) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Edit banner</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Cập nhật ảnh, link, vị trí và trạng thái hiển thị của banner.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <BannerForm banner={banner} />
      </div>
    </div>
  );
}
