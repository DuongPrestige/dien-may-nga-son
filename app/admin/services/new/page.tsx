import type { Metadata } from "next";

import { ServiceForm } from "@/src/features/services/components/admin/service-form";

export const metadata: Metadata = {
  title: "New service | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">New service</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Create a service page for repair, maintenance, or installation leads.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <ServiceForm />
      </div>
    </div>
  );
}
