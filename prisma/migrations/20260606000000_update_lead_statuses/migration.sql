ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";

CREATE TYPE "LeadStatus" AS ENUM (
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CLOSED',
  'LOST'
);

ALTER TABLE "leads"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "leads"
  ALTER COLUMN "status" TYPE "LeadStatus"
  USING (
    CASE
      WHEN "status"::text = 'CONVERTED' THEN 'QUALIFIED'
      ELSE "status"::text
    END
  )::"LeadStatus";

ALTER TABLE "leads"
  ALTER COLUMN "status" SET DEFAULT 'NEW';

DROP TYPE "LeadStatus_old";
