import type { Project, ProjectStatus, ProjectType } from "@prisma/client";

export type ProjectCardData = Pick<
  Project,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "projectType"
  | "location"
  | "customerArea"
  | "performedAt"
  | "thumbnailUrl"
>;

export type ProjectDetailData = ProjectCardData &
  Pick<
    Project,
    | "content"
    | "facebookUrl"
    | "seoTitle"
    | "seoDescription"
    | "createdAt"
    | "updatedAt"
  >;

export type ProjectFilters = {
  search?: string;
  projectType?: ProjectType;
  page?: number;
  limit?: number;
};

export type ProjectListResult = {
  items: ProjectCardData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AdminProjectFilters = ProjectFilters & {
  status?: ProjectStatus;
};

export type AdminProjectListItem = Pick<
  Project,
  | "id"
  | "title"
  | "slug"
  | "status"
  | "projectType"
  | "location"
  | "performedAt"
  | "thumbnailUrl"
  | "updatedAt"
>;

export type AdminProjectListResult = {
  items: AdminProjectListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AdminProjectDetail = Pick<
  Project,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "content"
  | "status"
  | "projectType"
  | "location"
  | "customerArea"
  | "performedAt"
  | "thumbnailUrl"
  | "facebookUrl"
  | "seoTitle"
  | "seoDescription"
>;

export type ProjectActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<
    Record<
      | "title"
      | "slug"
      | "excerpt"
      | "content"
      | "status"
      | "projectType"
      | "location"
      | "customerArea"
      | "performedAt"
      | "thumbnailUrl"
      | "facebookUrl"
      | "seoTitle"
      | "seoDescription",
      string
    >
  >;
};
