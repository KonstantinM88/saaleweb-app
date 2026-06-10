import type { Field } from "@/widgets/admin/GenericForm";

export const PROJECT_TR_FIELDS = ["title", "slug", "challenge", "solution", "results"];

export const projectLocaleFields: Field[] = [
  { name: "title", label: "Titel", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "challenge", label: "Herausforderung", type: "textarea" },
  { name: "solution", label: "Lösung", type: "textarea" },
  { name: "results", label: "Ergebnisse", type: "textarea" },
];

export function projectTopFields(categoryOptions: { value: string; label: string }[]): Field[] {
  return [
    { name: "categoryId", label: "Kategorie", type: "select", options: categoryOptions },
    { name: "coverColor", label: "Cover-Farbe (z. B. #FF4FA3)", type: "text" },
    { name: "technologies", label: "Technologien (Komma-getrennt)", type: "text", span2: true },
    { name: "resultValue", label: "Ergebnis (z. B. +120% Anfragen)", type: "text" },
    { name: "year", label: "Jahr", type: "number" },
    { name: "order", label: "Reihenfolge", type: "number" },
    { name: "featured", label: "Hervorgehoben", type: "checkbox" },
    { name: "published", label: "Veröffentlicht", type: "checkbox" },
  ];
}
