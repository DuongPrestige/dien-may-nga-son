import type { UserRole } from "@prisma/client";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type LoginActionState = {
  success: boolean;
  message: string;
  fieldErrors: {
    email?: string;
    password?: string;
  };
};
