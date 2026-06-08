import { Prisma, type Prisma as PrismaTypes } from "@prisma/client";

import { prisma } from "@/src/lib/prisma";
import type {
  AdminCategoryDetail,
  AdminCategoryFilters,
  AdminCategoryListResult,
} from "@/src/features/categories/types/categories.types";
import type { CategoryFormSchema } from "@/src/features/categories/validators/category.validator";

function buildAdminCategoryWhere(
  filters: AdminCategoryFilters,
): PrismaTypes.CategoryWhereInput {
  return {
    name: filters.search
      ? {
          contains: filters.search,
          mode: "insensitive",
        }
      : undefined,
  };
}

export async function getAdminCategories(
  filters: AdminCategoryFilters = {},
): Promise<AdminCategoryListResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const where = buildAdminCategoryWhere(filters);

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        updatedAt: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    }),
    prisma.category.count({ where }),
  ]);

  return {
    categories,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getAdminCategoryById(
  id: string,
): Promise<AdminCategoryDetail | null> {
  return prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
  });
}

export async function createCategory(input: CategoryFormSchema) {
  return prisma.category.create({
    data: input,
    select: {
      id: true,
    },
  });
}

export async function updateCategory(id: string, input: CategoryFormSchema) {
  return prisma.category.update({
    where: { id },
    data: input,
    select: {
      id: true,
    },
  });
}

export async function deleteCategory(id: string): Promise<boolean> {
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    return false;
  }

  try {
    await prisma.category.delete({
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
