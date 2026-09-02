import { NextResponse } from "next/server";

import {
  getMgsAdminAccessState,
  getMgsAdminCookieOptions,
  MGS_ADMIN_COOKIE_NAME,
} from "@/lib/mgs-admin-auth";

export const runtime = "nodejs";

function clearCookie(response: NextResponse) {
  const options = getMgsAdminCookieOptions(Date.now());
  response.cookies.set({ ...options, name: MGS_ADMIN_COOKIE_NAME, value: "", expires: new Date(0), maxAge: 0 });
}

export async function GET() {
  return NextResponse.json(await getMgsAdminAccessState());
}

export async function POST() {
  return NextResponse.json(
    { error: "Password login is disabled. Use the authorized Google account." },
    { status: 405, headers: { Allow: "GET, DELETE" } },
  );
}

export async function DELETE() {
  const response = new NextResponse(null, { status: 204 });
  clearCookie(response);
  return response;
}
