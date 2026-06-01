import { prisma } from "@/src/lib/prisma";

type DashboardCounts = {
  products: number;
  services: number;
  posts: number;
  leads: number;
};

export const dynamic = "force-dynamic";

async function getDashboardCounts(): Promise<DashboardCounts> {
  try {
    const [products, services, posts, leads] = await Promise.all([
      prisma.product.count(),
      prisma.service.count(),
      prisma.post.count(),
      prisma.lead.count(),
    ]);

    return {
      products,
      services,
      posts,
      leads,
    };
  } catch {
    return {
      products: 0,
      services: 0,
      posts: 0,
      leads: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts();
  const countCards = [
    { label: "Product count", value: counts.products },
    { label: "Service count", value: counts.services },
    { label: "Post count", value: counts.posts },
    { label: "Lead count", value: counts.leads },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase text-[#0284C7]">
          Dashboard
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[#111827]">
          Welcome Admin
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6B7280]">
          Tổng quan dữ liệu hiện có trong hệ thống quản trị.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {countCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-[#E5E7EB] bg-white p-5"
          >
            <p className="text-sm font-semibold text-[#6B7280]">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-bold text-[#111827]">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
