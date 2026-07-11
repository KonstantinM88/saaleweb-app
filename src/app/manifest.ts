import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${siteConfig.name} — Websites, SEO & KI`,
    short_name: siteConfig.name,
    description:
      "Digitales Studio für moderne Websites, SEO und KI — aus Halle (Saale) für ganz Deutschland.",
    start_url: "/",
    scope: "/",
    lang: "de",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#8B5CF6",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
