import { LeadSourceType } from "@prisma/client";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/src/components/shared/container";
import { Section } from "@/src/components/shared/section";
import { prepareBlogContent } from "@/src/features/blog/lib/blog-content";
import { LeadForm } from "@/src/features/leads/components/lead-form";
import { ProjectCard } from "@/src/features/projects/components/project-card";
import { getProjectTypeLabel } from "@/src/features/projects/constants";
import {
  formatProjectDate,
  getProjectDateIso,
} from "@/src/features/projects/lib/project-date";
import {
  getProjectBySlug,
  getProjectSlugs,
  getRelatedProjects,
} from "@/src/features/projects/services/projects.service";
import { getStoreContactLinks } from "@/src/features/settings/services/settings.service";
import {
  buildCanonicalUrl,
  buildMetadata,
  SITE_NAME,
  SITE_URL,
} from "@/src/lib/seo";
import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";

export const revalidate = 3600;

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const projects = await getProjectSlugs();
    return projects.map((project) => ({ slug: project.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: `Công trình thực tế | ${SITE_NAME}` };
  }

  const imageSrc = getSafeImageSrc(project.thumbnailUrl);
  return buildMetadata({
    title: project.seoTitle ?? `${project.title} | ${SITE_NAME}`,
    description:
      project.seoDescription ??
      project.excerpt ??
      `Công trình thực tế do ${SITE_NAME} thực hiện tại ${project.location}.`,
    path: `/cong-trinh-thuc-te/${project.slug}`,
    type: "article",
    publishedTime: getProjectDateIso(project.performedAt),
    images: imageSrc ? [imageSrc] : undefined,
  });
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const [project, contactLinks] = await Promise.all([
    getProjectBySlug(slug),
    getStoreContactLinks(),
  ]);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(
    project.id,
    project.projectType,
  );
  const imageSrc = getSafeImageSrc(project.thumbnailUrl);
  const { html: contentHtml, headings } = prepareBlogContent(project.content);
  const canonicalUrl = buildCanonicalUrl(
    `/cong-trinh-thuc-te/${project.slug}`,
  );
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description:
      project.excerpt ?? project.seoDescription ?? project.title,
    image: imageSrc ? [imageSrc] : undefined,
    datePublished: getProjectDateIso(project.performedAt),
    dateModified: getProjectDateIso(project.updatedAt),
    mainEntityOfPage: canonicalUrl,
    author: { "@id": `${SITE_URL}/#localbusiness` },
    publisher: { "@id": `${SITE_URL}/#localbusiness` },
    about: {
      "@type": "Thing",
      name: getProjectTypeLabel(project.projectType),
    },
    contentLocation: {
      "@type": "Place",
      name: project.location,
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Công trình thực tế",
        item: `${SITE_URL}/cong-trinh-thuc-te`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Section className="bg-[#F8FAFC] py-8 sm:py-12">
        <Container>
          <article className="mx-auto max-w-4xl">
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-[#0284C7]">
              <span>{getProjectTypeLabel(project.projectType)}</span>
              <time dateTime={getProjectDateIso(project.performedAt)}>
                {formatProjectDate(project.performedAt)}
              </time>
              <span>{project.location}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-[#111827] sm:text-5xl">
              {project.title}
            </h1>
            {project.excerpt ? (
              <p className="mt-4 text-base leading-7 text-[#6B7280]">
                {project.excerpt}
              </p>
            ) : null}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={contactLinks.phoneHref}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#F97316] px-5 text-sm font-bold text-white hover:bg-[#EA580C]"
              >
                Gọi tư vấn
              </a>
              <Link
                href="#tu-van"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0EA5E9] px-5 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
              >
                Yêu cầu công trình tương tự
              </Link>
            </div>
            {imageSrc ? (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-[#E0F2FE]">
                <Image
                  src={imageSrc}
                  alt={project.title}
                  fill
                  priority
                  unoptimized={shouldUseUnoptimizedImage(imageSrc)}
                  sizes="(min-width: 1024px) 896px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </article>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
          <article className="max-w-3xl">
            {headings.length ? (
              <nav
                aria-label="Mục lục công trình"
                className="mb-8 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-5"
              >
                <h2 className="text-lg font-bold text-[#111827]">Mục lục</h2>
                <ol className="mt-3 space-y-2 text-sm leading-6 text-[#374151]">
                  {headings.map((heading) => (
                    <li
                      key={heading.id}
                      className={heading.level === 3 ? "pl-4" : undefined}
                    >
                      <a
                        href={`#${heading.id}`}
                        className="hover:text-[#0284C7]"
                      >
                        {heading.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            <div
              className="text-base leading-8 text-[#374151] [&_a]:font-semibold [&_a]:text-[#0284C7] [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#BAE6FD] [&_blockquote]:bg-[#F8FAFC] [&_blockquote]:p-4 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#111827] [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#111827] [&_img]:my-7 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {project.facebookUrl ? (
              <div className="mt-8 rounded-lg border border-[#BAE6FD] bg-[#F0F9FF] p-5">
                <h2 className="text-xl font-bold text-[#111827]">
                  Hình ảnh xác thực trên Facebook
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#374151]">
                  Xem bài đăng thực tế và trao đổi của Điện Máy Nga Sơn về
                  công trình này.
                </p>
                <a
                  href={project.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-[#1877F2] px-5 text-sm font-bold text-white hover:bg-[#166FE5]"
                >
                  Xem bài đăng Facebook
                </a>
              </div>
            ) : null}
          </article>

          <aside
            id="tu-van"
            className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)] lg:sticky lg:top-24 lg:self-start"
          >
            <h2 className="text-xl font-bold text-[#111827]">
              Yêu cầu tư vấn
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Gửi nhu cầu để được tư vấn công trình phù hợp tại khu vực của
              bạn.
            </p>
            <LeadForm
              className="mt-5"
              sourceType={LeadSourceType.PROJECT}
              sourceUrl={`/cong-trinh-thuc-te/${project.slug}`}
            />
          </aside>
        </Container>
      </Section>

      {relatedProjects.length ? (
        <Section className="bg-[#F8FAFC]">
          <Container>
            <h2 className="text-2xl font-bold text-[#111827]">
              Công trình liên quan
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((relatedProject) => (
                <ProjectCard
                  key={relatedProject.id}
                  project={relatedProject}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
