import { compare } from "bcryptjs";

import type { AuthUser } from "@/src/features/auth/types/auth.types";
import { prisma } from "@/src/lib/prisma";

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      role: true,
      fullName: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  const isValidPassword = await compare(password, user.passwordHash);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.fullName ?? user.email,
    role: user.role,
  };
}
