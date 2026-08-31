"use client";

import { ArrowDownIcon, ArrowUpRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useState } from "react";

import type { MgsLocale, MgsProject } from "@/lib/mgs-project-data";

import styles from "./mgs-home-hero-v2.module.css";

type MgsHomeHeroV2Props = {
  locale: MgsLocale;
  featuredProject?: MgsProject;
};

const heroCopy = {
  ru: {
    opening: "Создаём",
    words: ["бренды", "сайты", "продукты", "системы"],
    closing: "которые работают.",
    lead: "Стратегия, дизайн и технологии в одной команде. Разбираемся в задаче, проектируем решение и доводим его до запуска.",
    primaryAction: "Обсудить проект",
    secondaryAction: "Смотреть работы",
    location: "Душанбе · работаем по всему миру",
    availability: "Открыты для новых проектов",
    selected: "Избранный проект",
    openProject: "Открыть проект",
    artLabel: "Design × Digital",
  },
  en: {
    opening: "We create",
    words: ["brands", "websites", "products", "systems"],
    closing: "that work.",
    lead: "Strategy, design, and technology in one team. We clarify the challenge, shape the solution, and take it all the way to launch.",
    primaryAction: "Discuss a project",
    secondaryAction: "View our work",
    location: "Dushanbe · working worldwide",
    availability: "Available for new projects",
    selected: "Selected project",
    openProject: "Open project",
    artLabel: "Design × Digital",
  },
} as const;

function withLocale(path: string, locale: MgsLocale) {
  return `${path}?lang=${locale}`;
}

export function MgsHomeHeroV2({ locale, featuredProject }: MgsHomeHeroV2Props) {
  const copy = heroCopy[locale];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setWordIndex(0);

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % copy.words.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [copy.words.length, locale]);

  const currentWord = copy.words[wordIndex];
  const stageStyle = { "--hero-phase": wordIndex } as CSSProperties;

  return (
    <section className={styles.hero} aria-labelledby="mgs-home-hero-title">
      <div className={styles.backgroundGrid} aria-hidden="true" />
      <div className={`mgs-shell ${styles.shell}`}>
        <div className={styles.intro}>
          <div className={styles.copy}>
            <h1
              id="mgs-home-hero-title"
              aria-label={`${copy.opening} ${copy.words[0]} ${copy.closing}`}
            >
              <span aria-hidden="true">{copy.opening}</span>
              <span className={styles.dynamicLine} aria-hidden="true">
                <span className={styles.dynamicWord} key={`${locale}-${currentWord}`}>{currentWord}</span>
              </span>
              <span aria-hidden="true">{copy.closing}</span>
            </h1>

            <p className={styles.lead}>{copy.lead}</p>

            <div className={styles.actions}>
              <Link className={`${styles.button} ${styles.buttonPrimary}`} href={withLocale("/contact", locale)}>
                <span>{copy.primaryAction}</span>
                <ArrowUpRightIcon aria-hidden="true" />
              </Link>
              <Link className={`${styles.button} ${styles.buttonSecondary}`} href="#selected-work">
                <span>{copy.secondaryAction}</span>
                <ArrowDownIcon aria-hidden="true" />
              </Link>
            </div>

            <div className={styles.meta}>
              <span>{copy.location}</span>
              <span className={styles.availability}><i aria-hidden="true" />{copy.availability}</span>
            </div>
          </div>

          <div className={styles.visual} style={stageStyle} aria-hidden="true">
            <div className={styles.visualGrid} />
            <div className={`${styles.glow} ${styles.glowBlue}`} />
            <div className={`${styles.glow} ${styles.glowPink}`} />
            <div className={`${styles.glow} ${styles.glowYellow}`} />

            <div className={styles.spectralRing} />
            <div className={`${styles.orbit} ${styles.orbitOne}`}><i /><i /></div>
            <div className={`${styles.orbit} ${styles.orbitTwo}`}><i /></div>
            <div className={`${styles.orbit} ${styles.orbitThree}`}><i /><i /></div>

            <div className={styles.core}>
              <span>MGS</span>
              <small>{copy.artLabel}</small>
            </div>

            <div className={`${styles.glassPanel} ${styles.glassPanelTop}`}>
              <span />
              <span />
              <span />
            </div>
            <div className={`${styles.glassPanel} ${styles.glassPanelBottom}`}>
              <i />
              <i />
            </div>

            <div className={styles.visualCounter}>{String(wordIndex + 1).padStart(2, "0")} / 04</div>
          </div>
        </div>

        {featuredProject ? (
          <Link className={styles.feature} href={withLocale(`/work/${featuredProject.slug}`, locale)}>
            <Image
              alt={featuredProject.title[locale]}
              className={styles.featureImage}
              fill
              priority
              sizes="(max-width: 820px) 100vw, 92vw"
              src={featuredProject.cover}
            />
            <div className={styles.featureShade} />
            <div className={styles.featureTop}>
              <span>{copy.selected} / {featuredProject.sequence}</span>
              <span>{featuredProject.category[locale]} · {featuredProject.year}</span>
            </div>
            <div className={styles.featureBottom}>
              <div>
                <p>{featuredProject.client[locale]}</p>
                <h2>{featuredProject.title[locale]}</h2>
              </div>
              <span className={styles.featureLink}>{copy.openProject}<ArrowUpRightIcon aria-hidden="true" /></span>
            </div>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
