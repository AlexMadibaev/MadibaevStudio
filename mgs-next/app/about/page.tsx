import type { Metadata } from "next";

import { MgsPositioningAboutPage } from "@/components/mgs-positioning-pages";
import { MgsSiteFrame } from "@/components/mgs-site-frame";
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
      <MgsPositioningAboutPage locale={locale} />
    </MgsSiteFrame>
  );
}
