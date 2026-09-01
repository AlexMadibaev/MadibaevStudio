import { MgsAdminEnquiryList } from "@/components/mgs-admin-enquiry-list";
import { MgsAdminPanel, MgsAdminShell, MgsAdminStatCard } from "@/components/mgs-admin-shell";
import { getMgsAdminSetupStatus } from "@/lib/mgs-admin-auth";
import { listMgsEnquiries } from "@/lib/mgs-content-store";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const setupStatus = getMgsAdminSetupStatus();
  const enquiriesData = await listMgsEnquiries();

  return (
    <MgsAdminShell
      description="Lead tracking for the public contact form. Status updates write back through the same deployed Next application."
      section="enquiries"
      setupStatus={setupStatus}
      storageStatus={enquiriesData.status}
      title="Enquiries"
    >
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <MgsAdminStatCard detail="All website enquiries received so far." label="Total" value={enquiriesData.enquiries.length} />
        <MgsAdminStatCard detail="Waiting for first response." label="New" value={enquiriesData.enquiries.filter((item) => item.status === "new").length} />
        <MgsAdminStatCard detail="Already contacted." label="Contacted" value={enquiriesData.enquiries.filter((item) => item.status === "contacted").length} />
        <MgsAdminStatCard detail="Active pipeline conversations." label="In discussion" value={enquiriesData.enquiries.filter((item) => item.status === "in_discussion").length} />
        <MgsAdminStatCard detail="Accepted opportunities." label="Accepted" value={enquiriesData.enquiries.filter((item) => item.status === "accepted").length} />
      </div>

      <MgsAdminPanel
        description="Each enquiry is stored as a separate private record to prevent contact-form writes from clobbering each other."
        eyebrow="Pipeline"
        title="Lead management"
      >
        <MgsAdminEnquiryList disabled={!enquiriesData.status.connected} enquiries={enquiriesData.enquiries} />
      </MgsAdminPanel>
    </MgsAdminShell>
  );
}
