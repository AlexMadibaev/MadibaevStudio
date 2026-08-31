"use client";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CodeBracketSquareIcon,
  CubeTransparentIcon,
  CursorArrowRaysIcon,
  MegaphoneIcon,
  PencilSquareIcon,
  SwatchIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { type ComponentType, type SVGProps, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { MgsLocale, MgsProject } from "@/lib/mgs-project-data";
import type { MgsServiceSlug } from "@/lib/mgs-service-data";

type MgsHomeProps = {
  locale: MgsLocale;
  projects: readonly MgsProject[];
};

type AnimatedStatProps = {
  value: number;
  suffix?: string;
  label: string;
};

const homeCopy = {
  ru: {
    work: {
      eyebrow: "Избранные работы",
      title: "Не просто показываем результат. Показываем, какую задачу он решил.",
      all: "Смотреть все проекты",
      view: "Открыть проект",
      more: "Ещё проекты",
    },
    about: {
      eyebrow: "О студии",
      title: "Дизайн — только часть решения.",
      body: "Madibaev Graphic Studio — независимая design & digital студия. Мы подключаемся там, где бизнесу нужно разобраться в задаче, сформировать правильное решение и качественно его реализовать. Видим проект целиком: от визуальной системы и пользовательского опыта до разработки и запуска.",
      action: "О студии",
      years: "лет практики",
      projects: "реализованных проектов",
      industries: "индустрий",
    },
    services: {
      eyebrow: "Экспертиза",
      title: "Что умеем",
      action: "Все услуги",
      cardAction: "Открыть услугу",
      items: [
        {
          slug: "branding",
          index: "01",
          name: "Брендинг",
          label: "Стратегия / Позиционирование / Айдентика",
          description: "Создаём бренды, которые можно узнавать, развивать и последовательно использовать во всех точках контакта.",
          highlights: ["Стратегия", "Айдентика", "Гайд"],
        },
        {
          slug: "graphic-design",
          index: "02",
          name: "Графический дизайн",
          label: "Кампании / Презентации / Editorial",
          description: "Разрабатываем визуальные коммуникации для бизнеса, маркетинга и корпоративных задач — от отдельного материала до целой системы.",
          highlights: ["Кампании", "Презентации", "Печать"],
        },
        {
          slug: "web",
          index: "03",
          name: "Сайты",
          label: "UX / UI / Разработка",
          description: "Проектируем и разрабатываем сайты, которые не только выглядят убедительно, но и решают конкретную бизнес-задачу.",
          highlights: ["UX/UI", "Разработка", "Интеграции"],
        },
        {
          slug: "ui-ux",
          index: "04",
          name: "Интерфейсы",
          label: "Исследование / Сценарии / Дизайн-системы",
          description: "Проектируем интерфейсы для сервисов и платформ: упрощаем сложные процессы и собираем масштабируемые продуктовые системы.",
          highlights: ["Исследование", "Прототип", "Дизайн-система"],
        },
        {
          slug: "advertising-print",
          index: "05",
          name: "Реклама и печать",
          label: "Реклама / События / Производство",
          description: "Переносим бренд из экрана в реальный мир: рекламные кампании, event-дизайн, наружная реклама, полиграфия и production-ready материалы.",
          highlights: ["Реклама", "События", "Печать"],
        },
        {
          slug: "3d",
          index: "06",
          name: "3D-визуализация",
          label: "Продукты / Пространства / Рендеры",
          description: "Создаём 3D-визуализации продуктов, пространств, сцен и концепций до того, как они появятся в реальности.",
          highlights: ["3D", "Среда", "Рендеры"],
        },
      ],
    },
    clients: {
      title: "Наши клиенты",
      body: "Компании и организации, для которых мы создавали дизайн, digital-продукты и коммуникационные решения.",
    },
    contact: {
      eyebrow: "Есть задача?",
      title: "Давайте разберёмся, что ей действительно нужно.",
      body: "Расскажите о проекте, цели или проблеме. Изучим контекст и предложим оптимальный формат работы — от отдельной задачи до комплексного запуска.",
      action: "Обсудить проект",
    },
  },
  en: {
    work: {
      eyebrow: "Selected work",
      title: "We don't just show what we made. We show what it solved.",
      all: "View all projects",
      view: "Open project",
      more: "More projects",
    },
    about: {
      eyebrow: "About the studio",
      title: "Design is only part of the solution.",
      body: "Madibaev Graphic Studio is an independent design & digital studio. We step in when a business needs to understand the challenge, define the right solution and bring it to life. We see the whole project — from visual systems and user experience to development and launch.",
      action: "About the studio",
      years: "years of practice",
      projects: "projects delivered",
      industries: "industries",
    },
    services: {
      eyebrow: "Expertise",
      title: "What we do",
      action: "All services",
      cardAction: "View service",
      items: [
        {
          slug: "branding",
          index: "01",
          name: "Branding",
          label: "Strategy / Positioning / Identity",
          description: "We create brands that can be recognised, developed and used consistently across every touchpoint.",
          highlights: ["Strategy", "Identity", "Guidelines"],
        },
        {
          slug: "graphic-design",
          index: "02",
          name: "Graphic Design",
          label: "Campaigns / Presentations / Editorial",
          description: "We create visual communications for business, marketing and corporate environments — from a single asset to a complete system.",
          highlights: ["Campaigns", "Presentations", "Print"],
        },
        {
          slug: "web",
          index: "03",
          name: "Websites",
          label: "UX / UI / Frontend / Backend",
          description: "We design and build websites that do more than look convincing — they solve a specific business problem.",
          highlights: ["UX/UI", "Frontend", "Backend"],
        },
        {
          slug: "ui-ux",
          index: "04",
          name: "UI/UX Design",
          label: "Research / Flows / Design Systems",
          description: "We design interfaces for products and platforms, simplify complex workflows and build scalable product systems.",
          highlights: ["Research", "Prototype", "Design System"],
        },
        {
          slug: "advertising-print",
          index: "05",
          name: "Advertising & Print",
          label: "Advertising / Event Design / Production",
          description: "We take brands beyond the screen through campaigns, event design, outdoor advertising, print and production-ready materials.",
          highlights: ["Campaigns", "Events", "Production"],
        },
        {
          slug: "3d",
          index: "06",
          name: "3D Visualization",
          label: "Objects / Environments / Rendering",
          description: "We visualize products, environments, stages and concepts before they exist in the real world.",
          highlights: ["Objects", "Environments", "Renders"],
        },
      ],
    },
    clients: {
      title: "Our clients",
      body: "Companies and organizations we've supported across design, digital products and communications.",
    },
    contact: {
      eyebrow: "Have a challenge?",
      title: "Let's find out what it actually needs.",
      body: "Tell us about your project, goal or problem. We'll study the context and define the right way to approach it — from a focused task to a complete launch.",
      action: "Discuss a project",
    },
  },
} as const;

const serviceCardLayouts = ["feature", "tall", "standard", "standard", "standard", "wide"] as const;
const serviceCardTones = ["blue", "pink", "yellow", "blue", "pink", "green"] as const;

const serviceIcons: Record<MgsServiceSlug, ComponentType<SVGProps<SVGSVGElement>>> = {
  branding: SwatchIcon,
  "graphic-design": PencilSquareIcon,
  web: CodeBracketSquareIcon,
  "ui-ux": CursorArrowRaysIcon,
  "advertising-print": MegaphoneIcon,
  "3d": CubeTransparentIcon,
};

const clientWordmarks: ReadonlyArray<{ name: Record<MgsLocale, string>; compact?: boolean }> = [
  { name: { ru: "Samsung", en: "Samsung" } },
  { name: { ru: "MegaFon Tajikistan", en: "MegaFon Tajikistan" } },
  { name: { ru: "Aga Khan", en: "Aga Khan" } },
  { name: { ru: "МИД Республики Таджикистан", en: "Ministry of Foreign Affairs of Tajikistan" }, compact: true },
  { name: { ru: "Saloma", en: "Saloma" } },
];

function withLocale(path: string, locale: MgsLocale) {
  return `${path}?lang=${locale}`;
}

function AnimatedStat({ value, suffix = "", label }: AnimatedStatProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => {
        setDisplayValue(value);
        setHasAnimated(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;

      observer.disconnect();
      setHasAnimated(true);
      const duration = 1350;
      const startedAt = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * eased));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          setDisplayValue(value);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    }, { threshold: 0.45 });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [hasAnimated, value]);

  return (
    <div ref={elementRef}>
      <dt aria-label={`${value}${suffix}`}>
        <span className="mgs-live-stat__value" aria-hidden="true">{displayValue}</span>{suffix}
      </dt>
      <dd>{label}</dd>
    </div>
  );
}

function ClientMarquee({ locale, title, body }: { locale: MgsLocale; title: string; body: string }) {
  const renderClients = (ariaHidden = false) => (
    <div className="mgs-home-clients__group" aria-hidden={ariaHidden || undefined}>
      {clientWordmarks.map((client) => (
        <div className="mgs-home-client" key={`${ariaHidden ? "clone-" : ""}${client.name.en}`}>
          <span className={client.compact ? "mgs-home-client__wordmark mgs-home-client__wordmark--compact" : "mgs-home-client__wordmark"}>
            {client.name[locale]}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="mgs-home-clients" data-mgs-reveal aria-label={title}>
      <div className="mgs-shell mgs-home-clients__heading">
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <div className="mgs-home-clients__viewport">
        <div className="mgs-home-clients__track">
          {renderClients()}
          {renderClients(true)}
        </div>
      </div>
    </section>
  );
}

export function MgsHome({ locale, projects }: MgsHomeProps) {
  const copy = homeCopy[locale];

  useEffect(() => {
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-mgs-reveal]"));
    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.dataset.mgsVisible = "true");
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.mgsVisible = "true";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    revealTargets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <section className="mgs-home-work mgs-shell" data-mgs-reveal id="selected-work">
        <div className="mgs-section-heading"><div><p className="mgs-eyebrow">{copy.work.eyebrow}</p><h2>{copy.work.title}</h2></div><Link className="mgs-inline-link" href={withLocale("/work", locale)}>{copy.work.all}<ArrowRightIcon /></Link></div>
        <div className="mgs-home-work__grid">
          {projects.map((project, index) => (
            <Link className={`mgs-home-project mgs-home-project--${index + 1}`} href={withLocale(`/work/${project.slug}`, locale)} key={project.slug}>
              <div className="mgs-home-project__media"><Image alt={project.title[locale]} fill sizes="(max-width: 800px) 100vw, 50vw" src={project.cover} /></div>
              <div className="mgs-home-project__details"><p>{project.sequence} / {project.category[locale]} / {project.year}</p><h3>{project.title[locale]}</h3><span>{project.client[locale]}<ArrowUpRightIcon aria-hidden="true" /></span></div>
            </Link>
          ))}
        </div>
        <div className="mgs-home-work__more"><span>{copy.work.more}</span>{projects.map((project) => <Link href={withLocale(`/work/${project.slug}`, locale)} key={project.slug}>{project.title[locale]}<ArrowUpRightIcon /></Link>)}</div>
      </section>

      <section className="mgs-home-about" data-mgs-reveal><div className="mgs-shell mgs-home-about__grid"><p className="mgs-eyebrow">{copy.about.eyebrow}</p><div><h2>{copy.about.title}</h2><p className="mgs-home-about__body">{copy.about.body}</p><Link className="mgs-inline-link" href={withLocale("/about", locale)}>{copy.about.action}<ArrowRightIcon /></Link></div><dl><AnimatedStat value={8} suffix="+" label={copy.about.years} /><AnimatedStat value={40} suffix="+" label={copy.about.projects} /><AnimatedStat value={12} label={copy.about.industries} /></dl></div></section>

      <section className="mgs-home-services mgs-shell" data-mgs-reveal>
        <div className="mgs-section-heading">
          <div>
            <p className="mgs-eyebrow">{copy.services.eyebrow}</p>
            <h2>{copy.services.title}</h2>
          </div>
          <Link className="mgs-inline-link" href={withLocale("/services", locale)}>
            {copy.services.action}
            <ArrowRightIcon />
          </Link>
        </div>

        <div className="mgs-home-services__cards">
          {copy.services.items.map((item, index) => {
            const Icon = serviceIcons[item.slug];
            return (
              <Link
                aria-label={`${item.name} — ${copy.services.cardAction}`}
                className={`mgs-expertise-card mgs-expertise-card--${serviceCardLayouts[index]} mgs-expertise-card--${serviceCardTones[index]}`}
                href={withLocale(`/services/${item.slug}`, locale)}
                key={item.slug}
              >
                <div className="mgs-expertise-card__top">
                  <span className="mgs-expertise-card__index">{item.index}</span>
                  <span className="mgs-expertise-card__icon">
                    <Icon aria-hidden="true" />
                  </span>
                </div>

                <div className="mgs-expertise-card__body">
                  <p className="mgs-expertise-card__label">{item.label}</p>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>

                <div className="mgs-expertise-card__footer">
                  <ul aria-hidden="true" className="mgs-expertise-card__chips">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <span className="mgs-expertise-card__action">
                    {copy.services.cardAction}
                    <ArrowUpRightIcon aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <ClientMarquee locale={locale} title={copy.clients.title} body={copy.clients.body} />
      <section className="mgs-home-contact mgs-shell" data-mgs-reveal><div className="mgs-home-contact__panel"><p className="mgs-eyebrow">{copy.contact.eyebrow}</p><h2>{copy.contact.title}</h2><p>{copy.contact.body}</p><Button asChild className="mgs-button mgs-button--primary" size="lg"><Link href={withLocale("/contact", locale)}><span>{copy.contact.action}</span><ArrowUpRightIcon /></Link></Button></div></section>
    </main>
  );
}
