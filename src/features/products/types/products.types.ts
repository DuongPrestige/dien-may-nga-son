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

export type AdminProductFilters = {
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: Product["status"];
  page?: number;
  limit?: number;
};

export type AdminProductListItem = Pick<
  Product,
  | "id"
  | "name"
  | "slug"
  | "sku"
  | "price"
  | "salePrice"
  | "isFeatured"
  | "status"
  | "updatedAt"
> & {
  category: Pick<Category, "id" | "name">;
  brand: Pick<Brand, "id" | "name">;
};

export type AdminProductDetail = Pick<
  Product,
  | "id"
  | "categoryId"
  | "brandId"
  | "name"
  | "slug"
  | "sku"
  | "price"
  | "salePrice"
  | "thumbnailUrl"
  | "shortDescription"
  | "description"
  | "isFeatured"
  | "status"
  | "seoTitle"
  | "seoDescription"
> & {
  specs: Pick<ProductSpec, "specName" | "specValue" | "sortOrder">[];
  images: Pick<ProductImage, "imageUrl" | "sortOrder">[];
};

export type AdminProductOption = {
  id: string;
  name: string;
};

export type AdminProductListResult = {
  products: AdminProductListItem[];
  categories: AdminProductOption[];
  brands: AdminProductOption[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductActionState = {
  success: boolean;
  message: string;
  fieldErrors: {
    name?: string;
    slug?: string;
    categoryId?: string;
    brandId?: string;
    sku?: string;
    price?: string;
    salePrice?: string;
    thumbnailUrl?: string;
    shortDescription?: string;
    description?: string;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
    specsText?: string;
    galleryText?: string;
  };
};
