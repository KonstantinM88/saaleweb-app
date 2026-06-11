import type { Field } from "@/widgets/admin/GenericForm";
export const PRICING_TR_FIELDS = ["name", "sub", "price", "features"];
export const pricingTopFields: Field[] = [
  { name: "order", label: "Reihenfolge", type: "number" },
  { name: "featured", label: "Hervorgehoben (beliebt)", type: "checkbox" },
  { name: "published", label: "Veröffentlicht", type: "checkbox" },
];
export const pricingLocaleFields: Field[] = [
  { name: "name", label: "Name (z. B. Business)", type: "text" },
  { name: "sub", label: "Untertitel", type: "text" },
  { name: "price", label: "Preis (z. B. ab 1.990 €)", type: "text" },
  { name: "features", label: "Features (eine pro Zeile)", type: "textarea" },
];
