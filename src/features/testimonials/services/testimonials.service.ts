import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

import {
  DEFAULT_PUBLIC_TESTIMONIALS_LIMIT,
  MAX_PUBLIC_TESTIMONIALS_LIMIT,
  TESTIMONIALS_CACHE_TAG,
} from "@/src/features/testimonials/constants";
import type {
  AdminTestimonialDetail,
  AdminTestimonialFilters,
  AdminTestimonialListResult,
  PublicTestimonial,
} from "@/src/features/testimonials/types/testimonials.types";
import type { TestimonialFormSchema } from "@/src/features/testimonials/validators/testimonial.validator";
import { prisma } from "@/src/lib/prisma";

const TESTIMONIALS_REVALIDATE_SECONDS = 3600;

function toTestimonialData(input: TestimonialFormSchema) {
  return {
    customerName: input.customerName,
    area: input.area ?? null,
    content: input.content,
    imageUrl: input.imageUrl ?? null,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
  };
}

function normalizePublicLimit(limit: number): number {
  if (!Number.isInteger(limit) || limit < 1) {
    return DEFAULT_PUBLIC_TESTIMONIALS_LIMIT;
  }

  return Math.min(limit, MAX_PUBLIC_TESTIMONIALS_LIMIT);
}

export async function getAdminTestimonials(
  filters: AdminTestimonialFilters = {},
): Promise<AdminTestimonialListResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;

  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        customerName: true,
        area: true,
        content: true,
        imageUrl: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.testimonial.count(),
  ]);

  return {
    testimonials,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getAdminTestimonialById(
  id: string,
): Promise<AdminTestimonialDetail | null> {
  return prisma.testimonial.findUnique({
    where: { id },
    select: {
      id: true,
      customerName: true,
      area: true,
      content: true,
      imageUrl: true,
      sortOrder: true,
      isActive: true,
    },
  });
}

export async function createTestimonial(input: TestimonialFormSchema) {
  return prisma.testimonial.create({
    data: toTestimonialData(input),
    select: { id: true },
  });
}

export async function updateTestimonial(
  id: string,
  input: TestimonialFormSchema,
) {
  return prisma.testimonial.update({
    where: { id },
    data: toTestimonialData(input),
    select: { id: true },
  });
}

export async function setTestimonialActive(id: string, isActive: boolean) {
  return prisma.testimonial.update({
    where: { id },
    data: { isActive },
    select: { id: true },
  });
}

export async function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({
    where: { id },
    select: { id: true },
  });
}

const getCachedActiveTestimonials = unstable_cache(
  async (limit: number): Promise<PublicTestimonial[]> => {
    return prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        id: true,
        customerName: true,
        area: true,
        content: true,
        imageUrl: true,
      },
    });
  },
  ["active-testimonials"],
  {
    revalidate: TESTIMONIALS_REVALIDATE_SECONDS,
    tags: [TESTIMONIALS_CACHE_TAG],
  },
);

export const getActiveTestimonials = cache(
  async (
    limit: number = DEFAULT_PUBLIC_TESTIMONIALS_LIMIT,
  ): Promise<PublicTestimonial[]> =>
    getCachedActiveTestimonials(normalizePublicLimit(limit)),
);
