import type { ServiceArea } from "@prisma/client";

export type AdminServiceAreaListItem = Pick<
  ServiceArea,
  "id" | "name" | "slug" | "sortOrder" | "isActive"
>;

export type AdminServiceAreaDetail = Pick<
  ServiceArea,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "sortOrder"
  | "isActive"
  | "seoTitle"
  | "seoDescription"
>;

export type AdminServiceAreaListResult = {
  areas: AdminServiceAreaListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminServiceAreaFilters = {
  page?: number;
  limit?: number;
};

export type PublicServiceAreaLink = Pick<ServiceArea, "name" | "slug">;

export type PublicServiceAreaDetail = Pick<
  ServiceArea,
  "id" | "name" | "slug" | "description" | "seoTitle" | "seoDescription"
>;

export type ServiceAreaFormValues = {
  name: string;
  slug: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
};

export type ServiceAreaActionState = {
  success: boolean;
  message: string;
  fieldErrors: {
    name?: string;
    slug?: string;
    description?: string;
    sortOrder?: string;
    seoTitle?: string;
    seoDescription?: string;
  };
};

export type ServiceAreaMutationResult = {
  success: boolean;
  message: string;
};
