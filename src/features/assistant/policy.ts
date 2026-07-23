const IMPLEMENTATION_ACTION_PATTERN =
  /(?:напиш(?:и|ите)|созда(?:й|йте)|сгенерир(?:уй|уйте)|сдела(?:й|йте)|дай(?:те)?|write|create|generate|build|provide|erstelle|erstell|schreib|generiere|baue)/iu;

const SOURCE_DELIVERABLE_PATTERN =
  /(?:исходн[\p{L}-]*\s+код|готов[\p{L}-]*\s+код|код\s+(?:для|сайта|лендинг)|html(?:-код)?|css(?:-код)?|javascript(?:-код)?|typescript(?:-код)?|react(?:-код)?|source\s+code|complete\s+code|full\s+code|html\s+landing\s+page|quellcode|vollst[äa]ndig[\p{L}-]*\s+code|html-code)/iu;

const EXECUTABLE_MARKUP_PATTERN =
  /(?:<\s*script\b|%3c\s*script\b|\bon(?:error|load|click|focus|mouseover)\s*=|javascript\s*:|data\s*:\s*text\/html)/iu;

const COMPLETE_SOURCE_PATTERN =
  /(?:```(?:html|css|javascript|typescript|jsx|tsx)?[\s\S]{120,}```|<!doctype\s+html|<html(?:\s|>)[\s\S]*<\/html>)/iu;

const GREETING_PATTERN =
  /^(?:hello|hi|hey|hallo|guten\s+(?:tag|morgen|abend)|привет|здравствуйте|добрый\s+(?:день|вечер|утро))[!.,?\s]*$/iu;

const COMMERCIAL_SCOPE_PATTERNS = [
  /saaleweb|веб[- ]?студи|webstudio|webagentur|web\s+agency|digitalagentur|digital\s+agency/iu,
  /website|webseite|webdesign|landingpage|landing\s+page|homepage|site|сайт|лендинг|веб/iu,
  /seo|local\s+seo|lokal(?:es)?\s+seo|локальн[\p{L}-]*\s+seo|google\s+business|ranking|sichtbarkeit|видимост|поисков[\p{L}-]*\s+(?:систем|запрос|выдач)|найти\s+(?:сайт|компани|услуг)/iu,
  /\bki\b|\bai\b|gpt|chatgpt|gemini|claude|perplexity|aio|geo|llm|ии|ассистент|chatbot|ki-suche/iu,
  /wordpress|next\.?js|react|java|cms|hosting|domain|домен|хостинг|performance|pagespeed|lighthouse/iu,
  /relaunch|redesign|редизайн|перезапуск|modernisierung|модернизац/iu,
  /automation|automatisierung|автоматизац|api|integration|интеграц|crm/iu,
  /booking|buchung|termin|reservation|запис|бронир|календар/iu,
  /shop|e-?commerce|магазин|online-shop|portal|портал/iu,
  /preis|kosten|budget|angebot|price|cost|стоимост|цена|бюджет|коммерческ[\p{L}-]*\s+предлож/iu,
  /projekt|project|проект|консультац|erstgespr[aä]ch|kontakt|contact|whatsapp|telegram|e-?mail|позвон|связ/iu,
  /lead|anfrage|kunden|заявк|клиент|business|unternehmen|бизнес|продаж|заказ/iu,
  /gründer|founder|основател|кто\s+(?:вы|ты)|wer\s+seid|who\s+are\s+you|как\s+тебя\s+зовут|что\s+вы\s+делаете|what\s+do\s+you\s+do|was\s+macht\s+ihr|was\s+bieten\s+sie\s+an/iu,
  /(?:о|про)\s+(?:вашу\s+)?компани|about\s+(?:you|your\s+company)|über\s+(?:euch|ihre\s+agentur)|ueber\s+(?:euch|ihre\s+agentur)|почему\s+выбрать\s+(?:вас|saaleweb)|why\s+(?:choose|hire)\s+you|warum\s+(?:sie|euch)/iu,
  /пример[\p{L}-]*\s+работ|портфолио|referenz|portfolio|case\s+stud(?:y|ies)|кейс/iu,
  /adresse|address|standort|где\s+(?:вы|находит)|адрес|halle|leipzig|merseburg|saalekreis|галле|лейпциг/iu,
  /impressum|datenschutz|privacy|конфиденциальност|gdpr|dsgvo/iu,
  /салон|парикмах|косметолог|beauty|friseur|barber|ресторан|кафе|restaurant|gastronom/iu,
  /стоматолог|стоматол|зубн|dental|dentist|zahnarzt|клиник|arzt|praxis|medical/iu,
  /строител|ремонт|repair|reparatur|bauunternehmen|construction|handwerk|ремесл|glaserei/iu,
  /отел|гостини|hotel|pension|недвиж|immobil|real\s+estate|юрист|адвокат|anwalt|lawyer/iu,
  /услуг|leistung|service|решени|lösung|solution|технолог|technology|prozess|process|этап/iu,
] as const;

const QUALIFICATION_REPLY_PATTERNS = [
  /^(?:да|нет|хочу|не\s+знаю|пока\s+нет|уже\s+есть|ок(?:ей)?|yes|no|sure|not\s+yet|already|ja|nein|gerne|noch\s+nicht|bereits)[!.,?\s]*$/iu,
  /^(?:почему|расскажите\s+подробнее|можно\s+подробнее|что\s+входит|как\s+это\s+работает|в\s+ч[её]м\s+разница|какие\s+преимущества|какой\s+вариант\s+лучше|что\s+вы\s+рекомендуете|сколько\s+(?:времени|по\s+времени)|с\s+чего\s+начать|когда\s+можно\s+начать|что\s+дальше|давайте|покажите|готов(?:а|ы)?|why|tell\s+me\s+more|what\s+is\s+included|how\s+does\s+it\s+work|what\s+is\s+the\s+difference|which\s+option\s+is\s+better|what\s+do\s+you\s+recommend|how\s+long|how\s+do\s+we\s+start|when\s+can\s+we\s+start|what\s+next|let'?s\s+do\s+it|ready|warum|mehr\s+details|was\s+ist\s+enthalten|wie\s+funktioniert\s+das|was\s+ist\s+der\s+unterschied|welche\s+variante\s+ist\s+besser|was\s+empfehlen\s+sie|wie\s+lange|wie\s+fangen\s+wir\s+an|wann\s+können\s+wir\s+starten|wie\s+geht\s+es\s+weiter|bereit)[!.,?\s]*$/iu,
  /^(?:русск|немецк|английск|russian|german|english|deutsch|englisch)(?:[\p{L}-]*\s*(?:,|\/|и|and|und)?\s*){0,5}$/iu,
  /^(?:до|от|около|примерно|bis|ab|ca\.?|about|around)?\s*\d[\d\s.,]*(?:€|eur|евро|euro)[!.,?\s]*$/iu,
  /^(?:срочно|(?:в\s+течени[еи]|около|примерно)\s+\d+\s+(?:дн|недел|месяц)[\p{L}-]*|\d+\s+(?:дн|недел|месяц)[\p{L}-]*|asap|(?:within|about|around)\s+\d+\s+(?:days?|weeks?|months?)|(?:in|ca\.?)\s+\d+\s+(?:tagen|wochen|monaten))[!.,?\s]*$/iu,
  /^(?:https?:\/\/|www\.)[^\s]+$/iu,
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/iu,
  /^(?:\+|00)\d(?:[\s().-]*\d){7,14}$/u,
] as const;

const TRANSLATION_REQUEST_PATTERN =
  /(?:перевед|перевод|translate|translation|übersetz|uebersetz)/iu;

const WORK_PRODUCT_ACTION_PATTERN =
  /(?:напиш|созда|сгенерир|состав|подготов|сдела|разработ|нарис|write|create|generate|prepare|make|design|erstelle|schreib|generiere|verfass)/iu;

const UNSUPPORTED_WORK_PRODUCT_PATTERN =
  /(?:стих|поэм|песн|эссе|реферат|домашн[\p{L}-]*\s+задан|poem|song|essay|homework|gedicht|hausaufgabe|рекламн[\p{L}-]*\s+кампан|advertising\s+campaign|google\s+ads\s+campaign|werbekampagne|объявлен|ad\s+copy|anzeigentext|контент[- ]?план|social\s+media\s+post|пост\s+для\s+соц|стать[юя]|article|blogbeitrag|логотип|logo|презентац|presentation|резюме|lebenslauf|\bcv\b)/iu;

const CLEARLY_NON_COMMERCIAL_PATTERNS = [
  /(?:^|\s)\d+\s*[+\-*/x×÷]\s*\d+(?=\s|[?.!,;:]|$)/iu,
  /(?:сколько\s+будет|реши(?:те)?\s+(?:пример|задачу)|посчитай(?:те)?|calculate\s+\d|solve\s+(?:this|the)\s+(?:sum|equation)|rechne\s+\d)/iu,
  /(?:какая|какую|что\s+за)\s+погод|weather\s+(?:today|tomorrow|in)|wie\s+ist\s+das\s+wetter|wetter\s+(?:heute|morgen|in)/iu,
  /(?:дай(?:те)?|напиш(?:и|ите)|расскаж(?:и|ите)|tell\s+me|write|erz[aä]hl|schreib)\s+(?:мне\s+)?(?:анекдот|шутку|joke|witz)/iu,
  /(?:рецепт\s+(?:блюда|торта|супа|пиццы)|cooking\s+recipe|recipe\s+for|kochrezept|rezept\s+f[üu]r)/iu,
  /(?:кто\s+(?:сейчас\s+)?президент|политическ[\p{L}-]*\s+новост|political\s+news|who\s+is\s+(?:the\s+)?president|wer\s+ist\s+(?:der|die)\s+pr[aä]sident)/iu,
  /(?:у\s+меня\s+болит|как\s+лечить|какие\s+лекарств|поставь\s+диагноз|medical\s+advice|diagnose\s+me|welche\s+medikamente|wie\s+behandle\s+ich)/iu,
  /(?:юридическ[\p{L}-]*\s+совет|legal\s+advice|rechtsberatung|инвестиционн[\p{L}-]*\s+совет|investment\s+advice|anlageberatung)/iu,
  /(?:результат\s+матча|кто\s+выиграл\s+матч|sports?\s+score|match\s+result|spielergebnis)/iu,
] as const;

/**
 * The public assistant qualifies projects and explains decisions, but it must
 * not become a free source-code generator for complete third-party websites.
 */
export function isImplementationDeliverableRequest(text: string): boolean {
  return IMPLEMENTATION_ACTION_PATTERN.test(text) && SOURCE_DELIVERABLE_PATTERN.test(text);
}

/** Detect obvious executable-markup probes without decoding or executing them. */
export function isExecutableMarkupProbe(text: string): boolean {
  return EXECUTABLE_MARKUP_PATTERN.test(text);
}

/** Final safety net in case a model ignores the source-delivery instruction. */
export function containsCompleteSourceDeliverable(text: string): boolean {
  return COMPLETE_SOURCE_PATTERN.test(text);
}

/**
 * Positive scope gate: unknown requests are rejected before they reach the
 * model. This is intentionally stricter than a growing off-topic blacklist.
 */
export function isAssistantCommercialScopeMessage(text: string): boolean {
  const clean = text.trim();
  if (!clean) return false;
  if (CLEARLY_NON_COMMERCIAL_PATTERNS.some((pattern) => pattern.test(clean))) return false;
  if (GREETING_PATTERN.test(clean)) return true;
  if (COMMERCIAL_SCOPE_PATTERNS.some((pattern) => pattern.test(clean))) return true;
  return QUALIFICATION_REPLY_PATTERNS.some((pattern) => pattern.test(clean));
}

/** Standalone work products are not delivered by the public sales assistant. */
export function isUnsupportedWorkProductRequest(text: string): boolean {
  if (TRANSLATION_REQUEST_PATTERN.test(text)) return true;
  return WORK_PRODUCT_ACTION_PATTERN.test(text) && UNSUPPORTED_WORK_PRODUCT_PATTERN.test(text);
}
