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
    storage: projectsData.status.connected ? projectsData.status : enquiriesData.status,
    counts: {
      totalProjects: projectsData.projects.length,
      publishedProjects: projectsData.projects.filter((project) => project.status === "published").length,
      draftProjects: projectsData.projects.filter((project) => project.status === "draft").length,
      featuredProjects: projectsData.projects.filter((project) => project.featured).length,
      totalEnquiries: enquiriesData.enquiries.length,
      newEnquiries: enquiriesData.enquiries.filter((enquiry) => enquiry.status === "new").length,
    },
    projects: projectsData.projects.slice(0, 6),
    enquiries: enquiriesData.enquiries.slice(0, 6),
  });
}
