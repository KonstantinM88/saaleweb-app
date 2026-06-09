import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "tooShort").max(120),
  email: z.email("invalidEmail"),
  company: z.string().max(160).optional().or(z.literal("")),
  message: z.string().min(10, "tooShort").max(2000),
  // Honeypot: must stay empty
  website: z.string().max(0).optional().or(z.literal("")),
  locale: z.enum(["de", "en", "ru"]).default("de"),
});

export type ContactInput = z.infer<typeof contactSchema>;
