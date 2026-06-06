import type { LeadStatus, Prisma } from "@prisma/client";

import { prisma } from "@/src/lib/prisma";
import type {
  AdminLeadFilters,
  CreateLeadInput,
  GetLeadsInput,
  LeadListItem,
  UpdateLeadStatusInput,
} from "@/src/features/leads/types/leads.types";

export async function createLead(input: CreateLeadInput) {
  return prisma.lead.create({
    data: {
      name: input.name,
      phone: input.phone,
      message: input.message,
      sourceType: input.sourceType,
      sourceUrl: input.sourceUrl,
      productId: input.productId,
      serviceId: input.serviceId,
    },
  });
}

export async function getLeads({
  status,
  sourceType,
  page = 1,
  limit = 20,
}: GetLeadsInput = {}): Promise<LeadListItem[]> {
  const where: Prisma.LeadWhereInput = {
    status,
    sourceType,
  };

  return prisma.lead.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      phone: true,
      message: true,
      sourceType: true,
      sourceUrl: true,
      status: true,
      createdAt: true,
    },
  });
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      message: true,
      sourceType: true,
      sourceUrl: true,
      status: true,
      createdAt: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

export async function getAdminLeads({
  search,
  status,
  page = 1,
  limit = 20,
}: AdminLeadFilters = {}) {
  const where: Prisma.LeadWhereInput = {
    status,
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              phone: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              message: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        phone: true,
        sourceType: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    leads,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function updateLeadStatus({
  id,
  status,
}: UpdateLeadStatusInput) {
  return prisma.lead.update({
    where: {
      id,
    },
    data: {
      status,
    },
    select: {
      id: true,
    },
  });
}

export async function deleteLead(id: string) {
  return prisma.lead.delete({
    where: {
      id,
    },
  });
}

export function isLeadStatus(value: string): value is LeadStatus {
  return ["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "LOST"].includes(
    value,
  );
}

