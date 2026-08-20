import type { Metadata } from "next";

import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { MgsAboutPage } from "@/components/mgs-secondary-pages";
import { getMgsPageMetadata } from "@/lib/mgs-page-metadata";
import { resolveMgsLocale } from "@/lib/mgs-project-data";

type AboutPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: AboutPageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  return getMgsPageMetadata(resolveMgsLocale(lang), "about", "/about");
}

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const { lang } = await searchParams;
  const locale = resolveMgsLocale(lang);

  return (
    <MgsSiteFrame locale={locale}>
      <MgsAboutPage locale={locale} />
    </MgsSiteFrame>
  );
}
