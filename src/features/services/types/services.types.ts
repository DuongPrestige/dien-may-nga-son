import type { ProductStatus, Service } from "@prisma/client";

export type ServiceCardData = Pick<
  Service,
  | "id"
  | "name"
  | "slug"
  | "thumbnailUrl"
  | "shortDescription"
  | "isFeatured"
> & {
  status: ProductStatus;
};

export type ServiceDetailData = ServiceCardData &
  Pick<Service, "content" | "seoTitle" | "seoDescription">;

export type AdminServiceFilters = {
  search?: string;
  status?: ProductStatus;
  page?: number;
  limit?: number;
};

export type AdminServiceListItem = Pick<
  Service,
  | "id"
  | "name"
  | "slug"
  | "shortDescription"
  | "isFeatured"
  | "updatedAt"
> & {
  status: ProductStatus;
};

export type AdminServiceDetail = Pick<
  Service,
  | "id"
  | "name"
  | "slug"
  | "shortDescription"
  | "content"
  | "isFeatured"
  | "seoTitle"
  | "seoDescription"
> & {
  status: ProductStatus;
};

export type AdminServiceListResult = {
  services: AdminServiceListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ServiceActionState = {
  success: boolean;
  message: string;
  fieldErrors: {
    name?: string;
    slug?: string;
    shortDescription?: string;
    content?: string;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
  };
};
