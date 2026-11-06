import { ProjectStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import { PROJECTS_CACHE_TAG } from "@/src/features/projects/services/projects.service";
import type { ProjectCardData } from "@/src/features/projects/types/projects.types";
import {
  SERVICE_AREA_PROJECT_LIMIT,
  SERVICE_AREAS_CACHE_TAG,
} from "@/src/features/service-areas/constants";
import type {
  AdminServiceAreaDetail,
  AdminServiceAreaFilters,
  AdminServiceAreaListResult,
  PublicServiceAreaDetail,
  PublicServiceAreaLink,
} from "@/src/features/service-areas/types/service-areas.types";
import type { ServiceAreaFormSchema } from "@/src/features/service-areas/validators/service-area.validator";
import { prisma } from "@/src/lib/prisma";

const SERVICE_AREAS_REVALIDATE_SECONDS = 3600;
const ADMIN_PAGE_SIZE = 20;

function toServiceAreaData(input: ServiceAreaFormSchema) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
  };
}

export async function getAdminServiceAreas(
  filters: AdminServiceAreaFilters = {},
): Promise<AdminServiceAreaListResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? ADMIN_PAGE_SIZE;

  const [areas, total] = await Promise.all([
    prisma.serviceArea.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        sortOrder: true,
        isActive: true,
      },
    }),
    prisma.serviceArea.count(),
  ]);

  return {
    areas,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getAdminServiceAreaById(
  id: string,
): Promise<AdminServiceAreaDetail | null> {
  return prisma.serviceArea.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      sortOrder: true,
      isActive: true,
      seoTitle: true,
      seoDescription: true,
    },
  });
}

export async function createServiceArea(input: ServiceAreaFormSchema) {
  return prisma.serviceArea.create({
    data: toServiceAreaData(input),
    select: { id: true, slug: true },
  });
}

export async function updateServiceArea(
  id: string,
  input: ServiceAreaFormSchema,
) {
  return prisma.serviceArea.update({
    where: { id },
    data: toServiceAreaData(input),
    select: { id: true, slug: true },
  });
}

export async function setServiceAreaActive(id: string, isActive: boolean) {
  return prisma.serviceArea.update({
    where: { id },
    data: { isActive },
    select: { id: true, slug: true },
  });
}

export async function deleteServiceArea(id: string) {
  return prisma.serviceArea.delete({
    where: { id },
    select: { id: true, slug: true },
  });
}

const getCachedActiveServiceAreas = unstable_cache(
  async (): Promise<PublicServiceAreaLink[]> => {
    return prisma.serviceArea.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { name: true, slug: true },
    });
  },
  ["active-service-areas"],
  {
    revalidate: SERVICE_AREAS_REVALIDATE_SECONDS,
    tags: [SERVICE_AREAS_CACHE_TAG],
  },
);

/** Active areas for navigation/footer links, ordered sortOrder asc, name asc. */
export const getActiveServiceAreas = cache(
  async (): Promise<PublicServiceAreaLink[]> => getCachedActiveServiceAreas(),
);

const getCachedServiceAreaBySlug = unstable_cache(
  async (slug: string): Promise<PublicServiceAreaDetail | null> => {
    return prisma.serviceArea.findFirst({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        seoTitle: true,
        seoDescription: true,
      },
    });
  },
  ["service-area-by-slug"],
  {
    revalidate: SERVICE_AREAS_REVALIDATE_SECONDS,
    tags: [SERVICE_AREAS_CACHE_TAG],
  },
);

/** Returns the active area for a slug, or null when unknown/inactive. */
export const getServiceAreaBySlug = cache(
  async (slug: string): Promise<PublicServiceAreaDetail | null> =>
    getCachedServiceAreaBySlug(slug),
);

const getCachedServiceAreaProjects = unstable_cache(
  async (areaName: string, limit: number): Promise<ProjectCardData[]> => {
    return prisma.project.findMany({
      where: {
        status: ProjectStatus.PUBLISHED,
        OR: [
          { location: { contains: areaName, mode: "insensitive" } },
          { customerArea: { contains: areaName, mode: "insensitive" } },
        ],
      },
      orderBy: [{ performedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        projectType: true,
        location: true,
        customerArea: true,
        performedAt: true,
        thumbnailUrl: true,
      },
    });
  },
  ["service-area-projects"],
  {
    revalidate: SERVICE_AREAS_REVALIDATE_SECONDS,
    tags: [SERVICE_AREAS_CACHE_TAG, PROJECTS_CACHE_TAG],
  },
);

/** Published projects whose location or customer area mentions the area. */
export const getServiceAreaProjects = cache(
  async (
    areaName: string,
    limit: number = SERVICE_AREA_PROJECT_LIMIT,
  ): Promise<ProjectCardData[]> =>
    getCachedServiceAreaProjects(areaName, limit),
);
