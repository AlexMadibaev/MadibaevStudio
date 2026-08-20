import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

import type { MgsLocale, MgsProject } from "@/lib/mgs-project-data";

type MgsCaseStudyProps = {
  locale: MgsLocale;
  project: MgsProject;
  nextProject: MgsProject;
};

const copy = {
  ru: {
    language: "Язык сайта",
    tajik: "Таджикский язык скоро появится",
    work: "Работы",
    allWork: "Все проекты",
    start: "Начать проект",
    caseStudy: "Кейс",
    services: "Услуги",
    year: "Год",
    client: "Клиент",
    industry: "Индустрия",
    discipline: "Направление",
    about: "О проекте",
    overview: "Обзор",
    challenge: "Задача",
    approach: "Подход",
    outcome: "Что создано",
    nextProject: "Следующий проект",
    viewCase: "Смотреть кейс",
    contactKicker: "Новый проект",
    contactTitle: "Нужен кейс такого же уровня для вашего проекта?",
    contactAction: "Начать обсуждение",
    location: "Душанбе · Весь мир",
    availability: "Открыты для новых проектов",
    visualLabel: "Визуальная композиция проекта",
  },
  en: {
    language: "Site language",
    tajik: "Tajik language is coming soon",
    work: "Work",
    allWork: "All projects",
    start: "Start a project",
    caseStudy: "Case study",
    services: "Services",
    year: "Year",
    client: "Client",
    industry: "Industry",
    discipline: "Discipline",
    about: "About the project",
    overview: "Overview",
    challenge: "Challenge",
    approach: "Approach",
    outcome: "Delivered",
    nextProject: "Next project",
    viewCase: "View case study",
    contactKicker: "New project",
    contactTitle: "Need this level of clarity for your project?",
    contactAction: "Start the conversation",
    location: "Dushanbe · Worldwide",
    availability: "Open to new projects",
    visualLabel: "Project visual composition",
  },
} as const;

function projectHref(slug: string, locale: MgsLocale) {
  return `/work/${slug}?lang=${locale}`;
}

function routeHref(route: "work" | "contact", locale: MgsLocale) {
  return `/${route}?lang=${locale}`;
}

function getCaseNarrative(project: MgsProject, locale: MgsLocale) {
  const heading = project.blocks.find((block) => block.type === "heading")?.content[locale] ?? project.summary[locale];
  const body = project.blocks
    .filter((block) => block.type === "paragraph")
    .map((block) => block.content[locale])
    .join(" ");

  const narrative = {
    ru: {
      nava: {
        challenge:
          "Культурной инициативе нужна была айдентика, которая звучит современно, но не теряет глубину, точность и устойчивость на разных носителях.",
        approach: `${body} В основе решения — ${project.services[locale].join(" и ").toLowerCase()}, собранные в одну дисциплинированную систему с ясными правилами применения.`,
        outcome:
          "Для проекта была собрана базовая айдентика: знак, типографические правила и визуальные принципы для афиш, презентаций и цифровых материалов.",
      },
      aria: {
        challenge:
          "Цифровому продукту была нужна среда, где сложный контент считывается быстро, а навигация остаётся уверенной на каждом этапе сценария.",
        approach: `${body} Мы собрали интерфейс вокруг содержания и опирались на ${project.services[locale].join(" и ").toLowerCase()} как на единый рабочий каркас с ясной иерархией.`,
        outcome:
          "На выходе была подготовлена система экранов и навигационных состояний с общей типографической и визуальной логикой для дальнейшей цифровой разработки.",
      },
      solo: {
        challenge:
          "Фестивалю требовалась кампания, способная держать вместе программу, сцену и коммуникацию, не теряя энергии и узнаваемости на разных форматах.",
        approach: `${body} Визуальный язык строится через ${project.services[locale].join(" и ").toLowerCase()}, чтобы каждое касание чувствовалось частью одной программы и одного ритма.`,
        outcome:
          "Для кампании были собраны ключевые графические приёмы и носители, которые можно развивать в анонсах, навигации и сценической коммуникации.",
      },
      north: {
        challenge:
          "Для независимой обжарочной компании было важно сделать упаковку и айдентику, которые помогают выбирать продукт быстро, интуитивно и с доверием.",
        approach: `${body} Система опирается на ${project.services[locale].join(" и ").toLowerCase()} и удерживает баланс между тактильностью, информацией и полочным характером.`,
        outcome:
          "В проект были собраны упаковочные и айдентификационные принципы, которые задают единый характер линейке и дают основу для расширения ассортимента.",
      },
    },
    en: {
      nava: {
        challenge:
          "The cultural initiative needed an identity that feels contemporary while still holding depth, clarity, and consistency across very different touchpoints.",
        approach: `${body} The solution is grounded in ${project.services[locale].join(" and ").toLowerCase()}, brought together as one disciplined system with clear rules for use.`,
        outcome:
          "The project package includes a core identity system: a mark, typographic rules, and visual principles prepared for posters, presentations, and digital materials.",
      },
      aria: {
        challenge:
          "The digital product needed an environment where complex content reads fast and navigation remains confident across the full journey.",
        approach: `${body} The interface was shaped around content first, using ${project.services[locale].join(" and ").toLowerCase()} as one working framework with clear hierarchy.`,
        outcome:
          "The deliverable is a screen and navigation system with one typographic and visual logic, prepared as a clear base for further digital production.",
      },
      solo: {
        challenge:
          "The festival needed a campaign system capable of holding programme, stage, and communication together without losing energy or recognisability across formats.",
        approach: `${body} The visual language is driven by ${project.services[locale].join(" and ").toLowerCase()} so every touchpoint feels part of one programme and one rhythm.`,
        outcome:
          "The output includes key campaign devices and sample applications that can be extended across announcements, wayfinding, and stage communication.",
      },
      north: {
        challenge:
          "The independent roastery needed packaging and identity that help people choose the product quickly, intuitively, and with confidence.",
        approach: `${body} The system leans on ${project.services[locale].join(" and ").toLowerCase()} and balances tactility, information, and shelf presence.`,
        outcome:
          "The project defines packaging and identity principles that give the range one recognisable character and a workable base for future extensions.",
      },
    },
  } as const;

  return {
    heading,
    overview: project.summary[locale],
    challenge: narrative[locale][project.visual].challenge,
    approach: narrative[locale][project.visual].approach,
    outcome: narrative[locale][project.visual].outcome,
  };
}

function MgsCaseArrow({ direction = "up" }: { direction?: "up" | "right" | "left" }) {
  const Icon = direction === "left" ? ArrowLeftIcon : direction === "right" ? ArrowRightIcon : ArrowUpRightIcon;

  return <Icon aria-hidden="true" className="mgs-case__arrow" />;
}

export function MgsCaseStudy({ locale, project, nextProject }: MgsCaseStudyProps) {
  const labels = copy[locale];
  const projectClass = `mgs-case--${project.visual}`;
  const narrative = getCaseNarrative(project, locale);

  return (
    <main className={`mgs-case ${projectClass}`} lang={locale}>
      <article className="mgs-case__shell">
        <section aria-labelledby="case-title" className="mgs-case__intro">
          <Link className="mgs-case__back" href={routeHref("work", locale)}>
            <MgsCaseArrow direction="left" />
            <span>{labels.allWork}</span>
          </Link>

          <div className="mgs-case__intro-meta">
            <p className="mgs-case__eyebrow">
              {labels.caseStudy} / {project.sequence}
            </p>
            <p className="mgs-case__summary">{project.summary[locale]}</p>
          </div>

          <h1 id="case-title" className="mgs-case__title">
            {project.title[locale]}
          </h1>
        </section>

        <figure className="mgs-case__art">
          <Image
            alt={`${project.title[locale]} — ${labels.visualLabel}`}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 92vw"
            src={project.cover}
            style={{ objectFit: "cover" }}
          />
          <div className="mgs-case__art-grid" />
          <figcaption className="mgs-case__art-meta">
            <span className="mgs-case__art-label">{project.category[locale]}</span>
            <span className="mgs-case__art-index">{project.year}</span>
          </figcaption>
        </figure>

        <section aria-label={labels.caseStudy} className="mgs-case__details">
          <dl>
            <div>
              <dt>{labels.client}</dt>
              <dd>{project.client[locale]}</dd>
            </div>
            <div>
              <dt>{labels.industry}</dt>
              <dd>{project.industry[locale]}</dd>
            </div>
            <div>
              <dt>{labels.services}</dt>
              <dd>{project.services[locale].join(" · ")}</dd>
            </div>
            <div>
              <dt>{labels.year}</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>{labels.discipline}</dt>
              <dd>{project.discipline[locale]}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="case-story-heading" className="mgs-case__story">
          <p className="mgs-case__eyebrow">{labels.about}</p>
          <div className="mgs-case__story-content">
            <header className="mgs-case__story-intro">
              <p className="mgs-case__story-label">{labels.overview}</p>
              <h2 id="case-story-heading">{narrative.heading}</h2>
              <p>{narrative.overview}</p>
            </header>

            <div className="mgs-case__story-grid">
              <section className="mgs-case__story-card">
                <p className="mgs-case__story-label">{labels.challenge}</p>
                <h3>{labels.challenge}</h3>
                <p>{narrative.challenge}</p>
              </section>

              <section className="mgs-case__story-card">
                <p className="mgs-case__story-label">{labels.approach}</p>
                <h3>{labels.approach}</h3>
                <p>{narrative.approach}</p>
              </section>

              <section className="mgs-case__story-card">
                <p className="mgs-case__story-label">{labels.outcome}</p>
                <h3>{labels.outcome}</h3>
                <p>{narrative.outcome}</p>
              </section>
            </div>
          </div>
        </section>

        <section className={`mgs-case__next mgs-case__next--${nextProject.visual}`}>
          <p className="mgs-case__eyebrow">{labels.nextProject}</p>
          <div className="mgs-case__next-content">
            <div aria-hidden="true" className="mgs-case__next-media">
              <Image alt="" fill sizes="(max-width: 767px) 104px, 184px" src={nextProject.cover} />
            </div>
            <div>
              <p className="mgs-case__next-category">{nextProject.category[locale]}</p>
              <h2>{nextProject.title[locale]}</h2>
            </div>
          </div>
          <Link className="mgs-case__button" href={projectHref(nextProject.slug, locale)}>
            <span>{labels.viewCase}</span>
            <MgsCaseArrow direction="right" />
          </Link>
        </section>

        <section className="mgs-case__contact">
          <p className="mgs-case__eyebrow">{labels.contactKicker}</p>
          <h2>{labels.contactTitle}</h2>
          <Link className="mgs-case__contact-link" href={routeHref("contact", locale)}>
            <span>{labels.contactAction}</span>
            <MgsCaseArrow />
          </Link>
        </section>
      </article>
    </main>
  );
}
