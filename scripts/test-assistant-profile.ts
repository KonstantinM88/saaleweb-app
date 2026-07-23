import assert from "node:assert/strict";
import {
  deriveAssistantFunnelStage,
  emptyAssistantSalesProfile,
  updateAssistantSalesProfile,
} from "../src/features/assistant/profile";
import {
  containsCompleteSourceDeliverable,
  isAssistantCommercialScopeMessage,
  isExecutableMarkupProbe,
  isImplementationDeliverableRequest,
  isUnsupportedWorkProductRequest,
} from "../src/features/assistant/policy";
import type { AssistantChatMessage } from "../src/features/assistant/knowledge";

const userMessages = [
  "у меня веб-студия",
  "нужна онлайн запись",
  "онлайн запись с календарём",
  "вот мой номер +380679014039 свяжитесь со мной",
  "с нуля",
  "на всех языках",
];

const messages: AssistantChatMessage[] = userMessages.map((content) => ({ role: "user", content }));
const profile = updateAssistantSalesProfile(emptyAssistantSalesProfile(), messages);

assert.equal(profile.businessType, "Web agency / digital studio");
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

const dentalProfile = updateAssistantSalesProfile(emptyAssistantSalesProfile(), [
  { role: "user", content: "Напиши код простого лендинга для стоматолога в Киеве" },
]);
assert.equal(dentalProfile.businessType, "Dental practice / clinic");
assert.equal(dentalProfile.websiteStatus, "new");
assert.ok(dentalProfile.goals.includes("launch a new website"));
assert.equal(deriveAssistantFunnelStage(dentalProfile), "SOLUTION");

assert.equal(isImplementationDeliverableRequest("Напиши мне HTML простого лендингпейджа"), true);
assert.equal(isImplementationDeliverableRequest("Можете разработать сайт для стоматологии?"), false);
assert.equal(isExecutableMarkupProbe("<img src=x onerror=\"alert(1)\">"), true);
assert.equal(isExecutableMarkupProbe("%3Cscript%3Ealert(1)%3C/script%3E"), true);
assert.equal(isAssistantCommercialScopeMessage("Сколько стоит сайт для стоматологии?"), true);
assert.equal(isAssistantCommercialScopeMessage("У меня салон красоты"), true);
assert.equal(isAssistantCommercialScopeMessage("Что входит?"), true);
assert.equal(isAssistantCommercialScopeMessage("Что вы делаете?"), true);
assert.equal(isAssistantCommercialScopeMessage("Покажите примеры работ"), true);
assert.equal(isAssistantCommercialScopeMessage("Сколько по времени?"), true);
assert.equal(isAssistantCommercialScopeMessage("Около 3 месяцев"), true);
assert.equal(isAssistantCommercialScopeMessage("Was kostet eine Website in Halle?"), true);
assert.equal(isAssistantCommercialScopeMessage("Can SaaleWeb improve my local SEO?"), true);
assert.equal(isAssistantCommercialScopeMessage("Переведи эти стихи на немецкий язык"), false);
assert.equal(isAssistantCommercialScopeMessage("Какая погода завтра?"), false);
assert.equal(isAssistantCommercialScopeMessage("Кто сейчас президент Франции?"), false);
assert.equal(isAssistantCommercialScopeMessage("Как лечить зубную боль?"), false);
assert.equal(isAssistantCommercialScopeMessage("Напиши школьное эссе"), false);
assert.equal(isUnsupportedWorkProductRequest("Переведи эти стихи на немецкий язык"), true);
assert.equal(isUnsupportedWorkProductRequest("Создай структуру рекламной кампании"), true);
assert.equal(isUnsupportedWorkProductRequest("Напиши статью о путешествиях"), true);
assert.equal(isUnsupportedWorkProductRequest("Составь план SEO для моего сайта"), false);
assert.equal(
  containsCompleteSourceDeliverable("```html\n<!doctype html><html><body>" + "x".repeat(130) + "</body></html>\n```"),
  true,
);

console.info("Assistant sales profile test passed.", {
  stage: deriveAssistantFunnelStage(profile),
  businessType: profile.businessType,
  websiteStatus: profile.websiteStatus,
  languages: profile.languages,
  features: profile.features,
  hasPhone: Boolean(profile.phone),
});
