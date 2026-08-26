import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MgsPositioningServiceDetailPage } from "@/components/mgs-positioning-pages";
import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { getMgsProjects } from "@/lib/mgs-content-store";
import { resolveMgsLocale } from "@/lib/mgs-project-data";
import { getMgsServiceDefinition, getMgsServiceName, isMgsServiceSlug } from "@/lib/mgs-service-data";
import { mgsAbsoluteUrl } from "@/lib/mgs-site-url";

export const dynamic = "force-dynamic";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: ServiceDetailPageProps): Promise<Metadata> {
  const [{ slug }, { lang }] = await Promise.all([params, searchParams]);
  const locale = resolveMgsLocale(lang);
  const name = getMgsServiceName(slug, locale);
  const definition = getMgsServiceDefinition(slug);

  if (!name || !definition) {
    return {
      title: locale === "ru" ? "Услуга не найдена — MGS" : "Service not found — MGS",
      robots: { index: false, follow: false },
    };
  }

  const title = `${name} — Madibaev Graphic Studio`;
  const description = definition.summary[locale];
  const pathname = `/services/${slug}`;
  const canonical = mgsAbsoluteUrl(`${pathname}?lang=${locale}`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ru: mgsAbsoluteUrl(`${pathname}?lang=ru`),
        en: mgsAbsoluteUrl(`${pathname}?lang=en`),
        "x-default": mgsAbsoluteUrl(`${pathname}?lang=ru`),
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: [mgsAbsoluteUrl("/opengraph-image")],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [mgsAbsoluteUrl("/opengraph-image")],
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

  const definition = getMgsServiceDefinition(slug);
  const pathname = `/services/${slug}`;
  const serviceUrl = mgsAbsoluteUrl(`${pathname}?lang=${locale}`);
  const serviceStructuredData = definition
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `${serviceUrl}#service`,
            name: definition.name[locale],
            description: definition.summary[locale],
            url: serviceUrl,
            provider: { "@id": `${mgsAbsoluteUrl("/")}#organization` },
            areaServed: { "@type": "Place", name: "Worldwide" },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: locale === "ru" ? "Услуги" : "Services",
                item: mgsAbsoluteUrl(`/services?lang=${locale}`),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: definition.name[locale],
                item: serviceUrl,
              },
            ],
          },
        ],
      }
    : null;

  return (
    <MgsSiteFrame locale={locale}>
      <MgsPositioningServiceDetailPage locale={locale} projects={projects} slug={slug} />
      {serviceStructuredData ? (
        <script dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }} type="application/ld+json" />
      ) : null}
    </MgsSiteFrame>
  );
}
