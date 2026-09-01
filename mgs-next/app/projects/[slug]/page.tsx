import { notFound, permanentRedirect } from "next/navigation";

import { findMgsProject, getMgsProjects } from "@/lib/mgs-content-store";

export const dynamic = "force-dynamic";

type LegacyProjectPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function LegacyProjectPage({ params, searchParams }: LegacyProjectPageProps) {
  const [{ slug }, { lang }, projects] = await Promise.all([params, searchParams, getMgsProjects()]);

  if (!findMgsProject(projects, slug)) {
    notFound();
  }

  const locale = Array.isArray(lang) ? lang[0] : lang;
  const query = locale === "ru" || locale === "en" ? `?lang=${locale}` : "";

  permanentRedirect(`/work/${slug}${query}`);
}
