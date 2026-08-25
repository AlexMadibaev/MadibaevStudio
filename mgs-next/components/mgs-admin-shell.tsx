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
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-[#e1e4e8] bg-[#f7f8fa] text-[#737982]";

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
    <main className="min-h-screen bg-[#f7f8fa] text-[#17181c]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1920px] lg:grid-cols-[256px_minmax(0,1fr)]">
        <aside className="border-r border-[#e4e6ea] bg-white px-3 py-5 lg:sticky lg:top-0 lg:h-screen">
          <div className="flex h-full flex-col gap-6">
            <div className="border-b border-[#e9ebef] px-2 pb-5">
              <div className="flex items-center gap-3 rounded-xl bg-[#17181c] px-3 py-2.5">
                <Image alt="Madibaev Graphic Studio" height={28} priority src="/mgs-logo.svg" width={82} />
              </div>
              <p className="mt-3 px-1 text-xs text-[#8b9099]">Панель управления</p>
            </div>

            <nav className="grid gap-1" aria-label="Admin navigation">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = item.key === section;

                return (
                  <Link
                    className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition ${
                      active
                        ? "bg-[#eaf1ff] text-[#0b57d0]"
                        : "text-[#565b65] hover:bg-[#f4f5f7]"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    <span className="flex items-center gap-3">
                      <span className="rounded-lg p-1">
                        <Icon className={`size-4 ${active ? "text-[#0b57d0]" : "text-[#737982]"}`} />
                      </span>
                      <span>
                        <span className={`block text-sm font-medium ${active ? "text-[#0b57d0]" : "text-[#454952]"}`}>{item.label}</span>
                      </span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4 border-t border-[#e9ebef] px-2 pt-5">
              <div className="flex flex-wrap gap-2">
                <StatusPill tone={setupStatus.authConfigured ? "good" : "warn"}>
                  {setupStatus.authConfigured ? "Auth ready" : "Auth setup required"}
                </StatusPill>
                <StatusPill tone={storageStatus.connected ? "good" : "warn"}>
                  {storageStatus.connected ? "Blob connected" : "Blob disconnected"}
                </StatusPill>
              </div>

              {storageStatus.issue ? (
                <p className="text-xs leading-5 text-[#737982]">{storageStatus.issue}</p>
              ) : (
                <p className="text-xs leading-5 text-[#737982]">
                  Admin changes write to private Vercel Blob records and immediately feed the live public pages.
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <Link className="inline-flex items-center gap-2 text-xs font-medium text-[#565b65] transition hover:text-[#0b57d0]" href="/" target="_blank">
                  Open website
                  <ArrowTopRightOnSquareIcon className="size-4" />
                </Link>
                <MgsAdminLogoutButton />
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-6 bg-[#f7f8fa] pb-10">
          <header className="border-b border-[#e4e6ea] bg-white px-5 py-5 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#17181c] sm:text-[2rem]">{title}</h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-[#737982]">{description}</p>
              </div>
              {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
          </header>

          <div className="space-y-6 px-5 pt-6 lg:px-8">
            {!setupStatus.authConfigured ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                Missing environment variables: {setupStatus.missingAuthEnv.join(", ")}.
              </div>
            ) : null}
            {children}
          </div>
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
    <section className="rounded-2xl border border-[#e1e4e8] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="border-b border-[#e9ebef] px-5 py-4">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#8b9099]">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-[#17181c]">{title}</h2>
        {description ? <p className="mt-1 max-w-3xl text-sm leading-6 text-[#737982]">{description}</p> : null}
      </div>
      <div className="p-5">{children}</div>
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
    <article className="rounded-2xl border border-[#e1e4e8] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <p className="text-sm text-[#737982]">{label}</p>
      <strong className="mt-3 block text-3xl font-semibold tracking-[-0.06em] text-[#17181c]">{value}</strong>
      <p className="mt-2 text-xs leading-5 text-[#8b9099]">{detail}</p>
    </article>
  );
}
