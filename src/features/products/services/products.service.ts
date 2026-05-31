import { ProductStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/src/lib/prisma";
import type {
  ProductCardData,
  ProductDetailData,
  ProductFilters,
  ProductListResult,
} from "@/src/features/products/types/products.types";

const productCardSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  salePrice: true,
  thumbnailUrl: true,
  shortDescription: true,
  brand: {
    select: {
      name: true,
      slug: true,
    },
  },
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
  specs: {
    orderBy: {
      sortOrder: "asc",
    },
    take: 3,
    select: {
      specName: true,
      specValue: true,
    },
  },
} satisfies Prisma.ProductSelect;

function buildProductWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  return {
    status: ProductStatus.ACTIVE,
    category: filters.category
      ? {
          slug: filters.category,
        }
      : undefined,
    brand: filters.brand
      ? {
          slug: filters.brand,
        }
      : undefined,
    price:
      filters.minPrice !== undefined || filters.maxPrice !== undefined
        ? {
            gte: filters.minPrice,
            lte: filters.maxPrice,
          }
        : undefined,
  };
}

function buildProductOrderBy(
  sort: ProductFilters["sort"],
): Prisma.ProductOrderByWithRelationInput {
  if (sort === "price_asc") {
    return { price: "asc" };
  }

  if (sort === "price_desc") {
    return { price: "desc" };
  }

  return { createdAt: "desc" };
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductListResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const where = buildProductWhere(filters);

  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: buildProductOrderBy(filters.sort),
      skip: (page - 1) * limit,
      take: limit,
      select: productCardSelect,
    }),
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        name: true,
        slug: true,
      },
    }),
    prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        name: true,
        slug: true,
      },
    }),
  ]);

  return {
    products: products as ProductCardData[],
    categories,
    brands,
  };
}

export async function getFeaturedProducts(
  limit = 6,
): Promise<ProductCardData[]> {
  return prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    select: productCardSelect,
  }) as Promise<ProductCardData[]>;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetailData | null> {
  return prisma.product.findFirst({
    where: {
      slug,
      status: ProductStatus.ACTIVE,
    },
    select: {
      ...productCardSelect,
      description: true,
      seoTitle: true,
      seoDescription: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          imageUrl: true,
          sortOrder: true,
        },
      },
    },
  }) as Promise<ProductDetailData | null>;
}

export async function getRelatedProducts(
  productId: string,
  categorySlug: string,
  limit = 4,
): Promise<ProductCardData[]> {
  return prisma.product.findMany({
    where: {
      id: {
        not: productId,
      },
      status: ProductStatus.ACTIVE,
      category: {
        slug: categorySlug,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    select: productCardSelect,
  }) as Promise<ProductCardData[]>;
}

export async function getProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
    },
    select: {
      slug: true,
    },
  });

  return products.map((product) => product.slug);
}

