import type { MetadataRoute } from "next";

import { listMgsAdminProjects } from "@/lib/mgs-content-store";
import { mgsServiceDefinitions } from "@/lib/mgs-service-data";
import { mgsAbsoluteUrl } from "@/lib/mgs-site-url";

export const dynamic = "force-dynamic";

const publicPaths = ["/", "/work", "/services", "/about", "/contact", "/privacy"];

function localizedUrl(pathname: string, locale: "ru" | "en") {
  const query = locale === "ru" && pathname === "/" ? "" : `?lang=${locale}`;
  return mgsAbsoluteUrl(`${pathname}${query}`);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects: adminProjects } = await listMgsAdminProjects();
  const publishedProjects = adminProjects.filter((project) => project.status === "published");

  const pages: MetadataRoute.Sitemap = publicPaths.flatMap((pathname) =>
    (["ru", "en"] as const).map((locale) => ({
      url: localizedUrl(pathname, locale),
      changeFrequency: pathname === "/" ? "weekly" : "monthly",
      priority: pathname === "/" ? 1 : 0.8,
      alternates: {
        languages: {
          ru: localizedUrl(pathname, "ru"),
          en: localizedUrl(pathname, "en"),
          "x-default": localizedUrl(pathname, "ru"),
        },
      },
    })),
  );

  const projects: MetadataRoute.Sitemap = publishedProjects.flatMap((project) =>
    (["ru", "en"] as const).map((locale) => ({
      url: localizedUrl(`/work/${project.slug}`, locale),
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly",
      priority: 0.9,
      images: [mgsAbsoluteUrl(project.cover)],
      alternates: {
        languages: {
          ru: localizedUrl(`/work/${project.slug}`, "ru"),
          en: localizedUrl(`/work/${project.slug}`, "en"),
          "x-default": localizedUrl(`/work/${project.slug}`, "ru"),
        },
      },
    })),
  );

  const services: MetadataRoute.Sitemap = mgsServiceDefinitions.flatMap((service) =>
    (["ru", "en"] as const).map((locale) => ({
      url: localizedUrl(`/services/${service.slug}`, locale),
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: {
          ru: localizedUrl(`/services/${service.slug}`, "ru"),
          en: localizedUrl(`/services/${service.slug}`, "en"),
          "x-default": localizedUrl(`/services/${service.slug}`, "ru"),
        },
      },
    })),
  );

  return [...pages, ...services, ...projects];
}
