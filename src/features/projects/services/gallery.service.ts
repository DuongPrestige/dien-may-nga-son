import { ProjectStatus, type Project, type ProjectType } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import { getGalleryFilter } from "@/src/features/projects/lib/gallery-filters";
import { PROJECTS_CACHE_TAG } from "@/src/features/projects/services/projects.service";
import { prisma } from "@/src/lib/prisma";

const GALLERY_REVALIDATE_SECONDS = 3600;

export const GALLERY_PAGE_SIZE = 24;
/** "Xem thêm" loads cumulatively; cap it to keep each request bounded. */
export const GALLERY_MAX_PAGE = 10;

export type GalleryItem = Pick<
  Project,
  "id" | "title" | "slug" | "location"
> & {
  thumbnailUrl: string;
};

export type GalleryResult = {
  items: GalleryItem[];
  total: number;
  page: number;
  hasMore: boolean;
};

function normalizeGalleryPage(page: number | undefined): number {
  if (!page || !Number.isInteger(page) || page < 1) {
    return 1;
  }

  return Math.min(page, GALLERY_MAX_PAGE);
}

const getCachedGalleryProjects = unstable_cache(
  async (
    projectTypes: ProjectType[],
    page: number,
  ): Promise<GalleryResult> => {
    const where = {
      status: ProjectStatus.PUBLISHED,
      thumbnailUrl: { not: null },
      NOT: { thumbnailUrl: "" },
      ...(projectTypes.length > 0 ? { projectType: { in: projectTypes } } : {}),
    };

    const [rows, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: [{ performedAt: "desc" }, { createdAt: "desc" }],
        take: page * GALLERY_PAGE_SIZE,
        select: {
          id: true,
          title: true,
          slug: true,
          location: true,
          thumbnailUrl: true,
        },
      }),
      prisma.project.count({ where }),
    ]);

    const items = rows.flatMap((row) =>
      row.thumbnailUrl ? [{ ...row, thumbnailUrl: row.thumbnailUrl }] : [],
    );

    return {
      items,
      total,
      page,
      hasMore: total > page * GALLERY_PAGE_SIZE && page < GALLERY_MAX_PAGE,
    };
  },
  ["project-gallery"],
  {
    revalidate: GALLERY_REVALIDATE_SECONDS,
    tags: [PROJECTS_CACHE_TAG],
  },
);

/**
 * Published projects with a thumbnail, newest first. Page N returns the first
 * N * GALLERY_PAGE_SIZE items so "Xem thêm" can extend the grid without JS.
 */
export const getGalleryProjects = cache(
  async (
    filter: string | undefined,
    page: number | undefined,
  ): Promise<GalleryResult> => {
    const projectTypes = [...(getGalleryFilter(filter)?.projectTypes ?? [])];

    return getCachedGalleryProjects(projectTypes, normalizeGalleryPage(page));
  },
);
