import type { ProductStatus, Service } from "@prisma/client";

export type ServiceCardData = Pick<
  Service,
  | "id"
  | "name"
  | "slug"
  | "thumbnailUrl"
  | "shortDescription"
  | "isFeatured"
>;

export type ServiceDetailData = Pick<
  Service,
  | "id"
  | "name"
  | "slug"
  | "thumbnailUrl"
  | "shortDescription"
  | "content"
  | "seoTitle"
  | "seoDescription"
>;

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
  | "thumbnailUrl"
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
    thumbnailUrl?: string;
    shortDescription?: string;
    content?: string;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
  };
};
