"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { MgsEnquiry, MgsEnquiryStatus } from "@/lib/mgs-content-store";

type MgsAdminEnquiryListProps = {
  enquiries: readonly MgsEnquiry[];
  disabled: boolean;
};

const statusLabels: Record<MgsEnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  in_discussion: "In discussion",
  accepted: "Accepted",
  declined: "Declined",
};

export function MgsAdminEnquiryList({ enquiries, disabled }: MgsAdminEnquiryListProps) {
  const router = useRouter();
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const pendingSet = useMemo(() => new Set(pendingIds), [pendingIds]);

  if (!enquiries.length) {
    return <p className="rounded-[26px] border border-white/10 bg-black/20 p-5 text-sm leading-6 text-[#dcc9b4]">No enquiries yet.</p>;
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm text-[#dcc9b4]">{message}</p> : null}
      {enquiries.map((enquiry) => {
        const isPending = pendingSet.has(enquiry.id);

        return (
          <article className="rounded-[30px] border border-white/10 bg-white/[0.035] p-5" key={enquiry.id}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#c6b798]">
                    {statusLabels[enquiry.status]}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#c6b798]">
                    {new Date(enquiry.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#fff7ee]">{enquiry.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#dcc9b4]">
                    {enquiry.email}
                    {enquiry.company ? ` · ${enquiry.company}` : ""}
                    {enquiry.contact ? ` · ${enquiry.contact}` : ""}
                  </p>
                </div>
                <p className="max-w-4xl text-sm leading-7 text-[#efe1cf]">{enquiry.message}</p>
                <p className="text-sm leading-6 text-[#dcc9b4]">
                  {enquiry.projectType || "General brief"}
                  {enquiry.budget ? ` · Budget: ${enquiry.budget}` : ""}
                  {enquiry.deadline ? ` · Deadline: ${enquiry.deadline}` : ""}
                </p>
              </div>

              <label className="block min-w-[220px]">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#c6b798]">Pipeline status</span>
                <select
                  className="w-full rounded-[22px] border border-white/10 bg-black/25 px-4 py-3 text-sm text-[#fff7ee] outline-none"
                  defaultValue={enquiry.status}
                  disabled={disabled || isPending}
                  onChange={async (event) => {
                    setPendingIds((current) => [...current, enquiry.id]);
                    setMessage(null);

                    try {
                      const response = await fetch(`/api/admin/enquiries/${enquiry.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        credentials: "same-origin",
                        body: JSON.stringify({ status: event.target.value }),
                      });
                      const data = (await response.json().catch(() => null)) as { error?: string } | null;

                      if (!response.ok) {
                        setMessage(data?.error ?? "Unable to update the enquiry.");
                        return;
                      }

                      router.refresh();
                    } finally {
                      setPendingIds((current) => current.filter((item) => item !== enquiry.id));
                    }
                  }}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </article>
        );
      })}
    </div>
  );
}
