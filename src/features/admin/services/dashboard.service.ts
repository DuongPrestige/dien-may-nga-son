import { LeadStatus } from "@prisma/client";

import type {
  AdminDashboardData,
  DashboardLeadMetrics,
} from "@/src/features/admin/types/dashboard.types";
import { prisma } from "@/src/lib/prisma";

const VIETNAM_UTC_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function getLeadDateBoundaries(now: Date) {
  const vietnamNow = new Date(now.getTime() + VIETNAM_UTC_OFFSET_MS);
  const todayStartUtc = new Date(
    Date.UTC(
      vietnamNow.getUTCFullYear(),
      vietnamNow.getUTCMonth(),
      vietnamNow.getUTCDate(),
    ) - VIETNAM_UTC_OFFSET_MS,
  );

  return {
    todayStartUtc,
    last7DaysStartUtc: new Date(todayStartUtc.getTime() - 6 * DAY_MS),
    last30DaysStartUtc: new Date(todayStartUtc.getTime() - 29 * DAY_MS),
  };
}

function createEmptyLeadMetrics(): DashboardLeadMetrics {
  return {
    [LeadStatus.NEW]: 0,
    [LeadStatus.CONTACTED]: 0,
    [LeadStatus.QUALIFIED]: 0,
    [LeadStatus.CLOSED]: 0,
    [LeadStatus.LOST]: 0,
  };
}

export async function getAdminDashboardData(
  now = new Date(),
): Promise<AdminDashboardData> {
  const { todayStartUtc, last7DaysStartUtc, last30DaysStartUtc } =
    getLeadDateBoundaries(now);

  const [
    products,
    services,
    posts,
    leadGroups,
    leadsToday,
    leadsLast7Days,
    leadsLast30Days,
    recentLeads,
  ] = await prisma.$transaction([
    prisma.product.count(),
    prisma.service.count(),
    prisma.post.count(),
    prisma.lead.groupBy({
      by: ["status"],
      orderBy: {
        status: "asc",
      },
      _count: {
        status: true,
      },
    }),
    prisma.lead.count({
      where: {
        createdAt: {
          gte: todayStartUtc,
        },
      },
    }),
    prisma.lead.count({
      where: {
        createdAt: {
          gte: last7DaysStartUtc,
        },
      },
    }),
    prisma.lead.count({
      where: {
        createdAt: {
          gte: last30DaysStartUtc,
        },
      },
    }),
    prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        sourceType: true,
        createdAt: true,
      },
    }),
  ]);

  const leadMetrics = createEmptyLeadMetrics();
  const statusGroups = leadGroups as Array<{
    status: LeadStatus;
    _count: {
      status: number;
    };
  }>;

  for (const group of statusGroups) {
    leadMetrics[group.status] = group._count.status;
  }

  return {
    totals: {
      products,
      services,
      posts,
      leads: Object.values(leadMetrics).reduce(
        (total, count) => total + count,
        0,
      ),
    },
    leadMetrics,
    leadsToday,
    leadsLast7Days,
    leadsLast30Days,
    recentLeads,
  };
}
