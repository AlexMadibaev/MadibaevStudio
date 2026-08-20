import { notFound } from "next/navigation";

import { MgsAdminProjectEditor } from "@/components/mgs-admin-project-editor";
import { MgsAdminPanel, MgsAdminShell } from "@/components/mgs-admin-shell";
import { getMgsAdminSetupStatus } from "@/lib/mgs-admin-auth";
import { getMgsAdminProject } from "@/lib/mgs-content-store";

export const dynamic = "force-dynamic";

type AdminProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminProjectDetailPage({ params }: AdminProjectDetailPageProps) {
  const { slug } = await params;
  const setupStatus = getMgsAdminSetupStatus();
  const projectData = await getMgsAdminProject(slug);

  if (!projectData.project) {
    notFound();
  }

  return (
    <MgsAdminShell
      description="Maintain the bilingual public case-study payload that feeds `/work`, homepage cards, and project metadata."
      section="projects"
      setupStatus={setupStatus}
      storageStatus={projectData.status}
      title={projectData.project.title.en}
    >
      <MgsAdminPanel
        description="All edits here go through the Next admin API and, when Blob is connected, persist directly into the deployed Vercel runtime."
        eyebrow="Editor"
        title="Project details"
      >
        <MgsAdminProjectEditor disabled={!projectData.status.connected} project={projectData.project} />
      </MgsAdminPanel>
    </MgsAdminShell>
  );
}
