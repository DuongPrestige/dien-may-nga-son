import { UserRole } from "@prisma/client";
import { z } from "zod";

import { MIN_PASSWORD_LENGTH } from "@/src/features/users/constants";

const MAX_PASSWORD_LENGTH = 72;

const emailSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập email")
  .email("Email không hợp lệ")
  .max(255, "Email tối đa 255 ký tự")
  .toLowerCase();

const fullNameSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().max(255, "Họ tên tối đa 255 ký tự").optional(),
);

const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Mật khẩu tối thiểu ${MIN_PASSWORD_LENGTH} ký tự`)
  .max(MAX_PASSWORD_LENGTH, `Mật khẩu tối đa ${MAX_PASSWORD_LENGTH} ký tự`);

const roleSchema = z.nativeEnum(UserRole, {
  message: "Vai trò không hợp lệ",
});

export const createUserSchema = z.object({
  email: emailSchema,
  fullName: fullNameSchema,
  role: roleSchema,
  isActive: z.boolean(),
  password: passwordSchema,
});

export const updateUserSchema = z.object({
  email: emailSchema,
  fullName: fullNameSchema,
  role: roleSchema,
  isActive: z.boolean(),
  password: z.preprocess(
    (value) => (value === "" ? undefined : value),
    passwordSchema.optional(),
  ),
});

export const userIdSchema = z.string().uuid("Mã người dùng không hợp lệ");

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
