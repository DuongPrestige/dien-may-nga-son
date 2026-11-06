import { ProductStatus, ProjectStatus } from "@prisma/client";
import type { MetadataRoute } from "next";

import { buildCanonicalUrl, getSiteUrl } from "@/src/lib/seo";
import { prisma } from "@/src/lib/prisma";

type SitemapEntry = MetadataRoute.Sitemap[number];

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  { path: "/products", priority: 0.9 },
  { path: "/services", priority: 0.9 },
  { path: "/blog", priority: 0.7 },
  { path: "/cong-trinh-thuc-te", priority: 0.8 },
  { path: "/hinh-anh-thuc-te", priority: 0.7 },
  { path: "/khu-vuc", priority: 0.7 },
] as const;

function createEntry(
  path: string,
  lastModified: Date,
  priority: number,
): SitemapEntry {
  return {
    url: buildCanonicalUrl(path),
    lastModified,
    changeFrequency: "weekly",
    priority,
  };
}

async function getDynamicEntries(): Promise<SitemapEntry[]> {
  const [products, services, posts, projects, serviceAreas] = await Promise.all([
    prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE },
      select: { slug: true, updatedAt: true },
    }),
    prisma.service.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.post.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
    }),
    prisma.project.findMany({
      where: { status: ProjectStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    }),
    prisma.serviceArea.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    ...products.map((product) =>
      createEntry(`/products/${product.slug}`, product.updatedAt, 0.8),
    ),
    ...services.map((service) =>
      createEntry(`/services/${service.slug}`, service.updatedAt, 0.9),
    ),
    ...posts.map((post) =>
      createEntry(
        `/blog/${post.slug}`,
        post.publishedAt ?? post.updatedAt,
        0.6,
      ),
    ),
    ...projects.map((project) =>
      createEntry(
        `/cong-trinh-thuc-te/${project.slug}`,
        project.updatedAt,
        0.7,
      ),
    ),
    ...serviceAreas.map((area) =>
      createEntry(`/khu-vuc/${area.slug}`, area.updatedAt, 0.8),
    ),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const siteUrl = getSiteUrl();
  let dynamicEntries: SitemapEntry[] = [];

  try {
    dynamicEntries = await getDynamicEntries();
  } catch {
    dynamicEntries = [];
  }

  return [
    ...staticRoutes.map((route) =>
      createEntry(route.path, now, route.priority),
    ),
    ...dynamicEntries,
  ].filter((entry) => entry.url.startsWith(siteUrl));
}
