import type { Category } from "@prisma/client";

export type AdminCategoryFilters = {
  search?: string;
  page?: number;
  limit?: number;
};

export type AdminCategoryListItem = Pick<
  Category,
  "id" | "name" | "slug" | "description" | "updatedAt"
> & {
  _count: {
    products: number;
  };
};

export type AdminCategoryDetail = Pick<
  Category,
  "id" | "name" | "slug" | "description"
>;

export type AdminCategoryListResult = {
  categories: AdminCategoryListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CategoryActionState = {
  success: boolean;
  message: string;
  fieldErrors: {
    name?: string;
    slug?: string;
    description?: string;
  };
};

export type DeleteCategoryResult = {
  success: boolean;
  message: string;
};
