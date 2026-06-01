import type { Session } from "next-auth";

import { logoutAction } from "@/src/features/auth/actions/auth.actions";

type AdminTopbarProps = {
  session: Session;
};

export function AdminTopbar({ session }: AdminTopbarProps) {
  return (
    <header className="border-b border-[#E5E7EB] bg-white px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#6B7280]">
            Xin chào
          </p>
          <h1 className="text-xl font-bold text-[#111827]">
            {session.user.name ?? session.user.email}
          </h1>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#E5E7EB] px-4 text-sm font-bold text-[#111827] hover:bg-[#F8FAFC]"
          >
            Đăng xuất
          </button>
        </form>
      </div>
    </header>
  );
}
