import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VIDEO_PATH = join(
  process.cwd(),
  "public",
  "images",
  "sections",
  "premium-saas-technology.webm",
);
const ETAG = '"premium-saas-technology-v1"';
const CACHE_CONTROL = "public, max-age=31536000, immutable";

function baseHeaders(size: number) {
  return new Headers({
    "Accept-Ranges": "bytes",
    "Cache-Control": CACHE_CONTROL,
    "Content-Length": String(size),
    "Content-Type": "video/webm",
    ETag: ETAG,
  });
}

function parseSingleRange(value: string | null, size: number) {
  if (!value) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match) return undefined;

  const [, startValue, endValue] = match;
  if (!startValue && !endValue) return undefined;

  let start: number;
  let end: number;

  if (!startValue) {
    const suffixLength = Number(endValue);
    if (!Number.isInteger(suffixLength) || suffixLength <= 0) return undefined;
    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  } else {
    start = Number(startValue);
    end = endValue ? Number(endValue) : size - 1;
  }

  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    start >= size ||
    end < start
  ) {
    return undefined;
  }

  return { start, end: Math.min(end, size - 1) };
}

export async function HEAD(request: Request) {
  const { size } = await stat(VIDEO_PATH);
  const headers = baseHeaders(size);

  if (request.headers.get("if-none-match") === ETAG) {
    headers.delete("Content-Length");
    return new Response(null, { status: 304, headers });
  }

  return new Response(null, { status: 200, headers });
}

export async function GET(request: Request) {
  const { size } = await stat(VIDEO_PATH);
  const headers = baseHeaders(size);

  if (request.headers.get("if-none-match") === ETAG) {
    headers.delete("Content-Length");
    return new Response(null, { status: 304, headers });
  }

  const range = parseSingleRange(request.headers.get("range"), size);
  if (range === undefined) {
    headers.set("Content-Range", `bytes */${size}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }

  const file = await readFile(VIDEO_PATH);
  if (!range) {
    return new Response(new Uint8Array(file), { status: 200, headers });
  }

  const body = file.subarray(range.start, range.end + 1);
  headers.set("Content-Length", String(body.byteLength));
  headers.set("Content-Range", `bytes ${range.start}-${range.end}/${size}`);

  return new Response(new Uint8Array(body), { status: 206, headers });
}
