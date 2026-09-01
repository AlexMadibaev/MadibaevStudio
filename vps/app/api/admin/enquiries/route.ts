import { NextResponse } from "next/server";

import { getMgsAdminAccessState } from "@/lib/mgs-admin-auth";
import { listMgsEnquiries } from "@/lib/mgs-content-store";

export const runtime = "nodejs";

export async function GET() {
  const access = await getMgsAdminAccessState();

  if (!access.setup.authConfigured) {
    return NextResponse.json({ error: "Admin auth is not configured.", setup: access.setup }, { status: 503 });
  }

  if (!access.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json(await listMgsEnquiries());
}
