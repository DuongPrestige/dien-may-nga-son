import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceForm } from "@/src/features/services/components/admin/service-form";
import { getAdminServiceById } from "@/src/features/services/services/services.service";

export const metadata: Metadata = {
  title: "Edit service | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditServicePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const service = await getAdminServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Edit service</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Update service content, lead-focused positioning, and SEO fields.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <ServiceForm service={service} />
      </div>
    </div>
  );
}
