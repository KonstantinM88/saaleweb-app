import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#FF4FA3",
          purple: "#8B5CF6",
        },
        dark: "#111827",
        ink: "#1F2937",
        muted: "#6B7280",
        success: "#10B981",
        warning: "#F59E0B",
        surface: "#F8FAFC",
        line: "#E5E7EB",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        brand: "linear-gradient(110deg, #FF4FA3 0%, #8B5CF6 100%)",
        "brand-soft": "linear-gradient(110deg, rgba(255,79,163,0.12), rgba(139,92,246,0.12))",
      },
      maxWidth: {
        container: "1180px",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(17,24,39,0.18)",
        lift: "0 30px 60px -20px rgba(17,24,39,0.28)",
      },
      keyframes: {
        bob: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-9px)" },
        },
      },
      animation: {
        bob: "bob 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
