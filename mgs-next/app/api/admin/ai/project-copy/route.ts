import { NextResponse } from "next/server";

import { getMgsAdminAccessState } from "@/lib/mgs-admin-auth";

type Mode = "seo" | "copywriter";
type Locale = "ru" | "en" | "both";

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function POST(request: Request) {
  const access = await getMgsAdminAccessState();
  if (!access.authenticated) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OPENROUTER_API_KEY is not configured." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const mode = body?.mode as Mode;
  const locale = (body?.locale as Locale) || "both";
  const project = isObject(body?.project) ? body.project : null;
  if (!project || (mode !== "seo" && mode !== "copywriter") || !["ru", "en", "both"].includes(locale)) {
    return NextResponse.json({ error: "Invalid AI request." }, { status: 400 });
  }

  const output = mode === "seo"
    ? { seo: { title: { ru: "", en: "" }, description: { ru: "", en: "" }, keywords: { ru: [], en: [] } } }
    : { copy: { title: { ru: "", en: "" }, summary: { ru: "", en: "" }, blocks: [] } };
  const system = `You are an expert bilingual SEO strategist and copywriter for Madibaev Graphic Studio, a premium design studio. Return ONLY valid JSON matching the requested schema. Write natural, specific copy; never invent clients, results, awards, or facts. Locale: ${locale}.`;
  const user = mode === "seo"
    ? `Create SEO metadata for this project. Keep title under 60 characters, descriptions 140-160 characters, and 5-8 relevant keywords per language. Schema: ${JSON.stringify(output)}. Project: ${JSON.stringify(project)}`
    : `Improve the project copy without changing facts. Return a concise bilingual title, summary, and the existing narrative blocks with the same types and count. Schema: ${JSON.stringify(output)}. Project: ${JSON.stringify(project)}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://mgs.studio", "X-Title": "MGS Admin AI" },
    body: JSON.stringify({ model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini", temperature: 0.5, response_format: { type: "json_object" }, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
  });
  if (!response.ok) return NextResponse.json({ error: "OpenRouter request failed." }, { status: 502 });
  const data = (await response.json().catch(() => null)) as { choices?: Array<{ message?: { content?: string } }> } | null;
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return NextResponse.json({ error: "The AI returned an empty response." }, { status: 502 });
  try {
    const result = JSON.parse(content);
    if (!isObject(result)) throw new Error("Invalid result");
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "The AI returned invalid JSON." }, { status: 502 });
  }
}
