import { ImageResponse } from "next/og";
import { siteConfig } from "@/shared/config/site";

export const runtime = "edge";

const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Loads a Google font subset that contains exactly the glyphs we render,
 * so any language (incl. Cyrillic) is covered by a single TTF. The old
 * User-Agent forces Google to return a TTF (not woff2) for Satori.
 */
async function loadGoogleFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Inter:wght@700&text=${encodeURIComponent(text)}`;
    const css = await (
      await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1; rv:6.0) Gecko/20110814 Firefox/6.0",
        },
      })
    ).text();
    const src = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:opentype|truetype)'\)/);
    if (!src) return null;
    return await (await fetch(src[1])).arrayBuffer();
  } catch {
    return null;
  }
}

async function loadFont(text: string): Promise<ArrayBuffer> {
  const googleFont = await loadGoogleFont(text);
  if (googleFont) return googleFont;
  return fetch(new URL("./Geist-Bold.ttf", import.meta.url)).then((res) => res.arrayBuffer());
}

function OgMark() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M42.8 16.6C37.3 10.8 24.8 12.2 20.9 20.4C15.3 32 44.4 27.8 42.5 40.4C40.8 51.9 25 53.2 17.4 44.1"
        fill="none"
        stroke="rgba(17,24,39,0.2)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="9.4"
        transform="translate(1.2 1.5)"
      />
      <path
        d="M42.8 16.6C37.3 10.8 24.8 12.2 20.9 20.4C15.3 32 44.4 27.8 42.5 40.4C40.8 51.9 25 53.2 17.4 44.1"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8.2"
      />
      <circle cx="43" cy="16.4" r="3.1" fill="#fff" />
      <circle cx="17.5" cy="44.2" r="2.5" fill="#fff" opacity=".72" />
    </svg>
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? siteConfig.name).slice(0, 120);
  const eyebrow = (searchParams.get("eyebrow") ?? "").slice(0, 60);

  const font = await loadFont(`${title}${eyebrow}${siteConfig.name}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #FF4FA3 0%, #8B5CF6 100%)",
          color: "white",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            <OgMark />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {eyebrow ? (
            <div style={{ fontSize: 26, opacity: 0.85, textTransform: "uppercase", letterSpacing: 2 }}>
              {eyebrow}
            </div>
          ) : null}
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
        </div>

        <div style={{ fontSize: 24, opacity: 0.85 }}>
          Websites · SEO · KI — Halle, Leipzig &amp; Saalekreis
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [{ name: "Inter", data: font, weight: 700, style: "normal" }],
    },
  );
}
