import type { Metadata } from "next";

import type { MgsLocale } from "@/lib/mgs-project-data";
import { mgsAbsoluteUrl } from "@/lib/mgs-site-url";

type MgsPageId = "home" | "work" | "services" | "about" | "contact" | "thank-you" | "privacy";

const pageMetadata: Record<MgsLocale, Record<MgsPageId, { title: string; description: string }>> = {
  ru: {
    home: {
      title: "Madibaev Graphic Studio — брендинг и веб-дизайн в Душанбе",
      description: "Независимая студия брендинга и digital-дизайна в Душанбе: айдентика, сайты и интерфейсы для брендов и продуктов по всему миру.",
    },
    work: {
      title: "Портфолио и кейсы — Madibaev Graphic Studio",
      description: "Портфолио Madibaev Graphic Studio: кейсы по брендингу, веб-дизайну и визуальным системам с разбором задачи, подхода и результата.",
    },
    services: {
      title: "Брендинг, веб-дизайн и UI/UX — Madibaev Graphic Studio",
      description: "Брендинг, графический дизайн, сайты, UI/UX, печать, реклама и 3D для брендов, продуктов и запусков.",
    },
    about: {
      title: "О студии и Александре Мадибаеве — Madibaev Graphic Studio",
      description: "Madibaev Graphic Studio — независимая студия Александра Мадибаева в Душанбе на стыке брендинга, digital и визуальных систем.",
    },
    contact: {
      title: "Заказать брендинг или сайт — Madibaev Graphic Studio",
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
      title: "Madibaev Graphic Studio — Branding & Web Design in Dushanbe",
      description: "Independent branding and digital design studio in Dushanbe, working with brands and products worldwide: identity, websites, and interfaces.",
    },
    work: {
      title: "Portfolio & Case Studies — Madibaev Graphic Studio",
      description: "Madibaev Graphic Studio portfolio: branding, web design, and visual systems case studies with a clear breakdown of challenge, approach, and result.",
    },
    services: {
      title: "Branding, Web Design & UI/UX — Madibaev Graphic Studio",
      description: "Branding, graphic design, websites, UI/UX, print, advertising, and 3D for brands, products, and launches.",
    },
    about: {
      title: "About Alexander Madibaev — Madibaev Graphic Studio",
      description: "Madibaev Graphic Studio is Alexander Madibaev’s independent branding and digital design practice based in Dushanbe, working with clients worldwide.",
    },
    contact: {
      title: "Start a Branding or Web Project — Madibaev Graphic Studio",
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
