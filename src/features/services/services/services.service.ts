import type { Prisma } from "@prisma/client";

import type {
  ServiceCardData,
  ServiceDetailData,
} from "@/src/features/services/types/services.types";
import { prisma } from "@/src/lib/prisma";

const serviceCardSelect = {
  id: true,
  name: true,
  slug: true,
  thumbnailUrl: true,
  shortDescription: true,
  isFeatured: true,
} satisfies Prisma.ServiceSelect;

export async function getServices(): Promise<ServiceCardData[]> {
  return prisma.service.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    select: serviceCardSelect,
  }) as Promise<ServiceCardData[]>;
}

export async function getFeaturedServices(
  limit = 6,
): Promise<ServiceCardData[]> {
  return prisma.service.findMany({
    where: {
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
  return prisma.service.findUnique({
    where: {
      slug,
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
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: serviceCardSelect,
  }) as Promise<ServiceCardData[]>;
}

export async function getServiceSlugs(): Promise<string[]> {
  const services = await prisma.service.findMany({
    select: {
      slug: true,
    },
  });

  return services.map((service) => service.slug);
}
