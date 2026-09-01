import type { Metadata } from "next";

import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { MgsWorkPage } from "@/components/mgs-work-page";
import { getMgsProjects } from "@/lib/mgs-content-store";
import { getMgsPageMetadata } from "@/lib/mgs-page-metadata";
import { resolveMgsLocale } from "@/lib/mgs-project-data";

export const dynamic = "force-dynamic";

type WorkPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: WorkPageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  return getMgsPageMetadata(resolveMgsLocale(lang), "work", "/work");
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const [{ lang }, projects] = await Promise.all([searchParams, getMgsProjects()]);
  const locale = resolveMgsLocale(lang);

  return (
    <MgsSiteFrame locale={locale}>
      <MgsWorkPage locale={locale} projects={projects} />
    </MgsSiteFrame>
  );
}
