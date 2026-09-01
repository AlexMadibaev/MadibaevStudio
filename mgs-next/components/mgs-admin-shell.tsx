import { ArrowTopRightOnSquareIcon, CircleStackIcon, FolderOpenIcon, InboxStackIcon, PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { MgsAdminSetupStatus } from "@/lib/mgs-admin-auth";
import type { MgsContentStoreStatus } from "@/lib/mgs-content-store";

import { MgsAdminLogoutButton } from "./mgs-admin-logout-button";

type MgsAdminShellProps = {
  section: "dashboard" | "projects" | "media" | "enquiries";
  title: string;
  description: string;
  setupStatus: MgsAdminSetupStatus;
  storageStatus: MgsContentStoreStatus;
  children: ReactNode;
  actions?: ReactNode;
};

const navigation = [
  { key: "dashboard", href: "/admin", label: "Dashboard", icon: CircleStackIcon },
  { key: "projects", href: "/admin/projects", label: "Projects", icon: FolderOpenIcon },
  { key: "media", href: "/admin/media", label: "Media", icon: PhotoIcon },
  { key: "enquiries", href: "/admin/enquiries", label: "Enquiries", icon: InboxStackIcon },
] as const;

function StatusPill({ tone, children }: { tone: "good" | "warn" | "neutral"; children: ReactNode }) {
  const toneClass = tone === "good"
    ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
    : tone === "warn"
      ? "border-amber-300/25 bg-amber-300/10 text-amber-200"
      : "border-white/10 bg-white/[0.04] text-[#b7aa9d]";

  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.68rem] font-medium tracking-[0.16em] uppercase ${toneClass}`}>{children}</span>;
}

export function MgsAdminShell({ section, title, description, setupStatus, storageStatus, children, actions }: MgsAdminShellProps) {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f6ecdd]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1920px] lg:grid-cols-[256px_minmax(0,1fr)]">
        <aside className="border-r border-white/10 bg-[#0a0a0a] px-3 py-5 lg:sticky lg:top-0 lg:h-screen">
          <div className="flex h-full flex-col gap-6">
            <div className="border-b border-white/10 px-2 pb-5">
              <div className="flex items-center gap-3 rounded-xl bg-[#17181c] px-3 py-2.5">
                <Image alt="Madibaev Graphic Studio" height={28} priority src="/mgs-logo.svg" width={82} />
              </div>
              <p className="mt-3 px-1 text-xs text-[#a99c90]">Панель управления</p>
            </div>

            <nav className="grid gap-1" aria-label="Admin navigation">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = item.key === section;
                return (
                  <Link
                    className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition ${active ? "bg-white/[0.10] text-[#fff7ee]" : "text-[#b7aa9d] hover:bg-white/[0.05] hover:text-[#fff7ee]"}`}
                    href={item.href}
                    key={item.href}
                  >
                    <span className="flex items-center gap-3">
                      <span className="rounded-lg p-1"><Icon className={`size-4 ${active ? "text-[#fff7ee]" : "text-[#a99c90]"}`} /></span>
                      <span><span className={`block text-sm font-medium ${active ? "text-[#fff7ee]" : "text-[#d2c3b4]"}`}>{item.label}</span></span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4 border-t border-white/10 px-2 pt-5">
              <div className="flex flex-wrap gap-2">
                <StatusPill tone={setupStatus.authConfigured ? "good" : "warn"}>{setupStatus.authConfigured ? "Auth ready" : "Auth setup required"}</StatusPill>
                <StatusPill tone={storageStatus.connected ? "good" : "warn"}>{storageStatus.connected ? "Storage connected" : "Storage disconnected"}</StatusPill>
              </div>

              {storageStatus.issue ? (
                <p className="text-xs leading-5 text-[#b7aa9d]">{storageStatus.issue}</p>
              ) : (
                <p className="text-xs leading-5 text-[#b7aa9d]">Projects, enquiries and uploaded media use persistent production storage. VPS media lives inside the `mgs_data` volume.</p>
              )}

              <div className="flex flex-wrap gap-3">
                <Link className="inline-flex items-center gap-2 text-xs font-medium text-[#d2c3b4] transition hover:text-white" href="/" target="_blank">
                  Open website <ArrowTopRightOnSquareIcon className="size-4" />
                </Link>
                <MgsAdminLogoutButton />
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-6 bg-[#050505] pb-10">
          <header className="border-b border-white/10 bg-[#080808] px-5 py-5 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#fff7ee] sm:text-[2rem]">{title}</h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-[#b7aa9d]">{description}</p>
              </div>
              {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
          </header>

          <div className="space-y-6 px-5 pt-6 lg:px-8">
            {!setupStatus.authConfigured ? (
              <div className="rounded-xl border border-amber-300/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">Missing environment variables: {setupStatus.missingAuthEnv.join(", ")}.</div>
            ) : null}
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

export function MgsAdminPanel({ title, eyebrow, children, description }: { title: string; eyebrow: string; children: ReactNode; description?: string }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] shadow-[0_18px_45px_rgba(0,0,0,0.2)]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#c6b798]">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-[#fff7ee]">{title}</h2>
        {description ? <p className="mt-1 max-w-3xl text-sm leading-6 text-[#b7aa9d]">{description}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function MgsAdminStatCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.16)]">
      <p className="text-sm text-[#b7aa9d]">{label}</p>
      <strong className="mt-3 block text-3xl font-semibold tracking-[-0.06em] text-[#fff7ee]">{value}</strong>
      <p className="mt-2 text-xs leading-5 text-[#a99c90]">{detail}</p>
    </article>
  );
}
