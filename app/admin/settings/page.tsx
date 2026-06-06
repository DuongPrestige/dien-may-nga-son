import type { Metadata } from "next";

import { SettingsForm } from "@/src/features/settings/components/admin/settings-form";
import { getSettings } from "@/src/features/settings/services/settings.service";

export const metadata: Metadata = {
  title: "Settings | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Settings</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Manage store information used across public pages and contact actions.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
