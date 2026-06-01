import Link from "next/link";

const adminMenuItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Services", href: "/admin/services" },
  { label: "Posts", href: "/admin/posts" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Settings", href: "/admin/settings" },
] as const;

export function AdminSidebar() {
  return (
    <aside className="border-b border-[#E5E7EB] bg-white lg:min-h-[calc(100vh-9rem)] lg:w-64 lg:border-b-0 lg:border-r">
      <div className="p-4 lg:p-6">
        <p className="text-xs font-bold uppercase text-[#0284C7]">
          Quản trị
        </p>
        <h2 className="mt-1 text-lg font-bold text-[#111827]">
          Điện Máy Nga Sơn
        </h2>
      </div>
      <nav
        aria-label="Admin navigation"
        className="flex gap-2 overflow-x-auto px-4 pb-4 lg:grid lg:overflow-visible lg:px-4"
      >
        {adminMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F0F9FF] hover:text-[#0284C7]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
