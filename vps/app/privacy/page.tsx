import type { Metadata } from "next";

import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { MgsPrivacyPage } from "@/components/mgs-secondary-pages";
import { getMgsPageMetadata } from "@/lib/mgs-page-metadata";
import { resolveMgsLocale } from "@/lib/mgs-project-data";

type PrivacyPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  return getMgsPageMetadata(resolveMgsLocale(lang), "privacy", "/privacy");
}

export default async function PrivacyPage({ searchParams }: PrivacyPageProps) {
  const { lang } = await searchParams;
  const locale = resolveMgsLocale(lang);

  return (
    <MgsSiteFrame locale={locale}>
      <MgsPrivacyPage locale={locale} />
    </MgsSiteFrame>
  );
}
