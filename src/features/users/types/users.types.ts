import type { User } from "@prisma/client";

export type AdminUserListItem = Pick<
  User,
  "id" | "email" | "fullName" | "role" | "isActive" | "createdAt"
>;

export type AdminUserDetail = Pick<
  User,
  "id" | "email" | "fullName" | "role" | "isActive"
>;

export type UserActionState = {
  success: boolean;
  message: string;
  fieldErrors: {
    email?: string;
    fullName?: string;
    role?: string;
    password?: string;
  };
};

export type UserMutationResult =
  | { ok: true }
  | { ok: false; reason: "EMAIL_TAKEN" | "LAST_SUPER_ADMIN" | "NOT_FOUND" };
