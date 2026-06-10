import type { Field } from "@/widgets/admin/GenericForm";

export const FAQ_TR_FIELDS = ["question", "answer"];
export const faqTopFields: Field[] = [
  { name: "category", label: "Kategorie (Key)", type: "text" },
  { name: "order", label: "Reihenfolge", type: "number" },
  { name: "published", label: "Veröffentlicht", type: "checkbox" },
];
export const faqLocaleFields: Field[] = [
  { name: "question", label: "Frage", type: "text", span2: true },
  { name: "answer", label: "Antwort", type: "textarea" },
];
