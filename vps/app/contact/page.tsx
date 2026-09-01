import type { Metadata } from "next";

import { MgsContactPage } from "@/components/mgs-contact-page";
import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { getMgsPageMetadata } from "@/lib/mgs-page-metadata";
import { resolveMgsLocale } from "@/lib/mgs-project-data";

type ContactPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: ContactPageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  return getMgsPageMetadata(resolveMgsLocale(lang), "contact", "/contact");
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { lang } = await searchParams;
  const locale = resolveMgsLocale(lang);

  return (
    <MgsSiteFrame locale={locale}>
      <MgsContactPage locale={locale} />
    </MgsSiteFrame>
  );
}
