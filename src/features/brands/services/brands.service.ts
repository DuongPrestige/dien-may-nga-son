import { Prisma, type Prisma as PrismaTypes } from "@prisma/client";

import { prisma } from "@/src/lib/prisma";
import type {
  AdminBrandDetail,
  AdminBrandFilters,
  AdminBrandListResult,
} from "@/src/features/brands/types/brands.types";
import type { BrandFormSchema } from "@/src/features/brands/validators/brand.validator";

function buildAdminBrandWhere(
  filters: AdminBrandFilters,
): PrismaTypes.BrandWhereInput {
  return {
    name: filters.search
      ? {
          contains: filters.search,
          mode: "insensitive",
        }
      : undefined,
  };
}

export async function getAdminBrands(
  filters: AdminBrandFilters = {},
): Promise<AdminBrandListResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const where = buildAdminBrandWhere(filters);

  const [brands, total] = await Promise.all([
    prisma.brand.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        description: true,
        updatedAt: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    }),
    prisma.brand.count({ where }),
  ]);

  return {
    brands,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getAdminBrandById(
  id: string,
): Promise<AdminBrandDetail | null> {
  return prisma.brand.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      description: true,
    },
  });
}

export async function createBrand(input: BrandFormSchema) {
  return prisma.brand.create({
    data: input,
    select: {
      id: true,
    },
  });
}

export async function updateBrand(id: string, input: BrandFormSchema) {
  return prisma.brand.update({
    where: { id },
    data: input,
    select: {
      id: true,
    },
  });
}

export async function deleteBrand(id: string): Promise<boolean> {
  const productCount = await prisma.product.count({
    where: { brandId: id },
  });

  if (productCount > 0) {
    return false;
  }

  try {
    await prisma.brand.delete({
      where: { id },
      select: { id: true },
    });
    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return false;
    }

    throw error;
  }
}
