import { NextResponse } from "next/server";

import {
  authenticateMgsAdminPassword,
  createMgsAdminSessionCookie,
  getMgsAdminAccessState,
  getMgsAdminCookieOptions,
  getMgsAdminSetupStatus,
  MGS_ADMIN_COOKIE_NAME,
} from "@/lib/mgs-admin-auth";

export const runtime = "nodejs";

function clearCookie(response: NextResponse) {
  response.cookies.set({
    name: MGS_ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}

export async function GET() {
  return NextResponse.json(await getMgsAdminAccessState());
}

export async function POST(request: Request) {
  const setup = getMgsAdminSetupStatus();

  if (!setup.authConfigured) {
    return NextResponse.json(
      { error: `Missing environment variables: ${setup.missingAuthEnv.join(", ")}.` },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (!authenticateMgsAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const session = createMgsAdminSessionCookie();
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set({
    ...getMgsAdminCookieOptions(session.expiresAt),
    value: session.token,
  });

  return response;
}

export async function DELETE() {
  const response = new NextResponse(null, { status: 204 });
  clearCookie(response);
  return response;
}
