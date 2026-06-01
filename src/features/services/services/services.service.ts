import { ProductStatus, type Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import type {
  ServiceCardData,
  ServiceDetailData,
  AdminServiceDetail,
  AdminServiceFilters,
  AdminServiceListResult,
} from "@/src/features/services/types/services.types";
import type { ServiceFormSchema } from "@/src/features/services/validators/service.validator";
import { prisma } from "@/src/lib/prisma";

export const SERVICES_CACHE_TAG = "services";
export const SERVICE_DETAIL_CACHE_TAG = "service-detail";
const SERVICES_CACHE_REVALIDATE_SECONDS = 3600;

function logServicesTiming(
  label: string,
  startedAt: number,
  details?: Record<string, number | string | boolean | undefined>,
) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const detailsText = details ? ` ${JSON.stringify(details)}` : "";

  console.log(
    `[perf:/services] ${label}: ${Date.now() - startedAt}ms${detailsText}`,
  );
}

const serviceCardSelect = {
  id: true,
  name: true,
  slug: true,
  thumbnailUrl: true,
  shortDescription: true,
  isFeatured: true,
} satisfies Prisma.ServiceSelect;

const serviceDetailSelect = {
  id: true,
  name: true,
  slug: true,
  thumbnailUrl: true,
  shortDescription: true,
  content: true,
  seoTitle: true,
  seoDescription: true,
} satisfies Prisma.ServiceSelect;

async function fetchServices(): Promise<ServiceCardData[]> {
  const startedAt = Date.now();
  const services = await prisma.service.findMany({
    where: {
      status: ProductStatus.ACTIVE,
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    select: serviceCardSelect,
  });

  logServicesTiming("getServices db query", startedAt, {
    rows: services.length,
  });

  return services;
}

const getCachedServices = unstable_cache(fetchServices, ["public-services"], {
  revalidate: SERVICES_CACHE_REVALIDATE_SECONDS,
  tags: [SERVICES_CACHE_TAG],
});

export const getServices = cache(async (): Promise<ServiceCardData[]> => {
  const startedAt = Date.now();
  const services = await getCachedServices();

  logServicesTiming("getServices", startedAt, {
    rows: services.length,
  });

  return services;
});

async function fetchFeaturedServices(
  limit = 6,
): Promise<ServiceCardData[]> {
  const startedAt = Date.now();
  const services = await prisma.service.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    select: serviceCardSelect,
  });

  logServicesTiming("getFeaturedServices db query", startedAt, {
    rows: services.length,
    limit,
  });

  return services;
}

const getCachedFeaturedServices = unstable_cache(
  fetchFeaturedServices,
  ["featured-services"],
  {
    revalidate: SERVICES_CACHE_REVALIDATE_SECONDS,
    tags: [SERVICES_CACHE_TAG],
  },
);

export const getFeaturedServices = cache(
  async (limit = 6): Promise<ServiceCardData[]> => {
    const startedAt = Date.now();
    const services = await getCachedFeaturedServices(limit);

    logServicesTiming("getFeaturedServices", startedAt, {
      rows: services.length,
      limit,
    });

    return services;
  },
);

async function fetchServiceBySlug(
  slug: string,
): Promise<ServiceDetailData | null> {
  const startedAt = Date.now();
  const service = await prisma.service.findFirst({
    where: {
      slug,
      status: ProductStatus.ACTIVE,
    },
    select: serviceDetailSelect,
  });

  logServicesTiming("getServiceBySlug db query", startedAt, {
    found: Boolean(service),
    slug,
  });

  return service;
}

const getCachedServiceBySlug = unstable_cache(
  fetchServiceBySlug,
  ["service-by-slug"],
  {
    revalidate: SERVICES_CACHE_REVALIDATE_SECONDS,
    tags: [SERVICES_CACHE_TAG, SERVICE_DETAIL_CACHE_TAG],
  },
);

export const getServiceBySlug = cache(
  async (slug: string): Promise<ServiceDetailData | null> => {
    const startedAt = Date.now();
    const service = await getCachedServiceBySlug(slug);

    logServicesTiming("getServiceBySlug", startedAt, {
      found: Boolean(service),
      slug,
    });

    return service;
  },
);

async function fetchRelatedServices(
  serviceId: string,
  limit = 3,
): Promise<ServiceCardData[]> {
  const startedAt = Date.now();
  const services = await prisma.service.findMany({
    where: {
      id: {
        not: serviceId,
      },
      status: ProductStatus.ACTIVE,
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: serviceCardSelect,
  });

  logServicesTiming("getRelatedServices db query", startedAt, {
    rows: services.length,
    limit,
  });

  return services;
}

const getCachedRelatedServices = unstable_cache(
  fetchRelatedServices,
  ["related-services"],
  {
    revalidate: SERVICES_CACHE_REVALIDATE_SECONDS,
    tags: [SERVICES_CACHE_TAG],
  },
);

export const getRelatedServices = cache(
  async (serviceId: string, limit = 3): Promise<ServiceCardData[]> => {
    const startedAt = Date.now();
    const services = await getCachedRelatedServices(serviceId, limit);

    logServicesTiming("getRelatedServices", startedAt, {
      rows: services.length,
      limit,
    });

    return services;
  },
);

async function fetchServiceSlugs(): Promise<string[]> {
  const startedAt = Date.now();
  const services = await prisma.service.findMany({
    where: {
      status: ProductStatus.ACTIVE,
    },
    select: {
      slug: true,
    },
  });

  const slugs = services.map((service) => service.slug);

  logServicesTiming("getServiceSlugs db query", startedAt, {
    rows: slugs.length,
  });

  return slugs;
}

const getCachedServiceSlugs = unstable_cache(
  fetchServiceSlugs,
  ["service-slugs"],
  {
    revalidate: SERVICES_CACHE_REVALIDATE_SECONDS,
    tags: [SERVICES_CACHE_TAG],
  },
);

export const getServiceSlugs = cache(async (): Promise<string[]> => {
  const startedAt = Date.now();
  const slugs = await getCachedServiceSlugs();

  logServicesTiming("getServiceSlugs", startedAt, {
    rows: slugs.length,
  });

  return slugs;
});

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
