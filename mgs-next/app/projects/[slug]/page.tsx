import { notFound, redirect } from "next/navigation";

import { getMgsProject } from "@/lib/mgs-project-data";

type LegacyProjectPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function LegacyProjectPage({ params, searchParams }: LegacyProjectPageProps) {
  const [{ slug }, { lang }] = await Promise.all([params, searchParams]);

  if (!getMgsProject(slug)) {
    notFound();
  }

  const locale = Array.isArray(lang) ? lang[0] : lang;
  const query = locale === "ru" || locale === "en" ? `?lang=${locale}` : "";

  redirect(`/work/${slug}${query}`);
}
