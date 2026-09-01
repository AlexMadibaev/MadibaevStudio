import { extname } from "node:path";

import { NextResponse } from "next/server";

import { getMgsMediaContentType, readMgsMediaFile } from "@/lib/mgs-media-store";

export const runtime = "nodejs";

const INLINE_MEDIA = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".mp4", ".webm", ".mov", ".pdf"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const relativePath = path.join("/");
  const extension = extname(relativePath).toLowerCase();

  try {
    const buffer = await readMgsMediaFile(relativePath);
    const headers: Record<string, string> = {
      "Content-Type": getMgsMediaContentType(relativePath),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `${INLINE_MEDIA.has(extension) ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(path.at(-1) || "file")}`,
    };

    if (extension === ".svg") {
      // Uploaded SVGs are allowed as design assets but sandboxed if opened as a document.
      headers["Content-Security-Policy"] = "sandbox; default-src 'none'; style-src 'unsafe-inline'";
    }

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    return new NextResponse(code === "ENOENT" ? "Not found" : "Media unavailable", {
      status: code === "ENOENT" ? 404 : 503,
    });
  }
}
