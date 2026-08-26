import type { MgsLocale } from "@/lib/mgs-project-data";

export const mgsServiceNames = {
  branding: { ru: "Брендинг", en: "Branding" },
  "graphic-design": { ru: "Графический дизайн", en: "Graphic Design" },
  web: { ru: "Web Design & Development", en: "Web Design & Development" },
  "ui-ux": { ru: "UI/UX & Digital Products", en: "UI/UX & Digital Products" },
  "advertising-print": { ru: "Кампании, Events & Print", en: "Campaigns, Events & Print" },
  "3d": { ru: "3D & Визуализация", en: "3D & Visualization" },
} as const satisfies Record<string, Record<MgsLocale, string>>;

export const mgsServiceSlugs = Object.keys(mgsServiceNames) as Array<keyof typeof mgsServiceNames>;
export type MgsServiceSlug = keyof typeof mgsServiceNames;

export function isMgsServiceSlug(slug: string): slug is MgsServiceSlug {
  return mgsServiceSlugs.some((serviceSlug) => serviceSlug === slug);
}

export function getMgsServiceName(slug: string, locale: MgsLocale) {
  return isMgsServiceSlug(slug) ? mgsServiceNames[slug][locale] : undefined;
}

type MgsLocalizedList = Record<MgsLocale, string[]>;

export type MgsServiceDefinition = {
  slug: string;
  name: Record<MgsLocale, string>;
  summary: Record<MgsLocale, string>;
  description: Record<MgsLocale, string>;
  deliverables: MgsLocalizedList;
  fit: MgsLocalizedList;
  process: MgsLocalizedList;
  relatedProjectSlugs: readonly string[];
};

export const mgsServiceDefinitions: readonly MgsServiceDefinition[] = [
  {
    slug: "branding",
    name: mgsServiceNames.branding,
    summary: {
      ru: "Стратегия и айдентика для компаний, которым нужен не просто новый визуал, а бренд, способный последовательно работать в бизнесе.",
      en: "Strategy and identity for companies that need more than a new look — a brand system that can work consistently across the business.",
    },
    description: {
      ru: "Начинаем с бизнеса, аудитории и контекста. Формулируем позиционирование, находим визуальный принцип и превращаем его в систему, которую можно уверенно использовать в digital, маркетинге, презентациях, упаковке и офлайне.",
      en: "We start with the business, audience, and context. We define positioning, establish a visual principle, and turn it into a system that can work confidently across digital, marketing, presentations, packaging, and physical touchpoints.",
    },
    deliverables: {
      ru: ["Исследование и позиционирование", "Логотип и визуальная айдентика", "Типографика и цветовая система", "Brand Guidelines", "Ключевые носители и шаблоны"],
      en: ["Research and positioning", "Logo and visual identity", "Typography and colour system", "Brand guidelines", "Key touchpoints and templates"],
    },
    fit: {
      ru: ["Запуск нового бренда", "Ребрендинг или репозиционирование", "Выход на новый рынок", "Визуальная коммуникация стала несистемной"],
      en: ["Launching a new brand", "Rebranding or repositioning", "Entering a new market", "Visual communication has become inconsistent"],
    },
    process: {
      ru: [
        "Разбираем бизнес, аудиторию, рынок и текущую точку бренда.",
        "Формулируем позиционирование и направление, которое отвечает задаче.",
        "Создаём айдентику и проверяем её на реальных точках контакта.",
        "Собираем правила и рабочие материалы для дальнейшего использования командой.",
      ],
      en: [
        "We examine the business, audience, market, and the brand’s current position.",
        "We define the positioning and creative direction around the actual challenge.",
        "We build the identity and test it across real touchpoints.",
        "We package the rules and working assets so the team can continue with confidence.",
      ],
    },
    relatedProjectSlugs: ["nava-identity", "north-roasters"],
  },
  {
    slug: "graphic-design",
    name: mgsServiceNames["graphic-design"],
    summary: {
      ru: "Визуальные коммуникации для бизнеса, маркетинга и корпоративных задач — от одного ключевого материала до целой кампейн-системы.",
      en: "Visual communication for business, marketing, and corporate needs — from one key asset to a complete campaign system.",
    },
    description: {
      ru: "Создаём дизайн вокруг конкретной цели: объяснить продукт, усилить предложение, представить компанию, поддержать запуск или сделать коммуникацию заметнее. Не собираем набор случайных макетов — задаём единый визуальный принцип и масштабируем его на нужные форматы.",
      en: "We design around a specific objective: explain a product, strengthen an offer, present a company, support a launch, or make communication more visible. Instead of disconnected layouts, we establish one visual principle and scale it across the formats that matter.",
    },
    deliverables: {
      ru: ["Key Visual и campaign system", "Презентации и коммерческие материалы", "Social & digital assets", "Editorial design", "Печатные и наружные материалы"],
      en: ["Key visual and campaign system", "Presentations and sales materials", "Social and digital assets", "Editorial design", "Print and outdoor materials"],
    },
    fit: {
      ru: ["Запуск продукта или кампании", "Корпоративная презентация", "Нужна серия материалов в едином стиле", "Существующий бренд выглядит слабее продукта"],
      en: ["Product or campaign launch", "Corporate presentation", "A series of assets needs one visual system", "The existing communication undersells the product"],
    },
    process: {
      ru: [
        "Определяем задачу, аудиторию, сообщение и каналы.",
        "Находим визуальную идею и создаём ключевой материал.",
        "Масштабируем систему на нужные форматы и сценарии.",
        "Готовим финальные файлы для публикации, передачи или производства.",
      ],
      en: [
        "We define the objective, audience, message, and channels.",
        "We establish the visual idea and build the key asset.",
        "We scale the system across the required formats and scenarios.",
        "We prepare final files for publishing, handoff, or production.",
      ],
    },
    relatedProjectSlugs: ["solo-festival", "nava-identity"],
  },
  {
    slug: "web",
    name: mgsServiceNames.web,
    summary: {
      ru: "Проектируем и разрабатываем сайты как работающий бизнес-инструмент — от структуры и UX до frontend, backend и запуска.",
      en: "We design and build websites as working business tools — from structure and UX to frontend, backend, and launch.",
    },
    description: {
      ru: "Берём web-проект целиком: разбираем цель, проектируем архитектуру и пользовательский путь, создаём интерфейс и доводим его до работающего продукта. Дизайн и разработка идут в одной логике, поэтому идея не теряется между макетом и реализацией.",
      en: "We take web projects end to end: clarify the objective, design the architecture and user journey, create the interface, and bring it into a working product. Design and development stay in one line, so the idea does not get lost between mockup and implementation.",
    },
    deliverables: {
      ru: ["Research и структура", "UX, wireframes и прототип", "UI и адаптивная дизайн-система", "Frontend development", "Backend / CMS / интеграции по задаче", "Запуск и финальная проверка"],
      en: ["Research and structure", "UX, wireframes, and prototype", "UI and responsive design system", "Frontend development", "Backend / CMS / integrations as required", "Launch and final QA"],
    },
    fit: {
      ru: ["Корпоративный или продуктовый сайт", "Landing page для запуска", "Портфолио или digital-презентация", "Существующий сайт устарел или плохо решает задачу", "Нужна одна команда на дизайн и разработку"],
      en: ["Corporate or product website", "Launch landing page", "Portfolio or digital presentation", "An existing website is outdated or ineffective", "One team is needed for both design and development"],
    },
    process: {
      ru: [
        "Определяем бизнес-цель, аудиторию, контент и технические ограничения.",
        "Собираем архитектуру, пользовательские сценарии и прототип.",
        "Проектируем адаптивный интерфейс и систему компонентов.",
        "Разрабатываем, интегрируем, тестируем и выводим продукт в production.",
      ],
      en: [
        "We define the business objective, audience, content, and technical constraints.",
        "We build the architecture, user journeys, and prototype.",
        "We design the responsive interface and component system.",
        "We develop, integrate, test, and bring the product into production.",
      ],
    },
    relatedProjectSlugs: ["aria-studio"],
  },
  {
    slug: "ui-ux",
    name: mgsServiceNames["ui-ux"],
    summary: {
      ru: "Проектируем интерфейсы и digital-продукты, где сложные процессы становятся понятными, а система готова к развитию вместе с продуктом.",
      en: "We design interfaces and digital products where complex processes become clear and the system is ready to evolve with the product.",
    },
    description: {
      ru: "Работаем не только с экранами, а с логикой продукта. Разбираем роли, сценарии, данные и ограничения, после чего строим информационную архитектуру, прототипы, интерфейс и дизайн-систему, которую удобно передавать разработке и масштабировать.",
      en: "We work with product logic, not just screens. We examine roles, journeys, data, and constraints, then build the information architecture, prototypes, interface, and design system in a form that is clear for development and ready to scale.",
    },
    deliverables: {
      ru: ["UX research и аудит", "User flows и информационная архитектура", "Wireframes и интерактивные прототипы", "UI design", "Компоненты и Design System", "Developer handoff"],
      en: ["UX research and audit", "User flows and information architecture", "Wireframes and interactive prototypes", "UI design", "Components and design system", "Developer handoff"],
    },
    fit: {
      ru: ["SaaS, кабинет или внутренняя система", "Новый digital-продукт", "Нужно переработать сложный пользовательский сценарий", "Продукту нужна единая дизайн-система"],
      en: ["SaaS, dashboard, or internal system", "A new digital product", "A complex user journey needs redesigning", "The product needs a unified design system"],
    },
    process: {
      ru: [
        "Погружаемся в продукт, пользователей, роли и бизнес-ограничения.",
        "Строим архитектуру и сценарии до начала визуального дизайна.",
        "Проектируем интерфейс, состояния, компоненты и взаимодействия.",
        "Проверяем целостность системы и готовим её к разработке и дальнейшему росту.",
      ],
      en: [
        "We understand the product, users, roles, and business constraints.",
        "We build the architecture and journeys before visual design begins.",
        "We design the interface, states, components, and interactions.",
        "We validate the system and prepare it for development and future growth.",
      ],
    },
    relatedProjectSlugs: ["aria-studio"],
  },
  {
    slug: "advertising-print",
    name: mgsServiceNames["advertising-print"],
    summary: {
      ru: "Кампании, event-дизайн и production-ready материалы, которые переносят идею бренда из digital в физическое пространство.",
      en: "Campaigns, event design, and production-ready materials that take a brand idea from digital into the physical world.",
    },
    description: {
      ru: "Создаём визуальные системы для рекламных кампаний, мероприятий, наружной рекламы и печати с учётом реальных размеров, материалов, технологий производства и условий использования. Поэтому макет работает не только на экране, но и после выхода в производство.",
      en: "We create visual systems for campaigns, events, outdoor, and print with real dimensions, materials, production methods, and usage conditions in mind. The design is built to work beyond the screen and survive production.",
    },
    deliverables: {
      ru: ["Advertising campaign system", "Event identity и оформление", "OOH / indoor", "POS и полиграфия", "Навигация и пространственная графика", "Prepress и production files"],
      en: ["Advertising campaign system", "Event identity and environment", "OOH / indoor", "POS and print", "Wayfinding and spatial graphics", "Prepress and production files"],
    },
    fit: {
      ru: ["Рекламная кампания", "Фестиваль, конференция или спортивное событие", "Наружная реклама и POS", "Нужно связать digital и физические носители одной системой"],
      en: ["Advertising campaign", "Festival, conference, or sports event", "Outdoor advertising and POS", "Digital and physical touchpoints need one system"],
    },
    process: {
      ru: [
        "Фиксируем задачу, площадки, форматы и производственные ограничения.",
        "Создаём ключевой визуальный принцип и систему применения.",
        "Адаптируем дизайн под реальные размеры, материалы и носители.",
        "Готовим production-ready файлы и сопровождаем финальный этап по необходимости.",
      ],
      en: [
        "We define the objective, placements, formats, and production constraints.",
        "We create the key visual principle and application system.",
        "We adapt the design to real dimensions, materials, and touchpoints.",
        "We prepare production-ready files and support the final stage when needed.",
      ],
    },
    relatedProjectSlugs: ["solo-festival", "north-roasters"],
  },
  {
    slug: "3d",
    name: mgsServiceNames["3d"],
    summary: {
      ru: "3D-визуализация продуктов, пространств и концепций, когда идею нужно увидеть, проверить и убедительно показать ещё до реализации.",
      en: "3D visualization for products, spaces, and concepts that need to be seen, tested, and presented convincingly before they are built.",
    },
    description: {
      ru: "Используем 3D как рабочий инструмент для презентации и принятия решений: создаём объекты, сцены, event-пространства и визуальные концепции, помогающие заранее понять масштаб, материал, композицию и итоговое впечатление.",
      en: "We use 3D as a practical tool for presentation and decision-making: products, scenes, event environments, and visual concepts that make scale, material, composition, and the final impression clear before production.",
    },
    deliverables: {
      ru: ["3D-модели и сцены", "Материалы, свет и окружение", "Product visualization", "Event / spatial visualization", "Финальные рендеры для презентации и рекламы"],
      en: ["3D models and scenes", "Materials, lighting, and environment", "Product visualization", "Event / spatial visualization", "Final renders for presentations and campaigns"],
    },
    fit: {
      ru: ["Нужно показать концепцию до производства", "Пространство или event ещё не построены", "Продукт нужно визуализировать без фотосъёмки", "Презентации нужен убедительный визуальный уровень"],
      en: ["A concept needs to be shown before production", "A space or event has not been built yet", "A product needs visualization without photography", "A presentation needs a stronger visual level"],
    },
    process: {
      ru: [
        "Определяем задачу, референсы, геометрию и нужный уровень детализации.",
        "Собираем модель или сцену, материалы, свет и композицию.",
        "Проверяем ракурсы и тестовые рендеры до финального расчёта.",
        "Доводим изображения и передаём готовые материалы в нужных форматах.",
      ],
      en: [
        "We define the objective, references, geometry, and required level of detail.",
        "We build the model or scene, materials, lighting, and composition.",
        "We review angles and test renders before final output.",
        "We refine the imagery and deliver final assets in the required formats.",
      ],
    },
    relatedProjectSlugs: ["north-roasters", "solo-festival"],
  },
] as const;

export function getMgsServiceDefinition(slug: string) {
  return mgsServiceDefinitions.find((item) => item.slug === slug);
}
