import type { Field } from "@/widgets/admin/GenericForm";
export const PROJCAT_TR_FIELDS = ["name"];
export const projCatTopFields: Field[] = [{ name: "key", label: "Key (eindeutig)", type: "text" }];
export const projCatLocaleFields: Field[] = [{ name: "name", label: "Name", type: "text" }];
