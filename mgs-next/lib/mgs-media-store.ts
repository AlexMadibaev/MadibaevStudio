import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { basename, extname, relative, resolve, sep } from "node:path";

const MEDIA_ROOT = "media";
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg",
  ".mp4", ".webm", ".mov",
  ".pdf", ".zip", ".txt", ".doc", ".docx", ".ppt", ".pptx",
]);

export type MgsMediaFile = {
  path: string;
  url: string;
  name: string;
  extension: string;
  size: number;
  updatedAt: string;
  isImage: boolean;
};

function dataRoot() {
  const configured = process.env.MGS_DATA_DIR?.trim();
  if (!configured) throw new Error("MGS_DATA_DIR is not configured.");
  return resolve(configured);
}

function mediaRoot() {
  return resolve(dataRoot(), MEDIA_ROOT);
}

function safeAbsolute(relativePath: string) {
  const root = mediaRoot();
  const normalized = relativePath.replace(/^\/+/, "").split("/").filter(Boolean).join(sep);
  const target = resolve(root, normalized);
  if (target !== root && !target.startsWith(`${root}${sep}`)) throw new Error("Invalid media path.");
  return target;
}

function slugifyFilename(filename: string) {
  const extension = extname(filename).toLowerCase();
  const base = basename(filename, extname(filename))
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "file";
  return { base, extension };
}

function publicPath(relativePath: string) {
  return `/media/${relativePath.split(sep).join("/")}`;
}

function isImageExtension(extension: string) {
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(extension);
}

export async function listMgsMediaFiles(): Promise<MgsMediaFile[]> {
  const root = mediaRoot();
  const files: MgsMediaFile[] = [];

  async function walk(directory: string) {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
      throw error;
    }

    await Promise.all(entries.map(async (entry) => {
      const absolute = resolve(directory, entry.name);
      if (entry.isDirectory()) return walk(absolute);
      if (!entry.isFile()) return;
      const info = await stat(absolute);
      const rel = relative(root, absolute);
      const extension = extname(entry.name).toLowerCase();
      files.push({
        path: rel.split(sep).join("/"),
        url: publicPath(rel),
        name: entry.name,
        extension,
        size: info.size,
        updatedAt: info.mtime.toISOString(),
        isImage: isImageExtension(extension),
      });
    }));
  }

  await walk(root);
  return files.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveMgsMediaFile(file: File): Promise<MgsMediaFile> {
  if (!file.size || file.size > MAX_UPLOAD_BYTES) throw new Error("File must be between 1 byte and 25 MB.");
  const { base, extension } = slugifyFilename(file.name || "file");
  if (!ALLOWED_EXTENSIONS.has(extension)) throw new Error(`Unsupported file type: ${extension || "unknown"}.`);

  const now = new Date();
  const folder = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const name = `${base}-${randomUUID().slice(0, 8)}${extension}`;
  const rel = `${folder}/${name}`;
  const target = safeAbsolute(rel);
  await mkdir(resolve(mediaRoot(), folder), { recursive: true });
  await writeFile(target, Buffer.from(await file.arrayBuffer()), { mode: 0o644 });
  const info = await stat(target);

  return {
    path: rel,
    url: publicPath(rel),
    name,
    extension,
    size: info.size,
    updatedAt: info.mtime.toISOString(),
    isImage: isImageExtension(extension),
  };
}

export async function deleteMgsMediaFile(relativePath: string) {
  const target = safeAbsolute(relativePath);
  await unlink(target);
}

export async function readMgsMediaFile(relativePath: string) {
  const target = safeAbsolute(relativePath);
  return readFile(target);
}

export function getMgsMediaContentType(relativePath: string) {
  const extension = extname(relativePath).toLowerCase();
  const types: Record<string, string> = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
    ".gif": "image/gif", ".svg": "image/svg+xml; charset=utf-8", ".mp4": "video/mp4",
    ".webm": "video/webm", ".mov": "video/quicktime", ".pdf": "application/pdf", ".zip": "application/zip",
    ".txt": "text/plain; charset=utf-8", ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };
  return types[extension] ?? "application/octet-stream";
}
