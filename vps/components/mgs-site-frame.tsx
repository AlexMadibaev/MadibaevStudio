"use client";

import {
  ArrowUpRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { MgsLocale } from "@/lib/mgs-project-data";

type MgsSiteFrameProps = {
  children: ReactNode;
  locale: MgsLocale;
};

const copy = {
  ru: {
    navigation: [
      ["Работы", "/work"],
      ["Услуги", "/services"],
      ["О студии", "/about"],
    ],
    contact: "Обсудить проект",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    skipToContent: "Перейти к содержимому",
    language: "Выбор языка",
    availability: "Открыты для новых задач",
    location: "Душанбе · Работаем по всему миру",
    footerNavigation: "Навигация",
    social: "Связь",
    privacy: "Конфиденциальность",
    copyright: "© 2026 Madibaev Graphic Studio",
  },
  en: {
    navigation: [
      ["Work", "/work"],
      ["Services", "/services"],
      ["About", "/about"],
    ],
    contact: "Discuss a project",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
    language: "Language selection",
    availability: "Open to new briefs",
    location: "Dushanbe · Working worldwide",
    footerNavigation: "Navigation",
    social: "Contact",
    privacy: "Privacy",
    copyright: "© 2026 Madibaev Graphic Studio",
  },
} as const;

function hrefForLocale(pathname: string, locale: MgsLocale) {
  return `${pathname}?lang=${locale}`;
}

function hrefForLocaleWithSearch(
  pathname: string,
  locale: MgsLocale,
) {
  const nextSearchParams = new URLSearchParams(window.location.search);
  nextSearchParams.set("lang", locale);
  const query = nextSearchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export function MgsSiteFrame({ children, locale }: MgsSiteFrameProps) {
  const labels = copy[locale];
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const changeLocale = (nextLocale: MgsLocale) => {
    if (nextLocale === locale || isChangingLanguage) return;
    setIsMenuOpen(false);
    const localizedHref = hrefForLocaleWithSearch(pathname, nextLocale);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.replace(localizedHref, { scroll: false });
      return;
    }
    setIsChangingLanguage(true);
    window.setTimeout(() => router.replace(localizedHref, { scroll: false }), 340);
    window.setTimeout(() => setIsChangingLanguage(false), 940);
  };

  const closeMenu = () => setIsMenuOpen(false);
  const isActiveRoute = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="mgs-site">
      <a className="mgs-skip-link" href="#mgs-content">{labels.skipToContent}</a>
      <div className={isChangingLanguage ? "mgs-site__language-wash is-active" : "mgs-site__language-wash"} aria-hidden="true">
        <Image src="/mgs-logo.svg" alt="" width={196} height={67} priority />
      </div>

      <header className={isMenuOpen ? "mgs-site__header is-menu-open" : "mgs-site__header"}>
        <div className="mgs-site__header-inner mgs-shell">
          <Link className="mgs-site__logo" href={hrefForLocale("/", locale)} aria-label="Madibaev Graphic Studio" onClick={closeMenu}>
            <Image src="/mgs-logo.svg" alt="Madibaev Graphic Studio" width={112} height={38} priority />
          </Link>

          <div className="mgs-site__actions">
            <div className="mgs-site__language" aria-label={labels.language}>
              {(["ru", "en"] as const).map((item) => (
                <button
                  aria-pressed={locale === item}
                  className={locale === item ? "is-active" : undefined}
                  key={item}
                  onClick={() => changeLocale(item)}
                  type="button"
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
            <Link className="mgs-site__header-cta" href={hrefForLocale("/contact", locale)}>
              <span>{labels.contact}</span>
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
            <Button
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? labels.closeMenu : labels.openMenu}
              className="mgs-site__menu-toggle"
              onClick={() => setIsMenuOpen((open) => !open)}
              size="icon"
              type="button"
              variant="ghost"
            >
              {isMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
            </Button>
          </div>
        </div>
        <nav className="mgs-site__nav" aria-label="Main navigation">
          {labels.navigation.map(([label, href]) => (
            <Link
              aria-current={isActiveRoute(href) ? "page" : undefined}
              className={isActiveRoute(href) ? "is-active" : undefined}
              key={href}
              href={hrefForLocale(href, locale)}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}
          <Link className="mgs-site__nav-contact" href={hrefForLocale("/contact", locale)} onClick={closeMenu}>{labels.contact}</Link>
        </nav>
      </header>

      <div id="mgs-content" tabIndex={-1}>{children}</div>

      <footer className="mgs-site__footer">
        <div className="mgs-site__footer-inner mgs-shell">
          <div className="mgs-site__footer-brand">
            <Image src="/mgs-logo.svg" alt="Madibaev Graphic Studio" width={142} height={48} />
            <p>{labels.location}</p>
            <span className="mgs-site__availability"><i aria-hidden="true" />{labels.availability}</span>
          </div>
          <div>
            <p className="mgs-site__footer-label">{labels.footerNavigation}</p>
            {labels.navigation.map(([label, href]) => <Link key={href} href={hrefForLocale(href, locale)}>{label}</Link>)}
            <Link href={hrefForLocale("/contact", locale)}>{labels.contact}</Link>
            <Link href={hrefForLocale("/privacy", locale)}>{labels.privacy}</Link>
          </div>
          <div>
            <p className="mgs-site__footer-label">{labels.social}</p>
            <a href="mailto:info@madibaevstudio.online">info@madibaevstudio.online</a>
            <a href="https://t.me/madibaevstudio" rel="noreferrer" target="_blank">Telegram</a>
            <a href="https://instagram.com/madibaevstudio" rel="noreferrer" target="_blank">Instagram</a>
          </div>
          <small>{labels.copyright}</small>
        </div>
      </footer>
    </div>
  );
}
