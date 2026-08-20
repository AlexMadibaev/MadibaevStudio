import { ArrowTopRightOnSquareIcon, CircleStackIcon, FolderOpenIcon, InboxStackIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { MgsAdminSetupStatus } from "@/lib/mgs-admin-auth";
import type { MgsContentStoreStatus } from "@/lib/mgs-content-store";

import { MgsAdminLogoutButton } from "./mgs-admin-logout-button";

type MgsAdminShellProps = {
  section: "dashboard" | "projects" | "enquiries";
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
  { key: "enquiries", href: "/admin/enquiries", label: "Enquiries", icon: InboxStackIcon },
] as const;

function StatusPill({
  tone,
  children,
}: {
  tone: "good" | "warn" | "neutral";
  children: ReactNode;
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-400/30 bg-emerald-500/12 text-emerald-100"
      : tone === "warn"
        ? "border-amber-300/25 bg-amber-400/10 text-amber-100"
        : "border-white/12 bg-white/[0.05] text-[#efe3d2]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.68rem] font-medium tracking-[0.16em] uppercase ${toneClass}`}>
      {children}
    </span>
  );
}

export function MgsAdminShell({
  section,
  title,
  description,
  setupStatus,
  storageStatus,
  children,
  actions,
}: MgsAdminShellProps) {
  return (
    <main className="min-h-screen bg-[#040404] text-[#f6ecdd]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1520px] gap-6 px-4 py-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6 lg:py-6">
        <aside className="rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top,#171717_0%,#0a0a0a_68%,#050505_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <div className="flex h-full flex-col gap-5">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4">
              <Image alt="Madibaev Graphic Studio" height={48} priority src="/mgs-logo.svg" width={140} />
              <p className="mt-4 text-[0.7rem] uppercase tracking-[0.22em] text-[#c6b798]">Content Control</p>
              <p className="mt-3 max-w-[20rem] text-sm leading-6 text-[#e4d4c0]/78">
                Single-owner admin for the live MGS website on Vercel.
              </p>
            </div>

            <nav className="grid gap-3" aria-label="Admin navigation">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = item.key === section;

                return (
                  <Link
                    className={`group flex items-center justify-between rounded-[26px] border px-4 py-4 transition ${
                      active
                        ? "border-white/18 bg-white/[0.08] shadow-[0_20px_42px_rgba(0,0,0,0.26)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`rounded-2xl p-2.5 ${active ? "bg-white/10" : "bg-black/25"}`}>
                        <Icon className="size-5 text-[#f8efe5]" />
                      </span>
                      <span>
                        <span className="block text-base font-semibold text-[#f8efe5]">{item.label}</span>
                        <span className="mt-1 block text-xs text-[#cdbca7]">
                          {item.key === "dashboard" ? "Overview" : item.key === "projects" ? "Case library" : "Lead inbox"}
                        </span>
                      </span>
                    </span>
                    <ArrowTopRightOnSquareIcon className={`size-4 transition ${active ? "text-[#f8efe5]" : "text-[#cdbca7] group-hover:text-[#f8efe5]"}`} />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 rounded-[28px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap gap-2">
                <StatusPill tone={setupStatus.authConfigured ? "good" : "warn"}>
                  {setupStatus.authConfigured ? "Auth ready" : "Auth setup required"}
                </StatusPill>
                <StatusPill tone={storageStatus.connected ? "good" : "warn"}>
                  {storageStatus.connected ? "Blob connected" : "Blob disconnected"}
                </StatusPill>
              </div>

              {storageStatus.issue ? (
                <p className="text-sm leading-6 text-[#dcc9b4]">{storageStatus.issue}</p>
              ) : (
                <p className="text-sm leading-6 text-[#dcc9b4]">
                  Admin changes write to private Vercel Blob records and immediately feed the live public pages.
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <Link className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[#f8efe5] transition hover:border-white/20 hover:bg-white/[0.05]" href="/" target="_blank">
                  Open website
                  <ArrowTopRightOnSquareIcon className="size-4" />
                </Link>
                <MgsAdminLogoutButton />
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <header className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#c8b391]">Madibaev Graphic Studio / Admin</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#fff7ee] sm:text-[2.6rem]">{title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#dcc9b4] sm:text-base">{description}</p>
              </div>
              {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
          </header>

          {!setupStatus.authConfigured ? (
            <div className="rounded-[30px] border border-amber-300/20 bg-amber-400/10 p-5 text-sm leading-7 text-amber-100">
              Missing environment variables: {setupStatus.missingAuthEnv.join(", ")}.
            </div>
          ) : null}

          {children}
        </section>
      </div>
    </main>
  );
}

export function MgsAdminPanel({
  title,
  eyebrow,
  children,
  description,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.22)]">
      <div className="mb-5 flex flex-col gap-2">
        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#c6b798]">{eyebrow}</p>
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fff7ee]">{title}</h2>
        {description ? <p className="max-w-3xl text-sm leading-6 text-[#dcc9b4]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function MgsAdminStatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-black/20 p-5">
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#c6b798]">{label}</p>
      <strong className="mt-4 block text-4xl font-semibold tracking-[-0.06em] text-[#fff7ee]">{value}</strong>
      <p className="mt-3 text-sm leading-6 text-[#dcc9b4]">{detail}</p>
    </article>
  );
}
