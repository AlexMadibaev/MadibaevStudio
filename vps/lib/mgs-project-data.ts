export const mgsLocales = ["ru", "en"] as const;

export type MgsLocale = (typeof mgsLocales)[number];

export type MgsLocalizedText = Record<MgsLocale, string>;

export type MgsProjectBlock = {
  type: "heading" | "paragraph";
  content: MgsLocalizedText;
};

export type MgsProjectSeo = {
  title: MgsLocalizedText;
  description: MgsLocalizedText;
  keywords: Record<MgsLocale, string[]>;
};

export type MgsProject = {
  slug: string;
  sequence: string;
  visual: "nava" | "aria" | "solo" | "north";
  title: MgsLocalizedText;
  client: MgsLocalizedText;
  category: MgsLocalizedText;
  industry: MgsLocalizedText;
  discipline: MgsLocalizedText;
  services: Record<MgsLocale, string[]>;
  year: number;
  mark: string;
  cover: string;
  summary: MgsLocalizedText;
  blocks: MgsProjectBlock[];
  seo?: MgsProjectSeo;
};

export const mgsProjects: readonly MgsProject[] = [
  {
    slug: "nava-identity",
    sequence: "01",
    visual: "nava",
    title: { ru: "Айдентика Nava", en: "Nava Identity" },
    client: { ru: "Nava Cultural Initiative", en: "Nava Cultural Initiative" },
    category: { ru: "Брендинг", en: "Branding" },
    industry: { ru: "Культура", en: "Culture" },
    discipline: { ru: "Айдентика · Арт-дирекшн", en: "Identity · Art Direction" },
    services: {
      ru: ["Брендинг", "Арт-дирекшн"],
      en: ["Branding", "Art Direction"],
    },
    year: 2026,
    mark: "N",
    cover: "/projects/nava-cover.webp",
    summary: {
      ru: "Айдентика для культурной инициативы с самостоятельным характером.",
      en: "An identity system for a cultural initiative with a distinct point of view.",
    },
    blocks: [
      {
        type: "heading",
        content: {
          ru: "Самобытная точка зрения как основа системы.",
          en: "A distinct point of view.",
        },
      },
      {
        type: "paragraph",
        content: {
          ru: "Знак, типографика и визуальные принципы собраны в гибкую систему, которая держит характер бренда на афишах, в digital-среде и в презентационных материалах.",
          en: "Mark, typography, and visual principles come together in a flexible system that keeps the brand character intact across posters, digital touchpoints, and presentation materials.",
        },
      },
    ],
  },
  {
    slug: "aria-studio",
    sequence: "02",
    visual: "aria",
    title: { ru: "Студия Aria", en: "Aria Studio" },
    client: { ru: "Aria Studio", en: "Aria Studio" },
    category: { ru: "Диджитал", en: "Digital" },
    industry: { ru: "Технологии", en: "Technology" },
    discipline: { ru: "Сайты · Интерфейсы", en: "Websites · UI/UX" },
    services: {
      ru: ["Сайты", "Интерфейсы"],
      en: ["Websites", "UI/UX Design"],
    },
    year: 2025,
    mark: "A",
    cover: "/projects/aria-cover.webp",
    summary: {
      ru: "Цифровая среда с ясным ритмом, логикой и уверенным тоном.",
      en: "A digital environment with clear rhythm, logic, and a confident tone.",
    },
    blocks: [
      {
        type: "heading",
        content: {
          ru: "Ясность в каждом сценарии.",
          en: "Clarity in every interaction.",
        },
      },
      {
        type: "paragraph",
        content: {
          ru: "Интерфейс строится вокруг содержания: спокойная навигация, выверенная иерархия и детали, которые помогают двигаться к целевому действию без лишнего шума.",
          en: "The interface is built around content: calm navigation, precise hierarchy, and details that help people move toward the key action without unnecessary noise.",
        },
      },
    ],
  },
  {
    slug: "solo-festival",
    sequence: "03",
    visual: "solo",
    title: { ru: "Фестиваль SOLO", en: "SOLO Festival" },
    client: { ru: "SOLO Festival", en: "SOLO Festival" },
    category: { ru: "Кампания", en: "Campaign" },
    industry: { ru: "События", en: "Events" },
    discipline: { ru: "Кампания · Арт-дирекшн", en: "Campaign · Art Direction" },
    services: {
      ru: ["Кампания", "Арт-дирекшн"],
      en: ["Campaign", "Art Direction"],
    },
    year: 2025,
    mark: "S",
    cover: "/projects/solo-cover.webp",
    summary: {
      ru: "Кампейн-айдентика для фестиваля с насыщенной программой и живой средой.",
      en: "Campaign identity for a festival with a dense programme and a living atmosphere.",
    },
    blocks: [
      {
        type: "heading",
        content: {
          ru: "Программа с собственным ритмом и энергией.",
          en: "A programme with a pulse.",
        },
      },
      {
        type: "paragraph",
        content: {
          ru: "Выразительная графическая система держит вместе программу, сцену и коммуникацию и остаётся живой от первого анонса до последнего дня фестиваля.",
          en: "An expressive graphic system holds programme, stage, and communication together and stays alive from the first announcement to the final festival day.",
        },
      },
    ],
  },
  {
    slug: "north-roasters",
    sequence: "04",
    visual: "north",
    title: { ru: "North Roasters", en: "North Roasters" },
    client: { ru: "North Roasters", en: "North Roasters" },
    category: { ru: "Брендинг", en: "Branding" },
    industry: { ru: "Гостеприимство", en: "Hospitality" },
    discipline: { ru: "Упаковка · Айдентика", en: "Packaging · Identity" },
    services: {
      ru: ["Упаковка", "Айдентика"],
      en: ["Packaging", "Identity"],
    },
    year: 2025,
    mark: "N",
    cover: "/projects/north-cover.webp",
    summary: {
      ru: "Айдентика и упаковка для независимой обжарочной компании с ясным характером.",
      en: "Identity and packaging for an independent roastery with a clear character.",
    },
    blocks: [
      {
        type: "heading",
        content: {
          ru: "Кофе с ясным характером и сильной полкой.",
          en: "Coffee with a clear character.",
        },
      },
      {
        type: "paragraph",
        content: {
          ru: "Упаковка превращает выбор зерна в понятный и тактильный опыт: точная информация, сильная полка и система, готовая расти вместе с ассортиментом и новыми носителями.",
          en: "Packaging turns choosing a bean into a clear, tactile experience: precise information, strong shelf presence, and a system ready to grow with the range and future touchpoints.",
        },
      },
    ],
  },
];

export function getMgsProject(slug: string) {
  return mgsProjects.find((project) => project.slug === slug);
}

export function getNextMgsProject(slug: string) {
  const currentIndex = mgsProjects.findIndex((project) => project.slug === slug);

  if (currentIndex < 0) {
    return mgsProjects[0];
  }

  return mgsProjects[(currentIndex + 1) % mgsProjects.length];
}

export function resolveMgsLocale(value: string | string[] | undefined): MgsLocale {
  const language = Array.isArray(value) ? value[0] : value;

  return language === "en" ? "en" : "ru";
}
