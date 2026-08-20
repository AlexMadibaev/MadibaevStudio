import type { Metadata } from "next";

import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { MgsHome } from "@/components/mgs-studio";
import { getMgsProjects } from "@/lib/mgs-content-store";
import { getMgsPageMetadata } from "@/lib/mgs-page-metadata";
import { resolveMgsLocale } from "@/lib/mgs-project-data";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  return getMgsPageMetadata(resolveMgsLocale(lang), "home", "/");
}

export default async function Home({ searchParams }: HomePageProps) {
  const [{ lang }, projects] = await Promise.all([searchParams, getMgsProjects()]);
  const locale = resolveMgsLocale(lang);

  return (
    <MgsSiteFrame locale={locale}>
      <MgsHome locale={locale} projects={projects} />
    </MgsSiteFrame>
  );
}
