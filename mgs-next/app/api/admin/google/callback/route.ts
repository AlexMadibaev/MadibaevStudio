import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  createMgsAdminSessionCookie,
  getMgsAdminCookieOptions,
  isMgsAdminGoogleEmailAllowed,
  MGS_ADMIN_COOKIE_NAME,
  safeCompareText,
} from "@/lib/mgs-admin-auth";
import {
  getMgsGoogleOAuthConfig,
  getMgsGoogleOAuthCookieOptions,
  GOOGLE_TOKEN_ENDPOINT,
  GOOGLE_USERINFO_ENDPOINT,
  MGS_GOOGLE_STATE_COOKIE,
  MGS_GOOGLE_VERIFIER_COOKIE,
} from "@/lib/mgs-google-oauth";
import { getRequestIp, takeRateLimit } from "@/lib/mgs-rate-limit";

export const runtime = "nodejs";

const GOOGLE_CALLBACK_LIMIT = { limit: 20, windowMs: 10 * 60 * 1000 } as const;

type GoogleTokenResponse = {
  access_token?: string;
  token_type?: string;
};

type GoogleUserInfo = {
  email?: string;
  email_verified?: boolean;
  sub?: string;
};

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://madibaevstudio.online").replace(/\/$/, "");
}

function redirectToLogin(error: string) {
  const url = new URL("/admin/login", siteUrl());
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

function clearOAuthCookies(response: NextResponse) {
  const options = getMgsGoogleOAuthCookieOptions();
  response.cookies.set({ ...options, name: MGS_GOOGLE_STATE_COOKIE, value: "", expires: new Date(0), maxAge: 0 });
  response.cookies.set({ ...options, name: MGS_GOOGLE_VERIFIER_COOKIE, value: "", expires: new Date(0), maxAge: 0 });
}

function fail(error: string) {
  const response = redirectToLogin(error);
  clearOAuthCookies(response);
  return response;
}

export async function GET(request: Request) {
  const limit = takeRateLimit(`admin-google-callback:${getRequestIp(request)}`, GOOGLE_CALLBACK_LIMIT);
  if (!limit.allowed) return fail("rate_limited");

  const requestUrl = new URL(request.url);
  if (requestUrl.searchParams.get("error")) return fail("cancelled");

  const code = requestUrl.searchParams.get("code") || "";
  const returnedState = requestUrl.searchParams.get("state") || "";
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(MGS_GOOGLE_STATE_COOKIE)?.value || "";
  const verifier = cookieStore.get(MGS_GOOGLE_VERIFIER_COOKIE)?.value || "";

  if (!code || !returnedState || !expectedState || !verifier || !safeCompareText(returnedState, expectedState)) {
    return fail("invalid_state");
  }

  try {
    const config = getMgsGoogleOAuthConfig();
    const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        code_verifier: verifier,
        grant_type: "authorization_code",
        redirect_uri: config.redirectUri,
      }),
      cache: "no-store",
    });

    const token = (await tokenResponse.json().catch(() => null)) as GoogleTokenResponse | null;
    if (!tokenResponse.ok || !token?.access_token) return fail("oauth_failed");

    const userResponse = await fetch(GOOGLE_USERINFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: "no-store",
    });
    const user = (await userResponse.json().catch(() => null)) as GoogleUserInfo | null;

    if (!userResponse.ok || !user?.email || user.email_verified !== true || !user.sub) {
      return fail("identity_failed");
    }

    if (!isMgsAdminGoogleEmailAllowed(user.email)) {
      return fail("not_allowed");
    }

    const session = createMgsAdminSessionCookie(user.email);
    const response = NextResponse.redirect(new URL("/admin", siteUrl()));
    response.cookies.set({
      ...getMgsAdminCookieOptions(session.expiresAt),
      name: MGS_ADMIN_COOKIE_NAME,
      value: session.token,
    });
    clearOAuthCookies(response);
    return response;
  } catch {
    return fail("oauth_failed");
  }
}
