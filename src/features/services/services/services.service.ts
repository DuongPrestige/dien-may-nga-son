import { ProductStatus, type Prisma } from "@prisma/client";

import type {
  ServiceCardData,
  ServiceDetailData,
  AdminServiceDetail,
  AdminServiceFilters,
  AdminServiceListResult,
} from "@/src/features/services/types/services.types";
import type { ServiceFormSchema } from "@/src/features/services/validators/service.validator";
import { prisma } from "@/src/lib/prisma";

const serviceCardSelect = {
  id: true,
  name: true,
  slug: true,
  thumbnailUrl: true,
  shortDescription: true,
  isFeatured: true,
  status: true,
} satisfies Prisma.ServiceSelect;

export async function getServices(): Promise<ServiceCardData[]> {
  return prisma.service.findMany({
    where: {
      status: ProductStatus.ACTIVE,
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    select: serviceCardSelect,
  }) as Promise<ServiceCardData[]>;
}

export async function getFeaturedServices(
  limit = 6,
): Promise<ServiceCardData[]> {
  return prisma.service.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    select: serviceCardSelect,
  }) as Promise<ServiceCardData[]>;
}

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceDetailData | null> {
  return prisma.service.findFirst({
    where: {
      slug,
      status: ProductStatus.ACTIVE,
    },
    select: {
      ...serviceCardSelect,
      content: true,
      seoTitle: true,
      seoDescription: true,
    },
  }) as Promise<ServiceDetailData | null>;
}

export async function getRelatedServices(
  serviceId: string,
  limit = 3,
): Promise<ServiceCardData[]> {
  return prisma.service.findMany({
    where: {
      id: {
        not: serviceId,
      },
      status: ProductStatus.ACTIVE,
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: serviceCardSelect,
  }) as Promise<ServiceCardData[]>;
}

export async function getServiceSlugs(): Promise<string[]> {
  const services = await prisma.service.findMany({
    where: {
      status: ProductStatus.ACTIVE,
    },
    select: {
      slug: true,
    },
  });

  return services.map((service) => service.slug);
}

function buildAdminServiceWhere(
  filters: AdminServiceFilters,
): Prisma.ServiceWhereInput {
  return {
    name: filters.search
      ? {
          contains: filters.search,
          mode: "insensitive",
        }
      : undefined,
    status: filters.status,
  };
}

export async function getAdminServices(
  filters: AdminServiceFilters = {},
): Promise<AdminServiceListResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const where = buildAdminServiceWhere(filters);

  const services = await prisma.service.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      isFeatured: true,
      status: true,
      updatedAt: true,
    },
  });
  const total = await prisma.service.count({ where });

  return {
    services,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getAdminServiceById(
  id: string,
): Promise<AdminServiceDetail | null> {
  return prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      content: true,
      isFeatured: true,
      status: true,
      seoTitle: true,
      seoDescription: true,
    },
  });
}

function toServiceData(input: ServiceFormSchema) {
  return {
    name: input.name,
    slug: input.slug,
    shortDescription: input.shortDescription,
    content: input.content,
    isFeatured: input.isFeatured,
    status: input.status,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
  };
}

export async function createService(input: ServiceFormSchema) {
  return prisma.service.create({
    data: toServiceData(input),
  });
}

export async function updateService(id: string, input: ServiceFormSchema) {
  return prisma.service.update({
    where: { id },
    data: toServiceData(input),
  });
}

export async function deleteService(id: string) {
  return prisma.service.delete({
    where: { id },
  });
}
