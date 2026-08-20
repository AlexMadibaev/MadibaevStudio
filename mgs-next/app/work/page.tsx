import type { Metadata } from "next";

import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { MgsWorkPage } from "@/components/mgs-secondary-pages";
import { getMgsPageMetadata } from "@/lib/mgs-page-metadata";
import { resolveMgsLocale } from "@/lib/mgs-project-data";

type WorkPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: WorkPageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  return getMgsPageMetadata(resolveMgsLocale(lang), "work", "/work");
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const { lang } = await searchParams;
  const locale = resolveMgsLocale(lang);

  return (
    <MgsSiteFrame locale={locale}>
      <MgsWorkPage locale={locale} />
    </MgsSiteFrame>
  );
}
