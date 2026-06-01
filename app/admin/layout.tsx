import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminSidebar } from "@/src/features/admin/components/admin-sidebar";
import { AdminTopbar } from "@/src/features/admin/components/admin-topbar";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-pathname");

  if (pathname === "/admin/login") {
    return children;
  }

  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="bg-[#F8FAFC]">
      <div className="lg:flex">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <AdminTopbar session={session} />
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
