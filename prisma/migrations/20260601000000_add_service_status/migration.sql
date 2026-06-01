ALTER TABLE "services" ADD COLUMN "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE';

CREATE INDEX "idx_services_status" ON "services"("status");
