import type { LeadSourceType, LeadStatus } from "@prisma/client";

export type DashboardLeadMetrics = Record<LeadStatus, number>;

export type DashboardRecentLead = {
  id: string;
  name: string;
  phone: string;
  status: LeadStatus;
  sourceType: LeadSourceType | null;
  createdAt: Date;
};

export type AdminDashboardData = {
  totals: {
    products: number;
    services: number;
    posts: number;
    leads: number;
  };
  leadMetrics: DashboardLeadMetrics;
  leadsToday: number;
  leadsLast7Days: number;
  leadsLast30Days: number;
  recentLeads: DashboardRecentLead[];
};
