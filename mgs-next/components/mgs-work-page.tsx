"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { MgsLocale, MgsProject } from "@/lib/mgs-project-data";

type MgsFilterId = "all" | "branding" | "digital" | "campaign";

const copy = {
  ru: {
    title: "Проекты, которые работают.",
    lead: "Показываем задачу, подход и результат — без лишней презентационной воды.",
    eyebrow: "Работы",
    filters: {
      all: "Все",
      branding: "Брендинг",
      digital: "Digital",
      campaign: "Кампании",
    },
    result: "проектов найдено",
    open: "Открыть кейс",
    emptyTitle: "Скоро здесь будет больше.",
    emptyBody: "Обновляем подборку кейсов. Если хотите обсудить новый проект — напишите нам.",
    processTitle: "Как решали",
    process: [
      "Контекст — что нужно было изменить.",
      "Решение — как собрали систему.",
      "Реализация — что запустили или передали команде.",
    ],
  },
  en: {
    title: "Projects built to work.",
    lead: "Each case shows the challenge, approach, and result — without presentation filler.",
    eyebrow: "Work",
    filters: {
      all: "All",
      branding: "Branding",
      digital: "Digital",
      campaign: "Campaigns",
    },
    result: "projects found",
    open: "Open case study",
    emptyTitle: "More work is coming.",
    emptyBody: "We are updating the case selection. If you have a project to discuss, get in touch.",
    processTitle: "How we solved it",
    process: [
      "Context — what needed to change.",
      "Solution — how the system came together.",
      "Delivery — what was launched or handed over.",
    ],
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

export function MgsWorkPage({ locale, projects }: { locale: MgsLocale; projects: readonly MgsProject[] }) {
  const text = copy[locale];
  const [filter, setFilter] = useState<MgsFilterId>("all");
  const visibleProjects = filter === "all" ? projects : projects.filter((project) => getWorkFilter(project) === filter);

  return (
    <main className="mgs-route-page mgs-shell">
      <section className="mgs-route-hero">
        <p className="mgs-eyebrow"><span />{text.eyebrow}</p>
        <div className="mgs-route-hero__heading">
          <h1>{text.title}</h1>
          <p>{text.lead}</p>
        </div>
      </section>

      <section className="mgs-work-filters" aria-label={text.eyebrow}>
        <div className="mgs-work-filters__buttons">
          {(Object.keys(text.filters) as MgsFilterId[]).map((item) => (
            <button
              aria-pressed={item === filter}
              className={item === filter ? "is-active" : undefined}
              key={item}
              onClick={() => setFilter(item)}
              type="button"
            >
              {text.filters[item]}
            </button>
          ))}
        </div>
        <p>{visibleProjects.length} {text.result}</p>
      </section>

      <section className="mgs-work-grid">
        {visibleProjects.length ? visibleProjects.map((project, index) => (
          <Link className="mgs-work-card" href={hrefWithLocale(`/work/${project.slug}`, locale)} key={project.slug}>
            <div className="mgs-work-card__image">
              <Image alt={project.title[locale]} fill priority={index === 0} sizes="(max-width: 900px) 100vw, 50vw" src={project.cover} />
            </div>
            <div className="mgs-work-card__meta">
              <p>{project.sequence} / {project.category[locale]} / {project.year}</p>
              <h2>{project.title[locale]}</h2>
              <p className="mgs-work-card__client">{project.client[locale]} · {project.discipline[locale]}</p>
              <span>{text.open}<ArrowUpRightIcon aria-hidden="true" /></span>
            </div>
          </Link>
        )) : (
          <div className="mgs-work-empty">
            <h2>{text.emptyTitle}</h2>
            <p>{text.emptyBody}</p>
          </div>
        )}
      </section>

      <section className="mgs-route-process">
        <div className="mgs-section-heading">
          <div><h2>{text.processTitle}</h2></div>
        </div>
        <div className="mgs-route-process__grid">
          {text.process.map((item, index) => (
            <article className="mgs-process-card" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
