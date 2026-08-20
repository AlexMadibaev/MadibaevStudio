import type { MetadataRoute } from "next";

import { mgsProjects } from "@/lib/mgs-project-data";
import { mgsAbsoluteUrl } from "@/lib/mgs-site-url";

const publicPaths = ["/", "/work", "/services", "/about", "/contact", "/privacy"];

function localizedUrl(pathname: string, locale: "ru" | "en") {
  const query = locale === "ru" && pathname === "/" ? "" : `?lang=${locale}`;
  return mgsAbsoluteUrl(`${pathname}${query}`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = publicPaths.flatMap((pathname) =>
    (["ru", "en"] as const).map((locale) => ({
      url: localizedUrl(pathname, locale),
      lastModified,
      changeFrequency: pathname === "/" ? "weekly" : "monthly",
      priority: pathname === "/" ? 1 : 0.8,
      alternates: {
        languages: {
          ru: localizedUrl(pathname, "ru"),
          en: localizedUrl(pathname, "en"),
        },
      },
    })),
  );

  const projects: MetadataRoute.Sitemap = mgsProjects.flatMap((project) =>
    (["ru", "en"] as const).map((locale) => ({
      url: localizedUrl(`/work/${project.slug}`, locale),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [mgsAbsoluteUrl(project.cover)],
      alternates: {
        languages: {
          ru: localizedUrl(`/work/${project.slug}`, "ru"),
          en: localizedUrl(`/work/${project.slug}`, "en"),
        },
      },
    })),
  );

  return [...pages, ...projects];
}
