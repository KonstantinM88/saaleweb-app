-- Extend the existing daily SEO snapshot with nullable, independently
-- refreshable PageSpeed measurements. Existing reports remain valid and the
-- Hero can keep using its reviewed fallback until the first successful run.

ALTER TABLE "SeoDailySnapshot"
ADD COLUMN "lighthouseMobile" INTEGER,
ADD COLUMN "lighthouseDesktop" INTEGER,
ADD COLUMN "lighthouseSeo" INTEGER,
ADD COLUMN "coreWebVitalsPassed" BOOLEAN,
ADD COLUMN "lighthouseMeasuredAt" TIMESTAMP(3),
ADD CONSTRAINT "SeoDailySnapshot_lighthouseMobile_range"
  CHECK ("lighthouseMobile" IS NULL OR "lighthouseMobile" BETWEEN 0 AND 100),
ADD CONSTRAINT "SeoDailySnapshot_lighthouseDesktop_range"
  CHECK ("lighthouseDesktop" IS NULL OR "lighthouseDesktop" BETWEEN 0 AND 100),
ADD CONSTRAINT "SeoDailySnapshot_lighthouseSeo_range"
  CHECK ("lighthouseSeo" IS NULL OR "lighthouseSeo" BETWEEN 0 AND 100);
