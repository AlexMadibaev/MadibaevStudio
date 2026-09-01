import { NextResponse } from "next/server";

import { getMgsAdminAccessState } from "@/lib/mgs-admin-auth";
import { listMgsAdminProjects, listMgsEnquiries } from "@/lib/mgs-content-store";

export const runtime = "nodejs";

export async function GET() {
  const access = await getMgsAdminAccessState();

  if (!access.setup.authConfigured) {
    return NextResponse.json({ error: "Admin auth is not configured.", setup: access.setup }, { status: 503 });
  }

  if (!access.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const [projectsData, enquiriesData] = await Promise.all([listMgsAdminProjects(), listMgsEnquiries()]);

  return NextResponse.json({
    setup: access.setup,
    projects: projectsData.projects,
    projectStorage: projectsData.status,
    enquiries: enquiriesData.enquiries,
    enquiryStorage: enquiriesData.status,
  });
}
