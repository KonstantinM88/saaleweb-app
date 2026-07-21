import { getIndexNowKey } from "@/features/seo/indexNow";

export const dynamic = "force-dynamic";

export function GET() {
  const key = getIndexNowKey();
  if (!key) {
    return new Response("IndexNow is not configured.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
