import { randomUUID } from "node:crypto";

import { BlobError, del, get, list, put } from "@vercel/blob";

import {
  type MgsLocale,
  mgsProjects,
  type MgsProject,
  type MgsProjectBlock,
  type MgsProjectSeo,
} from "@/lib/mgs-project-data";

const PROJECTS_BLOB_PATH = "mgs-admin/projects.json";
const ENQUIRIES_BLOB_PREFIX = "mgs-admin/enquiries/";
const JSON_CONTENT_TYPE = "application/json; charset=utf-8";

const PROJECT_VISUALS = ["nava", "aria", "solo", "north"] as const;
const PROJECT_STATUSES = ["draft", "published"] as const;
const ENQUIRY_STATUSES = ["new", "contacted", "in_discussion", "accepted", "declined"] as const;

export type MgsAdminProjectStatus = (typeof PROJECT_STATUSES)[number];
export type MgsEnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export type MgsAdminProject = MgsProject & {
  status: MgsAdminProjectStatus;
  featured: boolean;
  updatedAt: string;
  publishedAt: string | null;
};

export type MgsEnquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  contact: string;
  projectType: string;
  budget: string;
  deadline: string;
  message: string;
  createdAt: string;
  status: MgsEnquiryStatus;
  blobPathname?: string;
  etag?: string;
};

export type CreateMgsEnquiryInput = Omit<
  MgsEnquiry,
  "id" | "createdAt" | "status" | "blobPathname" | "etag"
>;

export type MgsContentStoreStatus = {
  connected: boolean;
  issue: string | null;
};

type ReadPrivateJsonResult<T> = {
  data: T | null;
  etag: string | null;
  issue: string | null;
};

export class MgsContentStoreUnavailableError extends Error {
  constructor(message = "Vercel Blob is not connected.") {
    super(message);
    this.name = "MgsContentStoreUnavailableError";
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isLocaleRecord(value: unknown): value is Record<MgsLocale, string> {
  return isObject(value) && typeof value.ru === "string" && typeof value.en === "string";
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asLocaleText(value: unknown, fallback: Record<MgsLocale, string>) {
  if (!isLocaleRecord(value)) {
    return fallback;
  }

  return {
    ru: value.ru.trim(),
    en: value.en.trim(),
  };
}

function asLocalizedServices(
  value: unknown,
  fallback: Record<MgsLocale, string[]>,
): Record<MgsLocale, string[]> {
  if (!isObject(value) || !Array.isArray(value.ru) || !Array.isArray(value.en)) {
    return fallback;
  }

  const normalize = (items: unknown[]) =>
    items
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

  return {
    ru: normalize(value.ru),
    en: normalize(value.en),
  };
}

function asProjectSeo(value: unknown, fallback?: MgsProjectSeo): MgsProjectSeo | undefined {
  if (!isObject(value)) return fallback;
  const title = asLocaleText(value.title, fallback?.title ?? { ru: "", en: "" });
  const description = asLocaleText(value.description, fallback?.description ?? { ru: "", en: "" });
  const keywords = asLocalizedServices(value.keywords, fallback?.keywords ?? { ru: [], en: [] });
  return { title, description, keywords };
}

function asProjectBlock(
  value: unknown,
  fallback?: MgsProjectBlock,
): MgsProjectBlock | null {
  if (!isObject(value)) {
    return fallback ?? null;
  }

  const normalizedType = value.type === "text" ? "paragraph" : value.type;

  if (normalizedType !== "heading" && normalizedType !== "paragraph") {
    return fallback ?? null;
  }

  const content = isLocaleRecord(value.content)
    ? {
        ru: value.content.ru.trim(),
        en: value.content.en.trim(),
      }
    : isObject(value.translations) && isLocaleRecord(value.translations)
      ? {
          ru: value.translations.ru.trim(),
          en: value.translations.en.trim(),
        }
      : null;

  if (!content) {
    return fallback ?? null;
  }

  return {
    type: normalizedType,
    content,
  };
}

function buildSeedAdminProjects(): MgsAdminProject[] {
  return mgsProjects.map((project) => ({
    ...structuredClone(project),
    status: "published",
    featured: true,
    updatedAt: new Date(`${project.year}-01-01T00:00:00.000Z`).toISOString(),
    publishedAt: new Date(`${project.year}-01-01T00:00:00.000Z`).toISOString(),
  }));
}

function normalizeAdminProject(value: unknown, fallback?: MgsAdminProject): MgsAdminProject | null {
  if (!isObject(value)) {
    return fallback ?? null;
  }

  const title = asLocaleText(value.title, fallback?.title ?? { ru: "", en: "" });
  const summary = asLocaleText(value.summary, fallback?.summary ?? title);
  const client = asLocaleText(value.client, fallback?.client ?? title);
  const category = asLocaleText(value.category, fallback?.category ?? title);
  const industry = asLocaleText(value.industry, fallback?.industry ?? title);
  const discipline = asLocaleText(value.discipline, fallback?.discipline ?? title);
  const services = asLocalizedServices(value.services, fallback?.services ?? { ru: [], en: [] });
  const blocks = Array.isArray(value.blocks)
    ? value.blocks
        .map((block, index) => asProjectBlock(block, fallback?.blocks[index]))
        .filter((block): block is MgsProjectBlock => Boolean(block))
    : fallback?.blocks ?? [];
  const seo = asProjectSeo(value.seo, fallback?.seo);

  const slug = asString(value.slug, fallback?.slug ?? "");
  const sequence = asString(value.sequence, fallback?.sequence ?? "");
  const cover = asString(value.cover, fallback?.cover ?? "");
  const mark = asString(value.mark, fallback?.mark ?? "");
  const visualCandidate = typeof value.visual === "string" ? value.visual : null;
  const visual = PROJECT_VISUALS.find((item) => item === visualCandidate) ?? fallback?.visual;
  const statusCandidate = typeof value.status === "string" ? value.status : null;
  const status = PROJECT_STATUSES.find((item) => item === statusCandidate) ?? fallback?.status ?? "draft";

  if (
    !slug ||
    !sequence ||
    !cover ||
    !mark ||
    !visual ||
    !title.ru ||
    !title.en ||
    !summary.ru ||
    !summary.en ||
    !client.ru ||
    !client.en ||
    !category.ru ||
    !category.en ||
    !industry.ru ||
    !industry.en ||
    !discipline.ru ||
    !discipline.en
  ) {
    return fallback ?? null;
  }

  return {
    slug,
    sequence,
    visual,
    title,
    client,
    category,
    industry,
    discipline,
    services,
    year: asNumber(value.year, fallback?.year ?? new Date().getFullYear()),
    mark,
    cover,
    summary,
    blocks,
    ...(seo ? { seo } : {}),
    status,
    featured: asBoolean(value.featured, fallback?.featured ?? false),
    updatedAt: asString(value.updatedAt, fallback?.updatedAt ?? new Date().toISOString()),
    publishedAt:
      value.publishedAt === null
        ? null
        : asString(value.publishedAt, fallback?.publishedAt ?? "") || null,
  };
}

function normalizeEnquiry(value: unknown): MgsEnquiry | null {
  if (!isObject(value)) {
    return null;
  }

  const statusCandidate = typeof value.status === "string" ? value.status : null;
  const status = ENQUIRY_STATUSES.find((item) => item === statusCandidate) ?? null;

  const id = asString(value.id);
  const name = asString(value.name);
  const email = asString(value.email);
  const company = asString(value.company);
  const contact = asString(value.contact);
  const projectType = asString(value.projectType);
  const budget = asString(value.budget);
  const deadline = asString(value.deadline);
  const message = asString(value.message);
  const createdAt = asString(value.createdAt);

  if (!id || !name || !email || !message || !createdAt || !status) {
    return null;
  }

  return {
    id,
    name,
    email,
    company,
    contact,
    projectType,
    budget,
    deadline,
    message,
    createdAt,
    status,
  };
}

async function readBlobText(pathname: string) {
  const response = await get(pathname, { access: "private", useCache: false });

  if (!response) {
    return null;
  }

  if (response.statusCode !== 200 || !response.stream) {
    throw new Error(`Unable to read ${pathname}: Blob returned HTTP ${response.statusCode}.`);
  }

  return {
    text: await new Response(response.stream).text(),
    etag: response.blob.etag,
  };
}

async function readPrivateJson<T>(
  pathname: string,
  normalize: (value: unknown) => T | null,
): Promise<ReadPrivateJsonResult<T>> {
  try {
    const raw = await readBlobText(pathname);

    if (!raw) {
      return { data: null, etag: null, issue: null };
    }

    const parsed = JSON.parse(raw.text) as unknown;
    const normalized = normalize(parsed);

    if (!normalized) {
      return {
        data: null,
        etag: raw.etag,
        issue: `Stored JSON at ${pathname} is invalid.`,
      };
    }

    return {
      data: normalized,
      etag: raw.etag,
      issue: null,
    };
  } catch (error) {
    if (error instanceof BlobError && error.message.includes("404")) {
      return { data: null, etag: null, issue: null };
    }

    return {
      data: null,
      etag: null,
      issue: error instanceof Error ? error.message : `Unable to read ${pathname}.`,
    };
  }
}

function ensureBlobConnected() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new MgsContentStoreUnavailableError();
  }
}

async function writePrivateJson(pathname: string, value: unknown, etag?: string | null) {
  ensureBlobConnected();

  await put(pathname, JSON.stringify(value, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: JSON_CONTENT_TYPE,
    ifMatch: etag ?? undefined,
  });
}

async function listAllBlobs(prefix: string) {
  ensureBlobConnected();

  const blobs: Awaited<ReturnType<typeof list>>["blobs"] = [];
  let cursor: string | undefined;

  do {
    const response = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...response.blobs);
    cursor = response.hasMore ? response.cursor : undefined;
  } while (cursor);

  return blobs;
}

async function readStoredAdminProjects() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      projects: buildSeedAdminProjects(),
      status: {
        connected: false,
        issue: "Blob storage is not connected. Project edits stay disabled until BLOB_READ_WRITE_TOKEN is set.",
      } satisfies MgsContentStoreStatus,
      etag: null as string | null,
    };
  }

  const result = await readPrivateJson(PROJECTS_BLOB_PATH, (value) => {
    if (!Array.isArray(value)) {
      return null;
    }

    const seedBySlug = new Map(buildSeedAdminProjects().map((project) => [project.slug, project]));
    const projects = value
      .map((item) => normalizeAdminProject(item, seedBySlug.get(asString(isObject(item) ? item.slug : ""))))
      .filter((project): project is MgsAdminProject => Boolean(project));

    return projects.length ? projects : null;
  });

  if (!result.data && result.issue) {
    return {
      projects: [],
      status: {
        connected: false,
        issue: `Stored project data could not be read safely. ${result.issue}`,
      } satisfies MgsContentStoreStatus,
      etag: result.etag,
    };
  }

  if (!result.data) {
    return {
      projects: buildSeedAdminProjects(),
      status: {
        connected: true,
        issue:
          result.issue ??
          "No stored project data found yet. Seed projects are shown until the first save.",
      } satisfies MgsContentStoreStatus,
      etag: result.etag,
    };
  }

  return {
    projects: result.data,
    status: {
      connected: true,
      issue: result.issue,
    } satisfies MgsContentStoreStatus,
    etag: result.etag,
  };
}

function sortProjects(projects: readonly MgsAdminProject[]) {
  return [...projects].sort((left, right) => {
    const leftSequence = Number.parseInt(left.sequence, 10);
    const rightSequence = Number.parseInt(right.sequence, 10);

    if (Number.isFinite(leftSequence) && Number.isFinite(rightSequence) && leftSequence !== rightSequence) {
      return leftSequence - rightSequence;
    }

    return left.title.en.localeCompare(right.title.en);
  });
}

function slugDatePrefix(createdAt: string) {
  return createdAt.replace(/[:.]/g, "-");
}

export function getMgsContentStoreStatus(): MgsContentStoreStatus {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      connected: false,
      issue: "Blob storage is not connected. Add BLOB_READ_WRITE_TOKEN in Vercel to enable persistence.",
    };
  }

  return {
    connected: true,
    issue: null,
  };
}

export async function getMgsProjects(): Promise<readonly MgsProject[]> {
  const { projects } = await readStoredAdminProjects();

  return sortProjects(projects)
    .filter((project) => project.status === "published")
    .map((project) => ({
      slug: project.slug,
      sequence: project.sequence,
      visual: project.visual,
      title: project.title,
      client: project.client,
      category: project.category,
      industry: project.industry,
      discipline: project.discipline,
      services: project.services,
      year: project.year,
      mark: project.mark,
      cover: project.cover,
      summary: project.summary,
      blocks: project.blocks,
    }));
}

export function findMgsProject(projects: readonly MgsProject[], slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextMgsProject(projects: readonly MgsProject[], slug: string) {
  if (!projects.length) {
    throw new Error("No projects available.");
  }

  const index = projects.findIndex((project) => project.slug === slug);
  return index < 0 ? projects[0] : projects[(index + 1) % projects.length];
}

export async function listMgsAdminProjects() {
  const { projects, status } = await readStoredAdminProjects();

  return {
    projects: sortProjects(projects),
    status,
  };
}

export async function getMgsAdminProject(slug: string) {
  const { projects, status } = await readStoredAdminProjects();
  return {
    project: projects.find((item) => item.slug === slug) ?? null,
    status,
  };
}

export async function createMgsAdminProject(project: MgsAdminProject) {
  const current = await readStoredAdminProjects();
  const existing = current.projects.find((item) => item.slug === project.slug);

  if (existing) {
    throw new Error("Project slug already exists.");
  }

  const nextProjects = sortProjects([...current.projects, project]);
  await writePrivateJson(PROJECTS_BLOB_PATH, nextProjects, current.etag);
  return project;
}

export async function saveMgsAdminProject(currentSlug: string, project: MgsAdminProject) {
  const current = await readStoredAdminProjects();
  const index = current.projects.findIndex((item) => item.slug === currentSlug);

  if (index < 0) {
    throw new Error("Project not found.");
  }

  const duplicate = current.projects.find((item) => item.slug === project.slug && item.slug !== currentSlug);

  if (duplicate) {
    throw new Error("Project slug already exists.");
  }

  const nextProjects = [...current.projects];
  nextProjects[index] = project;
  const sortedProjects = sortProjects(nextProjects);
  await writePrivateJson(PROJECTS_BLOB_PATH, sortedProjects, current.etag);
  return project;
}

export async function deleteMgsAdminProject(slug: string) {
  const current = await readStoredAdminProjects();
  const nextProjects = current.projects.filter((item) => item.slug !== slug);

  if (nextProjects.length === current.projects.length) {
    throw new Error("Project not found.");
  }

  await writePrivateJson(PROJECTS_BLOB_PATH, nextProjects, current.etag);
}

export async function listMgsEnquiries() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      enquiries: [] as MgsEnquiry[],
      status: {
        connected: false,
        issue: "Blob storage is not connected. New enquiries cannot be saved on Vercel yet.",
      } satisfies MgsContentStoreStatus,
    };
  }

  const blobs = await listAllBlobs(ENQUIRIES_BLOB_PREFIX);
  const pendingRecords = await Promise.all(
    blobs.map(async (blob): Promise<MgsEnquiry | null> => {
      const result = await readPrivateJson(blob.pathname, normalizeEnquiry);

      if (!result.data) {
        return null;
      }

      return {
        ...result.data,
        blobPathname: blob.pathname,
        etag: result.etag ?? blob.etag,
      } satisfies MgsEnquiry;
    }),
  );
  const records = pendingRecords.filter((record): record is MgsEnquiry => record !== null);

  return {
    enquiries: records.sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    status: {
      connected: true,
      issue: null,
    } satisfies MgsContentStoreStatus,
  };
}

export async function createMgsEnquiry(input: CreateMgsEnquiryInput) {
  ensureBlobConnected();

  const createdAt = new Date().toISOString();
  const enquiry: MgsEnquiry = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company.trim(),
    contact: input.contact.trim(),
    projectType: input.projectType.trim(),
    budget: input.budget.trim(),
    deadline: input.deadline.trim(),
    message: input.message.trim(),
    createdAt,
    status: "new",
  };
  const pathname = `${ENQUIRIES_BLOB_PREFIX}${slugDatePrefix(createdAt)}-${enquiry.id}.json`;

  await writePrivateJson(pathname, enquiry);

  return {
    ...enquiry,
    blobPathname: pathname,
  };
}

export async function updateMgsEnquiryStatus(id: string, status: MgsEnquiryStatus) {
  const { enquiries } = await listMgsEnquiries();
  const enquiry = enquiries.find((item) => item.id === id);

  if (!enquiry?.blobPathname) {
    throw new Error("Enquiry not found.");
  }

  const nextEnquiry = {
    ...enquiry,
    status,
  };

  await writePrivateJson(
    enquiry.blobPathname,
    {
      id: nextEnquiry.id,
      name: nextEnquiry.name,
      email: nextEnquiry.email,
      company: nextEnquiry.company,
      contact: nextEnquiry.contact,
      projectType: nextEnquiry.projectType,
      budget: nextEnquiry.budget,
      deadline: nextEnquiry.deadline,
      message: nextEnquiry.message,
      createdAt: nextEnquiry.createdAt,
      status: nextEnquiry.status,
    },
    enquiry.etag,
  );

  return nextEnquiry;
}

export async function removeMgsEnquiry(id: string) {
  const { enquiries } = await listMgsEnquiries();
  const enquiry = enquiries.find((item) => item.id === id);

  if (!enquiry?.blobPathname) {
    throw new Error("Enquiry not found.");
  }

  ensureBlobConnected();
  await del(enquiry.blobPathname, enquiry.etag ? { ifMatch: enquiry.etag } : undefined);
}
