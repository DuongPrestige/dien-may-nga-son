import Image from "next/image";
import Link from "next/link";

import { getProjectTypeLabel } from "@/src/features/projects/constants";
import {
  formatProjectDate,
  getProjectDateIso,
} from "@/src/features/projects/lib/project-date";
import type { ProjectCardData } from "@/src/features/projects/types/projects.types";
import {
  getSafeImageSrc,
  shouldUseUnoptimizedImage,
} from "@/src/lib/image-src";

type ProjectCardProps = {
  project: ProjectCardData;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const imageSrc = getSafeImageSrc(project.thumbnailUrl);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#E5E7EB] bg-white transition-colors hover:border-[#0EA5E9]">
      <Link
        href={`/cong-trinh-thuc-te/${project.slug}`}
        className="relative aspect-[4/3] bg-[#E0F2FE]"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={project.title}
            fill
            unoptimized={shouldUseUnoptimizedImage(imageSrc)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center px-5 text-center text-sm font-bold text-[#0369A1]">
            Hình ảnh công trình đang cập nhật
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-[#0284C7]">
          <span>{getProjectTypeLabel(project.projectType)}</span>
          <time dateTime={getProjectDateIso(project.performedAt)}>
            {formatProjectDate(project.performedAt)}
          </time>
        </div>
        <h2 className="mt-2 text-lg font-bold leading-7 text-[#111827]">
          <Link href={`/cong-trinh-thuc-te/${project.slug}`}>
            {project.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm font-semibold text-[#374151]">
          {project.location}
        </p>
        <p className="mt-2 flex-1 text-sm leading-6 text-[#6B7280]">
          {project.excerpt ??
            "Hình ảnh và thông tin công trình thực tế do Điện Máy Nga Sơn thực hiện."}
        </p>
        <Link
          href={`/cong-trinh-thuc-te/${project.slug}`}
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md border border-[#0EA5E9] px-4 text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE]"
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}
