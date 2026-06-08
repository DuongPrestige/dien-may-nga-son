import type { Brand } from "@prisma/client";

export type AdminBrandFilters = {
  search?: string;
  page?: number;
  limit?: number;
};

export type AdminBrandListItem = Pick<
  Brand,
  "id" | "name" | "slug" | "logoUrl" | "description" | "updatedAt"
> & {
  _count: {
    products: number;
  };
};

export type AdminBrandDetail = Pick<
  Brand,
  "id" | "name" | "slug" | "logoUrl" | "description"
>;

export type AdminBrandListResult = {
  brands: AdminBrandListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type BrandActionState = {
  success: boolean;
  message: string;
  fieldErrors: {
    name?: string;
    slug?: string;
    logoUrl?: string;
    description?: string;
  };
};

export type DeleteBrandResult = {
  success: boolean;
  message: string;
};
