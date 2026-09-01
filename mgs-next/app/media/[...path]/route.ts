import { NextResponse } from "next/server";

import { getMgsMediaContentType, readMgsMediaFile } from "@/lib/mgs-media-store";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const relativePath = path.join("/");

  try {
    const buffer = await readMgsMediaFile(relativePath);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": getMgsMediaContentType(relativePath),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    return new NextResponse(code === "ENOENT" ? "Not found" : "Media unavailable", {
      status: code === "ENOENT" ? 404 : 503,
    });
  }
}
