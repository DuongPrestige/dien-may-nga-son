import type { Testimonial } from "@prisma/client";

export type AdminTestimonialFilters = {
  page?: number;
  limit?: number;
};

export type AdminTestimonialListItem = Pick<
  Testimonial,
  | "id"
  | "customerName"
  | "area"
  | "content"
  | "imageUrl"
  | "sortOrder"
  | "isActive"
  | "createdAt"
>;

export type AdminTestimonialDetail = Pick<
  Testimonial,
  | "id"
  | "customerName"
  | "area"
  | "content"
  | "imageUrl"
  | "sortOrder"
  | "isActive"
>;

export type AdminTestimonialListResult = {
  testimonials: AdminTestimonialListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PublicTestimonial = Pick<
  Testimonial,
  "id" | "customerName" | "area" | "content" | "imageUrl"
>;

export type TestimonialFormValues = {
  customerName: string;
  area: string;
  content: string;
  imageUrl: string;
  sortOrder: string;
  isActive: boolean;
};

export type TestimonialActionState = {
  success: boolean;
  message: string;
  fieldErrors: {
    customerName?: string;
    area?: string;
    content?: string;
    imageUrl?: string;
    sortOrder?: string;
  };
};

export type TestimonialMutationResult = {
  success: boolean;
  message: string;
};
