import type { Service } from "@prisma/client";

export type ServiceCardData = Pick<
  Service,
  | "id"
  | "name"
  | "slug"
  | "thumbnailUrl"
  | "shortDescription"
  | "isFeatured"
>;

export type ServiceDetailData = ServiceCardData &
  Pick<Service, "content" | "seoTitle" | "seoDescription">;
