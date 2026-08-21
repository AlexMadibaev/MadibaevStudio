import type { MgsLocale } from "@/lib/mgs-project-data";

export const mgsServiceNames = {
  branding: { ru: "Брендинг", en: "Branding" },
  "graphic-design": { ru: "Графический дизайн", en: "Graphic Design" },
  web: { ru: "Web", en: "Web" },
  "ui-ux": { ru: "UI/UX", en: "UI/UX" },
  "advertising-print": { ru: "Реклама и печать", en: "Advertising & Print" },
  "3d": { ru: "3D", en: "3D" },
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
    name: { ru: "Брендинг", en: "Branding" },
    summary: {
      ru: "Для новых и растущих брендов, которым нужен цельный и управляемый язык: от позиции до правил применения.",
      en: "For new and growing brands that need a coherent and manageable language, from positioning to practical rules for use.",
    },
    description: {
      ru: "Определяем характер бренда, собираем его визуальные опоры и оформляем правила так, чтобы команда могла уверенно запускать коммуникацию и развивать систему дальше.",
      en: "We define the brand’s character, build its visual foundations, and document the rules so the team can launch communications confidently and scale the system further.",
    },
    deliverables: {
      ru: ["Платформа бренда", "Лого и фирменный знак", "Типографика и цвет", "Брендбук", "Упаковка и носители"],
      en: ["Brand platform", "Logo and wordmark", "Typography and colour", "Brand book", "Packaging and touchpoints"],
    },
    fit: {
      ru: ["Новый бренд или репозиционирование", "Выход на новый рынок", "Когда визуал нужно собрать в единую систему"],
      en: ["New brands or repositioning", "Expansion into a new market", "When the visual layer needs one clear system"],
    },
    process: {
      ru: [
        "Погружаемся в продукт, аудиторию и текущий образ бренда.",
        "Формулируем позиционирование и визуальное направление.",
        "Собираем айдентику и проверяем её на ключевых носителях.",
        "Фиксируем правила применения в гайдлайне для команды.",
      ],
      en: [
        "We immerse ourselves in the product, audience, and current brand perception.",
        "We define the positioning and visual direction.",
        "We build the identity and test it on the touchpoints that matter.",
        "We document the rules in guidelines the team can use.",
      ],
    },
    relatedProjectSlugs: ["nava-identity", "north-roasters"],
  },
  {
    slug: "graphic-design",
    name: { ru: "Графический дизайн", en: "Graphic Design" },
    summary: {
      ru: "Кампании, презентации и редакционные материалы, в которых бренд остаётся узнаваемым и выразительным в каждом формате.",
      en: "Campaigns, presentations, and editorial materials that keep the brand recognisable and expressive in every format.",
    },
    description: {
      ru: "Создаём key visuals, презентации, печатные и digital-материалы вокруг одной идеи, а не как набор разрозненных носителей.",
      en: "We create key visuals, presentations, print, and digital materials around one idea rather than as a set of disconnected touchpoints.",
    },
    deliverables: {
      ru: ["Кампейн-система", "Презентации", "Editorial design", "Соцсети и key visuals", "Печатные материалы"],
      en: ["Campaign system", "Presentations", "Editorial design", "Social and key visuals", "Print collateral"],
    },
    fit: {
      ru: ["Запуск кампании", "Нужен выразительный визуальный язык", "Есть бренд, но не хватает сильных носителей"],
      en: ["Campaign launches", "Need a more expressive visual language", "Brand exists, but touchpoints feel weak"],
    },
    process: {
      ru: [
        "Определяем задачу, аудиторию и каналы, в которых будет жить кампания.",
        "Находим идею и создаём ключевой визуал.",
        "Адаптируем систему под нужные форматы и производство.",
        "Передаём исходники и правила для дальнейших материалов.",
      ],
      en: [
        "We define the task, audience, and channels where the campaign will live.",
        "We find the idea and create the key visual.",
        "We adapt the system for the required formats and production.",
        "We hand over source files and rules for future materials.",
      ],
    },
    relatedProjectSlugs: ["solo-festival", "nava-identity"],
  },
  {
    slug: "web",
    name: { ru: "Web", en: "Web" },
    summary: {
      ru: "Сайты, которые сначала объясняют ценность, а затем ведут человека к нужному действию без лишнего трения.",
      en: "Websites that explain the value first, then lead people to the action that matters without friction.",
    },
    description: {
      ru: "Проектируем структуру и сценарии, задаём визуальный язык и доводим интерфейс до запуска, в котором всё выглядит цельно, читается быстро и внушает доверие.",
      en: "We shape the structure and journeys, set the visual language, and carry the interface through to a launch where everything feels coherent, clear, and trustworthy.",
    },
    deliverables: {
      ru: ["Структура и прототип", "UI-система сайта", "Ключевые секции и анимация", "Frontend handoff или реализация", "Адаптация под mobile"],
      en: ["Structure and wireframes", "Website UI system", "Key sections and motion", "Frontend handoff or implementation", "Mobile adaptation"],
    },
    fit: {
      ru: ["Портфолио и презентационные сайты", "Продуктовые лендинги", "Когда сайт должен продавать доверие с первого экрана"],
      en: ["Portfolio and presentation sites", "Product landing pages", "When the site has to sell trust from the first screen"],
    },
    process: {
      ru: [
        "Собираем контент, структуру и сценарии будущего сайта.",
        "Проверяем логику в прототипе и определяем визуальное направление.",
        "Проектируем адаптивный интерфейс и ключевые состояния.",
        "Готовим frontend к запуску или передаче в разработку.",
      ],
      en: [
        "We organise the content, structure, and journeys for the future site.",
        "We test the logic in a prototype and set the visual direction.",
        "We design the responsive interface and its key states.",
        "We prepare the frontend for launch or handoff to development.",
      ],
    },
    relatedProjectSlugs: ["aria-studio"],
  },
  {
    slug: "ui-ux",
    name: { ru: "UI/UX", en: "UI/UX" },
    summary: {
      ru: "Интерфейсы для продуктов и сервисов, в которых сложное становится логичным и удобным.",
      en: "Interfaces for products and services where complexity becomes logical and easier to use.",
    },
    description: {
      ru: "Разбираем путь пользователя и собираем навигацию, состояния и компоненты вокруг реальных задач продукта, а не вокруг внутренних допущений команды.",
      en: "We map the user journey and build navigation, states, and components around the product’s real jobs to be done, not internal team assumptions.",
    },
    deliverables: {
      ru: ["Customer flow", "Wireframes", "UI-kit", "Состояния и взаимодействия", "Design system"],
      en: ["Customer flow", "Wireframes", "UI kit", "States and interactions", "Design system"],
    },
    fit: {
      ru: ["Сложный сервис или кабинет", "Нужно улучшить usability", "Есть продукт, но нет визуальной системы"],
      en: ["Complex products or dashboards", "Usability needs improvement", "The product lacks a visual system"],
    },
    process: {
      ru: [
        "Разбираем сценарии пользователя, ограничения и приоритеты продукта.",
        "Собираем информационную архитектуру и каркасы экранов.",
        "Проектируем интерфейс, компоненты и взаимодействия.",
        "Проверяем состояния и готовим дизайн к передаче команде.",
      ],
      en: [
        "We map user journeys, product constraints, and priorities.",
        "We build the information architecture and screen wireframes.",
        "We design the interface, components, and interactions.",
        "We test states and prepare the design for the delivery team.",
      ],
    },
    relatedProjectSlugs: ["aria-studio"],
  },
  {
    slug: "advertising-print",
    name: { ru: "Реклама и печать", en: "Advertising & Print" },
    summary: {
      ru: "Офлайн-материалы, в которых бренд узнаётся на экране, на бумаге и в физическом пространстве.",
      en: "Offline materials that keep the brand recognisable on screen, on paper, and in physical space.",
    },
    description: {
      ru: "Готовим материалы для запусков, мероприятий и кампаний, где сообщение должно считываться быстро, а бренд — оставаться в памяти.",
      en: "We prepare materials for launches, events, and campaigns where the message must land quickly and the brand must stay memorable.",
    },
    deliverables: {
      ru: ["OOH и indoor", "Постеры и POS", "Буклеты и каталоги", "Event-материалы", "Подготовка к печати"],
      en: ["OOH and indoor", "Posters and POS", "Booklets and catalogues", "Event materials", "Print-ready production"],
    },
    fit: {
      ru: ["Оффлайн-кампании", "Сильные ивент-носители", "Когда digital и print должны говорить одним языком"],
      en: ["Offline campaigns", "Bold event assets", "When digital and print need one visual voice"],
    },
    process: {
      ru: [
        "Уточняем аудиторию, форматы и производственные ограничения.",
        "Собираем ключевой визуал и правила вёрстки.",
        "Адаптируем макеты под носители и готовим их к печати.",
        "Передаём файлы и спецификации для производства.",
      ],
      en: [
        "We define the audience, formats, and production constraints.",
        "We build the key visual and layout rules.",
        "We adapt the layouts for every touchpoint and prepare print files.",
        "We hand over files and specifications for production.",
      ],
    },
    relatedProjectSlugs: ["solo-festival", "north-roasters"],
  },
  {
    slug: "3d",
    name: { ru: "3D", en: "3D" },
    summary: {
      ru: "3D-визуализация, когда продукт, пространство или идея должны быть убедительно показаны до реального производства.",
      en: "3D visualisation for when a product, space, or idea needs to be shown convincingly before it reaches production.",
    },
    description: {
      ru: "Используем 3D как инструмент объяснения и презентации: для упаковки, предметов, среды и digital-проектов, где обычного мокапа уже недостаточно.",
      en: "We use 3D to explain and present an idea across packaging, products, environments, and digital projects when a standard mockup is no longer enough.",
    },
    deliverables: {
      ru: ["Concept renders", "Материалы и свет", "Продуктовые сцены", "3D-графика для digital", "Арт-кадры для презентации"],
      en: ["Concept renders", "Materials and lighting", "Product scenes", "3D graphics for digital", "Art shots for presentation"],
    },
    fit: {
      ru: ["Нужно показать продукт до продакшна", "Нужен wow-уровень в презентации", "Фотографии пока нет или она не решает задачу"],
      en: ["Need to show a product before production", "Presentation needs stronger impact", "Photography is missing or not enough"],
    },
    process: {
      ru: [
        "Определяем объект, референсы и необходимый уровень реализма.",
        "Собираем сцену, материалы, свет и ракурс.",
        "Согласуем тестовые рендеры и доводим финальные кадры.",
        "Передаём готовые изображения и исходные материалы по договорённости.",
      ],
      en: [
        "We define the object, references, and the required level of realism.",
        "We build the scene, materials, lighting, and camera angles.",
        "We review test renders and refine the final frames.",
        "We deliver finished imagery and agreed source materials.",
      ],
    },
    relatedProjectSlugs: ["north-roasters", "solo-festival"],
  },
] as const;

export function getMgsServiceDefinition(slug: string) {
  return mgsServiceDefinitions.find((item) => item.slug === slug);
}
