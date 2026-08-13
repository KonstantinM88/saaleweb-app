-- Store the two additional Lighthouse categories used by the public Hero.
-- Existing daily snapshots and internal CrUX data remain unchanged.

ALTER TABLE "SeoDailySnapshot"
ADD COLUMN "lighthouseAccessibility" INTEGER,
ADD COLUMN "lighthouseBestPractices" INTEGER,
ADD CONSTRAINT "SeoDailySnapshot_lighthouseAccessibility_range"
  CHECK ("lighthouseAccessibility" IS NULL OR "lighthouseAccessibility" BETWEEN 0 AND 100),
ADD CONSTRAINT "SeoDailySnapshot_lighthouseBestPractices_range"
  CHECK ("lighthouseBestPractices" IS NULL OR "lighthouseBestPractices" BETWEEN 0 AND 100);
