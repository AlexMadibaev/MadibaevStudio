import { NextResponse } from "next/server";

import { getMgsAdminAccessState } from "@/lib/mgs-admin-auth";
import { deleteMgsMediaFile, listMgsMediaFiles, saveMgsMediaFile } from "@/lib/mgs-media-store";

export const runtime = "nodejs";

async function requireAdmin() {
  const access = await getMgsAdminAccessState();
  return access.authenticated;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const files = await listMgsMediaFiles();
    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to read media library." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 27 * 1024 * 1024) {
    return NextResponse.json({ error: "Upload is too large." }, { status: 413 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "File is required." }, { status: 400 });
    const saved = await saveMgsMediaFile(file);
    return NextResponse.json({ file: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload file." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const path = new URL(request.url).searchParams.get("path")?.trim();
  if (!path) return NextResponse.json({ error: "Media path is required." }, { status: 400 });

  try {
    await deleteMgsMediaFile(path);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    return NextResponse.json(
      { error: code === "ENOENT" ? "File not found." : "Unable to delete file." },
      { status: code === "ENOENT" ? 404 : 400 },
    );
  }
}
