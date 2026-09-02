import { redirect } from "next/navigation";

import { MgsAdminLoginForm } from "@/components/mgs-admin-login-form";
import { getMgsAdminAccessState } from "@/lib/mgs-admin-auth";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const access = await getMgsAdminAccessState();

  if (access.authenticated) {
    redirect("/admin");
  }

  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-10 text-[#f6ecdd]">
      <div className="w-full max-w-[560px] rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top,#171717_0%,#0b0b0b_70%,#050505_100%)] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.4)]">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#c6b798]">Madibaev Graphic Studio / Admin</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#fff7ee]">Owner access</h1>
        <p className="mt-4 text-sm leading-7 text-[#b7aa9d]">
          Sign in with the authorized Google account. The verified email must exactly match the owner email configured on the server. Sessions expire after 12 hours.
        </p>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.035] p-5">
          {!access.setup.authConfigured ? (
            <div className="mb-5 rounded-[24px] border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
              Missing environment variables: {access.setup.missingAuthEnv.join(", ")}.
            </div>
          ) : null}

          {!access.setup.storageConnected ? (
            <div className="mb-5 rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-[#b7aa9d]">
              Persistent storage is not connected yet. The admin can open, but project saves, enquiries, and media require MGS_DATA_DIR on VPS or Blob on Vercel.
            </div>
          ) : null}

          <MgsAdminLoginForm disabled={!access.setup.authConfigured} error={error} />
        </div>
      </div>
    </main>
  );
}
