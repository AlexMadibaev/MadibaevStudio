import { NextResponse } from "next/server";

import { getMgsAdminAccessState } from "@/lib/mgs-admin-auth";
import { deleteMgsAdminProject, getMgsAdminProject, saveMgsAdminProject, type MgsAdminProject } from "@/lib/mgs-content-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

function normalizeProjectPayload(payload: Record<string, unknown>, current: MgsAdminProject): MgsAdminProject {
  const localized = (key: string, fallback: { ru: string; en: string }) => {
    const value = payload[key];
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return fallback;
    }

    const source = value as Record<string, unknown>;
    return {
      ru: typeof source.ru === "string" ? source.ru.trim() : fallback.ru,
      en: typeof source.en === "string" ? source.en.trim() : fallback.en,
    };
  };

  const servicesSource = payload.services;
  const services =
    servicesSource && typeof servicesSource === "object" && !Array.isArray(servicesSource)
      ? {
          ru: Array.isArray((servicesSource as Record<string, unknown>).ru)
            ? ((servicesSource as Record<string, unknown>).ru as unknown[]).map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean)
            : current.services.ru,
          en: Array.isArray((servicesSource as Record<string, unknown>).en)
            ? ((servicesSource as Record<string, unknown>).en as unknown[]).map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean)
            : current.services.en,
        }
      : current.services;

  const blocks = Array.isArray(payload.blocks)
    ? payload.blocks
        .map((block) => {
          if (!block || typeof block !== "object" || Array.isArray(block)) return null;
          const source = block as Record<string, unknown>;
          const content = source.content;
          if (!content || typeof content !== "object" || Array.isArray(content)) return null;
          const localizedContent = content as Record<string, unknown>;
          const type = source.type === "heading" ? "heading" : source.type === "paragraph" ? "paragraph" : null;

          if (!type) return null;

          return {
            type,
            content: {
              ru: typeof localizedContent.ru === "string" ? localizedContent.ru.trim() : "",
              en: typeof localizedContent.en === "string" ? localizedContent.en.trim() : "",
            },
          };
        })
        .filter((block): block is { type: "heading" | "paragraph"; content: { ru: string; en: string } } => Boolean(block))
    : current.blocks;

  const nextStatus = payload.status === "published" ? "published" : payload.status === "draft" ? "draft" : current.status;

  return {
    slug: typeof payload.slug === "string" && payload.slug.trim() ? payload.slug.trim() : current.slug,
    sequence: typeof payload.sequence === "string" && payload.sequence.trim() ? payload.sequence.trim() : current.sequence,
    visual:
      payload.visual === "aria" || payload.visual === "solo" || payload.visual === "north" || payload.visual === "nava"
        ? payload.visual
        : current.visual,
    title: localized("title", current.title),
    client: localized("client", current.client),
    category: localized("category", current.category),
    industry: localized("industry", current.industry),
    discipline: localized("discipline", current.discipline),
    services,
    year: typeof payload.year === "number" && Number.isFinite(payload.year) ? payload.year : current.year,
    mark: typeof payload.mark === "string" && payload.mark.trim() ? payload.mark.trim() : current.mark,
    cover: typeof payload.cover === "string" && payload.cover.trim() ? payload.cover.trim() : current.cover,
    summary: localized("summary", current.summary),
    blocks,
    status: nextStatus,
    featured: typeof payload.featured === "boolean" ? payload.featured : current.featured,
    updatedAt: new Date().toISOString(),
    publishedAt: nextStatus === "published" ? current.publishedAt ?? new Date().toISOString() : null,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const access = await getMgsAdminAccessState();
  const { slug } = await context.params;

  if (!access.setup.authConfigured) {
    return NextResponse.json({ error: "Admin auth is not configured.", setup: access.setup }, { status: 503 });
  }

  if (!access.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const projectData = await getMgsAdminProject(slug);

  if (!projectData.project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json(projectData);
}

export async function PATCH(request: Request, context: RouteContext) {
  const access = await getMgsAdminAccessState();
  const { slug } = await context.params;

  if (!access.setup.authConfigured) {
    return NextResponse.json({ error: "Admin auth is not configured.", setup: access.setup }, { status: 503 });
  }

  if (!access.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const projectData = await getMgsAdminProject(slug);

  if (!projectData.status.connected) {
    return NextResponse.json({ error: projectData.status.issue ?? "Blob storage is not connected." }, { status: 503 });
  }

  if (!projectData.project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const project = normalizeProjectPayload(body ?? {}, projectData.project);
    const saved = await saveMgsAdminProject(slug, project);
    return NextResponse.json({ project: saved });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save the project." },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const access = await getMgsAdminAccessState();
  const { slug } = await context.params;

  if (!access.setup.authConfigured) {
    return NextResponse.json({ error: "Admin auth is not configured.", setup: access.setup }, { status: 503 });
  }

  if (!access.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const projectData = await getMgsAdminProject(slug);

  if (!projectData.status.connected) {
    return NextResponse.json({ error: projectData.status.issue ?? "Blob storage is not connected." }, { status: 503 });
  }

  try {
    await deleteMgsAdminProject(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete the project." },
      { status: 400 },
    );
  }
}
