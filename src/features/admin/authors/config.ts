import type { Field } from "@/widgets/admin/GenericForm";
export const AUTHOR_TR_FIELDS = ["role", "bio"];
export const authorTopFields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "avatarUrl", label: "Avatar", type: "image", hint: "400×400 px", maxWidth: 600 },
];
export const authorLocaleFields: Field[] = [
  { name: "role", label: "Rolle", type: "text" },
  { name: "bio", label: "Bio", type: "textarea" },
];
