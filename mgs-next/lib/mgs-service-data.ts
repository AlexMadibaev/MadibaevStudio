import type { MgsLocale } from "@/lib/mgs-project-data";

export const mgsServiceNames = {
  branding: { ru: "Брендинг", en: "Branding" },
  "graphic-design": { ru: "Графический дизайн", en: "Graphic Design" },
  web: { ru: "Web", en: "Web" },
  "ui-ux": { ru: "UI/UX", en: "UI/UX" },
  "advertising-print": { ru: "Реклама и печать", en: "Advertising & Print" },
  "3d": { ru: "3D", en: "3D" },
} as const satisfies Record<string, Record<MgsLocale, string>>;

export const mgsServiceSlugs = Object.keys(mgsServiceNames) as Array<keyof typeof mgsServiceNames>;
export type MgsServiceSlug = keyof typeof mgsServiceNames;

export function isMgsServiceSlug(slug: string): slug is MgsServiceSlug {
  return mgsServiceSlugs.some((serviceSlug) => serviceSlug === slug);
}

export function getMgsServiceName(slug: string, locale: MgsLocale) {
  return isMgsServiceSlug(slug) ? mgsServiceNames[slug][locale] : undefined;
}
