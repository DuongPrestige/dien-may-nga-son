import type {
  ProductStatus,
  Service,
  ServicePriceItem,
} from "@prisma/client";

export type ServicePriceItemData = Pick<
  ServicePriceItem,
  "name" | "priceLabel" | "note"
>;

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
> & {
  priceItems: ServicePriceItemData[];
};

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
  priceItems: ServicePriceItemData[];
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
    priceTable?: string;
  };
};
