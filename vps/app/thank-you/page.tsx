import type { Metadata } from "next";

import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { MgsThankYouPage } from "@/components/mgs-secondary-pages";
import { getMgsPageMetadata } from "@/lib/mgs-page-metadata";
import { resolveMgsLocale } from "@/lib/mgs-project-data";

type ThankYouPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: ThankYouPageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  return getMgsPageMetadata(resolveMgsLocale(lang), "thank-you", "/thank-you");
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const { lang } = await searchParams;
  const locale = resolveMgsLocale(lang);

  return (
    <MgsSiteFrame locale={locale}>
      <MgsThankYouPage locale={locale} />
    </MgsSiteFrame>
  );
}
