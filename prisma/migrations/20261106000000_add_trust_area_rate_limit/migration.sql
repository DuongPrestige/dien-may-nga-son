-- CreateTable
CREATE TABLE "service_price_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "service_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price_label" VARCHAR(100) NOT NULL,
    "note" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "service_price_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_name" VARCHAR(255) NOT NULL,
    "area" VARCHAR(255),
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_areas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limits" (
    "key" VARCHAR(255) NOT NULL,
    "count" INTEGER NOT NULL,
    "reset_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "idx_service_price_items_service" ON "service_price_items"("service_id");

-- CreateIndex
CREATE INDEX "idx_testimonials_active_sort" ON "testimonials"("is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "service_areas_slug_key" ON "service_areas"("slug");

-- CreateIndex
CREATE INDEX "idx_service_areas_active_sort" ON "service_areas"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "idx_rate_limits_reset_at" ON "rate_limits"("reset_at");

-- AddForeignKey
ALTER TABLE "service_price_items" ADD CONSTRAINT "service_price_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

