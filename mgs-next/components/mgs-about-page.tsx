"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { MgsLocale } from "@/lib/mgs-project-data";

import styles from "./mgs-about-page.module.css";

const copy = {
  ru: {
    title: "От задачи до запуска.",
    lead: "Стратегия, дизайн, UX и разработка в одном процессе.",
    studioTitle: "Отвечаем за результат.",
    studioText: "MGS выросла из практики Александра Мадибаева, где дизайн не отделён от бизнес-задачи и реализации. Сегодня мы собираем под проект нужную команду и ведём клиента через единый процесс.",
    expertiseTitle: "Что делаем",
    expertise: [
      "Брендинг и визуальные системы",
      "Web design & development",
      "UI/UX и digital-продукты",
      "Графический дизайн и презентации",
      "Рекламные кампании и event design",
      "Print, production и 3D-визуализация",
    ],
    stats: [
      { value: 8, suffix: "+", label: "лет практики" },
      { value: 40, suffix: "+", label: "реализованных проектов" },
      { value: 12, suffix: "", label: "индустрий" },
    ],
    principlesTitle: "Сначала контекст. Потом форма.",
    principlesLead: "Сначала понимаем, что должно измениться. Потом выбираем инструмент.",
    principles: [
      "Понимаем проблему до того, как начинаем рисовать.",
      "Делаем современно, но не строим решение вокруг тренда ради тренда.",
      "Соединяем дизайн, UX и технологию в одну систему.",
      "Остаёмся вовлечены до момента, когда результат реально работает.",
    ],
    processTitle: "От брифа до запуска",
    processLead: "На каждом этапе понятно, что делаем и какой результат должен появиться дальше.",
    process: [
      ["01", "Brief", "Фиксируем задачу, цели, ограничения, сроки и критерии результата."],
      ["02", "Research", "Погружаемся в бизнес, аудиторию, рынок, продукт и текущую ситуацию."],
      ["03", "Concept", "Формируем направление и объясняем логику решения до детальной реализации."],
      ["04", "Design", "Собираем визуальную, интерфейсную или коммуникационную систему."],
      ["05", "Revisions", "Проверяем решение на реальных сценариях и уточняем согласованные детали."],
      ["06", "Production / Development", "Готовим материалы к производству или самостоятельно реализуем digital-часть."],
      ["07", "Launch", "Проверяем финальный результат и сопровождаем запуск."],
    ],
    cooperationTitle: "Работаем вместе",
    cooperation: [
      "Подключаемся к отдельной задаче или берём проект целиком.",
      "До старта фиксируем scope, этапы, сроки, зоны ответственности и критерии результата.",
      "На каждом этапе показываем логику решения, а не просто очередной вариант макета.",
      "После запуска передаём систему так, чтобы её можно было использовать и развивать дальше.",
    ],
    cta: "Обсудить проект",
  },
  en: {
    title: "From challenge to launch.",
    lead: "Strategy, design, UX, and development in one process.",
    studioTitle: "Accountable for the outcome.",
    studioText: "MGS grew from Alexander Madibaev's practice, where design was never separated from the business challenge or implementation. Today we assemble the right team and lead each project through one connected process.",
    expertiseTitle: "What we do",
    expertise: [
      "Branding and visual systems",
      "Web design & development",
      "UI/UX and digital products",
      "Graphic design and presentations",
      "Advertising campaigns and event design",
      "Print, production, and 3D visualization",
    ],
    stats: [
      { value: 8, suffix: "+", label: "years of practice" },
      { value: 40, suffix: "+", label: "projects delivered" },
      { value: 12, suffix: "", label: "industries" },
    ],
    principlesTitle: "Context first. Form second.",
    principlesLead: "First we define what needs to change. Then we choose the tool.",
    principles: [
      "Understand the problem before we start designing.",
      "Make it current without building the solution around a trend for its own sake.",
      "Connect design, UX, and technology as one system.",
      "Stay involved until the result works in the real world.",
    ],
    processTitle: "From brief to launch",
    processLead: "Every stage has a clear purpose and a clear next outcome.",
    process: [
      ["01", "Brief", "We align the challenge, goals, constraints, timing, and success criteria."],
      ["02", "Research", "We understand the business, audience, market, product, and current situation."],
      ["03", "Concept", "We define the direction and make the reasoning clear before detailed execution."],
      ["04", "Design", "We build the visual, interface, or communication system."],
      ["05", "Revisions", "We test the solution against real scenarios and refine the agreed details."],
      ["06", "Production / Development", "We prepare assets for production or build the digital part ourselves."],
      ["07", "Launch", "We check the final result and support the project through launch."],
    ],
    cooperationTitle: "Working together",
    cooperation: [
      "Bring us into one focused task or hand over the full project.",
      "Before work starts, we align scope, stages, timing, responsibilities, and success criteria.",
      "At every stage we explain the reasoning, not just present another design option.",
      "After launch, we hand over a system your team can use and develop further.",
    ],
    cta: "Discuss a project",
  },
} as const;

function hrefWithLocale(path: string, locale: MgsLocale) {
  return `${path}?lang=${locale}`;
}

function CountUp({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const duration = 1200;

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      run();
    }, { threshold: 0.35 });

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <article className={styles.stat} ref={ref}>
      <strong aria-label={`${value}${suffix}`}>{display}{suffix ? <span aria-hidden="true">{suffix}</span> : null}</strong>
      <p>{label}</p>
    </article>
  );
}

export function MgsAboutPage({ locale }: { locale: MgsLocale }) {
  const text = copy[locale];

  return (
    <main className={`mgs-shell ${styles.page}`}>
      <section className={styles.hero}>
        <h1>{text.title}</h1>
        <p>{text.lead}</p>
      </section>

      <section className={styles.intro}>
        <article className={styles.panel}>
          <h2>{text.studioTitle}</h2>
          <p>{text.studioText}</p>
        </article>
        <article className={styles.panel}>
          <h2>{text.expertiseTitle}</h2>
          <ol className={styles.expertiseList}>
            {text.expertise.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </article>
      </section>

      <section className={styles.stats} aria-label={locale === "ru" ? "Студия в цифрах" : "Studio in numbers"}>
        {text.stats.map((stat) => <CountUp key={stat.label} {...stat} />)}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <h2>{text.principlesTitle}</h2>
          <p>{text.principlesLead}</p>
        </div>
        <div className={styles.principles}>
          {text.principles.map((item, index) => (
            <article className={styles.principle} key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <h2>{text.processTitle}</h2>
          <p>{text.processLead}</p>
        </div>
        <div className={styles.process}>
          {text.process.map(([step, title, body]) => (
            <article className={styles.processItem} key={step}>
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cooperation}>
        <div className={styles.cooperationCopy}>
          <h2>{text.cooperationTitle}</h2>
          <Link className={styles.cta} href={hrefWithLocale("/contact", locale)}>
            <span>{text.cta}</span><ArrowUpRightIcon aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.cooperationBody}>
          <ul>{text.cooperation.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>
    </main>
  );
}
