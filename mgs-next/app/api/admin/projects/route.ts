import { NextResponse } from "next/server";

import { getMgsAdminAccessState } from "@/lib/mgs-admin-auth";
import { createMgsAdminProject, listMgsAdminProjects, type MgsAdminProject } from "@/lib/mgs-content-store";

export const runtime = "nodejs";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildNewProject(payload: Record<string, unknown>, existingProjects: readonly MgsAdminProject[]): MgsAdminProject {
  const slug = slugify(typeof payload.slug === "string" ? payload.slug : "");
  const titleRu = typeof payload.titleRu === "string" ? payload.titleRu.trim() : "";
  const titleEn = typeof payload.titleEn === "string" ? payload.titleEn.trim() : "";
  const year = typeof payload.year === "string" ? Number(payload.year) : new Date().getFullYear();
  const visual = payload.visual === "aria" || payload.visual === "solo" || payload.visual === "north" ? payload.visual : "nava";

  if (!slug || !titleRu || !titleEn || !Number.isFinite(year)) {
    throw new Error("slug, bilingual title, and year are required.");
  }

  const sequenceNumber = existingProjects.reduce((max, project) => {
    const current = Number.parseInt(project.sequence, 10);
    return Number.isFinite(current) ? Math.max(max, current) : max;
  }, 0) + 1;

  return {
    slug,
    sequence: String(sequenceNumber).padStart(2, "0"),
    visual,
    title: { ru: titleRu, en: titleEn },
    client: { ru: titleRu, en: titleEn },
    category: { ru: "Проект", en: "Project" },
    industry: { ru: "Индустрия", en: "Industry" },
    discipline: { ru: "Кейс", en: "Case Study" },
    services: { ru: [], en: [] },
    year,
    mark: titleEn.charAt(0).toUpperCase() || "M",
    cover: `/projects/${slug}-cover.webp`,
    summary: {
      ru: "Новый проект. Добавьте описание и структуру кейса.",
      en: "New project. Add the summary and case-study structure.",
    },
    blocks: [
      { type: "heading", content: { ru: titleRu, en: titleEn } },
      { type: "paragraph", content: { ru: "Добавьте вводный абзац для кейса.", en: "Add the opening paragraph for the case study." } },
    ],
    status: "draft",
    featured: false,
    updatedAt: new Date().toISOString(),
    publishedAt: null,
  };
}

export async function GET() {
  const access = await getMgsAdminAccessState();

  if (!access.setup.authConfigured) {
    return NextResponse.json({ error: "Admin auth is not configured.", setup: access.setup }, { status: 503 });
  }

  if (!access.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json(await listMgsAdminProjects());
}

export async function POST(request: Request) {
  const access = await getMgsAdminAccessState();

  if (!access.setup.authConfigured) {
    return NextResponse.json({ error: "Admin auth is not configured.", setup: access.setup }, { status: 503 });
  }

  if (!access.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const projectsData = await listMgsAdminProjects();

  if (!projectsData.status.connected) {
    return NextResponse.json({ error: projectsData.status.issue ?? "Blob storage is not connected." }, { status: 503 });
  }

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const project = buildNewProject(body ?? {}, projectsData.projects);
    await createMgsAdminProject(project);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create the project." },
      { status: 400 },
    );
  }
}
