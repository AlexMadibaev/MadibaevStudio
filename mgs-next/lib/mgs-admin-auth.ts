import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

export const MGS_ADMIN_COOKIE_NAME = "mgs_admin_session";
export const MGS_ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

type MgsAdminAuthEnvKey =
  | "ADMIN_SESSION_SECRET"
  | "ADMIN_GOOGLE_EMAIL"
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET";

type MgsAdminSessionPayload = {
  email: string;
  exp: number;
  iat: number;
  nonce: string;
};

export type MgsAdminSession = {
  email: string;
  expiresAt: string;
  issuedAt: string;
};

export type MgsAdminSetupStatus = {
  authConfigured: boolean;
  storageConnected: boolean;
  missingAuthEnv: readonly MgsAdminAuthEnvKey[];
};

export type MgsAdminAccessState =
  | {
      authenticated: false;
      session: null;
      setup: MgsAdminSetupStatus;
    }
  | {
      authenticated: true;
      session: MgsAdminSession;
      setup: MgsAdminSetupStatus;
    };

function readEnv(name: MgsAdminAuthEnvKey) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function hasPersistentStorage() {
  return Boolean(process.env.MGS_DATA_DIR?.trim() || process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

export function safeCompareText(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function parseSessionToken(token: string, secret: string): MgsAdminSessionPayload | null {
  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload, secret);

  if (!safeCompareText(providedSignature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as Partial<MgsAdminSessionPayload>;

    if (
      typeof payload.email !== "string" ||
      typeof payload.exp !== "number" ||
      typeof payload.iat !== "number" ||
      typeof payload.nonce !== "string" ||
      payload.exp <= Date.now() ||
      !isMgsAdminGoogleEmailAllowed(payload.email)
    ) {
      return null;
    }

    return {
      email: normalizeEmail(payload.email),
      exp: payload.exp,
      iat: payload.iat,
      nonce: payload.nonce,
    };
  } catch {
    return null;
  }
}

function createSessionToken(secret: string, email: string) {
  const issuedAt = Date.now();
  const payload: MgsAdminSessionPayload = {
    email: normalizeEmail(email),
    exp: issuedAt + MGS_ADMIN_SESSION_MAX_AGE * 1000,
    iat: issuedAt,
    nonce: randomUUID(),
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));

  return {
    token: `${encodedPayload}.${signPayload(encodedPayload, secret)}`,
    payload,
  };
}

export function shouldUseMgsSecureCookie() {
  const explicit = process.env.MGS_COOKIE_SECURE?.trim().toLowerCase();

  if (explicit === "true" || explicit === "1") return true;
  if (explicit === "false" || explicit === "0") return false;

  return (
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") === true
  );
}

export function getMgsAdminSetupStatus(): MgsAdminSetupStatus {
  const missingAuthEnv = ([
    "ADMIN_SESSION_SECRET",
    "ADMIN_GOOGLE_EMAIL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ] as const).filter((key) => !readEnv(key));

  return {
    authConfigured: missingAuthEnv.length === 0,
    storageConnected: hasPersistentStorage(),
    missingAuthEnv,
  };
}

export async function getMgsAdminAccessState(): Promise<MgsAdminAccessState> {
  const setup = getMgsAdminSetupStatus();

  if (!setup.authConfigured) {
    return {
      authenticated: false,
      session: null,
      setup,
    };
  }

  const secret = readEnv("ADMIN_SESSION_SECRET");
  const cookieStore = await cookies();
  const token = cookieStore.get(MGS_ADMIN_COOKIE_NAME)?.value;

  if (!secret || !token) {
    return {
      authenticated: false,
      session: null,
      setup,
    };
  }

  const payload = parseSessionToken(token, secret);

  if (!payload) {
    return {
      authenticated: false,
      session: null,
      setup,
    };
  }

  return {
    authenticated: true,
    session: {
      email: payload.email,
      expiresAt: new Date(payload.exp).toISOString(),
      issuedAt: new Date(payload.iat).toISOString(),
    },
    setup,
  };
}

export function isMgsAdminGoogleEmailAllowed(email: string) {
  const expectedEmail = readEnv("ADMIN_GOOGLE_EMAIL");

  if (!expectedEmail) {
    return false;
  }

  return safeCompareText(normalizeEmail(email), normalizeEmail(expectedEmail));
}

export function createMgsAdminSessionCookie(email: string) {
  const secret = readEnv("ADMIN_SESSION_SECRET");

  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET.");
  }

  if (!isMgsAdminGoogleEmailAllowed(email)) {
    throw new Error("Google account is not allowed to open the admin panel.");
  }

  const { token, payload } = createSessionToken(secret, email);

  return {
    token,
    expiresAt: payload.exp,
  };
}

export function getMgsAdminCookieOptions(expiresAt: number) {
  return {
    name: MGS_ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: shouldUseMgsSecureCookie(),
    path: "/",
    expires: new Date(expiresAt),
    maxAge: MGS_ADMIN_SESSION_MAX_AGE,
  };
}
