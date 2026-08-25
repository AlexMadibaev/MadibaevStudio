import { notFound } from "next/navigation";
import Link from "next/link";

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
      actions={
        projectData.project.status === "published" ? (
          <div className="flex flex-wrap gap-2">
            <Link
              className="inline-flex min-h-10 items-center rounded-full border border-white/12 bg-white/[0.05] px-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#f8efe5] transition hover:border-white/25 hover:bg-white/[0.1]"
              href={`/work/${projectData.project.slug}?lang=ru`}
              target="_blank"
            >
              RU preview
            </Link>
            <Link
              className="inline-flex min-h-10 items-center rounded-full bg-[#f8efe5] px-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#111113] transition hover:bg-white"
              href={`/work/${projectData.project.slug}?lang=en`}
              target="_blank"
            >
              EN preview
            </Link>
          </div>
        ) : (
          <span className="inline-flex min-h-10 items-center rounded-full border border-amber-300/20 bg-amber-400/10 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-amber-100">
            Publish to preview
          </span>
        )
      }
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
