import type { Banner } from "@prisma/client";

import type { BannerPosition } from "@/src/features/banners/constants";

export type AdminBannerFilters = {
  position?: BannerPosition;
  page?: number;
  limit?: number;
};

export type AdminBannerListItem = Pick<
  Banner,
  | "id"
  | "title"
  | "imageUrl"
  | "targetUrl"
  | "position"
  | "sortOrder"
  | "isActive"
  | "createdAt"
>;

export type AdminBannerDetail = Pick<
  Banner,
  "id" | "title" | "imageUrl" | "targetUrl" | "position" | "sortOrder" | "isActive"
>;

export type AdminBannerListResult = {
  banners: AdminBannerListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PublicBanner = Pick<
  Banner,
  "id" | "title" | "imageUrl" | "targetUrl"
>;

export type BannerFormValues = {
  title: string;
  imageUrl: string;
  targetUrl: string;
  position: string;
  sortOrder: string;
  isActive: boolean;
};

export type BannerActionState = {
  success: boolean;
  message: string;
  values?: BannerFormValues;
  fieldErrors: {
    title?: string;
    imageUrl?: string;
    targetUrl?: string;
    position?: string;
    sortOrder?: string;
  };
};

export type BannerMutationResult = {
  success: boolean;
  message: string;
};
