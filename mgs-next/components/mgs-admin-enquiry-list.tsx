"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  new: "border-sky-200 bg-sky-50 text-sky-700",
  contacted: "border-violet-200 bg-violet-50 text-violet-700",
  in_discussion: "border-amber-200 bg-amber-50 text-amber-700",
  accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  declined: "border-rose-200 bg-rose-50 text-rose-700",
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
      <div className="rounded-2xl border border-[#e1e4e8] bg-white p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Search enquiries</span>
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8b9099]" />
            <Input
              className="h-11 rounded-xl border-[#e1e4e8] bg-white py-3 pl-11 pr-4 text-sm text-[#17181c] placeholder:text-[#8b9099] focus-visible:border-[#8db0eb] focus-visible:ring-[#dbe8ff]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, company..."
              value={query}
            />
          </label>
          <p className="shrink-0 text-xs uppercase tracking-[0.16em] text-[#8b9099]">Showing {filteredEnquiries.length} of {enquiries.length}</p>
        </div>
        <Tabs className="mt-4" onValueChange={(value) => setFilter(value as EnquiryFilter)} value={filter}>
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl border border-[#e1e4e8] bg-[#f7f8fa] p-1">
          {filters.map((item) => {
            const active = item.value === filter;
            const count = item.value === "all" ? enquiries.length : enquiries.filter((enquiry) => enquiry.status === item.value).length;

            return (
              <TabsTrigger
                className={`h-9 rounded-lg px-3 text-xs font-semibold ${active ? "bg-white text-[#0b57d0] shadow-sm" : "text-[#737982] hover:text-[#17181c]"}`}
                key={item.value}
                value={item.value}
              >
                {item.label} <span className="ml-1 opacity-60">{count}</span>
              </TabsTrigger>
            );
          })}
          </TabsList>
        </Tabs>
      </div>

      {message ? <p className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100" role="status">{message}</p> : null}

      {!enquiries.length ? (
        <div className="rounded-2xl border border-dashed border-[#d6dbe3] bg-[#f7f8fa] p-8 text-center">
          <p className="text-lg font-semibold text-[#17181c]">No enquiries yet.</p>
          <p className="mt-2 text-sm leading-6 text-[#737982]">New briefs from the public contact form will appear here.</p>
        </div>
      ) : !filteredEnquiries.length ? (
        <div className="rounded-2xl border border-dashed border-[#d6dbe3] bg-[#f7f8fa] p-8 text-center">
          <p className="text-lg font-semibold text-[#17181c]">No matching enquiries.</p>
          <button className="mt-3 text-sm text-[#0b57d0] underline underline-offset-4" onClick={() => { setQuery(""); setFilter("all"); }} type="button">Clear filters</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enquiry) => {
            const isPending = pendingSet.has(enquiry.id);

            return (
              <article className="rounded-2xl border border-[#e1e4e8] bg-white p-5 transition hover:border-[#b8c9e8] hover:shadow-sm" key={enquiry.id}>
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <button className="min-w-0 flex-1 text-left" onClick={() => setSelectedId(enquiry.id)} type="button">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`h-auto rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] ${statusStyles[enquiry.status]}`} variant="outline">{statusLabels[enquiry.status]}</Badge>
                      <span className="text-[0.68rem] uppercase tracking-[0.16em] text-[#8b9099]">{formatDate(enquiry.createdAt)}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#17181c]">{enquiry.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#737982]">{enquiry.email}{enquiry.company ? ` · ${enquiry.company}` : ""}{enquiry.contact ? ` · ${enquiry.contact}` : ""}</p>
                    <p className="mt-3 line-clamp-3 max-w-4xl text-sm leading-7 text-[#454952]">{enquiry.message}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[#8b9099]">{enquiry.projectType || "General brief"}{enquiry.budget ? ` · ${enquiry.budget}` : ""}{enquiry.deadline ? ` · Due ${enquiry.deadline}` : ""}</p>
                  </button>

                  <div className="flex shrink-0 flex-col gap-3 xl:min-w-[220px]">
                    <label className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#8b9099]">Pipeline status</span>
                      <select className="w-full rounded-xl border border-[#e1e4e8] bg-white px-4 py-3 text-sm text-[#17181c] outline-none focus:border-[#8db0eb]" disabled={disabled || isPending} onChange={(event) => updateStatus(enquiry, event.target.value)} value={enquiry.status}>
                        {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                    <button className="rounded-full border border-[#20242b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#20242b] transition hover:bg-[#f4f5f7]" onClick={() => setSelectedId(enquiry.id)} type="button">View details</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Sheet onOpenChange={(open) => { if (!open) setSelectedId(null); }} open={Boolean(selectedEnquiry)}>
        <SheetContent className="w-full border-[#e1e4e8] bg-white p-0 text-[#17181c] sm:max-w-xl" side="right">
          {selectedEnquiry ? <>
            <SheetHeader className="border-b border-[#e9ebef] p-6 pr-14">
              <SheetTitle className="text-left text-3xl font-semibold tracking-[-0.05em] text-[#17181c]">{selectedEnquiry.name}</SheetTitle>
              <SheetDescription className="text-left text-sm text-[#cdbca7]">Enquiry detail · {formatDate(selectedEnquiry.createdAt)}</SheetDescription>
            </SheetHeader>

            <div className="flex h-[calc(100%-110px)] flex-col overflow-y-auto p-6">

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[["Email", selectedEnquiry.email, `mailto:${selectedEnquiry.email}`], ["Company", selectedEnquiry.company || "—", null], ["Contact", selectedEnquiry.contact || "—", null], ["Project type", selectedEnquiry.projectType || "—", null], ["Budget", selectedEnquiry.budget || "—", null], ["Deadline", selectedEnquiry.deadline || "—", null]].map(([label, value, href]) => (
                <div className="rounded-xl border border-[#e1e4e8] bg-[#f7f8fa] p-4" key={label}>
                  <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[#8b9099]">{label}</p>
                  {href ? <a className="mt-2 block break-all text-sm text-[#0b57d0] underline underline-offset-4" href={href}>{value}</a> : <p className="mt-2 text-sm text-[#17181c]">{value}</p>}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-[#e1e4e8] bg-[#f7f8fa] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[#8b9099]">Message</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#454952]">{selectedEnquiry.message}</p>
            </div>

            <div className="mt-auto pt-6">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#8b9099]">Move through pipeline</span>
                <select className="w-full rounded-xl border border-[#e1e4e8] bg-white px-4 py-3 text-sm text-[#17181c] outline-none" disabled={disabled || pendingSet.has(selectedEnquiry.id)} onChange={(event) => updateStatus(selectedEnquiry, event.target.value)} value={selectedEnquiry.status}>
                  {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>
            </div>
          </> : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
