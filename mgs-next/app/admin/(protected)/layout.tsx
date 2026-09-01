import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getMgsAdminAccessState } from "@/lib/mgs-admin-auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const access = await getMgsAdminAccessState();

  if (!access.setup.authConfigured || !access.authenticated) {
    redirect("/admin/login");
  }

  return children;
}
