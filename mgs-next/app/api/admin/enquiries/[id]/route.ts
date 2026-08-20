import { NextResponse } from "next/server";

import { getMgsAdminAccessState } from "@/lib/mgs-admin-auth";
import { updateMgsEnquiryStatus } from "@/lib/mgs-content-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const access = await getMgsAdminAccessState();
  const { id } = await context.params;

  if (!access.setup.authConfigured) {
    return NextResponse.json({ error: "Admin auth is not configured.", setup: access.setup }, { status: 503 });
  }

  if (!access.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { status?: string } | null;

  if (
    body?.status !== "new" &&
    body?.status !== "contacted" &&
    body?.status !== "in_discussion" &&
    body?.status !== "accepted" &&
    body?.status !== "declined"
  ) {
    return NextResponse.json({ error: "Invalid enquiry status." }, { status: 400 });
  }

  try {
    const enquiry = await updateMgsEnquiryStatus(id, body.status);
    return NextResponse.json({ enquiry });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update the enquiry." },
      { status: 400 },
    );
  }
}
