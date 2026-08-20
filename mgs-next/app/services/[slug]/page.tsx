import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { MgsServiceDetailPage } from "@/components/mgs-secondary-pages";
import { getMgsProjects } from "@/lib/mgs-content-store";
import { resolveMgsLocale } from "@/lib/mgs-project-data";
import { getMgsServiceName, isMgsServiceSlug } from "@/lib/mgs-service-data";

export const dynamic = "force-dynamic";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: ServiceDetailPageProps): Promise<Metadata> {
  const [{ slug }, { lang }] = await Promise.all([params, searchParams]);
  const locale = resolveMgsLocale(lang);
  const name = getMgsServiceName(slug, locale);

  if (!name) {
    return { title: "MGS — Service not found" };
  }

  const canonical = `/services/${slug}?lang=${locale}`;
  return {
    title: `${name} — Madibaev Graphic Studio`,
    description: `${name} by Madibaev Graphic Studio.`,
    alternates: {
      canonical,
      languages: {
        ru: `/services/${slug}?lang=ru`,
        en: `/services/${slug}?lang=en`,
      },
    },
  };
}

export default async function ServiceDetailPage({
  params,
  searchParams,
}: ServiceDetailPageProps) {
  const [{ slug }, { lang }, projects] = await Promise.all([params, searchParams, getMgsProjects()]);
  const locale = resolveMgsLocale(lang);

  if (!isMgsServiceSlug(slug)) {
    notFound();
  }

  return (
    <MgsSiteFrame locale={locale}>
      <MgsServiceDetailPage locale={locale} projects={projects} slug={slug} />
    </MgsSiteFrame>
  );
}
