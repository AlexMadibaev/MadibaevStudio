import Link from "next/link";

import { MgsAdminProjectCreateForm } from "@/components/mgs-admin-project-create-form";
import { MgsAdminPanel, MgsAdminShell, MgsAdminStatCard } from "@/components/mgs-admin-shell";
import { getMgsAdminSetupStatus } from "@/lib/mgs-admin-auth";
import { listMgsAdminProjects } from "@/lib/mgs-content-store";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const setupStatus = getMgsAdminSetupStatus();
  const projectsData = await listMgsAdminProjects();
  const published = projectsData.projects.filter((project) => project.status === "published");
  const featured = projectsData.projects.filter((project) => project.featured);

  return (
    <MgsAdminShell
      description="Create and maintain the project cards that feed the homepage, the work archive, and every public case-study route."
      section="projects"
      setupStatus={setupStatus}
      storageStatus={projectsData.status}
      title="Project library"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MgsAdminStatCard detail="All known case-study entries." label="Total projects" value={projectsData.projects.length} />
        <MgsAdminStatCard detail="Currently visible on the public website." label="Published" value={published.length} />
        <MgsAdminStatCard detail="Pinned into the selected-work experience." label="Featured" value={featured.length} />
      </div>

      <MgsAdminPanel
        description="Create a new entry first, then open it to edit bilingual copy, cover, services, and block structure."
        eyebrow="Create"
        title="Add project"
      >
        <MgsAdminProjectCreateForm disabled={!projectsData.status.connected} />
      </MgsAdminPanel>

      <MgsAdminPanel
        description="Each card opens a full editor page."
        eyebrow="Library"
        title="Current entries"
      >
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {projectsData.projects.map((project) => (
            <Link
              className="group rounded-[30px] border border-white/10 bg-black/20 p-5 transition hover:border-white/18 hover:bg-white/[0.04]"
              href={`/admin/projects/${project.slug}`}
              key={project.slug}
            >
              <div
                aria-hidden="true"
                className="relative mb-5 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#151518] bg-cover bg-center"
                style={{ backgroundImage: `url(${project.cover})` }}
              >
                <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/10" />
                <span className="relative text-7xl font-semibold tracking-[-0.12em] text-white/90 drop-shadow-[0_8px_28px_rgba(0,0,0,0.45)]">
                  {project.mark}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#c6b798]">{project.status}</span>
                {project.featured ? (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#c6b798]">featured</span>
                ) : null}
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-[#fff7ee]">{project.title.en}</h3>
              <p className="mt-2 text-sm leading-6 text-[#dcc9b4]">{project.summary.en}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-[#c6b798]">
                <span>{project.sequence}</span>
                <span>{project.year}</span>
                <span>{project.visual}</span>
              </div>
              <p className="mt-5 text-sm font-medium text-[#fff7ee] transition group-hover:text-white">Open editor</p>
            </Link>
          ))}
        </div>
      </MgsAdminPanel>
    </MgsAdminShell>
  );
}
