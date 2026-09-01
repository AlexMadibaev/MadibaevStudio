import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MgsCaseStudy } from "@/components/mgs-case-study";
import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { findMgsProject, getMgsProjects, getNextMgsProject } from "@/lib/mgs-content-store";
import { resolveMgsLocale } from "@/lib/mgs-project-data";
import { mgsAbsoluteUrl, mgsSiteUrl } from "@/lib/mgs-site-url";

export const dynamic = "force-dynamic";

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: WorkDetailPageProps): Promise<Metadata> {
  const [{ slug }, { lang }, projects] = await Promise.all([params, searchParams, getMgsProjects()]);
  const project = findMgsProject(projects, slug);

  if (!project) {
    return {
      title: "MGS — Project not found",
      description: "This Madibaev Graphic Studio project does not exist.",
    };
  }

  const locale = resolveMgsLocale(lang);
  const title = project.title[locale];
  const description = `${title}. ${project.summary[locale]}`;
  const pathname = `/work/${project.slug}`;
  const canonical = mgsAbsoluteUrl(`${pathname}?lang=${locale}`);

  return {
    metadataBase: new URL(mgsSiteUrl),
    title: `MGS — ${title}`,
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
      type: "article",
      title: `MGS — ${title}`,
      description,
      url: canonical,
      images: [{ url: mgsAbsoluteUrl(project.cover), width: 1280, height: 854, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `MGS — ${title}`,
      description,
      images: [mgsAbsoluteUrl(project.cover)],
    },
  };
}

export default async function WorkDetailPage({
  params,
  searchParams,
}: WorkDetailPageProps) {
  const [{ slug }, { lang }, projects] = await Promise.all([params, searchParams, getMgsProjects()]);
  const locale = resolveMgsLocale(lang);
  const project = findMgsProject(projects, slug);

  if (!project) {
    notFound();
  }

  const pathname = `/work/${project.slug}`;
  const projectUrl = mgsAbsoluteUrl(`${pathname}?lang=${locale}`);
  const projectStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${projectUrl}#project`,
        name: project.title[locale],
        description: project.summary[locale],
        url: projectUrl,
        image: mgsAbsoluteUrl(project.cover),
        dateCreated: String(project.year),
        inLanguage: locale,
        creator: { "@id": `${mgsAbsoluteUrl("/")}#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "ru" ? "Работы" : "Work",
            item: mgsAbsoluteUrl(`/work?lang=${locale}`),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: project.title[locale],
            item: projectUrl,
          },
        ],
      },
    ],
  };

  return (
    <MgsSiteFrame locale={locale}>
      <MgsCaseStudy
        locale={locale}
        nextProject={getNextMgsProject(projects, project.slug)}
        project={project}
      />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(projectStructuredData) }} type="application/ld+json" />
    </MgsSiteFrame>
  );
}
