import { Prisma, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

import type {
  AdminUserDetail,
  AdminUserListItem,
  UserMutationResult,
} from "@/src/features/users/types/users.types";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "@/src/features/users/validators/user.validator";
import { prisma } from "@/src/lib/prisma";

const PASSWORD_HASH_ROUNDS = 12;

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function getAdminUsers(): Promise<AdminUserListItem[]> {
  return prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function getAdminUserById(
  id: string,
): Promise<AdminUserDetail | null> {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
    },
  });
}

export async function createUser(
  input: CreateUserInput,
): Promise<UserMutationResult> {
  const passwordHash = await hash(input.password, PASSWORD_HASH_ROUNDS);

  try {
    await prisma.user.create({
      data: {
        email: input.email,
        fullName: input.fullName ?? null,
        role: input.role,
        isActive: input.isActive,
        passwordHash,
      },
      select: { id: true },
    });
    return { ok: true };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, reason: "EMAIL_TAKEN" };
    }

    throw error;
  }
}

/**
 * Updates a user while guaranteeing at least one active SUPER_ADMIN remains.
 * Runs in a serializable transaction so two concurrent demotions cannot both
 * pass the check.
 */
export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<UserMutationResult> {
  const passwordHash = input.password
    ? await hash(input.password, PASSWORD_HASH_ROUNDS)
    : undefined;

  try {
    return await prisma.$transaction(
      async (tx) => {
        const existing = await tx.user.findUnique({
          where: { id },
          select: { role: true, isActive: true },
        });

        if (!existing) {
          return { ok: false, reason: "NOT_FOUND" } as const;
        }

        const isActiveSuperAdmin =
          existing.role === UserRole.SUPER_ADMIN && existing.isActive;
        const remainsActiveSuperAdmin =
          input.role === UserRole.SUPER_ADMIN && input.isActive;

        if (isActiveSuperAdmin && !remainsActiveSuperAdmin) {
          const otherActiveSuperAdmins = await tx.user.count({
            where: {
              id: { not: id },
              role: UserRole.SUPER_ADMIN,
              isActive: true,
            },
          });

          if (otherActiveSuperAdmins === 0) {
            return { ok: false, reason: "LAST_SUPER_ADMIN" } as const;
          }
        }

        await tx.user.update({
          where: { id },
          data: {
            email: input.email,
            fullName: input.fullName ?? null,
            role: input.role,
            isActive: input.isActive,
            ...(passwordHash ? { passwordHash } : {}),
          },
          select: { id: true },
        });

        return { ok: true } as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, reason: "EMAIL_TAKEN" };
    }

    throw error;
  }
}
