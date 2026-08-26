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
      title: "От отдельной задачи до полноценного digital-продукта.",
      lead: "Мы не продаём заранее заготовленный набор услуг. Сначала разбираемся, что мешает бизнесу двигаться дальше, затем собираем под задачу нужную комбинацию стратегии, дизайна, разработки и production.",
      more: "Подробнее",
      approachTitle: "Как подходим к задаче",
      approachText: "Одна и та же проблема редко решается только логотипом, только интерфейсом или только кодом. Поэтому MGS может подключаться на одном этапе или вести проект целиком — от исследования и концепции до реализации и запуска.",
      fitTitle: "Когда это особенно нужно",
      deliverablesTitle: "Что входит в работу",
      processTitle: "Как идёт работа",
      resultTitle: "Что остаётся после работы",
      result: "Не красивый файл ради красивого файла, а решение, которое можно запустить, использовать, передать команде и развивать дальше.",
      startProject: "Обсудить проект",
      relatedTitle: "Связанные проекты",
      allServices: "Все услуги",
      openCase: "Открыть кейс",
    },
    about: {
      eyebrow: "О студии",
      title: "Мы подключаемся там, где задачу нужно не просто оформить — а решить.",
      lead: "Madibaev Graphic Studio — независимая design & digital студия из Душанбе, работающая с компаниями и командами без географических ограничений. Мы соединяем стратегию, визуальный дизайн, UX и разработку, чтобы вести проект от идеи до работающего результата.",
      founderTitle: "Основа студии",
      founder: "MGS основана Александром Мадибаевым как практика, в которой дизайн не отделён от бизнес-задачи и реализации. Сегодня проекты могут собираться командой под конкретную задачу, а клиент получает единый процесс и сопровождение на каждом этапе — без разрыва между теми, кто придумал решение, и теми, кто его запускает.",
      expertiseTitle: "Экспертиза",
      expertise: [
        "Брендинг и визуальные системы",
        "Web design & development",
        "UI/UX и digital-продукты",
        "Графический дизайн и презентации",
        "Рекламные кампании и event design",
        "Print, production и 3D-визуализация",
      ],
      numbers: [
        ["8+", "лет практики"],
        ["40+", "реализованных проектов"],
        ["12", "индустрий"],
      ],
      practiceTitle: "Как мы смотрим на работу",
      practice: "У клиента может быть точное техническое задание, сырая идея или только проблема, которую нужно решить. Во всех случаях наша задача — быстро понять бизнес-контекст, убрать лишнее и найти форму реализации, которая соответствует цели, бюджету, срокам и реальным условиям запуска.",
      principlesTitle: "Принципы",
      principles: [
        "Сначала понимаем проблему. Потом выбираем инструмент.",
        "Решение должно быть современным, но не зависеть от тренда ради тренда.",
        "Дизайн, UX и технология должны работать как одна система.",
        "Мы остаёмся рядом до момента, когда результат можно реально использовать.",
      ],
      processTitle: "От задачи до запуска",
      process: [
        ["01", "Brief", "Фиксируем задачу, цели, ограничения, сроки и критерии результата."],
        ["02", "Research", "Погружаемся в бизнес, аудиторию, рынок, продукт и текущую ситуацию."],
        ["03", "Concept", "Формируем направление и объясняем, почему именно оно отвечает задаче."],
        ["04", "Design", "Переводим идею в визуальную, интерфейсную или коммуникационную систему."],
        ["05", "Revisions", "Проверяем решение на реальных сценариях и дорабатываем согласованные детали."],
        ["06", "Production / Development", "Готовим материалы к производству или самостоятельно реализуем digital-часть."],
        ["07", "Launch", "Проверяем финальный результат и сопровождаем проект на этапе запуска."],
      ],
      cooperationTitle: "Формат сотрудничества",
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
      title: "From a focused task to a complete digital product.",
      lead: "We do not force projects into a predefined service package. First we understand what is holding the business back, then combine the right strategy, design, development, and production capabilities around the challenge.",
      more: "Learn more",
      approachTitle: "How we approach the work",
      approachText: "The same business problem is rarely solved by a logo alone, an interface alone, or code alone. MGS can join at one specific stage or lead the full project from research and concept through implementation and launch.",
      fitTitle: "When it helps",
      deliverablesTitle: "What is included",
      processTitle: "How the work moves",
      resultTitle: "What remains after the work",
      result: "Not a polished file for its own sake, but a solution that can be launched, used, handed over, and developed further.",
      startProject: "Discuss a project",
      relatedTitle: "Related projects",
      allServices: "All services",
      openCase: "Open case study",
    },
    about: {
      eyebrow: "About",
      title: "We step in when the challenge needs more than decoration — it needs a solution.",
      lead: "Madibaev Graphic Studio is an independent design & digital studio based in Dushanbe and working without geographic limits. We combine strategy, visual design, UX, and development to take projects from an idea to a working result.",
      founderTitle: "The studio",
      founder: "MGS was founded by Alexander Madibaev as a practice where design is not separated from the business challenge or its implementation. Today, teams can be assembled around the needs of each project, while the client gets one process and support at every stage — without a gap between the people defining the solution and the people launching it.",
      expertiseTitle: "Expertise",
      expertise: [
        "Branding and visual systems",
        "Web design & development",
        "UI/UX and digital products",
        "Graphic design and presentations",
        "Advertising campaigns and event design",
        "Print, production, and 3D visualization",
      ],
      numbers: [
        ["8+", "years of practice"],
        ["40+", "projects delivered"],
        ["12", "industries"],
      ],
      practiceTitle: "How we think about the work",
      practice: "A client may come with a precise brief, an early idea, or only a problem that needs solving. In every case, our job is to understand the business context quickly, remove what is unnecessary, and find a form of execution that fits the objective, budget, timing, and real launch conditions.",
      principlesTitle: "Principles",
      principles: [
        "Understand the problem first. Choose the tool second.",
        "The solution should feel current without chasing trends for their own sake.",
        "Design, UX, and technology should work as one system.",
        "We stay involved until the result is ready to be used in the real world.",
      ],
      processTitle: "From challenge to launch",
      process: [
        ["01", "Brief", "We align the challenge, goals, constraints, timing, and success criteria."],
        ["02", "Research", "We understand the business, audience, market, product, and current situation."],
        ["03", "Concept", "We define a direction and make the reasoning behind it clear."],
        ["04", "Design", "We turn the idea into a visual, interface, or communication system."],
        ["05", "Revisions", "We test the solution against real scenarios and refine the agreed details."],
        ["06", "Production / Development", "We prepare assets for production or build the digital part ourselves."],
        ["07", "Launch", "We check the final result and support the project through launch."],
      ],
      cooperationTitle: "Collaboration format",
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
          <p>{service.descriptionText}</p>
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
          <div className="mgs-section-heading"><div><p className="mgs-eyebrow">{copy.relatedTitle}</p><h2>{service.summaryText}</h2></div></div>
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
