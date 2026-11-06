import { unstable_cache } from "next/cache";
import { cache } from "react";

import {
  BANNERS_CACHE_TAG,
  MAX_BANNERS_PER_POSITION,
  type BannerPosition,
} from "@/src/features/banners/constants";
import type {
  AdminBannerDetail,
  AdminBannerFilters,
  AdminBannerListResult,
  PublicBanner,
} from "@/src/features/banners/types/banners.types";
import type { BannerFormSchema } from "@/src/features/banners/validators/banner.validator";
import { prisma } from "@/src/lib/prisma";

const BANNERS_REVALIDATE_SECONDS = 3600;

function toBannerData(input: BannerFormSchema) {
  return {
    title: input.title,
    imageUrl: input.imageUrl,
    targetUrl: input.targetUrl ?? null,
    position: input.position,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
  };
}

export async function getAdminBanners(
  filters: AdminBannerFilters = {},
): Promise<AdminBannerListResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const where = filters.position ? { position: filters.position } : {};

  const [banners, total] = await Promise.all([
    prisma.banner.findMany({
      where,
      orderBy: [{ position: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        imageUrl: true,
        targetUrl: true,
        position: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.banner.count({ where }),
  ]);

  return {
    banners,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getAdminBannerById(
  id: string,
): Promise<AdminBannerDetail | null> {
  return prisma.banner.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      targetUrl: true,
      position: true,
      sortOrder: true,
      isActive: true,
    },
  });
}

export async function createBanner(input: BannerFormSchema) {
  return prisma.banner.create({
    data: toBannerData(input),
    select: { id: true },
  });
}

export async function updateBanner(id: string, input: BannerFormSchema) {
  return prisma.banner.update({
    where: { id },
    data: toBannerData(input),
    select: { id: true },
  });
}

export async function setBannerActive(id: string, isActive: boolean) {
  return prisma.banner.update({
    where: { id },
    data: { isActive },
    select: { id: true },
  });
}

export async function deleteBanner(id: string) {
  return prisma.banner.delete({
    where: { id },
    select: { id: true },
  });
}

const getCachedActiveBanners = unstable_cache(
  async (position: BannerPosition): Promise<PublicBanner[]> => {
    return prisma.banner.findMany({
      where: { position, isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: MAX_BANNERS_PER_POSITION,
      select: {
        id: true,
        title: true,
        imageUrl: true,
        targetUrl: true,
      },
    });
  },
  ["active-banners"],
  {
    revalidate: BANNERS_REVALIDATE_SECONDS,
    tags: [BANNERS_CACHE_TAG],
  },
);

export const getActiveBanners = cache(getCachedActiveBanners);
