import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.email("invalidEmail").max(254),
  locale: z.enum(["de", "en", "ru"]).default("de"),
  // Honeypot: bots may fill this, but the action handles it without storing data.
  website: z.string().optional().default(""),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
