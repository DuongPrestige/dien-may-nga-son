import type {
  Brand,
  Category,
  Product,
  ProductImage,
  ProductSpec,
} from "@prisma/client";

export type ProductSort = "latest" | "price_asc" | "price_desc";

export type ProductFilters = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
  page?: number;
  limit?: number;
};

export type ProductCardData = Pick<
  Product,
  | "id"
  | "name"
  | "slug"
  | "price"
  | "salePrice"
  | "thumbnailUrl"
  | "shortDescription"
> & {
  brand: Pick<Brand, "name" | "slug">;
  category: Pick<Category, "name" | "slug">;
  specs: Pick<ProductSpec, "specName" | "specValue">[];
};

export type ProductDetailData = ProductCardData &
  Pick<Product, "description" | "seoTitle" | "seoDescription"> & {
    images: Pick<ProductImage, "imageUrl" | "sortOrder">[];
  };

export type ProductListResult = {
  products: ProductCardData[];
  categories: Pick<Category, "name" | "slug">[];
  brands: Pick<Brand, "name" | "slug">[];
};

