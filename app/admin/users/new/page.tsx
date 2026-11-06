import type { Metadata } from "next";

import { UserForm } from "@/src/features/users/components/admin/user-form";
import { requireSuperAdmin } from "@/src/features/users/lib/require-super-admin";

export const metadata: Metadata = {
  title: "New user | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewUserPage() {
  await requireSuperAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">New user</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Tạo tài khoản quản trị mới cho nhân viên cửa hàng.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <UserForm />
      </div>
    </div>
  );
}
