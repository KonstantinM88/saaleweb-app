import type { Field } from "@/widgets/admin/GenericForm";
export const CAT_TR_FIELDS = ["name", "slug"];
export const catTopFields: Field[] = [{ name: "key", label: "Key (eindeutig)", type: "text" }];
export const catLocaleFields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
];
