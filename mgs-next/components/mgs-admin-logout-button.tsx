"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MgsAdminLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[#f6ecdd] transition hover:border-white/20 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      onClick={async () => {
        setPending(true);

        try {
          await fetch("/api/admin/session", {
            method: "DELETE",
            credentials: "same-origin",
          });
        } finally {
          router.replace("/admin/login");
          router.refresh();
        }
      }}
      type="button"
    >
      {pending ? "Signing out..." : "Log out"}
    </button>
  );
}
