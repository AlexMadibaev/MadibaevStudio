"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type MgsAdminProjectCreateFormProps = {
  disabled: boolean;
};

export function MgsAdminProjectCreateForm({ disabled }: MgsAdminProjectCreateFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: "",
    titleRu: "",
    titleEn: "",
    year: String(new Date().getFullYear()),
    visual: "nava",
  });
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3 rounded-[28px] border border-white/10 bg-black/20 p-4 md:grid-cols-[1.1fr_1fr_1fr_140px_140px_auto]"
      onSubmit={async (event) => {
        event.preventDefault();
        if (disabled || pending) return;

        setPending(true);
        setMessage(null);

        try {
          const response = await fetch("/api/admin/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify(form),
          });
          const data = (await response.json().catch(() => null)) as { error?: string; project?: { slug: string } } | null;

          if (!response.ok || !data?.project) {
            setMessage(data?.error ?? "Unable to create the project.");
            return;
          }

          router.push(`/admin/projects/${data.project.slug}`);
          router.refresh();
        } finally {
          setPending(false);
        }
      }}
    >
      <input
        className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#fff7ee] outline-none placeholder:text-[#ab9984]"
        disabled={disabled || pending}
        onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
        placeholder="slug"
        value={form.slug}
      />
      <input
        className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#fff7ee] outline-none placeholder:text-[#ab9984]"
        disabled={disabled || pending}
        onChange={(event) => setForm((current) => ({ ...current, titleRu: event.target.value }))}
        placeholder="Title RU"
        value={form.titleRu}
      />
      <input
        className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#fff7ee] outline-none placeholder:text-[#ab9984]"
        disabled={disabled || pending}
        onChange={(event) => setForm((current) => ({ ...current, titleEn: event.target.value }))}
        placeholder="Title EN"
        value={form.titleEn}
      />
      <input
        className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#fff7ee] outline-none placeholder:text-[#ab9984]"
        disabled={disabled || pending}
        onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
        placeholder="Year"
        value={form.year}
      />
      <select
        className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#fff7ee] outline-none"
        disabled={disabled || pending}
        onChange={(event) => setForm((current) => ({ ...current, visual: event.target.value }))}
        value={form.visual}
      >
        <option value="nava">nava</option>
        <option value="aria">aria</option>
        <option value="solo">solo</option>
        <option value="north">north</option>
      </select>
      <button
        className="rounded-full bg-[linear-gradient(120deg,#19a4f6_0%,#d6027f_48%,#ffcf40_100%)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        disabled={disabled || pending}
        type="submit"
      >
        {pending ? "Creating..." : "Add project"}
      </button>

      {message ? <p className="md:col-span-full text-sm text-amber-100">{message}</p> : null}
    </form>
  );
}
