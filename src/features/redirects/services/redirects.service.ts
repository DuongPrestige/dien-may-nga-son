import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@/src/lib/prisma";
import type { AdminRedirectListItem } from "@/src/features/redirects/types/redirects.types";
import type { RedirectFormSchema } from "@/src/features/redirects/validators/redirect.validator";

export const REDIRECTS_CACHE_TAG = "seo-redirects";
const REDIRECTS_CACHE_REVALIDATE_SECONDS = 300;

type RedirectRecord = {
  sourcePath: string;
  destinationPath: string;
};

function buildRedirectMap(redirects: RedirectRecord[]): Map<string, string> {
  return new Map(
    redirects.map((redirect) => [
      redirect.sourcePath,
      redirect.destinationPath,
    ]),
  );
}

function resolvesWithoutLoop(
  sourcePath: string,
  redirectMap: Map<string, string>,
): boolean {
  const visited = new Set<string>();
  let currentPath: string | undefined = sourcePath;

  while (currentPath) {
    if (visited.has(currentPath)) {
      return false;
    }

    visited.add(currentPath);
    currentPath = redirectMap.get(currentPath);
  }

  return true;
}

async function fetchRedirectRecords(): Promise<RedirectRecord[]> {
  return prisma.seoRedirect.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      sourcePath: true,
      destinationPath: true,
    },
  });
}

const getCachedRedirectRecords = unstable_cache(
  fetchRedirectRecords,
  ["seo-redirect-records"],
  {
    revalidate: REDIRECTS_CACHE_REVALIDATE_SECONDS,
    tags: [REDIRECTS_CACHE_TAG],
  },
);

export async function getRedirectDestination(
  sourcePath: string,
): Promise<string | null> {
  const redirects = await getCachedRedirectRecords();
  const redirectMap = buildRedirectMap(redirects);
  const visited = new Set<string>();
  let currentPath = sourcePath;
  let destinationPath = redirectMap.get(currentPath);

  while (destinationPath) {
    if (visited.has(currentPath) || destinationPath === sourcePath) {
      return null;
    }

    visited.add(currentPath);
    currentPath = destinationPath;
    destinationPath = redirectMap.get(currentPath);
  }

  return currentPath === sourcePath ? null : currentPath;
}

export async function getAdminRedirects(): Promise<AdminRedirectListItem[]> {
  return prisma.seoRedirect.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      sourcePath: true,
      destinationPath: true,
      createdAt: true,
    },
  });
}

export async function createRedirect(input: RedirectFormSchema) {
  return prisma.$transaction(async (tx) => {
    const redirects = await tx.seoRedirect.findMany({
      select: {
        sourcePath: true,
        destinationPath: true,
      },
    });
    const redirectMap = buildRedirectMap(redirects);
    redirectMap.set(input.sourcePath, input.targetPath);

    if (!resolvesWithoutLoop(input.sourcePath, redirectMap)) {
      throw new Error("REDIRECT_LOOP");
    }

    await tx.seoRedirect.deleteMany({
      where: { sourcePath: input.sourcePath },
    });

    return tx.seoRedirect.create({
      data: {
        sourcePath: input.sourcePath,
        destinationPath: input.targetPath,
        redirectType: 301,
      },
      select: {
        id: true,
      },
    });
  });
}

export async function deleteRedirect(id: string) {
  return prisma.seoRedirect.delete({
    where: { id },
    select: { id: true },
  });
}

export async function syncSlugRedirect(
  tx: Prisma.TransactionClient,
  oldPath: string,
  newPath: string,
) {
  if (oldPath === newPath) {
    return;
  }

  // A path that becomes live again must stop redirecting elsewhere.
  await tx.seoRedirect.deleteMany({
    where: { sourcePath: newPath },
  });

  // Flatten older aliases to the newest canonical path to avoid redirect chains.
  await tx.seoRedirect.updateMany({
    where: { destinationPath: oldPath },
    data: { destinationPath: newPath },
  });

  await tx.seoRedirect.deleteMany({
    where: { sourcePath: oldPath },
  });
  await tx.seoRedirect.create({
    data: {
      sourcePath: oldPath,
      destinationPath: newPath,
      redirectType: 301,
    },
    select: { id: true },
  });
}
