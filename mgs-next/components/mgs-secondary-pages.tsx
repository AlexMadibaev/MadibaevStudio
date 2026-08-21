"use client";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import type { MgsLocale, MgsProject } from "@/lib/mgs-project-data";
import { mgsServiceDefinitions as serviceDefinitions } from "@/lib/mgs-service-data";

type MgsFilterId = "all" | "branding" | "digital" | "campaign";

const pageCopy = {
  ru: {
    work: {
      title: "Работы, где дизайн решает конкретную задачу.",
      description: "Кейсы Madibaev Graphic Studio: идентичность, сайты, digital-продукты и визуальные кампании.",
      eyebrow: "Работы",
      lead: "Здесь не просто готовые макеты. В каждом проекте — исходная задача, рабочая система и носители, на которых она живёт.",
      filters: {
        all: "Все",
        branding: "Брендинг",
        digital: "Digital",
        campaign: "Кампании",
      },
      result: "проектов найдено",
      open: "Открыть кейс",
      processTitle: "Что видно в сильном кейсе.",
      process: [
        "Ясная задача вместо абстрактного moodboard.",
        "Система вместо набора разрозненных макетов.",
        "Реализация, которую удобно запускать, показывать и развивать дальше.",
      ],
    },
    services: {
      title: "Услуги, из которых собирается зрелый визуальный язык бренда.",
      description: "Брендинг, графический дизайн, сайты, UI/UX, реклама, печать и 3D для брендов, продуктов и запусков.",
      eyebrow: "Услуги",
      lead: "MGS подключается, когда нужен не один экран или носитель, а цельная система: бренд, сайт, интерфейс, кампания или материалы для запуска.",
      more: "Подробнее",
      approachTitle: "Как подходим к задаче",
      approachText: "Начинаем с задачи, контекста и точки роста. Только после этого собираем форму, чтобы результат не просто выглядел эффектно, а держал смысл, масштабировался и помогал бизнесу.",
      fitTitle: "Когда это особенно нужно",
      deliverablesTitle: "Что получает команда",
      processTitle: "Как идёт работа",
      process: [
        "Фиксируем задачу, ограничения и состав результата.",
        "Собираем направление, систему и ключевые точки применения.",
        "Доводим детали и передаём рабочую основу для запуска.",
      ],
      resultTitle: "Что остаётся после работы",
      result: "Не набор разрозненных макетов, а рабочая система, с которой команде удобно запускаться, коммуницировать и масштабироваться дальше.",
      startProject: "Обсудить задачу",
      relatedTitle: "Связанные проекты",
      allServices: "Все услуги",
    },
    about: {
      title: "Студия, которая соединяет бренд, digital и реализацию в одну линию.",
      description: "О Madibaev Graphic Studio, подходе, принципах работы и формате сотрудничества.",
      eyebrow: "О студии",
      lead: "Madibaev Graphic Studio основана Александром Мадибаевым и работает на стыке брендинга, графического дизайна, сайтов и UI/UX. Фокус студии — делать выразительные проекты, которые держатся на ясной структуре и пригодны к реальной работе.",
      founderTitle: "Основатель",
      founder: "Александр Мадибаев — основатель и креативный директор MGS. Ведёт проекты от первого контекста до финальной системы, которую можно передать команде и использовать без постоянной поддержки извне.",
      expertiseTitle: "Экспертиза",
      expertise: ["Бренд-стратегия и айдентика", "Графический дизайн и кампании", "Сайты и digital-продукты", "UI/UX и дизайн-системы", "Печать, среда и 3D-визуализация"],
      timelineTitle: "Практика",
      timeline: "2019 — сегодня · Независимая дизайн-практика между Душанбе и международными проектами, с фокусом на бренды, digital и визуальные системы.",
      principlesTitle: "Принципы",
      principles: [
        "Сначала смысл и архитектура, потом эффект.",
        "Выразительность важна только тогда, когда она помогает считывать идею.",
        "Каждое решение должно выдерживать рост, передачу команде и реальное использование.",
      ],
      processTitle: "Как строится работа",
      process: [
        ["01", "Контекст", "Разбираем задачу, аудиторию, ограничения и то, что должно измениться после проекта."],
        ["02", "Исследование", "Собираем ориентиры, сценарии и материал, на котором можно строить решение."],
        ["03", "Направление", "Формулируем идею, тон и принципы, которые будут держать весь проект."],
        ["04", "Система", "Переводим направление в структуру, типографику, компоненты и правила применения."],
        ["05", "Проверка", "Примеряем решение к ключевым носителям, интерфейсу или коммуникации до продакшна."],
        ["06", "Реализация", "Доводим согласованные материалы до состояния, готового к выпуску."],
        ["07", "Передача", "Собираем файлы и правила так, чтобы команде было удобно продолжать работу."],
      ],
      cooperationTitle: "Формат сотрудничества",
      cooperation: [
        "Работа начинается после согласования задачи, объёма и сроков.",
        "Этапы и количество раундов правок фиксируем до старта.",
        "Дополнительные задачи и правки вне объёма оцениваются отдельно.",
        "Для новых проектов предусмотрена предоплата.",
      ],
      numbers: [
        ["8+", "лет в дизайне"],
        ["40+", "реализованных проектов"],
        ["12", "изученных индустрий"],
      ],
    },
    contact: {
      title: "Хороший проект начинается с точного брифа.",
      description: "Контактная страница Madibaev Graphic Studio для брифа, связи и старта нового проекта.",
      eyebrow: "Контакт",
      lead: "Если нужен брендинг, сайт, интерфейс или сильный визуальный язык для запуска, оставьте вводные. В ответ будет понятный следующий шаг по задаче, срокам и формату работы.",
      formTitle: "Короткий бриф",
      labels: {
        name: "Имя",
        company: "Компания",
        email: "Email",
        contact: "Telegram / WhatsApp",
        projectType: "Тип проекта",
        budget: "Бюджет",
        deadline: "Срок",
        message: "О проекте",
      },
      placeholders: {
        name: "Ваше имя / команда",
        email: "name@company.com",
        company: "Компания / проект",
        contact: "@username или +992…",
        budget: "Например, $2,000–5,000",
        deadline: "Ориентировочная дата",
        message: "Что нужно сделать, сроки и контекст",
      },
      projectTypes: ["Брендинг", "Сайт", "UI/UX", "Графический дизайн", "Печать / реклама", "3D", "Другое"],
      selectProjectType: "Выберите тип проекта",
      attachmentNote: "Если уже есть бриф, референсы или материалы, добавьте ссылку на папку в описании.",
      submit: "Отправить запрос",
      directTitle: "Напрямую",
      channels: [
        ["Email", "info@madibaevstudio.online"],
        ["Telegram", "@madibaevstudio"],
        ["География", "Душанбе / worldwide"],
      ],
      note: "Ответ обычно в течение 1–2 рабочих дней.",
    },
    thankYou: {
      title: "Запрос принят.",
      description: "Спасибо. Следующий шаг уже обозначен.",
      eyebrow: "Спасибо",
      lead: "Сообщение зафиксировано. Пока мы смотрим вводные, можно вернуться к кейсам или уточнить будущий объём проекта через услуги.",
      work: "Смотреть работы",
      services: "Смотреть услуги",
    },
    privacy: {
      title: "Политика конфиденциальности",
      description: "Как Madibaev Graphic Studio работает с контактными данными и содержанием заявок.",
      eyebrow: "Privacy",
      sections: [
        ["Какие данные собираются", "Имя, контактные данные, название компании и содержание сообщения, если вы сами их отправляете через форму или email."],
        ["Зачем они нужны", "Чтобы ответить на запрос, обсудить проект и подготовить следующий шаг по сотрудничеству."],
        ["Как данные хранятся", "Контактные данные не публикуются и используются только для коммуникации по проекту."],
        ["Передача третьим лицам", "Данные не продаются и не передаются третьим лицам без прямой необходимости для выполнения проекта."],
      ],
    },
    notFound: {
      title: "Такой страницы нет.",
      description: "Похоже, адрес устарел или был изменён при переработке сайта.",
      action: "Вернуться к работам",
    },
  },
  en: {
    work: {
      title: "Projects where brand, interface, and touchpoints work as one system.",
      description: "A selection of Madibaev Graphic Studio case studies across identity, websites, digital, and visual systems with clear logic and strong delivery.",
      eyebrow: "Work",
      lead: "This is not just a gallery. Each case shows what had to be solved, how the visual language was built, and why the result keeps working after launch.",
      filters: {
        all: "All",
        branding: "Branding",
        digital: "Digital",
        campaign: "Campaigns",
      },
      result: "projects found",
      open: "Open case study",
      processTitle: "What a strong case study should reveal.",
      process: [
        "A clear challenge instead of an abstract moodboard.",
        "A system instead of disconnected layouts.",
        "Execution that is ready to launch, present, and scale further.",
      ],
    },
    services: {
      title: "Services that build a more mature visual language for a brand.",
      description: "Branding, graphic design, websites, UI/UX, advertising, print, and 3D for brands, products, and launches.",
      eyebrow: "Services",
      lead: "MGS is brought in when the task is bigger than one screen or one asset and needs a coherent system: a brand, a website, a product interface, a campaign, or launch materials.",
      more: "Learn more",
      approachTitle: "Approach",
      approachText: "We start from the challenge, context, and growth point. Only then do we shape the form, so the result does not just look striking but also carries meaning, scales well, and supports the business.",
      fitTitle: "When it helps",
      deliverablesTitle: "What the team receives",
      processTitle: "How it moves",
      process: [
        "We align the task, constraints, and scope.",
        "We build the direction, the system, and the key points of application.",
        "We refine the details and hand over a working base for launch.",
      ],
      resultTitle: "What stays after the work",
      result: "Not a set of separate layouts, but a working system the team can launch with, communicate through, and continue to scale.",
      startProject: "Discuss a project",
      relatedTitle: "Related projects",
      allServices: "All services",
    },
    about: {
      title: "A studio that brings brand, digital, and execution into one line.",
      description: "About Madibaev Graphic Studio, the working principles, and the collaboration format.",
      eyebrow: "About",
      lead: "Madibaev Graphic Studio was founded by Alexander Madibaev and works across branding, graphic design, websites, and UI/UX. The focus is to create expressive work grounded in clear structure and ready for real use.",
      founderTitle: "Founder",
      founder: "Alexander Madibaev is the founder and creative director of MGS. He leads projects from the first context to a final system that teams can take over and use without constant outside support.",
      expertiseTitle: "Expertise",
      expertise: ["Brand strategy and identity", "Graphic design and campaigns", "Websites and digital products", "UI/UX and design systems", "Print, spatial touchpoints, and 3D visualisation"],
      timelineTitle: "Practice",
      timeline: "2019 — today · Independent practice between Dushanbe and international projects, focused on brands, digital, and visual systems.",
      principlesTitle: "Principles",
      principles: [
        "Meaning and structure come before effect.",
        "Expression matters only when it helps the idea read more clearly.",
        "Every decision should survive growth, handoff, and real-world use.",
      ],
      processTitle: "How work is structured",
      process: [
        ["01", "Context", "We unpack the task, audience, constraints, and what needs to change after the project."],
        ["02", "Research", "We gather references, scenarios, and material that can ground a useful response."],
        ["03", "Direction", "We define the idea, tone, and principles that will hold the full project together."],
        ["04", "System", "We turn the direction into structure, typography, components, and rules for use."],
        ["05", "Testing", "We apply the solution to key touchpoints, interface, or communication before production."],
        ["06", "Delivery", "We bring agreed materials to a finished state, ready to be used."],
        ["07", "Handover", "We package files and rules so the team can continue the work with ease."],
      ],
      cooperationTitle: "How we collaborate",
      cooperation: [
        "Work starts after the scope, deliverables, and timeline are agreed.",
        "Stages and revision rounds are set before the project begins.",
        "Additional tasks and revisions outside the scope are scoped separately.",
        "New projects begin with an advance payment.",
      ],
      numbers: [
        ["8+", "years in design"],
        ["40+", "projects delivered"],
        ["12", "industries explored"],
      ],
    },
    contact: {
      title: "A strong project starts with a precise brief.",
      description: "Madibaev Graphic Studio contact page for briefs, enquiries, and new project starts.",
      eyebrow: "Contact",
      lead: "If you need branding, a website, an interface, or a stronger visual language for a launch, send the context. The reply will define the next step for the task, timing, and collaboration format.",
      formTitle: "Short brief",
      labels: {
        name: "Name",
        company: "Company",
        email: "Email",
        contact: "Telegram / WhatsApp",
        projectType: "Project type",
        budget: "Budget",
        deadline: "Deadline",
        message: "About the project",
      },
      placeholders: {
        name: "Your name / team",
        email: "name@company.com",
        company: "Company / project",
        contact: "@username or +1…",
        budget: "For example, $2,000–5,000",
        deadline: "Target date",
        message: "What needs to happen, timing, and context",
      },
      projectTypes: ["Branding", "Website", "UI/UX", "Graphic Design", "Print / Advertising", "3D", "Other"],
      selectProjectType: "Select project type",
      attachmentNote: "If you already have a brief, references, or materials, add a folder link in the message.",
      submit: "Send enquiry",
      directTitle: "Direct contact",
      channels: [
        ["Email", "info@madibaevstudio.online"],
        ["Telegram", "@madibaevstudio"],
        ["Location", "Dushanbe / worldwide"],
      ],
      note: "Reply usually within 1–2 business days.",
    },
    thankYou: {
      title: "Enquiry received.",
      description: "Thank you. The next step is already clear.",
      eyebrow: "Thank you",
      lead: "The message is logged. While we review the context, you can return to the case studies or clarify the future scope through the services pages.",
      work: "View work",
      services: "View services",
    },
    privacy: {
      title: "Privacy policy",
      description: "How Madibaev Graphic Studio handles contact details and enquiry content.",
      eyebrow: "Privacy",
      sections: [
        ["What data is collected", "Name, contact details, company name, and message content if you choose to send them through the form or email."],
        ["Why it is needed", "To reply to the enquiry, discuss the project, and prepare the next collaboration step."],
        ["How data is stored", "Contact details are not published and are used only for project communication."],
        ["Third-party sharing", "Data is not sold or shared with third parties unless it is directly required to deliver the project."],
      ],
    },
    notFound: {
      title: "This page does not exist.",
      description: "The address may be outdated or changed during the site rebuild.",
      action: "Back to work",
    },
  },
} as const;

function hrefWithLocale(path: string, locale: MgsLocale) {
  return `${path}?lang=${locale}`;
}

function getWorkFilter(project: MgsProject): Exclude<MgsFilterId, "all"> {
  if (project.category.en === "Digital") return "digital";
  if (project.category.en === "Campaign") return "campaign";
  return "branding";
}

export function hasServiceSlug(slug: string) {
  return serviceDefinitions.some((item) => item.slug === slug);
}

function getService(locale: MgsLocale, slug: string, projects: readonly MgsProject[]) {
  const service = serviceDefinitions.find((item) => item.slug === slug);

  if (!service) {
    return undefined;
  }

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

export function MgsWorkPage({ locale, projects }: { locale: MgsLocale; projects: readonly MgsProject[] }) {
  const copy = pageCopy[locale].work;
  const [filter, setFilter] = useState<MgsFilterId>("all");
  const visibleProjects = filter === "all" ? projects : projects.filter((project) => getWorkFilter(project) === filter);

  return (
    <>
      <main className="mgs-route-page mgs-shell">
        <section className="mgs-route-hero">
          <p className="mgs-eyebrow">
            <span />
            {copy.eyebrow}
          </p>
          <div className="mgs-route-hero__heading">
            <h1>{copy.title}</h1>
            <p>{copy.lead}</p>
          </div>
        </section>

        <section className="mgs-work-filters" aria-label={copy.eyebrow}>
          <div className="mgs-work-filters__buttons">
            {(Object.keys(copy.filters) as MgsFilterId[]).map((item) => (
              <button
                aria-pressed={item === filter}
                className={item === filter ? "is-active" : undefined}
                key={item}
                onClick={() => setFilter(item)}
                type="button"
              >
                {copy.filters[item]}
              </button>
            ))}
          </div>
          <p>{visibleProjects.length} {copy.result}</p>
        </section>

        <section className="mgs-work-grid">
          {visibleProjects.map((project, index) => (
            <Link className="mgs-work-card" href={hrefWithLocale(`/work/${project.slug}`, locale)} key={project.slug}>
              <div className="mgs-work-card__image">
                <Image alt={project.title[locale]} fill priority={index === 0} sizes="(max-width: 900px) 100vw, 50vw" src={project.cover} />
              </div>
              <div className="mgs-work-card__meta">
                <p>{project.sequence} / {project.category[locale]} / {project.year}</p>
                <h2>{project.title[locale]}</h2>
                <p className="mgs-work-card__client">{project.client[locale]} · {project.discipline[locale]}</p>
                <span>{copy.open}<ArrowUpRightIcon aria-hidden="true" /></span>
              </div>
            </Link>
          ))}
        </section>

        <section className="mgs-route-process">
          <div className="mgs-section-heading">
            <div>
              <p className="mgs-eyebrow">{copy.eyebrow}</p>
              <h2>{copy.processTitle}</h2>
            </div>
          </div>
          <div className="mgs-route-process__grid">
            {copy.process.map((item, index) => (
              <article className="mgs-process-card" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export function MgsServicesPage({ locale }: { locale: MgsLocale }) {
  const copy = pageCopy[locale].services;

  return (
    <>
      <main className="mgs-route-page mgs-shell">
        <section className="mgs-route-hero">
          <p className="mgs-eyebrow">
            <span />
            {copy.eyebrow}
          </p>
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
    </>
  );
}

export function MgsServiceDetailPage({ locale, slug, projects }: { locale: MgsLocale; slug: string; projects: readonly MgsProject[] }) {
  const copy = pageCopy[locale].services;
  const service = getService(locale, slug, projects);

  if (!service) {
    return null;
  }

  return (
    <>
      <main className="mgs-route-page mgs-shell">
        <section className="mgs-route-hero">
          <p className="mgs-eyebrow">
            <span />
            {copy.eyebrow}
          </p>
          <div className="mgs-route-hero__heading">
            <h1>{service.title}</h1>
            <p>{service.descriptionText}</p>
          </div>
          <Link className="mgs-inline-link" href={hrefWithLocale("/services", locale)}>
            {copy.allServices}
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </section>

        <section className="mgs-service-detail">
          <article className="mgs-service-detail__panel">
            <p className="mgs-eyebrow">{copy.deliverablesTitle}</p>
            <ul>
              {service.deliverablesList.map((item) => (
                <li key={item}><CheckIcon aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </article>
          <article className="mgs-service-detail__panel">
            <p className="mgs-eyebrow">{copy.fitTitle}</p>
            <ul>
              {service.fitList.map((item) => (
                <li key={item}><SparklesIcon aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mgs-route-process">
          <div className="mgs-section-heading">
            <div>
              <p className="mgs-eyebrow">{copy.eyebrow}</p>
              <h2>{copy.processTitle}</h2>
            </div>
          </div>
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
              {copy.startProject}
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
          </article>
        </section>

        <section className="mgs-related-projects">
          <div className="mgs-section-heading">
            <div>
              <p className="mgs-eyebrow">{copy.relatedTitle}</p>
              <h2>{service.summaryText}</h2>
            </div>
          </div>
          <div className="mgs-related-projects__grid">
            {service.relatedProjects.map((project) => (
              <Link className="mgs-work-card" href={hrefWithLocale(`/work/${project.slug}`, locale)} key={project.slug}>
                <div className="mgs-work-card__image">
                  <Image alt={project.title[locale]} fill sizes="(max-width: 900px) 100vw, 50vw" src={project.cover} />
                </div>
                <div className="mgs-work-card__meta">
                  <p>{project.category[locale]} / {project.year}</p>
                  <h2>{project.title[locale]}</h2>
                  <p className="mgs-work-card__client">{project.client[locale]} · {project.discipline[locale]}</p>
                  <span>{pageCopy[locale].work.open}<ArrowUpRightIcon aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export function MgsAboutPage({ locale }: { locale: MgsLocale }) {
  const copy = pageCopy[locale].about;

  return (
    <>
      <main className="mgs-route-page mgs-shell">
        <section className="mgs-route-hero">
          <p className="mgs-eyebrow">
            <span />
            {copy.eyebrow}
          </p>
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
            <ul className="mgs-principles-list">
              {copy.expertise.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </section>

        <section className="mgs-about-numbers">
          {copy.numbers.map(([value, label]) => (
            <article key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </section>

        <section className="mgs-route-story">
          <article>
            <p className="mgs-eyebrow">{copy.timelineTitle}</p>
            <p>{copy.timeline}</p>
          </article>
        </section>

        <section className="mgs-route-story mgs-route-story--split">
          <article>
            <p className="mgs-eyebrow">{copy.principlesTitle}</p>
            <ul className="mgs-principles-list">
              {copy.principles.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article>
            <p className="mgs-eyebrow">{copy.processTitle}</p>
            <div className="mgs-about-process">
              {copy.process.map(([step, title, body]) => (
                <div key={step}>
                  <span>{step}</span>
                  <h2>{title}</h2>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mgs-route-story">
          <article>
            <p className="mgs-eyebrow">{copy.cooperationTitle}</p>
            <ul className="mgs-principles-list">
              {copy.cooperation.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </section>
      </main>
    </>
  );
}

export function MgsContactPage({ locale }: { locale: MgsLocale }) {
  const copy = pageCopy[locale].contact;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      contact: String(formData.get("contact") || "").trim(),
      projectType: String(formData.get("projectType") || "").trim(),
      budget: String(formData.get("budget") || "").trim(),
      deadline: String(formData.get("deadline") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "submit_failed");
      }

      const params = new URLSearchParams({
        lang: locale,
        name: payload.name,
      });

      router.push(`/thank-you?${params.toString()}`);
    } catch (error) {
      const fallback = locale === "ru"
        ? "Не удалось отправить запрос. Попробуйте ещё раз."
        : "Could not send the enquiry. Please try again.";

      setSubmitError(error instanceof Error && error.message !== "submit_failed" ? error.message : fallback);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="mgs-route-page mgs-shell">
        <section className="mgs-route-hero">
          <p className="mgs-eyebrow">
            <span />
            {copy.eyebrow}
          </p>
          <div className="mgs-route-hero__heading">
            <h1>{copy.title}</h1>
            <p>{copy.lead}</p>
          </div>
        </section>

        <section className="mgs-contact-layout">
          <form className="mgs-contact-form" onSubmit={handleSubmit}>
            <div className="mgs-contact-form__heading">
              <p className="mgs-eyebrow">{copy.formTitle}</p>
              <span>{copy.note}</span>
            </div>
            <div className="mgs-contact-form__fields">
              <label className="mgs-contact-form__field" htmlFor="enquiry-name">
                <span>{copy.labels.name}</span>
                <input autoComplete="name" id="enquiry-name" name="name" placeholder={copy.placeholders.name} required type="text" />
              </label>
              <label className="mgs-contact-form__field" htmlFor="enquiry-email">
                <span>{copy.labels.email}</span>
                <input autoComplete="email" id="enquiry-email" name="email" placeholder={copy.placeholders.email} required type="email" />
              </label>
              <label className="mgs-contact-form__field" htmlFor="enquiry-company">
                <span>{copy.labels.company}</span>
                <input autoComplete="organization" id="enquiry-company" name="company" placeholder={copy.placeholders.company} type="text" />
              </label>
              <label className="mgs-contact-form__field" htmlFor="enquiry-contact">
                <span>{copy.labels.contact}</span>
                <input autoComplete="tel" id="enquiry-contact" name="contact" placeholder={copy.placeholders.contact} type="text" />
              </label>
              <label className="mgs-contact-form__field" htmlFor="enquiry-project-type">
                <span>{copy.labels.projectType}</span>
                <span className="mgs-contact-form__select">
                  <select defaultValue="" id="enquiry-project-type" name="projectType">
                    <option disabled value="">{copy.selectProjectType}</option>
                    {copy.projectTypes.map((projectType) => <option key={projectType} value={projectType}>{projectType}</option>)}
                  </select>
                  <ChevronDownIcon aria-hidden="true" />
                </span>
              </label>
              <label className="mgs-contact-form__field" htmlFor="enquiry-budget">
                <span>{copy.labels.budget}</span>
                <input id="enquiry-budget" inputMode="decimal" name="budget" placeholder={copy.placeholders.budget} type="text" />
              </label>
              <label className="mgs-contact-form__field" htmlFor="enquiry-deadline">
                <span>{copy.labels.deadline}</span>
                <input id="enquiry-deadline" name="deadline" placeholder={copy.placeholders.deadline} type="text" />
              </label>
              <label className="mgs-contact-form__field mgs-contact-form__field--wide" htmlFor="enquiry-message">
                <span>{copy.labels.message}</span>
                <textarea id="enquiry-message" name="message" placeholder={copy.placeholders.message} required rows={7} />
              </label>
            </div>
            <p className="mgs-contact-form__attachment-note">{copy.attachmentNote}</p>
            <Button className="mgs-button mgs-button--primary" disabled={isSubmitting} type="submit">
              <span>{copy.submit}</span>
              <ArrowUpRightIcon aria-hidden="true" />
            </Button>
            {submitError ? <p className="mgs-contact-form__error" role="alert">{submitError}</p> : null}
          </form>

          <aside className="mgs-contact-panel">
            <p className="mgs-eyebrow">{copy.directTitle}</p>
            <ul>
              <li><EnvelopeIcon aria-hidden="true" /><a href="mailto:info@madibaevstudio.online">info@madibaevstudio.online</a></li>
              <li><GlobeAltIcon aria-hidden="true" /><a href="https://t.me/madibaevstudio" rel="noreferrer" target="_blank">@madibaevstudio</a></li>
            </ul>
            <div className="mgs-contact-panel__meta">
              {copy.channels.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

export function MgsThankYouPage({ locale }: { locale: MgsLocale }) {
  const copy = pageCopy[locale].thankYou;
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  return (
    <>
      <main className="mgs-route-page mgs-shell">
        <section className="mgs-route-hero mgs-route-hero--compact">
          <p className="mgs-eyebrow">
            <span />
            {copy.eyebrow}
          </p>
          <div className="mgs-route-hero__heading">
            <h1>{copy.title}</h1>
            <p>{name ? `${name}, ${copy.lead}` : copy.lead}</p>
          </div>
          <div className="mgs-thank-you__actions">
            <Button asChild className="mgs-button mgs-button--primary" size="lg">
              <Link href={hrefWithLocale("/work", locale)}>
                <span>{copy.work}</span>
                <ArrowUpRightIcon aria-hidden="true" />
              </Link>
            </Button>
            <Link className="mgs-inline-link" href={hrefWithLocale("/services", locale)}>
              {copy.services}
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export function MgsPrivacyPage({ locale }: { locale: MgsLocale }) {
  const copy = pageCopy[locale].privacy;

  return (
    <>
      <main className="mgs-route-page mgs-shell">
        <section className="mgs-route-hero mgs-route-hero--compact">
          <p className="mgs-eyebrow">
            <span />
            {copy.eyebrow}
          </p>
          <div className="mgs-route-hero__heading">
            <h1>{copy.title}</h1>
          </div>
        </section>

        <section className="mgs-privacy-grid">
          {copy.sections.map(([title, body]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

export function MgsNotFoundPage({ locale }: { locale: MgsLocale }) {
  const copy = pageCopy[locale].notFound;

  return (
    <>
      <main className="mgs-route-page mgs-shell">
        <section className="mgs-route-hero mgs-route-hero--compact">
          <p className="mgs-eyebrow">
            <span />
            404
          </p>
          <div className="mgs-route-hero__heading">
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </div>
          <Button asChild className="mgs-button mgs-button--primary" size="lg">
            <Link href={hrefWithLocale("/work", locale)}>
              <span>{copy.action}</span>
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </section>
      </main>
    </>
  );
}
