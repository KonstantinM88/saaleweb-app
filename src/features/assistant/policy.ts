const IMPLEMENTATION_ACTION_PATTERN =
  /(?:напиш(?:и|ите)|созда(?:й|йте)|сгенерир(?:уй|уйте)|сдела(?:й|йте)|дай(?:те)?|write|create|generate|build|provide|erstelle|erstell|schreib|generiere|baue)/iu;

const SOURCE_DELIVERABLE_PATTERN =
  /(?:исходн[\p{L}-]*\s+код|готов[\p{L}-]*\s+код|код\s+(?:для|сайта|лендинг)|html(?:-код)?|css(?:-код)?|javascript(?:-код)?|typescript(?:-код)?|react(?:-код)?|source\s+code|complete\s+code|full\s+code|html\s+landing\s+page|quellcode|vollst[äa]ndig[\p{L}-]*\s+code|html-code)/iu;

const EXECUTABLE_MARKUP_PATTERN =
  /(?:<\s*script\b|%3c\s*script\b|\bon(?:error|load|click|focus|mouseover)\s*=|javascript\s*:|data\s*:\s*text\/html)/iu;

const COMPLETE_SOURCE_PATTERN =
  /(?:```(?:html|css|javascript|typescript|jsx|tsx)?[\s\S]{120,}```|<!doctype\s+html|<html(?:\s|>)[\s\S]*<\/html>)/iu;

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
