import { UserRole } from "@prisma/client";

export const MIN_PASSWORD_LENGTH = 8;

export const USER_ROLE_OPTIONS = [
  {
    value: UserRole.ADMIN,
    label: "Admin",
    description: "Quản lý nội dung, sản phẩm, leads và cài đặt.",
  },
  {
    value: UserRole.SUPER_ADMIN,
    label: "Super Admin",
    description: "Toàn quyền, bao gồm quản lý tài khoản quản trị.",
  },
] as const;

export function getUserRoleLabel(role: UserRole): string {
  return (
    USER_ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role
  );
}
