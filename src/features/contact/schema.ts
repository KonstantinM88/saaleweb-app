import { z } from "zod";

export const contactSchema = z
  .object({
    name: z.string().min(2, "tooShort").max(120),
    email: z.email("invalidEmail"),
    phone: z.string().max(80).optional().or(z.literal("")),
    company: z.string().max(160).optional().or(z.literal("")),
    projectWebsite: z.string().max(240).optional().or(z.literal("")),
    projectType: z.string().max(120).optional().or(z.literal("")),
    budget: z.string().max(120).optional().or(z.literal("")),
    message: z.string().max(2000).optional().or(z.literal("")),
    privacy: z.string().optional().or(z.literal("")),
    // Honeypot: must stay empty
    website: z.string().max(0).optional().or(z.literal("")),
    // Ad-campaign attribution (utm_* / referrer), filled client-side
    utm: z.string().max(400).optional().or(z.literal("")),
    locale: z.enum(["de", "en", "ru"]).default("de"),
    source: z.enum(["homepage_contact", "contact_page", "website_audit"]).default("homepage_contact"),
  })
  .superRefine((data, ctx) => {
    if (data.source !== "website_audit" && (!data.message || data.message.trim().length < 10)) {
      ctx.addIssue({
        code: "custom",
        path: ["message"],
        message: "tooShort",
      });
    }

    if (data.source === "website_audit" && !data.projectWebsite?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["projectWebsite"],
        message: "tooShort",
      });
    }

    if (data.source === "contact_page" && data.privacy !== "accepted") {
      ctx.addIssue({
        code: "custom",
        path: ["privacy"],
        message: "privacyRequired",
      });
    }
  });

export type ContactInput = z.infer<typeof contactSchema>;
