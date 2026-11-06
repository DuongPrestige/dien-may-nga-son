import "server-only";

import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

export type SuperAdminSession = {
  userId: string;
};

/**
 * auth() re-validates the user against the database (see auth.ts jwt
 * callback), so the role here reflects the current stored role.
 */
export async function requireSuperAdmin(): Promise<SuperAdminSession> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  if (session.user.role !== UserRole.SUPER_ADMIN) {
    redirect("/admin");
  }

  return { userId: session.user.id };
}
