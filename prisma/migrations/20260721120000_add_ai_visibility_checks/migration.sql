-- Store manual weekly AI-search visibility benchmarks without treating API
-- responses or crawler visits as consumer-search visibility.

CREATE TABLE "AiVisibilityCheck" (
    "id" TEXT NOT NULL,
    "week" TEXT NOT NULL,
    "promptKey" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "mentioned" BOOLEAN NOT NULL DEFAULT false,
    "cited" BOOLEAN NOT NULL DEFAULT false,
    "mentionOrder" INTEGER,
    "citationUrl" TEXT,
    "competitor" TEXT,
    "notes" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiVisibilityCheck_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AiVisibilityCheck_week_promptKey_platform_key"
ON "AiVisibilityCheck"("week", "promptKey", "platform");

CREATE INDEX "AiVisibilityCheck_week_idx" ON "AiVisibilityCheck"("week");
CREATE INDEX "AiVisibilityCheck_platform_idx" ON "AiVisibilityCheck"("platform");
CREATE INDEX "AiVisibilityCheck_promptKey_idx" ON "AiVisibilityCheck"("promptKey");
