import type { Metadata } from "next";

import type { MgsLocale } from "@/lib/mgs-project-data";
import { mgsAbsoluteUrl } from "@/lib/mgs-site-url";

type MgsPageId = "home" | "work" | "services" | "about" | "contact" | "thank-you" | "privacy";

const pageMetadata: Record<MgsLocale, Record<MgsPageId, { title: string; description: string }>> = {
  ru: {
    home: {
      title: "Madibaev Graphic Studio — Design & Digital Studio",
      description: "Независимая design & digital студия: брендинг, web design & development, UI/UX, digital-продукты, кампании, print и 3D. Работаем с компаниями по всему миру.",
    },
    work: {
      title: "Портфолио и кейсы — Madibaev Graphic Studio",
      description: "Кейсы MGS по брендингу, сайтам, digital-продуктам, UI/UX и визуальным коммуникациям — с фокусом на задачу, систему и реализацию.",
    },
    services: {
      title: "Брендинг, Web Development и UI/UX — Madibaev Graphic Studio",
      description: "Стратегия, брендинг, графический дизайн, web design & development, UI/UX, digital-продукты, кампании, event design, print и 3D.",
    },
    about: {
      title: "О студии — Madibaev Graphic Studio",
      description: "MGS — design & digital студия из Душанбе: стратегия, брендинг, web development, UI/UX и production. Ведём проекты от бизнес-задачи до запуска.",
    },
    contact: {
      title: "Обсудить проект — Madibaev Graphic Studio",
      description: "Расскажите о задаче, цели, сроках и контексте. MGS предложит подходящий формат работы — от отдельной задачи до комплексного запуска.",
    },
    "thank-you": {
      title: "Спасибо — Madibaev Graphic Studio",
      description: "Ваша заявка отправлена в Madibaev Graphic Studio.",
    },
    privacy: {
      title: "Политика конфиденциальности — MGS",
      description: "Как Madibaev Graphic Studio обрабатывает контактные данные и заявки.",
    },
  },
  en: {
    home: {
      title: "Madibaev Graphic Studio — Design & Digital Studio",
      description: "Independent design & digital studio for branding, web design & development, UI/UX, digital products, campaigns, print, and 3D. Working with companies worldwide.",
    },
    work: {
      title: "Portfolio & Case Studies — Madibaev Graphic Studio",
      description: "MGS case studies across branding, websites, digital products, UI/UX, and visual communication — focused on the challenge, system, and execution.",
    },
    services: {
      title: "Branding, Web Development & UI/UX — Madibaev Graphic Studio",
      description: "Strategy, branding, graphic design, web design & development, UI/UX, digital products, campaigns, event design, print, and 3D.",
    },
    about: {
      title: "About the Studio — Madibaev Graphic Studio",
      description: "MGS is a design & digital studio based in Dushanbe, combining strategy, branding, web development, UI/UX, and production from challenge to launch.",
    },
    contact: {
      title: "Discuss a Project — Madibaev Graphic Studio",
      description: "Share the challenge, objective, timing, and context. MGS can support a focused task or lead a complete project through launch.",
    },
    "thank-you": {
      title: "Thank you — Madibaev Graphic Studio",
      description: "Your enquiry has been sent to Madibaev Graphic Studio.",
    },
    privacy: {
      title: "Privacy policy — MGS",
      description: "How Madibaev Graphic Studio handles contact details and enquiries.",
    },
  },
};

function localizedPath(pathname: string, locale: MgsLocale) {
  return locale === "ru" && pathname === "/" ? pathname : `${pathname}?lang=${locale}`;
}

export function getMgsPageMetadata(locale: MgsLocale, page: MgsPageId, pathname: string): Metadata {
  const metadata = pageMetadata[locale][page];
  const canonical = mgsAbsoluteUrl(localizedPath(pathname, locale));
  const isThankYouPage = page === "thank-you";

  return {
    metadataBase: new URL(mgsAbsoluteUrl("/")),
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical,
      languages: {
        ru: mgsAbsoluteUrl(localizedPath(pathname, "ru")),
        en: mgsAbsoluteUrl(localizedPath(pathname, "en")),
        "x-default": mgsAbsoluteUrl(localizedPath(pathname, "ru")),
      },
    },
    openGraph: {
      type: "website",
      title: metadata.title,
      description: metadata.description,
      url: canonical,
      images: [mgsAbsoluteUrl("/opengraph-image")],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [mgsAbsoluteUrl("/opengraph-image")],
    },
    robots: isThankYouPage ? { index: false, follow: false } : undefined,
  };
}
