import { NextResponse } from "next/server";

import { getMgsAdminSetupStatus } from "@/lib/mgs-admin-auth";
import {
  buildMgsGoogleAuthorizationUrl,
  createMgsGoogleOAuthAttempt,
  getMgsGoogleOAuthConfig,
  getMgsGoogleOAuthCookieOptions,
  MGS_GOOGLE_STATE_COOKIE,
  MGS_GOOGLE_VERIFIER_COOKIE,
} from "@/lib/mgs-google-oauth";
import { getRequestIp, rateLimitHeaders, takeRateLimit } from "@/lib/mgs-rate-limit";

export const runtime = "nodejs";

const GOOGLE_LOGIN_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 } as const;

export async function GET(request: Request) {
  const setup = getMgsAdminSetupStatus();
  if (!setup.authConfigured) {
    return NextResponse.json(
      { error: `Missing environment variables: ${setup.missingAuthEnv.join(", ")}.` },
      { status: 503 },
    );
  }

  const limit = takeRateLimit(`admin-google-start:${getRequestIp(request)}`, GOOGLE_LOGIN_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Try again later." },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  const config = getMgsGoogleOAuthConfig();
  const attempt = createMgsGoogleOAuthAttempt();
  const response = NextResponse.redirect(buildMgsGoogleAuthorizationUrl(config, attempt.state, attempt.challenge));
  const cookieOptions = getMgsGoogleOAuthCookieOptions();

  response.cookies.set({ ...cookieOptions, name: MGS_GOOGLE_STATE_COOKIE, value: attempt.state });
  response.cookies.set({ ...cookieOptions, name: MGS_GOOGLE_VERIFIER_COOKIE, value: attempt.verifier });
  return response;
}
