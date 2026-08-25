import Link from "next/link";

import { MgsAdminPanel, MgsAdminShell, MgsAdminStatCard } from "@/components/mgs-admin-shell";
import { getMgsAdminSetupStatus } from "@/lib/mgs-admin-auth";
import { getMgsContentStoreStatus, listMgsAdminProjects, listMgsEnquiries } from "@/lib/mgs-content-store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [projectsData, enquiriesData] = await Promise.all([listMgsAdminProjects(), listMgsEnquiries()]);
  const setupStatus = getMgsAdminSetupStatus();
  const storageStatus = projectsData.status.connected ? projectsData.status : getMgsContentStoreStatus();
  const published = projectsData.projects.filter((project) => project.status === "published");
  const drafts = projectsData.projects.filter((project) => project.status === "draft");
  const featured = projectsData.projects.filter((project) => project.featured);
  const freshEnquiries = enquiriesData.enquiries.filter((enquiry) => enquiry.status === "new");

  return (
    <MgsAdminShell
      actions={
        <div className="flex flex-wrap gap-2">
          <Link className="inline-flex items-center gap-2 rounded-full bg-[#0b57d0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0847ad]" href="/admin/projects/new">
            <span aria-hidden="true" className="text-lg leading-none">+</span> Project
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-full border border-[#20242b] bg-white px-4 py-2.5 text-sm font-semibold text-[#20242b] transition hover:bg-[#f4f5f7]" href="/admin/enquiries">
            Inbox <span aria-hidden="true">→</span>
          </Link>
        </div>
      }
      description="One surface for the live portfolio library, public case-study content, and inbound enquiries from the website."
      section="dashboard"
      setupStatus={setupStatus}
      storageStatus={storageStatus}
      title="Admin dashboard"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MgsAdminStatCard detail="Projects currently visible on the public site." label="Published work" value={published.length} />
        <MgsAdminStatCard detail="Entries still waiting for publication." label="Draft queue" value={drafts.length} />
        <MgsAdminStatCard detail="Cards highlighted on the homepage and selected work." label="Featured cases" value={featured.length} />
        <MgsAdminStatCard detail="Fresh enquiries from the public contact form." label="New enquiries" value={freshEnquiries.length} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.95fr]">
        <MgsAdminPanel
          description="These entries define the public `/work` pages and every live case-study detail route."
          eyebrow="Content"
          title="Recent projects"
        >
          <div className="grid gap-3">
            {projectsData.projects.slice(0, 4).map((project) => (
              <Link
                className="flex flex-col gap-3 rounded-xl border border-[#e5e7eb] bg-white p-4 transition hover:border-[#b8c9e8] hover:shadow-sm md:flex-row md:items-center md:justify-between"
                href={`/admin/projects/${project.slug}`}
                key={project.slug}
              >
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8b9099]">
                    {project.sequence} / {project.category.en} / {project.year}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#17181c]">{project.title.en}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#737982]">{project.summary.en}</p>
                </div>
                <span className="rounded-full border border-[#dbe5f5] bg-[#f3f7ff] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#0b57d0]">
                  {project.status}
                </span>
              </Link>
            ))}
          </div>
        </MgsAdminPanel>

        <MgsAdminPanel
          description="Every public enquiry is stored as its own private blob record to avoid write collisions."
          eyebrow="Inbox"
          title="Latest enquiries"
        >
          <div className="grid gap-3">
            {enquiriesData.enquiries.slice(0, 4).map((enquiry) => (
                <article className="rounded-xl border border-[#e5e7eb] bg-white p-4" key={enquiry.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#dbe5f5] bg-[#f3f7ff] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#0b57d0]">
                    {enquiry.status}
                  </span>
                  <span className="rounded-full border border-[#e5e7eb] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#737982]">
                    {new Date(enquiry.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#17181c]">{enquiry.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#737982]">{enquiry.email}</p>
                <p className="mt-3 text-sm leading-7 text-[#454952]">{enquiry.message}</p>
              </article>
            ))}
            {!enquiriesData.enquiries.length ? (
              <p className="rounded-xl border border-[#e5e7eb] bg-white p-4 text-sm leading-6 text-[#737982]">No enquiries yet.</p>
            ) : null}
          </div>
        </MgsAdminPanel>
      </div>
    </MgsAdminShell>
  );
}
