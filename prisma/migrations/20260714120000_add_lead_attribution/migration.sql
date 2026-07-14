-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "submissionId" TEXT;

-- CreateTable
CREATE TABLE "LeadAttribution" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "firstSource" TEXT,
    "firstMedium" TEXT,
    "firstChannel" TEXT,
    "firstCampaign" TEXT,
    "firstContent" TEXT,
    "firstTerm" TEXT,
    "firstLandingPage" TEXT,
    "firstReferrer" TEXT,
    "firstGclid" TEXT,
    "firstFbclid" TEXT,
    "firstMsclkid" TEXT,
    "firstCapturedAt" TIMESTAMP(3),
    "lastSource" TEXT,
    "lastMedium" TEXT,
    "lastChannel" TEXT,
    "lastCampaign" TEXT,
    "lastContent" TEXT,
    "lastTerm" TEXT,
    "lastLandingPage" TEXT,
    "lastReferrer" TEXT,
    "lastGclid" TEXT,
    "lastFbclid" TEXT,
    "lastMsclkid" TEXT,
    "lastCapturedAt" TIMESTAMP(3),
    "conversionPage" TEXT,
    "deviceCategory" TEXT,
    "captureMode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadAttribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeadAttribution_leadId_key" ON "LeadAttribution"("leadId");

-- CreateIndex
CREATE INDEX "LeadAttribution_firstSource_idx" ON "LeadAttribution"("firstSource");

-- CreateIndex
CREATE INDEX "LeadAttribution_lastSource_idx" ON "LeadAttribution"("lastSource");

-- CreateIndex
CREATE INDEX "LeadAttribution_firstCampaign_idx" ON "LeadAttribution"("firstCampaign");

-- CreateIndex
CREATE INDEX "LeadAttribution_lastCampaign_idx" ON "LeadAttribution"("lastCampaign");

-- CreateIndex
CREATE INDEX "LeadAttribution_firstLandingPage_idx" ON "LeadAttribution"("firstLandingPage");

-- CreateIndex
CREATE INDEX "LeadAttribution_conversionPage_idx" ON "LeadAttribution"("conversionPage");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_submissionId_key" ON "Lead"("submissionId");

-- AddForeignKey
ALTER TABLE "LeadAttribution" ADD CONSTRAINT "LeadAttribution_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
