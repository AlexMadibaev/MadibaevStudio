import { NextResponse } from "next/server";

import {
  authenticateMgsAdminPassword,
  createMgsAdminSessionCookie,
  getMgsAdminAccessState,
  getMgsAdminCookieOptions,
  getMgsAdminSetupStatus,
  MGS_ADMIN_COOKIE_NAME,
} from "@/lib/mgs-admin-auth";
import { clearRateLimit, getRequestIp, rateLimitHeaders, takeRateLimit } from "@/lib/mgs-rate-limit";

export const runtime = "nodejs";

const LOGIN_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 } as const;
const MAX_LOGIN_BODY_BYTES = 4 * 1024;

function clearCookie(response: NextResponse) {
  const options = getMgsAdminCookieOptions(Date.now());
  response.cookies.set({ ...options, name: MGS_ADMIN_COOKIE_NAME, value: "", expires: new Date(0), maxAge: 0 });
}

export async function GET() {
  return NextResponse.json(await getMgsAdminAccessState());
}

export async function POST(request: Request) {
  const setup = getMgsAdminSetupStatus();
  if (!setup.authConfigured) {
    return NextResponse.json({ error: `Missing environment variables: ${setup.missingAuthEnv.join(", ")}.` }, { status: 503 });
  }

  const ip = getRequestIp(request);
  const key = `admin-login:${ip}`;
  const limit = takeRateLimit(key, LOGIN_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_LOGIN_BODY_BYTES) {
    return NextResponse.json({ error: "Invalid request." }, { status: 413, headers: rateLimitHeaders(limit) });
  }

  const text = await request.text().catch(() => "");
  if (Buffer.byteLength(text, "utf8") > MAX_LOGIN_BODY_BYTES) {
    return NextResponse.json({ error: "Invalid request." }, { status: 413, headers: rateLimitHeaders(limit) });
  }

  let body: { password?: string } | null = null;
  try { body = JSON.parse(text) as { password?: string }; } catch { body = null; }
  const password = typeof body?.password === "string" ? body.password : "";

  if (!authenticateMgsAdminPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return NextResponse.json({ error: "Invalid password." }, { status: 401, headers: rateLimitHeaders(limit) });
  }

  clearRateLimit(key);
  const session = createMgsAdminSessionCookie();
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set({ ...getMgsAdminCookieOptions(session.expiresAt), value: session.token });
  return response;
}

export async function DELETE() {
  const response = new NextResponse(null, { status: 204 });
  clearCookie(response);
  return response;
}
