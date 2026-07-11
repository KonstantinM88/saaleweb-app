import assert from "node:assert/strict";
import {
  deriveAssistantFunnelStage,
  emptyAssistantSalesProfile,
  updateAssistantSalesProfile,
} from "../src/features/assistant/profile";
import type { AssistantChatMessage } from "../src/features/assistant/knowledge";

const userMessages = [
  "saaleweb.de создание вебсайтов",
  "нужна онлайн запись",
  "онлайн запись с календарём",
  "вот мой номер +380679014039 свяжитесь со мной",
  "с нуля",
  "на всех языках",
];

const messages: AssistantChatMessage[] = userMessages.map((content) => ({ role: "user", content }));
const profile = updateAssistantSalesProfile(emptyAssistantSalesProfile(), messages);

assert.equal(profile.businessType, "Web development / website creation");
assert.equal(profile.websiteStatus, "new");
assert.equal(profile.phone, "+380679014039");
assert.equal(profile.contactRequested, true);
assert.deepEqual(profile.languages, ["de", "en", "ru"]);
assert.ok(profile.features.includes("online booking"));
assert.ok(profile.features.includes("calendar synchronization"));
assert.ok(profile.features.includes("multilingual website"));
assert.equal(deriveAssistantFunnelStage(profile), "CONTACT");
assert.equal(deriveAssistantFunnelStage(profile, true), "HANDOFF");

const afterShortConfirmation = updateAssistantSalesProfile(profile, [{ role: "user", content: "да" }]);
assert.equal(afterShortConfirmation.businessType, profile.businessType);
assert.equal(afterShortConfirmation.websiteStatus, "new");
assert.equal(afterShortConfirmation.phone, profile.phone);
assert.deepEqual(afterShortConfirmation.languages, profile.languages);

const phoneOnlyProfile = updateAssistantSalesProfile(emptyAssistantSalesProfile(), [
  { role: "user", content: "мой номер +4917671764743" },
]);
assert.equal(phoneOnlyProfile.contactRequested, false);
const confirmedPhoneProfile = updateAssistantSalesProfile(phoneOnlyProfile, [{ role: "user", content: "да" }]);
assert.equal(confirmedPhoneProfile.contactRequested, true);
assert.equal(deriveAssistantFunnelStage(confirmedPhoneProfile), "CONTACT");

console.info("Assistant sales profile test passed.", {
  stage: deriveAssistantFunnelStage(profile),
  businessType: profile.businessType,
  websiteStatus: profile.websiteStatus,
  languages: profile.languages,
  features: profile.features,
  hasPhone: Boolean(profile.phone),
});
