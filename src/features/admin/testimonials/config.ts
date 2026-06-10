import type { Field } from "@/widgets/admin/GenericForm";
export const TESTI_TR_FIELDS = ["quote", "clientName", "company"];
export const testiTopFields: Field[] = [
  { name: "rating", label: "Bewertung (1–5)", type: "number" },
  { name: "avatarUrl", label: "Avatar", type: "image", hint: "200×200 px", maxWidth: 400 },
  { name: "order", label: "Reihenfolge", type: "number" },
  { name: "published", label: "Veröffentlicht", type: "checkbox" },
];
export const testiLocaleFields: Field[] = [
  { name: "quote", label: "Zitat", type: "textarea" },
  { name: "clientName", label: "Name", type: "text" },
  { name: "company", label: "Firma", type: "text" },
];
