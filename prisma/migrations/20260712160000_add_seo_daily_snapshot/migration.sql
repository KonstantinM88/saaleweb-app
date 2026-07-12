-- Persist one cached SEO monitoring report per calendar day.

CREATE TABLE "SeoDailySnapshot" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "sitemapUrls" INTEGER NOT NULL,
    "report" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeoDailySnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SeoDailySnapshot_day_key" ON "SeoDailySnapshot"("day");
