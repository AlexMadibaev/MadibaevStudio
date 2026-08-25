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
          <Link className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(100deg,#159bd3,#e5097f,#ffcf32)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(229,9,127,0.2)] transition hover:brightness-110" href="/admin/projects/new">
            <span aria-hidden="true" className="text-lg leading-none">+</span> Project
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-[#fff7ee] transition hover:bg-white/[0.08]" href="/admin/enquiries">
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
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-white/[0.05] md:flex-row md:items-center md:justify-between"
                href={`/admin/projects/${project.slug}`}
                key={project.slug}
              >
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#a99c90]">
                    {project.sequence} / {project.category.en} / {project.year}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#fff7ee]">{project.title.en}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#b7aa9d]">{project.summary.en}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#c6b798]">
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
                <article className="rounded-xl border border-white/10 bg-black/20 p-4" key={enquiry.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#c6b798]">
                    {enquiry.status}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#a99c90]">
                    {new Date(enquiry.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#fff7ee]">{enquiry.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#b7aa9d]">{enquiry.email}</p>
                <p className="mt-3 text-sm leading-7 text-[#efe1cf]">{enquiry.message}</p>
              </article>
            ))}
            {!enquiriesData.enquiries.length ? (
              <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-[#b7aa9d]">No enquiries yet.</p>
            ) : null}
          </div>
        </MgsAdminPanel>
      </div>
    </MgsAdminShell>
  );
}
