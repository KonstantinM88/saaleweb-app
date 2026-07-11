-- Store structured AI assistant sales context and link explicit handoffs to leads.

ALTER TABLE "Lead" ALTER COLUMN "email" DROP NOT NULL;

ALTER TABLE "AssistantConversation"
ADD COLUMN "salesProfile" JSONB,
ADD COLUMN "funnelStage" TEXT NOT NULL DEFAULT 'DISCOVERY',
ADD COLUMN "leadId" TEXT;

CREATE UNIQUE INDEX "AssistantConversation_leadId_key" ON "AssistantConversation"("leadId");

ALTER TABLE "AssistantConversation"
ADD CONSTRAINT "AssistantConversation_leadId_fkey"
FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
