"use client";

import {
  ArrowDownIcon,
  ArrowLeftIcon,
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
import { AnimatePresence, motion } from "motion/react";
import { type ComponentType, type PointerEvent, type SVGProps, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { mgsProjects, type MgsLocale } from "@/lib/mgs-project-data";
import type { MgsServiceSlug } from "@/lib/mgs-service-data";

type MgsHomeProps = {
  locale: MgsLocale;
};

const homeCopy = {
  ru: {
    hero: {
      eyebrow: "Независимая дизайн-студия из Душанбе",
      summary: "Создаём бренды, сайты и кампании для команд, которым важно быть понятными, узнаваемыми и последовательными в каждом контакте.",
      location: "Душанбе · работаем с командами по всему миру",
      action: "Смотреть проекты",
      availability: "Открыты для новых проектов",
      selected: "Избранный проект",
      previous: "Предыдущий проект",
      next: "Следующий проект",
    },
    work: {
      eyebrow: "Избранные работы",
      title: "Проекты, где идея становится узнаваемой системой.",
      all: "Смотреть все проекты",
      view: "Открыть проект",
      more: "Ещё проекты",
    },
    about: {
      eyebrow: "О студии",
      title: "Не разовые макеты. Рабочий язык для бренда.",
      body: "Madibaev Graphic Studio — независимая студия Александра Мадибаева. Мы разбираемся в контексте, собираем основу бренда и переводим её в айдентику, сайт и коммуникацию, которыми команда может пользоваться дальше.",
      action: "О студии",
      years: "лет практики",
      projects: "реализованных проектов",
      industries: "индустрий изучено",
    },
    services: {
      eyebrow: "Экспертиза",
      title: "Собираем систему, а не набор отдельных носителей.",
      action: "Все услуги",
      cardAction: "Открыть услугу",
      items: [
        {
          slug: "branding",
          index: "01",
          name: "Брендинг",
          label: "Позиционирование / Айдентика / Гайд",
          description: "Определяем характер бренда и правила, по которым его узнают — от знака до ежедневных материалов.",
          highlights: ["Позиция", "Айдентика", "Гайд"],
        },
        {
          slug: "graphic-design",
          index: "02",
          name: "Графический дизайн",
          label: "Кампании / Editorial / Презентации",
          description: "Создаём материалы для кампаний, редакционных форматов и презентаций, которые сохраняют характер бренда.",
          highlights: ["Кампания", "Презентации", "Печать"],
        },
        {
          slug: "web",
          index: "03",
          name: "Web",
          label: "Контент / Структура / Frontend",
          description: "Собираем сайты, где содержание, структура и интерфейс ведут человека к следующему шагу.",
          highlights: ["Структура", "UI", "Frontend"],
        },
        {
          slug: "ui-ux",
          index: "04",
          name: "UI/UX",
          label: "Сценарии / Интерфейс / Состояния",
          description: "Проектируем цифровые сценарии, в которых проще понять предложение, выбрать и выполнить действие.",
          highlights: ["Сценарии", "Компоненты", "Прототип"],
        },
        {
          slug: "advertising-print",
          index: "05",
          name: "Реклама и печать",
          label: "OOH / Печать / События",
          description: "Переносим идею в наружную рекламу, печать и пространство — с учётом реального производства.",
          highlights: ["OOH", "Печать", "Производство"],
        },
        {
          slug: "3d",
          index: "06",
          name: "3D",
          label: "Объекты / Сцены / Визуализация",
          description: "Создаём объекты и сцены, когда важно показать форму, масштаб или материал ещё до запуска.",
          highlights: ["Объекты", "Сцены", "Рендеры"],
        },
      ],
    },
    philosophy: {
      eyebrow: "Философия",
      quote: "Дизайн не должен украшать задачу. Он должен дать ей форму, которую можно понять, запомнить и применять.",
    },
    industries: "Технологии · События · Ритейл · Гостеприимство · Логистика · Строительство · Медиа · Еда · Спорт · Здравоохранение",
    contact: {
      eyebrow: "Обсудить проект",
      title: "Есть задача, которой нужно дать форму?",
      body: "Опишите контекст, цель и срок. Скажем, чем можем помочь и с чего стоит начать.",
      action: "Обсудить проект",
    },
  },
  en: {
    hero: {
      eyebrow: "Independent design studio based in Dushanbe",
      summary: "Brands, websites and campaigns for teams that need to be understood, recognised and consistent at every touchpoint.",
      location: "Dushanbe · working with teams worldwide",
      action: "Explore projects",
      availability: "Available for new projects",
      selected: "Selected project",
      previous: "Previous project",
      next: "Next project",
    },
    work: {
      eyebrow: "Selected work",
      title: "Projects where an idea becomes a recognisable system.",
      all: "View all projects",
      view: "Open project",
      more: "More projects",
    },
    about: {
      eyebrow: "About the studio",
      title: "Not one-off layouts. A working language for the brand.",
      body: "Madibaev Graphic Studio is the independent studio of Alexander Madibaev. We examine the context, set the brand’s foundation, and turn it into identity, websites and communication a team can use consistently.",
      action: "About the studio",
      years: "years of practice",
      projects: "projects delivered",
      industries: "industries explored",
    },
    services: {
      eyebrow: "Expertise",
      title: "Systems, not a collection of isolated touchpoints.",
      action: "All services",
      cardAction: "View service",
      items: [
        {
          slug: "branding",
          index: "01",
          name: "Branding",
          label: "Positioning / Identity / Guidelines",
          description: "We define a brand’s character and the rules that make it recognisable — from the mark to everyday materials.",
          highlights: ["Position", "Identity", "Guide"],
        },
        {
          slug: "graphic-design",
          index: "02",
          name: "Graphic design",
          label: "Campaigns / Editorial / Decks",
          description: "We create campaign, editorial and presentation materials that preserve the brand’s character across formats.",
          highlights: ["Campaigns", "Decks", "Print"],
        },
        {
          slug: "web",
          index: "03",
          name: "Web",
          label: "Content / Structure / Frontend",
          description: "We build websites where content, structure and interface lead people to the next step.",
          highlights: ["Structure", "UI", "Frontend"],
        },
        {
          slug: "ui-ux",
          index: "04",
          name: "UI/UX",
          label: "Flows / Interface / States",
          description: "We design digital flows that make it easier to understand an offer, choose and take action.",
          highlights: ["Flows", "Components", "Prototype"],
        },
        {
          slug: "advertising-print",
          index: "05",
          name: "Advertising & print",
          label: "OOH / Print / Events",
          description: "We carry an idea into outdoor, print and physical space, accounting for real production from the start.",
          highlights: ["OOH", "Print", "Production"],
        },
        {
          slug: "3d",
          index: "06",
          name: "3D",
          label: "Objects / Scenes / Visualisation",
          description: "We create objects and scenes when form, scale or material need to be understood before launch.",
          highlights: ["Objects", "Scenes", "Renders"],
        },
      ],
    },
    philosophy: {
      eyebrow: "Philosophy",
      quote: "Design should not decorate a problem. It should give it a form people can understand, remember and use.",
    },
    industries: "Technology · Events · Retail · Hospitality · Logistics · Construction · Media · Food · Sport · Healthcare",
    contact: {
      eyebrow: "Discuss a project",
      title: "Have a project that needs to take shape?",
      body: "Share the context, goal and timing. We’ll tell you how we can help and where it makes sense to start.",
      action: "Discuss a project",
    },
  },
} as const;

const slideMotion = {
  initial: (direction: number) => ({ opacity: 0, x: direction > 0 ? 36 : -36, scale: 0.985 }),
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -36 : 36, scale: 1.015 }),
};

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

function withLocale(path: string, locale: MgsLocale) {
  return `${path}?lang=${locale}`;
}

export function MgsHome({ locale }: MgsHomeProps) {
  const copy = homeCopy[locale];
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const heroRef = useRef<HTMLElement>(null);
  const dragOrigin = useRef<number | null>(null);
  const activeProject = mgsProjects[activeSlide];

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

  const moveSlide = (direction: number) => {
    setSlideDirection(direction);
    setActiveSlide((current) => (current + direction + mgsProjects.length) % mgsProjects.length);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty("--mgs-hero-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    heroRef.current.style.setProperty("--mgs-hero-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  const handleSliderPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragOrigin.current = event.clientX;
  };

  const handleSliderPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragOrigin.current === null) return;
    const delta = event.clientX - dragOrigin.current;
    dragOrigin.current = null;
    if (Math.abs(delta) < 48) return;
    moveSlide(delta > 0 ? -1 : 1);
  };

  return (
    <main>
      <section className="mgs-home-hero" onPointerMove={handlePointerMove} ref={heroRef}>
        <div className="mgs-home-hero__grid" aria-hidden="true" />
        <div className="mgs-shell mgs-home-hero__layout">
          <div className="mgs-home-hero__copy">
            <p className="mgs-eyebrow"><span />{copy.hero.eyebrow}</p>
            <h1><span>MADIBAEV</span><span>GRAPHIC</span><span>STUDIO</span></h1>
            <p className="mgs-home-hero__summary">{copy.hero.summary}</p>
            <div className="mgs-home-hero__actions">
              <Button asChild className="mgs-button mgs-button--primary" size="lg"><Link href="#selected-work"><span>{copy.hero.action}</span><ArrowDownIcon /></Link></Button>
              <span className="mgs-home-hero__location">{copy.hero.location}</span>
            </div>
          </div>

          <div className="mgs-hero-slider" aria-label={copy.hero.selected} aria-roledescription="carousel" onPointerDown={handleSliderPointerDown} onPointerUp={handleSliderPointerUp}>
            <div className="mgs-hero-slider__viewport">
              <AnimatePresence custom={slideDirection} initial={false} mode="wait">
                <motion.article animate="animate" className="mgs-hero-slider__slide" custom={slideDirection} exit="exit" initial="initial" key={activeProject.slug} transition={{ type: "spring", stiffness: 210, damping: 27, mass: 0.9 }} variants={slideMotion}>
                  <Image alt="" className="mgs-hero-slider__image" fill priority sizes="(max-width: 800px) 100vw, 42vw" src={activeProject.cover} />
                  <div className="mgs-hero-slider__shade" />
                  <div className="mgs-hero-slider__meta"><span>{copy.hero.selected} / {activeProject.sequence}</span><span>{activeProject.year}</span></div>
                  <div className="mgs-hero-slider__title"><p>{activeProject.category[locale]} · {activeProject.client[locale]}</p><h2>{activeProject.title[locale]}</h2><Link href={withLocale(`/work/${activeProject.slug}`, locale)}><span>{copy.work.view}</span><ArrowUpRightIcon aria-hidden="true" /></Link></div>
                </motion.article>
              </AnimatePresence>
            </div>
            <div className="mgs-hero-slider__controls"><span>{String(activeSlide + 1).padStart(2, "0")} / {String(mgsProjects.length).padStart(2, "0")}</span><div><Button aria-label={copy.hero.previous} className="mgs-icon-button" onClick={() => moveSlide(-1)} size="icon" type="button" variant="ghost"><ArrowLeftIcon /></Button><Button aria-label={copy.hero.next} className="mgs-icon-button" onClick={() => moveSlide(1)} size="icon" type="button" variant="ghost"><ArrowRightIcon /></Button></div></div>
          </div>

          <p className="mgs-home-hero__availability"><i aria-hidden="true" />{copy.hero.availability}</p>
        </div>
      </section>

      <section className="mgs-home-work mgs-shell" data-mgs-reveal id="selected-work">
        <div className="mgs-section-heading"><div><p className="mgs-eyebrow">{copy.work.eyebrow}</p><h2>{copy.work.title}</h2></div><Link className="mgs-inline-link" href={withLocale("/work", locale)}>{copy.work.all}<ArrowRightIcon /></Link></div>
        <div className="mgs-home-work__grid">
          {mgsProjects.map((project, index) => (
            <Link className={`mgs-home-project mgs-home-project--${index + 1}`} href={withLocale(`/work/${project.slug}`, locale)} key={project.slug}>
              <div className="mgs-home-project__media"><Image alt="" fill sizes="(max-width: 800px) 100vw, 50vw" src={project.cover} /></div>
              <div className="mgs-home-project__details"><p>{project.sequence} / {project.category[locale]} / {project.year}</p><h3>{project.title[locale]}</h3><span>{project.client[locale]}<ArrowUpRightIcon aria-hidden="true" /></span></div>
            </Link>
          ))}
        </div>
        <div className="mgs-home-work__more"><span>{copy.work.more}</span>{mgsProjects.map((project) => <Link href={withLocale(`/work/${project.slug}`, locale)} key={project.slug}>{project.title[locale]}<ArrowUpRightIcon /></Link>)}</div>
      </section>

      <section className="mgs-home-about" data-mgs-reveal><div className="mgs-shell mgs-home-about__grid"><p className="mgs-eyebrow">{copy.about.eyebrow}</p><div><h2>{copy.about.title}</h2><p className="mgs-home-about__body">{copy.about.body}</p><Link className="mgs-inline-link" href={withLocale("/about", locale)}>{copy.about.action}<ArrowRightIcon /></Link></div><dl><div><dt>8+</dt><dd>{copy.about.years}</dd></div><div><dt>40+</dt><dd>{copy.about.projects}</dd></div><div><dt>12</dt><dd>{copy.about.industries}</dd></div></dl></div></section>

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

      <section className="mgs-home-philosophy" data-mgs-reveal><div className="mgs-shell"><p className="mgs-eyebrow">{copy.philosophy.eyebrow}</p><blockquote>{copy.philosophy.quote}</blockquote></div></section>
      <section className="mgs-home-industries" aria-label="Industries"><p>{copy.industries}</p></section>
      <section className="mgs-home-contact mgs-shell" data-mgs-reveal><div className="mgs-home-contact__panel"><p className="mgs-eyebrow">{copy.contact.eyebrow}</p><h2>{copy.contact.title}</h2><p>{copy.contact.body}</p><Button asChild className="mgs-button mgs-button--primary" size="lg"><Link href={withLocale("/contact", locale)}><span>{copy.contact.action}</span><ArrowUpRightIcon /></Link></Button></div></section>
    </main>
  );
}
