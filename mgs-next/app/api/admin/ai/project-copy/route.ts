import { NextResponse } from "next/server";

import { getMgsAdminAccessState } from "@/lib/mgs-admin-auth";
import { getRequestIp, rateLimitHeaders, takeRateLimit } from "@/lib/mgs-rate-limit";

type Mode = "questions" | "seo" | "copywriter";
type Locale = "ru" | "en" | "both";

const MAX_BODY_BYTES = 64 * 1024;
const MAX_PROJECT_JSON = 40_000;
const MAX_ANSWERS_JSON = 8_000;
const AI_LIMIT = { limit: 12, windowMs: 15 * 60_000 } as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isMode(value: unknown): value is Mode {
  return value === "questions" || value === "seo" || value === "copywriter";
}

function isLocale(value: unknown): value is Locale {
  return value === "ru" || value === "en" || value === "both";
}

function jsonSize(value: unknown) {
  try {
    return Buffer.byteLength(JSON.stringify(value), "utf8");
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

function boundedString(value: unknown, max: number) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function isLocaleText(value: unknown, max: number) {
  return (
    isObject(value) &&
    boundedString(value.ru, max) &&
    boundedString(value.en, max)
  );
}

function isStringList(value: unknown, maxItems: number, maxItemLength: number) {
  return (
    Array.isArray(value) &&
    value.length <= maxItems &&
    value.every((item) => typeof item === "string" && item.length <= maxItemLength)
  );
}

function normalizeAnswers(value: unknown) {
  if (!isObject(value)) return {} as Record<string, string>;
  const entries = Object.entries(value).slice(0, 8);
  const normalized: Record<string, string> = {};
  for (const [key, answer] of entries) {
    if (!/^[a-z0-9_-]{1,40}$/i.test(key)) continue;
    if (typeof answer !== "string" || answer.length > 1200) continue;
    normalized[key] = answer.trim();
  }
  return normalized;
}

function validateAiResult(mode: Mode, value: unknown, project: Record<string, unknown>) {
  if (!isObject(value)) return false;

  if (mode === "questions") {
    if (!Array.isArray(value.questions) || value.questions.length !== 3) return false;
    return value.questions.every((question) => {
      if (!isObject(question)) return false;
      return (
        boundedString(question.id, 40) &&
        boundedString(question.question, 280) &&
        (question.placeholder === undefined || question.placeholder === "" || boundedString(question.placeholder, 240))
      );
    });
  }

  if (mode === "seo") {
    if (!isObject(value.seo)) return false;
    return (
      isLocaleText(value.seo.title, 90) &&
      isLocaleText(value.seo.description, 220) &&
      isObject(value.seo.keywords) &&
      isStringList(value.seo.keywords.ru, 12, 80) &&
      isStringList(value.seo.keywords.en, 12, 80)
    );
  }

  if (!isObject(value.copy)) return false;
  if (!isLocaleText(value.copy.title, 180) || !isLocaleText(value.copy.summary, 1200)) return false;
  if (!Array.isArray(value.copy.blocks)) return false;

  const sourceBlocks = Array.isArray(project.blocks) ? project.blocks : [];
  if (value.copy.blocks.length !== sourceBlocks.length) return false;

  return value.copy.blocks.every((block, index) => {
    if (!isObject(block)) return false;
    const expected = sourceBlocks[index];
    const expectedType = isObject(expected) && (expected.type === "heading" || expected.type === "paragraph")
      ? expected.type
      : null;
    const type = block.type === "heading" || block.type === "paragraph" ? block.type : null;
    const content = isObject(block.content)
      ? block.content
      : isObject(block.translations)
        ? block.translations
        : null;
    return Boolean(type && expectedType && type === expectedType && isLocaleText(content, 6000));
  });
}

export async function POST(request: Request) {
  const access = await getMgsAdminAccessState();
  if (!access.authenticated) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const ip = getRequestIp(request);
  const limit = takeRateLimit(`admin-ai:${ip}`, AI_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "AI request limit reached. Try again later." },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "AI request payload is too large." },
      { status: 413, headers: rateLimitHeaders(limit) },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured." },
      { status: 503, headers: rateLimitHeaders(limit) },
    );
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const mode = body?.mode;
  const locale = body?.locale ?? "both";
  const project = isObject(body?.project) ? body.project : null;
  const answers = normalizeAnswers(body?.answers);

  if (
    !project ||
    !isMode(mode) ||
    !isLocale(locale) ||
    jsonSize(project) > MAX_PROJECT_JSON ||
    jsonSize(answers) > MAX_ANSWERS_JSON
  ) {
    return NextResponse.json(
      { error: "Invalid AI request." },
      { status: 400, headers: rateLimitHeaders(limit) },
    );
  }

  const output = mode === "questions"
    ? { questions: [{ id: "goal", question: "", placeholder: "" }, { id: "audience", question: "", placeholder: "" }, { id: "proof", question: "", placeholder: "" }] }
    : mode === "seo"
      ? { seo: { title: { ru: "", en: "" }, description: { ru: "", en: "" }, keywords: { ru: [], en: [] } } }
      : { copy: { title: { ru: "", en: "" }, summary: { ru: "", en: "" }, blocks: [] } };

  const system = `You are an expert bilingual SEO strategist and copywriter for Madibaev Graphic Studio, a premium design studio. Return ONLY valid JSON matching the requested schema. Write natural, specific copy; never invent clients, results, awards, or facts. Locale: ${locale}.`;
  const user = mode === "questions"
    ? `Ask 3 short, practical questions that will improve the project ${body?.target === "copywriter" ? "copywriting" : "SEO metadata"}. Use ids goal, audience, proof. Do not ask for facts already present. Schema: ${JSON.stringify(output)}. Project: ${JSON.stringify(project)}`
    : mode === "seo"
      ? `Create SEO metadata for this project. Keep title under 60 characters, descriptions 140-160 characters, and 5-8 relevant keywords per language. Use the owner's answers as strategic context: ${JSON.stringify(answers)}. Schema: ${JSON.stringify(output)}. Project: ${JSON.stringify(project)}`
      : `Improve the project copy without changing facts. Return a concise bilingual title, summary, and the existing narrative blocks with the same types and count. Use the owner's answers as strategic context: ${JSON.stringify(answers)}. Schema: ${JSON.stringify(output)}. Project: ${JSON.stringify(project)}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://madibaevstudio.online",
      "X-Title": "MGS Admin AI",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 2400,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "OpenRouter request failed." },
      { status: 502, headers: rateLimitHeaders(limit) },
    );
  }

  const data = (await response.json().catch(() => null)) as { choices?: Array<{ message?: { content?: string } }> } | null;
  const content = data?.choices?.[0]?.message?.content;
  if (!content || content.length > 80_000) {
    return NextResponse.json(
      { error: "The AI returned an invalid response." },
      { status: 502, headers: rateLimitHeaders(limit) },
    );
  }

  try {
    const result = JSON.parse(content) as unknown;
    if (!validateAiResult(mode, result, project)) throw new Error("Invalid result schema");
    return NextResponse.json(result, { headers: rateLimitHeaders(limit) });
  } catch {
    return NextResponse.json(
      { error: "The AI returned data that did not match the expected schema." },
      { status: 502, headers: rateLimitHeaders(limit) },
    );
  }
}
