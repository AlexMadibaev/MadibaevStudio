import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { createMgsEnquiry, MgsContentStoreUnavailableError } from "@/lib/mgs-content-store";
import { getRequestIp, rateLimitHeaders, takeRateLimit } from "@/lib/mgs-rate-limit";
import { verifyTurnstile } from "@/lib/mgs-turnstile";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 12 * 1024;
const ENQUIRY_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 } as const;

function normalizeField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  const ip = getRequestIp(request);
  const limit = takeRateLimit(`enquiry:${ip}`, ENQUIRY_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many enquiries. Please try again later." },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  let rawText = "";
  try {
    rawText = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  let rawPayload: unknown;
  try {
    rawPayload = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const source = rawPayload && typeof rawPayload === "object" ? rawPayload as Record<string, unknown> : {};

  // Honeypot: pretend success so simple bots do not learn how the trap works.
  if (normalizeField(source.website)) {
    return NextResponse.json({ id: randomUUID() }, { status: 201, headers: rateLimitHeaders(limit) });
  }

  const startedAt = typeof source.formStartedAt === "number" ? source.formStartedAt : 0;
  if (startedAt > 0 && Date.now() - startedAt < 1200) {
    return NextResponse.json({ error: "Please wait a moment and try again." }, { status: 400, headers: rateLimitHeaders(limit) });
  }

  const turnstile = await verifyTurnstile(normalizeField(source.turnstileToken), ip);
  if (!turnstile.ok) {
    return NextResponse.json(
      { error: "Spam protection verification failed." },
      { status: 403, headers: rateLimitHeaders(limit) },
    );
  }

  const payload = {
    name: normalizeField(source.name),
    email: normalizeField(source.email),
    company: normalizeField(source.company),
    contact: normalizeField(source.contact),
    projectType: normalizeField(source.projectType),
    budget: normalizeField(source.budget),
    deadline: normalizeField(source.deadline),
    message: normalizeField(source.message),
  };

  if (!payload.name || !payload.email || !payload.message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400, headers: rateLimitHeaders(limit) });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400, headers: rateLimitHeaders(limit) });
  }

  if (
    payload.name.length > 120 || payload.email.length > 160 || payload.company.length > 160 ||
    payload.contact.length > 120 || payload.projectType.length > 80 || payload.budget.length > 120 ||
    payload.deadline.length > 120 || payload.message.length > 4000
  ) {
    return NextResponse.json({ error: "Enquiry is too long." }, { status: 400, headers: rateLimitHeaders(limit) });
  }

  try {
    const enquiry = await createMgsEnquiry(payload);
    return NextResponse.json({ id: enquiry.id }, { status: 201, headers: rateLimitHeaders(limit) });
  } catch (error) {
    if (error instanceof MgsContentStoreUnavailableError) {
      return NextResponse.json({ error: "The enquiry service is not configured yet." }, { status: 503, headers: rateLimitHeaders(limit) });
    }
    return NextResponse.json({ error: "The enquiry service is temporarily unavailable." }, { status: 502, headers: rateLimitHeaders(limit) });
  }
}
