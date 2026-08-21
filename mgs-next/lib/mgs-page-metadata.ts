import type { Metadata } from "next";

import type { MgsLocale } from "@/lib/mgs-project-data";
import { mgsAbsoluteUrl } from "@/lib/mgs-site-url";

type MgsPageId = "home" | "work" | "services" | "about" | "contact" | "thank-you" | "privacy";

const pageMetadata: Record<MgsLocale, Record<MgsPageId, { title: string; description: string }>> = {
  ru: {
    home: {
      title: "Madibaev Graphic Studio — дизайн-студия",
      description: "Независимая студия брендинга и digital-дизайна: визуальные системы, сайты и интерфейсы для брендов и продуктов.",
    },
    work: {
      title: "Работы — Madibaev Graphic Studio",
      description: "Кейсы Madibaev Graphic Studio: айдентика, сайты, digital и визуальные системы с ясной логикой и сильной подачей.",
    },
    services: {
      title: "Услуги — Madibaev Graphic Studio",
      description: "Брендинг, графический дизайн, сайты, UI/UX, печать, реклама и 3D для брендов, продуктов и запусков.",
    },
    about: {
      title: "О студии — Madibaev Graphic Studio",
      description: "Madibaev Graphic Studio — независимая студия Александра Мадибаева на стыке брендинга, digital и визуальных систем.",
    },
    contact: {
      title: "Начать проект — Madibaev Graphic Studio",
      description: "Опишите задачу, сроки и контекст — MGS вернётся с понятным следующим шагом.",
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
      title: "Madibaev Graphic Studio — independent design studio",
      description: "Independent branding and digital design studio for visual systems, websites, and interfaces.",
    },
    work: {
      title: "Work — Madibaev Graphic Studio",
      description: "Madibaev Graphic Studio case studies across identity, websites, digital, and visual systems.",
    },
    services: {
      title: "Services — Madibaev Graphic Studio",
      description: "Branding, graphic design, websites, UI/UX, print, advertising, and 3D for brands, products, and launches.",
    },
    about: {
      title: "About — Madibaev Graphic Studio",
      description: "Madibaev Graphic Studio is Alexander Madibaev’s independent practice across branding, digital, and visual systems.",
    },
    contact: {
      title: "Start a project — Madibaev Graphic Studio",
      description: "Share the context, timing, and scope, and MGS will return with a clear next step.",
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
