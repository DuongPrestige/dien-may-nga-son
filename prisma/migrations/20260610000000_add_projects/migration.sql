-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM (
  'AIRCON_INSTALL',
  'AIRCON_MAINTENANCE',
  'AIRCON_REPAIR',
  'WASHING_MACHINE_REPAIR',
  'REFRIGERATOR_REPAIR',
  'TV_INSTALL',
  'DELIVERY',
  'OTHER'
);

-- AlterEnum
ALTER TYPE "LeadSourceType" ADD VALUE IF NOT EXISTS 'PROJECT';

-- CreateTable
CREATE TABLE "projects" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
  "project_type" "ProjectType" NOT NULL,
  "location" VARCHAR(255) NOT NULL,
  "customer_area" VARCHAR(255),
  "performed_at" TIMESTAMP(3) NOT NULL,
  "thumbnail_url" TEXT,
  "facebook_url" TEXT,
  "seo_title" VARCHAR(255),
  "seo_description" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "idx_projects_slug" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "idx_projects_status" ON "projects"("status");

-- CreateIndex
CREATE INDEX "idx_projects_project_type" ON "projects"("project_type");

-- CreateIndex
CREATE INDEX "idx_projects_performed_at" ON "projects"("performed_at");
