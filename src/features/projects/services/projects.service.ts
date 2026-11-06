import { cache } from "react";

import { unstable_cache } from "next/cache";

import { prisma } from "@/src/lib/prisma";
import { sanitizeBlogContent } from "@/src/features/blog/lib/blog-content";
import { syncSlugRedirect } from "@/src/features/redirects/services/redirects.service";
import {
  pickAvailableSlug,
  toProjectSlug,
} from "@/src/features/projects/lib/project-slug";
import type { ProjectFormSchema } from "@/src/features/projects/validators/project.validator";
import type {
  AdminProjectDetail,
  AdminProjectFilters,
  AdminProjectListResult,
  ProjectCardData,
  ProjectDetailData,
  ProjectFilters,
  ProjectListResult,
} from "@/src/features/projects/types/projects.types";

export const PROJECTS_CACHE_TAG = "projects";
export const PROJECT_DETAIL_CACHE_TAG = "project-detail";

const PROJECTS_REVALIDATE_SECONDS = 3600;
const PUBLIC_PAGE_SIZE = 6;
const ADMIN_PAGE_SIZE = 10;

const projectCardSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  projectType: true,
  location: true,
  customerArea: true,
  performedAt: true,
  thumbnailUrl: true,
} as const;

const projectDetailSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  projectType: true,
  location: true,
  customerArea: true,
  performedAt: true,
  thumbnailUrl: true,
  facebookUrl: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
} as const;

function normalizePage(page: number | undefined) {
  return Number.isInteger(page) && page && page > 0 ? page : 1;
}

function projectData(data: ProjectFormSchema) {
  return {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: sanitizeBlogContent(data.content),
    status: data.status,
    projectType: data.projectType,
    location: data.location,
    customerArea: data.customerArea || null,
    performedAt: data.performedAt,
    thumbnailUrl: data.thumbnailUrl || null,
    facebookUrl: data.facebookUrl || null,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
  };
}

const getCachedPublishedProjects = unstable_cache(
  async (
    search: string,
    projectType: ProjectFilters["projectType"],
    page: number,
  ): Promise<ProjectListResult> => {
    const where = {
      status: "PUBLISHED" as const,
      ...(projectType ? { projectType } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { location: { contains: search, mode: "insensitive" as const } },
              {
                customerArea: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.project.findMany({
        where,
        select: projectCardSelect,
        orderBy: [{ performedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * PUBLIC_PAGE_SIZE,
        take: PUBLIC_PAGE_SIZE,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      items: items as ProjectCardData[],
      total,
      page,
      pageSize: PUBLIC_PAGE_SIZE,
      totalPages: Math.max(1, Math.ceil(total / PUBLIC_PAGE_SIZE)),
    };
  },
  ["published-projects"],
  {
    revalidate: PROJECTS_REVALIDATE_SECONDS,
    tags: [PROJECTS_CACHE_TAG],
  },
);

export const getPublishedProjects = cache(
  async (filters: ProjectFilters = {}): Promise<ProjectListResult> => {
    return getCachedPublishedProjects(
      filters.search?.trim() ?? "",
      filters.projectType,
      normalizePage(filters.page),
    );
  },
);

const getCachedProjectBySlug = unstable_cache(
  async (slug: string): Promise<ProjectDetailData | null> => {
    return prisma.project.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: projectDetailSelect,
    });
  },
  ["project-by-slug"],
  {
    revalidate: PROJECTS_REVALIDATE_SECONDS,
    tags: [PROJECT_DETAIL_CACHE_TAG],
  },
);

export const getProjectBySlug = cache(getCachedProjectBySlug);

const getCachedRelatedProjects = unstable_cache(
  async (
    id: string,
    projectType: ProjectCardData["projectType"],
    limit: number,
  ): Promise<ProjectCardData[]> => {
    return prisma.project.findMany({
      where: {
        id: { not: id },
        status: "PUBLISHED",
        projectType,
      },
      select: projectCardSelect,
      orderBy: [{ performedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
  },
  ["related-projects"],
  {
    revalidate: PROJECTS_REVALIDATE_SECONDS,
    tags: [PROJECTS_CACHE_TAG],
  },
);

export const getRelatedProjects = cache(
  async (
    id: string,
    projectType: ProjectCardData["projectType"],
    limit = 3,
  ) => getCachedRelatedProjects(id, projectType, limit),
);

const getCachedProjectSlugs = unstable_cache(
  async () =>
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
  ["project-slugs"],
  {
    revalidate: PROJECTS_REVALIDATE_SECONDS,
    tags: [PROJECTS_CACHE_TAG],
  },
);

export const getProjectSlugs = cache(getCachedProjectSlugs);

export async function getAdminProjects(
  filters: AdminProjectFilters = {},
): Promise<AdminProjectListResult> {
  const page = normalizePage(filters.page);
  const search = filters.search?.trim() ?? "";
  const where = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.projectType ? { projectType: filters.projectType } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
            { location: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        projectType: true,
        location: true,
        performedAt: true,
        thumbnailUrl: true,
        updatedAt: true,
      },
      orderBy: [{ updatedAt: "desc" }],
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
    }),
    prisma.project.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize: ADMIN_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
}

export async function getAdminProjectById(
  id: string,
): Promise<AdminProjectDetail | null> {
  return prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      status: true,
      projectType: true,
      location: true,
      customerArea: true,
      performedAt: true,
      thumbnailUrl: true,
      facebookUrl: true,
      seoTitle: true,
      seoDescription: true,
    },
  });
}

/** Returns a slug derived from `text` that no existing project uses yet. */
export async function generateUniqueProjectSlug(text: string): Promise<string> {
  const base = toProjectSlug(text);
  const existing = await prisma.project.findMany({
    where: { slug: { startsWith: base } },
    select: { slug: true },
  });

  return pickAvailableSlug(base, new Set(existing.map((item) => item.slug)));
}

export async function createProject(data: ProjectFormSchema) {
  return prisma.project.create({
    data: projectData(data),
    select: { id: true, slug: true },
  });
}

export async function updateProject(id: string, data: ProjectFormSchema) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.project.findUniqueOrThrow({
      where: { id },
      select: { slug: true },
    });
    const project = await tx.project.update({
      where: { id },
      data: projectData(data),
      select: { id: true, slug: true },
    });

    if (current.slug !== project.slug) {
      await syncSlugRedirect(
        tx,
        `/cong-trinh-thuc-te/${current.slug}`,
        `/cong-trinh-thuc-te/${project.slug}`,
      );
    }

    return { ...project, previousSlug: current.slug };
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({
    where: { id },
    select: { id: true, slug: true },
  });
}
