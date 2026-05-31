import { LeadSourceType, LeadStatus } from "@prisma/client";
import { z } from "zod";

const vietnamesePhoneRegex = /^(?:0|\+84)(?:3|5|7|8|9)\d{8}$/;

const optionalUuidSchema = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.string().uuid("Mã liên kết không hợp lệ").optional(),
);

export const leadSourceTypeSchema = z.enum([
  LeadSourceType.PRODUCT,
  LeadSourceType.SERVICE,
  LeadSourceType.BLOG,
  LeadSourceType.CONTACT,
  LeadSourceType.PROMOTION,
  LeadSourceType.HOME,
]);

export const leadStatusSchema = z.enum([
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.CONVERTED,
  LeadStatus.CLOSED,
]);

export const createLeadSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên"),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s.-]/g, ""))
    .refine(
      (value) => vietnamesePhoneRegex.test(value),
      "Vui lòng nhập số điện thoại Việt Nam hợp lệ",
    ),
  message: z
    .preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.string().trim().max(1000, "Nội dung quá dài").optional(),
    )
    .optional(),
  sourceType: leadSourceTypeSchema,
  sourceUrl: z
    .preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.string().trim().max(500, "Đường dẫn nguồn quá dài").optional(),
    )
    .optional(),
  productId: optionalUuidSchema,
  serviceId: optionalUuidSchema,
});

export const getLeadsSchema = z.object({
  status: leadStatusSchema.optional(),
  sourceType: leadSourceTypeSchema.optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const updateLeadStatusSchema = z.object({
  id: z.string().uuid("Mã khách hàng tiềm năng không hợp lệ"),
  status: leadStatusSchema,
});

export type CreateLeadSchema = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusSchema = z.infer<typeof updateLeadStatusSchema>;

