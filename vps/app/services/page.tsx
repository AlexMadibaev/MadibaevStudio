import type { Metadata } from "next";

import { MgsPositioningServicesPage } from "@/components/mgs-positioning-pages";
import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { getMgsPageMetadata } from "@/lib/mgs-page-metadata";
import { resolveMgsLocale } from "@/lib/mgs-project-data";

type ServicesPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: ServicesPageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  return getMgsPageMetadata(resolveMgsLocale(lang), "services", "/services");
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { lang } = await searchParams;
  const locale = resolveMgsLocale(lang);

  return (
    <MgsSiteFrame locale={locale}>
      <MgsPositioningServicesPage locale={locale} />
    </MgsSiteFrame>
  );
}
