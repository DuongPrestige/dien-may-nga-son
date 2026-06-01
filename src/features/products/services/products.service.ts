import { ProductStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/src/lib/prisma";
import type {
  AdminProductDetail,
  AdminProductFilters,
  AdminProductListResult,
  AdminProductOption,
  ProductCardData,
  ProductDetailData,
  ProductFilters,
  ProductListResult,
} from "@/src/features/products/types/products.types";
import type { ProductFormSchema } from "@/src/features/products/validators/product.validator";

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

function buildAdminProductWhere(
  filters: AdminProductFilters,
): Prisma.ProductWhereInput {
  return {
    name: filters.search
      ? {
          contains: filters.search,
          mode: "insensitive",
        }
      : undefined,
    categoryId: filters.categoryId,
    brandId: filters.brandId,
    status: filters.status,
  };
}

export async function getProductAdminOptions(): Promise<{
  categories: AdminProductOption[];
  brands: AdminProductOption[];
}> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return { categories, brands };
}

export async function getAdminProducts(
  filters: AdminProductFilters = {},
): Promise<AdminProductListResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const where = buildAdminProductWhere(filters);

  const products = await prisma.product.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      price: true,
      salePrice: true,
      isFeatured: true,
      status: true,
      updatedAt: true,
      category: { select: { id: true, name: true } },
      brand: { select: { id: true, name: true } },
    },
  });
  const total = await prisma.product.count({ where });
  const options = await getProductAdminOptions();

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    categories: options.categories,
    brands: options.brands,
  };
}

export async function getAdminProductById(
  id: string,
): Promise<AdminProductDetail | null> {
  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      categoryId: true,
      brandId: true,
      name: true,
      slug: true,
      sku: true,
      price: true,
      salePrice: true,
      thumbnailUrl: true,
      shortDescription: true,
      description: true,
      isFeatured: true,
      status: true,
      seoTitle: true,
      seoDescription: true,
      specs: {
        orderBy: { sortOrder: "asc" },
        select: { specName: true, specValue: true, sortOrder: true },
      },
      images: {
        orderBy: { sortOrder: "asc" },
        select: { imageUrl: true, sortOrder: true },
      },
    },
  });
}

function parseSpecsText(specsText?: string) {
  if (!specsText) {
    return [];
  }

  return specsText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        return {
          specName: line,
          specValue: "",
          sortOrder: index,
        };
      }

      return {
        specName: line.slice(0, separatorIndex).trim(),
        specValue: line.slice(separatorIndex + 1).trim(),
        sortOrder: index,
      };
    })
    .filter((spec) => spec.specName.length > 0);
}

function parseGalleryText(galleryText?: string) {
  if (!galleryText) {
    return [];
  }

  return galleryText
    .split(/\r?\n/)
    .map((imageUrl) => imageUrl.trim())
    .filter(Boolean)
    .map((imageUrl, index) => ({
      imageUrl,
      sortOrder: index,
    }));
}

function toProductData(input: ProductFormSchema) {
  return {
    categoryId: input.categoryId,
    brandId: input.brandId,
    name: input.name,
    slug: input.slug,
    sku: input.sku,
    price: input.price,
    salePrice: input.salePrice,
    thumbnailUrl: input.thumbnailUrl,
    shortDescription: input.shortDescription,
    description: input.description,
    isFeatured: input.isFeatured,
    status: input.status,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
  };
}

export async function createProduct(input: ProductFormSchema) {
  const specs = parseSpecsText(input.specsText);
  const images = parseGalleryText(input.galleryText);

  return prisma.product.create({
    data: {
      ...toProductData(input),
      specs: specs.length > 0 ? { create: specs } : undefined,
      images: images.length > 0 ? { create: images } : undefined,
    },
  });
}

export async function updateProduct(id: string, input: ProductFormSchema) {
  const specs = parseSpecsText(input.specsText);
  const images = parseGalleryText(input.galleryText);

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id },
      data: toProductData(input),
    });

    await tx.productSpec.deleteMany({ where: { productId: id } });
    await tx.productImage.deleteMany({ where: { productId: id } });

    if (specs.length > 0) {
      await tx.productSpec.createMany({
        data: specs.map((spec) => ({
          productId: id,
          ...spec,
        })),
      });
    }

    if (images.length > 0) {
      await tx.productImage.createMany({
        data: images.map((image) => ({
          productId: id,
          ...image,
        })),
      });
    }

    return product;
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}
