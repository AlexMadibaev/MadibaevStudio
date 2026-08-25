"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { MgsEnquiry, MgsEnquiryStatus } from "@/lib/mgs-content-store";

type MgsAdminEnquiryListProps = {
  enquiries: readonly MgsEnquiry[];
  disabled: boolean;
};

type EnquiryFilter = "all" | MgsEnquiryStatus;

const statusLabels: Record<MgsEnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  in_discussion: "In discussion",
  accepted: "Accepted",
  declined: "Declined",
};

const statusStyles: Record<MgsEnquiryStatus, string> = {
  new: "border-sky-300/25 bg-sky-400/10 text-sky-100",
  contacted: "border-violet-300/25 bg-violet-400/10 text-violet-100",
  in_discussion: "border-amber-300/25 bg-amber-400/10 text-amber-100",
  accepted: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  declined: "border-rose-300/25 bg-rose-400/10 text-rose-100",
};

const filters: { value: EnquiryFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...Object.entries(statusLabels).map(([value, label]) => ({ value: value as MgsEnquiryStatus, label })),
];

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export function MgsAdminEnquiryList({ enquiries, disabled }: MgsAdminEnquiryListProps) {
  const router = useRouter();
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<EnquiryFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pendingSet = useMemo(() => new Set(pendingIds), [pendingIds]);
  const filteredEnquiries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesFilter = filter === "all" || enquiry.status === filter;
      const searchText = [enquiry.name, enquiry.email, enquiry.company, enquiry.contact, enquiry.projectType].join(" ").toLowerCase();
      return matchesFilter && (!normalizedQuery || searchText.includes(normalizedQuery));
    });
  }, [enquiries, filter, query]);

  const selectedEnquiry = selectedId ? enquiries.find((item) => item.id === selectedId) ?? null : null;

  async function updateStatus(enquiry: MgsEnquiry, status: string) {
    setPendingIds((current) => [...current, enquiry.id]);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ status }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setMessage(data?.error ?? "Unable to update the enquiry.");
        return;
      }

      router.refresh();
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setPendingIds((current) => current.filter((item) => item !== enquiry.id));
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[26px] border border-white/10 bg-black/20 p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Search enquiries</span>
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#c6b798]" />
            <input
              className="w-full rounded-[18px] border border-white/10 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-[#fff7ee] outline-none transition placeholder:text-[#ab9984] focus:border-white/25"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, company..."
              value={query}
            />
          </label>
          <p className="shrink-0 text-xs uppercase tracking-[0.16em] text-[#c6b798]">Showing {filteredEnquiries.length} of {enquiries.length}</p>
        </div>
        <div aria-label="Filter enquiries by status" className="mt-4 flex flex-wrap gap-2" role="tablist">
          {filters.map((item) => {
            const active = item.value === filter;
            const count = item.value === "all" ? enquiries.length : enquiries.filter((enquiry) => enquiry.status === item.value).length;

            return (
              <button
                aria-selected={active}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${active ? "border-white/25 bg-white/[0.12] text-[#fff7ee]" : "border-white/10 text-[#c6b798] hover:border-white/20 hover:text-[#fff7ee]"}`}
                key={item.value}
                onClick={() => setFilter(item.value)}
                role="tab"
                type="button"
              >
                {item.label} <span className="ml-1 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {message ? <p className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100" role="status">{message}</p> : null}

      {!enquiries.length ? (
        <div className="rounded-[26px] border border-dashed border-white/15 bg-black/20 p-8 text-center">
          <p className="text-lg font-semibold text-[#fff7ee]">No enquiries yet.</p>
          <p className="mt-2 text-sm leading-6 text-[#dcc9b4]">New briefs from the public contact form will appear here.</p>
        </div>
      ) : !filteredEnquiries.length ? (
        <div className="rounded-[26px] border border-dashed border-white/15 bg-black/20 p-8 text-center">
          <p className="text-lg font-semibold text-[#fff7ee]">No matching enquiries.</p>
          <button className="mt-3 text-sm text-[#c6b798] underline underline-offset-4" onClick={() => { setQuery(""); setFilter("all"); }} type="button">Clear filters</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enquiry) => {
            const isPending = pendingSet.has(enquiry.id);

            return (
              <article className="rounded-[30px] border border-white/10 bg-white/[0.035] p-5 transition hover:border-white/18" key={enquiry.id}>
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <button className="min-w-0 flex-1 text-left" onClick={() => setSelectedId(enquiry.id)} type="button">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] ${statusStyles[enquiry.status]}`}>{statusLabels[enquiry.status]}</span>
                      <span className="text-[0.68rem] uppercase tracking-[0.16em] text-[#c6b798]">{formatDate(enquiry.createdAt)}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#fff7ee]">{enquiry.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#dcc9b4]">{enquiry.email}{enquiry.company ? ` · ${enquiry.company}` : ""}{enquiry.contact ? ` · ${enquiry.contact}` : ""}</p>
                    <p className="mt-3 line-clamp-3 max-w-4xl text-sm leading-7 text-[#efe1cf]">{enquiry.message}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[#c6b798]">{enquiry.projectType || "General brief"}{enquiry.budget ? ` · ${enquiry.budget}` : ""}{enquiry.deadline ? ` · Due ${enquiry.deadline}` : ""}</p>
                  </button>

                  <div className="flex shrink-0 flex-col gap-3 xl:min-w-[220px]">
                    <label className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#c6b798]">Pipeline status</span>
                      <select className="w-full rounded-[18px] border border-white/10 bg-black/25 px-4 py-3 text-sm text-[#fff7ee] outline-none focus:border-white/25" disabled={disabled || isPending} onChange={(event) => updateStatus(enquiry, event.target.value)} value={enquiry.status}>
                        {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                    <button className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f8efe5] transition hover:border-white/20 hover:bg-white/[0.06]" onClick={() => setSelectedId(enquiry.id)} type="button">View details</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedEnquiry ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/65 p-3 backdrop-blur-sm" role="presentation">
          <button aria-label="Close enquiry details" className="absolute inset-0 cursor-default" onClick={() => setSelectedId(null)} type="button" />
          <aside aria-label="Enquiry details" aria-modal="true" className="relative z-10 flex h-full w-full max-w-xl flex-col overflow-y-auto rounded-[30px] border border-white/12 bg-[#111113] p-6 shadow-2xl" role="dialog">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#c6b798]">Enquiry detail</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#fff7ee]">{selectedEnquiry.name}</h2>
                <p className="mt-2 text-sm text-[#cdbca7]">{formatDate(selectedEnquiry.createdAt)}</p>
              </div>
              <button aria-label="Close" className="rounded-full border border-white/10 p-2 text-[#f8efe5] transition hover:bg-white/[0.08]" onClick={() => setSelectedId(null)} type="button"><XMarkIcon className="size-5" /></button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[["Email", selectedEnquiry.email, `mailto:${selectedEnquiry.email}`], ["Company", selectedEnquiry.company || "—", null], ["Contact", selectedEnquiry.contact || "—", null], ["Project type", selectedEnquiry.projectType || "—", null], ["Budget", selectedEnquiry.budget || "—", null], ["Deadline", selectedEnquiry.deadline || "—", null]].map(([label, value, href]) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4" key={label}>
                  <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[#c6b798]">{label}</p>
                  {href ? <a className="mt-2 block break-all text-sm text-[#fff7ee] underline decoration-white/20 underline-offset-4" href={href}>{value}</a> : <p className="mt-2 text-sm text-[#fff7ee]">{value}</p>}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[#c6b798]">Message</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#efe1cf]">{selectedEnquiry.message}</p>
            </div>

            <div className="mt-auto pt-6">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#c6b798]">Move through pipeline</span>
                <select className="w-full rounded-[18px] border border-white/10 bg-black/25 px-4 py-3 text-sm text-[#fff7ee] outline-none" disabled={disabled || pendingSet.has(selectedEnquiry.id)} onChange={(event) => updateStatus(selectedEnquiry, event.target.value)} value={selectedEnquiry.status}>
                  {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
