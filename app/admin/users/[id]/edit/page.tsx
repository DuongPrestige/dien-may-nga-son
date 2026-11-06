import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UserForm } from "@/src/features/users/components/admin/user-form";
import { requireSuperAdmin } from "@/src/features/users/lib/require-super-admin";
import { getAdminUserById } from "@/src/features/users/services/users.service";
import { userIdSchema } from "@/src/features/users/validators/user.validator";

export const metadata: Metadata = {
  title: "Edit user | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { userId } = await requireSuperAdmin();
  const { id } = await params;
  const parsedId = userIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const user = await getAdminUserById(parsedId.data);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Edit user</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Cập nhật thông tin, vai trò, mật khẩu hoặc trạng thái tài khoản.
        </p>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <UserForm user={user} isSelf={user.id === userId} />
      </div>
    </div>
  );
}
