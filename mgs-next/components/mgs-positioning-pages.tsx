import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

import type { MgsLocale, MgsProject } from "@/lib/mgs-project-data";
import { mgsServiceDefinitions as serviceDefinitions } from "@/lib/mgs-service-data";

const positioningCopy = {
  ru: {
    services: {
      eyebrow: "Услуги",
      title: "От задачи — к запуску.",
      lead: "Стратегия, дизайн и разработка под конкретную задачу — от отдельного этапа до полного запуска.",
      more: "Подробнее",
      approachTitle: "Подход",
      approachText: "Сначала определяем задачу. Затем собираем нужную связку стратегии, дизайна и разработки.",
      fitTitle: "Когда подключаемся",
      deliverablesTitle: "Что входит",
      processTitle: "Как работаем",
      resultTitle: "Результат",
      result: "Готовая система, которую можно запустить, использовать и развивать.",
      startProject: "Обсудить проект",
      relatedTitle: "Связанные проекты",
      allServices: "Все услуги",
      openCase: "Открыть кейс",
    },
    about: {
      eyebrow: "О студии",
      title: "От задачи — к результату.",
      lead: "Стратегия, дизайн, UX и разработка в одном процессе — от идеи до запуска.",
      founderTitle: "Студия",
      founder: "MGS основана Александром Мадибаевым как практика, в которой дизайн не отделён от бизнес-задачи и реализации. Сегодня проекты могут собираться командой под конкретную задачу, а клиент получает единый процесс и сопровождение на каждом этапе — без разрыва между теми, кто придумал решение, и теми, кто его запускает.",
      expertiseTitle: "Экспертиза",
      expertise: [
        "Брендинг и визуальные системы",
        "Сайты",
        "Интерфейсы и дизайн-системы",
        "Графический дизайн и презентации",
        "Реклама и печать",
        "3D-визуализация",
      ],
      numbers: [
        ["8+", "лет практики"],
        ["40+", "реализованных проектов"],
        ["12", "индустрий"],
      ],
      practiceTitle: "Подход",
      practice: "У клиента может быть точное техническое задание, сырая идея или только проблема, которую нужно решить. Во всех случаях наша задача — быстро понять бизнес-контекст, убрать лишнее и найти форму реализации, которая соответствует цели, бюджету, срокам и реальным условиям запуска.",
      principlesTitle: "Принципы",
      principles: [
        "Сначала понимаем проблему. Потом выбираем инструмент.",
        "Решение должно быть современным, но не зависеть от тренда ради тренда.",
        "Дизайн, UX и технология должны работать как одна система.",
        "Мы остаёмся рядом до момента, когда результат можно реально использовать.",
      ],
      processTitle: "Процесс",
      process: [
        ["01", "Brief", "Фиксируем задачу, цели, ограничения, сроки и критерии результата."],
        ["02", "Research", "Погружаемся в бизнес, аудиторию, рынок, продукт и текущую ситуацию."],
        ["03", "Concept", "Формируем направление и объясняем, почему именно оно отвечает задаче."],
        ["04", "Design", "Переводим идею в визуальную, интерфейсную или коммуникационную систему."],
        ["05", "Revisions", "Проверяем решение на реальных сценариях и дорабатываем согласованные детали."],
        ["06", "Production / Development", "Готовим материалы к производству или самостоятельно реализуем digital-часть."],
        ["07", "Launch", "Проверяем финальный результат и сопровождаем проект на этапе запуска."],
      ],
      cooperationTitle: "Сотрудничество",
      cooperation: [
        "Можно подключить нас к отдельной задаче или передать проект целиком.",
        "До старта фиксируем объём, этапы, сроки и количество раундов правок.",
        "Дополнительный объём оценивается отдельно и не смешивается с согласованным scope.",
        "Для новых проектов работа начинается с предоплаты.",
      ],
    },
  },
  en: {
    services: {
      eyebrow: "Services",
      title: "From challenge to launch.",
      lead: "Strategy, design, and development shaped around the task — from one stage to a full launch.",
      more: "Learn more",
      approachTitle: "Approach",
      approachText: "We define the challenge first, then combine the strategy, design, and development it actually needs.",
      fitTitle: "When we join",
      deliverablesTitle: "What's included",
      processTitle: "How we work",
      resultTitle: "Result",
      result: "A working system ready to launch, use, and grow.",
      startProject: "Discuss a project",
      relatedTitle: "Related projects",
      allServices: "All services",
      openCase: "Open case study",
    },
    about: {
      eyebrow: "About",
      title: "From challenge to result.",
      lead: "Strategy, design, UX, and development in one process — from idea to launch.",
      founderTitle: "Studio",
      founder: "MGS was founded by Alexander Madibaev as a practice where design is not separated from the business challenge or its implementation. Today, teams can be assembled around the needs of each project, while the client gets one process and support at every stage — without a gap between the people defining the solution and the people launching it.",
      expertiseTitle: "Expertise",
      expertise: [
        "Branding and visual systems",
        "Websites",
        "UI/UX design systems",
        "Graphic design and presentations",
        "Advertising and print",
        "3D visualization",
      ],
      numbers: [
        ["8+", "years of practice"],
        ["40+", "projects delivered"],
        ["12", "industries"],
      ],
      practiceTitle: "Approach",
      practice: "A client may come with a precise brief, an early idea, or only a problem that needs solving. In every case, our job is to understand the business context quickly, remove what is unnecessary, and find a form of execution that fits the objective, budget, timing, and real launch conditions.",
      principlesTitle: "Principles",
      principles: [
        "Understand the problem first. Choose the tool second.",
        "The solution should feel current without chasing trends for their own sake.",
        "Design, UX, and technology should work as one system.",
        "We stay involved until the result is ready to be used in the real world.",
      ],
      processTitle: "Process",
      process: [
        ["01", "Brief", "We align the challenge, goals, constraints, timing, and success criteria."],
        ["02", "Research", "We understand the business, audience, market, product, and current situation."],
        ["03", "Concept", "We define a direction and make the reasoning behind it clear."],
        ["04", "Design", "We turn the idea into a visual, interface, or communication system."],
        ["05", "Revisions", "We test the solution against real scenarios and refine the agreed details."],
        ["06", "Production / Development", "We prepare assets for production or build the digital part ourselves."],
        ["07", "Launch", "We check the final result and support the project through launch."],
      ],
      cooperationTitle: "Collaboration",
      cooperation: [
        "Bring us into one focused task or hand over the full project.",
        "Scope, stages, timing, and revision rounds are agreed before work begins.",
        "Additional scope is estimated separately and kept distinct from the agreed work.",
        "New projects begin with an advance payment.",
      ],
    },
  },
} as const;

function hrefWithLocale(path: string, locale: MgsLocale) {
  return `${path}?lang=${locale}`;
}

function getService(locale: MgsLocale, slug: string, projects: readonly MgsProject[]) {
  const service = serviceDefinitions.find((item) => item.slug === slug);

  if (!service) return undefined;

  return {
    ...service,
    title: service.name[locale],
    summaryText: service.summary[locale],
    descriptionText: service.description[locale],
    deliverablesList: service.deliverables[locale],
    fitList: service.fit[locale],
    processList: service.process[locale],
    relatedProjects: service.relatedProjectSlugs
      .map((projectSlug) => projects.find((project) => project.slug === projectSlug))
      .filter((project): project is MgsProject => Boolean(project)),
  };
}

export function MgsPositioningServicesPage({ locale }: { locale: MgsLocale }) {
  const copy = positioningCopy[locale].services;

  return (
    <main className="mgs-route-page mgs-shell">
      <section className="mgs-route-hero">
        <p className="mgs-eyebrow"><span />{copy.eyebrow}</p>
        <div className="mgs-route-hero__heading">
          <h1>{copy.title}</h1>
          <p>{copy.lead}</p>
        </div>
      </section>

      <section className="mgs-services-grid">
        {serviceDefinitions.map((service, index) => (
          <Link className={`mgs-service-card mgs-service-card--${(index % 3) + 1}`} href={hrefWithLocale(`/services/${service.slug}`, locale)} key={service.slug}>
            <p>{String(index + 1).padStart(2, "0")}</p>
            <h2>{service.name[locale]}</h2>
            <span>{service.summary[locale]}</span>
            <strong>{copy.more}<ArrowRightIcon aria-hidden="true" /></strong>
          </Link>
        ))}
      </section>

      <section className="mgs-route-story">
        <article>
          <p className="mgs-eyebrow">{copy.approachTitle}</p>
          <p>{copy.approachText}</p>
        </article>
      </section>
    </main>
  );
}

export function MgsPositioningServiceDetailPage({ locale, slug, projects }: { locale: MgsLocale; slug: string; projects: readonly MgsProject[] }) {
  const copy = positioningCopy[locale].services;
  const service = getService(locale, slug, projects);

  if (!service) return null;

  return (
    <main className="mgs-route-page mgs-shell">
      <section className="mgs-route-hero">
        <p className="mgs-eyebrow"><span />{copy.eyebrow}</p>
        <div className="mgs-route-hero__heading">
          <h1>{service.title}</h1>
          <p>{service.summaryText}</p>
        </div>
        <Link className="mgs-inline-link" href={hrefWithLocale("/services", locale)}>
          {copy.allServices}<ArrowRightIcon aria-hidden="true" />
        </Link>
      </section>

      <section className="mgs-service-detail">
        <article className="mgs-service-detail__panel">
          <p className="mgs-eyebrow">{copy.deliverablesTitle}</p>
          <ul>{service.deliverablesList.map((item) => <li key={item}><CheckIcon aria-hidden="true" />{item}</li>)}</ul>
        </article>
        <article className="mgs-service-detail__panel">
          <p className="mgs-eyebrow">{copy.fitTitle}</p>
          <ul>{service.fitList.map((item) => <li key={item}><SparklesIcon aria-hidden="true" />{item}</li>)}</ul>
        </article>
      </section>

      <section className="mgs-route-process">
        <div className="mgs-section-heading"><div><p className="mgs-eyebrow">{copy.eyebrow}</p><h2>{copy.processTitle}</h2></div></div>
        <div className="mgs-route-process__grid">
          {service.processList.map((item, index) => (
            <article className="mgs-process-card" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mgs-route-story">
        <article>
          <p className="mgs-eyebrow">{copy.resultTitle}</p>
          <p>{copy.result}</p>
          <Link className="mgs-inline-link mgs-route-story__action" href={hrefWithLocale("/contact", locale)}>
            {copy.startProject}<ArrowUpRightIcon aria-hidden="true" />
          </Link>
        </article>
      </section>

      {service.relatedProjects.length ? (
        <section className="mgs-related-projects">
          <div className="mgs-section-heading"><div><p className="mgs-eyebrow">{copy.relatedTitle}</p><h2>{copy.relatedTitle}</h2></div></div>
          <div className="mgs-related-projects__grid">
            {service.relatedProjects.map((project) => (
              <Link className="mgs-work-card" href={hrefWithLocale(`/work/${project.slug}`, locale)} key={project.slug}>
                <div className="mgs-work-card__image"><Image alt={project.title[locale]} fill sizes="(max-width: 900px) 100vw, 50vw" src={project.cover} /></div>
                <div className="mgs-work-card__meta">
                  <p>{project.category[locale]} / {project.year}</p>
                  <h2>{project.title[locale]}</h2>
                  <p className="mgs-work-card__client">{project.client[locale]} · {project.discipline[locale]}</p>
                  <span>{copy.openCase}<ArrowUpRightIcon aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

export function MgsPositioningAboutPage({ locale }: { locale: MgsLocale }) {
  const copy = positioningCopy[locale].about;

  return (
    <main className="mgs-route-page mgs-shell">
      <section className="mgs-route-hero">
        <p className="mgs-eyebrow"><span />{copy.eyebrow}</p>
        <div className="mgs-route-hero__heading">
          <h1>{copy.title}</h1>
          <p>{copy.lead}</p>
        </div>
      </section>

      <section className="mgs-route-story mgs-route-story--split">
        <article>
          <p className="mgs-eyebrow">{copy.founderTitle}</p>
          <p>{copy.founder}</p>
        </article>
        <article>
          <p className="mgs-eyebrow">{copy.expertiseTitle}</p>
          <ul className="mgs-principles-list">{copy.expertise.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </section>

      <section className="mgs-about-numbers">
        {copy.numbers.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}
      </section>

      <section className="mgs-route-story">
        <article>
          <p className="mgs-eyebrow">{copy.practiceTitle}</p>
          <p>{copy.practice}</p>
        </article>
      </section>

      <section className="mgs-route-story mgs-route-story--split">
        <article>
          <p className="mgs-eyebrow">{copy.principlesTitle}</p>
          <ul className="mgs-principles-list">{copy.principles.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article>
          <p className="mgs-eyebrow">{copy.processTitle}</p>
          <div className="mgs-about-process">
            {copy.process.map(([step, title, body]) => (
              <div key={step}><span>{step}</span><h2>{title}</h2><p>{body}</p></div>
            ))}
          </div>
        </article>
      </section>

      <section className="mgs-route-story">
        <article>
          <p className="mgs-eyebrow">{copy.cooperationTitle}</p>
          <ul className="mgs-principles-list">{copy.cooperation.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </section>
    </main>
  );
}
