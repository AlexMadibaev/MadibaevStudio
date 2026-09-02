import { createHash, randomBytes } from "node:crypto";

import { shouldUseMgsSecureCookie } from "@/lib/mgs-admin-auth";

export const MGS_GOOGLE_STATE_COOKIE = "mgs_google_oauth_state";
export const MGS_GOOGLE_VERIFIER_COOKIE = "mgs_google_oauth_verifier";
export const MGS_GOOGLE_OAUTH_MAX_AGE = 10 * 60;

const GOOGLE_AUTHORIZATION_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
export const GOOGLE_USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";

export type MgsGoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

function requiredEnv(name: "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET") {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}.`);
  return value;
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://madibaevstudio.online").replace(/\/$/, "");
}

export function getMgsGoogleOAuthConfig(): MgsGoogleOAuthConfig {
  return {
    clientId: requiredEnv("GOOGLE_CLIENT_ID"),
    clientSecret: requiredEnv("GOOGLE_CLIENT_SECRET"),
    redirectUri: process.env.GOOGLE_REDIRECT_URI?.trim() || `${siteUrl()}/api/admin/google/callback`,
  };
}

export function createMgsGoogleOAuthAttempt() {
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { state, verifier, challenge };
}

export function buildMgsGoogleAuthorizationUrl(config: MgsGoogleOAuthConfig, state: string, challenge: string) {
  const url = new URL(GOOGLE_AUTHORIZATION_ENDPOINT);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("access_type", "online");
  url.searchParams.set("prompt", "select_account");
  return url;
}

export function getMgsGoogleOAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: shouldUseMgsSecureCookie(),
    path: "/api/admin/google",
    maxAge: MGS_GOOGLE_OAUTH_MAX_AGE,
  };
}
