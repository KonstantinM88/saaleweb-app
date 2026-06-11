import type { Field } from "@/widgets/admin/GenericForm";
export const SEO_TR_FIELDS = ["title", "description", "ogImage"];
export const seoTopFields: Field[] = [
  { name: "path", label: "Pfad (z. B. /, /leistungen, /projekte)", type: "text", span2: true },
];
export const seoLocaleFields: Field[] = [
  { name: "title", label: "Title", type: "text", span2: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "ogImage", label: "OG-Bild (optional)", type: "image", hint: "1200×630 px", maxWidth: 1200 },
];
