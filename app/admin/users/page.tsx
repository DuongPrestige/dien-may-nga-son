import type { Metadata } from "next";
import Link from "next/link";

import { getUserRoleLabel } from "@/src/features/users/constants";
import { requireSuperAdmin } from "@/src/features/users/lib/require-super-admin";
import { getAdminUsers } from "@/src/features/users/services/users.service";

export const metadata: Metadata = {
  title: "Users | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeZone: "Asia/Ho_Chi_Minh",
});

export default async function AdminUsersPage() {
  const { userId } = await requireSuperAdmin();
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Users</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Quản lý tài khoản quản trị. Chỉ Super Admin truy cập được trang
            này; hệ thống luôn giữ ít nhất một Super Admin đang hoạt động.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0369A1] px-5 text-sm font-bold text-white hover:bg-[#075985]"
        >
          Add user
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
            <thead className="bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#6B7280]">
              <tr>
                <th className="px-4 py-3">Người dùng</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#111827]">
                      {user.fullName ?? user.email}
                      {user.id === userId ? (
                        <span className="ml-2 text-xs font-semibold text-[#0369A1]">
                          (Bạn)
                        </span>
                      ) : null}
                    </div>
                    <div className="text-xs text-[#6B7280]">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-[#374151]">
                    {getUserRoleLabel(user.role)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${
                        user.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-[#F3F4F6] text-[#6B7280]"
                      }`}
                    >
                      {user.isActive ? "Hoạt động" : "Đã vô hiệu hóa"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {dateFormatter.format(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="text-sm font-bold text-[#0369A1] hover:text-[#075985]"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
