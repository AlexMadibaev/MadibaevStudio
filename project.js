const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const setLeadingText = (element, value) => {
  if (!element) return;
  const textNode = [...element.childNodes].find(
    (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim(),
  );

  if (textNode) textNode.nodeValue = value;
  else element.insertBefore(document.createTextNode(value), element.firstChild);
};

const setHeadingLines = (element, lines) => {
  if (!element) return;
  element.replaceChildren();
  lines.forEach((line, index) => {
    if (index) element.append(document.createElement("br"));
    element.append(document.createTextNode(line));
  });
};

const pageCopy = {
  ru: {
    pageTitle: "MGS — Проект",
    description: "Проект Madibaev Graphic Studio.",
    languageLabel: "Выбор языка",
    tajikTitle: "Таджикский язык появится позже",
    start: "Начать проект ",
    headerBack: "Работы",
    back: "← Все проекты",
    loading: "ЗАГРУЗКА",
    project: "Проект",
    empty: "Кейс скоро появится.",
    missingTitle: "Этот проект не найден.",
    missingBack: "К работам",
    story: "О ПРОЕКТЕ",
    contactKicker: "НОВЫЙ ПРОЕКТ",
    contactTitle: ["Есть задача?", "Давайте обсудим."],
    details: "Детали проекта",
    services: "Услуги",
    year: "Год",
    type: "Направление",
    footerPlace: "Душанбе · Весь мир",
    visualLabel: "Проект Madibaev Graphic Studio",
    categories: {
      branding: "БРЕНДИНГ",
      digital: "DIGITAL",
      campaign: "КАМПАНИЯ",
      "graphic-design": "ГРАФИЧЕСКИЙ ДИЗАЙН",
    },
    serviceNames: {
      Branding: "Брендинг",
      "Art Direction": "Арт-дирекшн",
      "Web Design": "Веб-дизайн",
      "UI/UX": "UI/UX",
      Campaign: "Кампания",
      Packaging: "Упаковка",
      Identity: "Айдентика",
    },
  },
  en: {
    pageTitle: "MGS — Project",
    description: "A Madibaev Graphic Studio project.",
    languageLabel: "Language selection",
    tajikTitle: "Tajik language coming soon",
    start: "Start a project ",
    headerBack: "Work",
    back: "← All projects",
    loading: "LOADING",
    project: "Project",
    empty: "Case study coming soon.",
    missingTitle: "This project doesn't exist.",
    missingBack: "Back to work",
    story: "ABOUT THE PROJECT",
    contactKicker: "NEW PROJECT",
    contactTitle: ["Have a project?", "Let's talk."],
    details: "Project details",
    services: "Services",
    year: "Year",
    type: "Discipline",
    footerPlace: "Dushanbe · Worldwide",
    visualLabel: "Madibaev Graphic Studio project",
    categories: {
      branding: "BRANDING",
      digital: "DIGITAL",
      campaign: "CAMPAIGN",
      "graphic-design": "GRAPHIC DESIGN",
    },
    serviceNames: {
      Branding: "Branding",
      "Art Direction": "Art Direction",
      "Web Design": "Web Design",
      "UI/UX": "UI/UX",
      Campaign: "Campaign",
      Packaging: "Packaging",
      Identity: "Identity",
    },
  },
};

const title = $("#title");
const meta = $("#meta");
const blocks = $("#blocks");
const art = $("#art");
const details = $("#case-details");
const story = $(".case-story");
const id = new URLSearchParams(location.search).get("id");
let project;
let state = "loading";

const languageSwitch = document.createElement("div");
languageSwitch.className = "language-switch";
languageSwitch.innerHTML = `
  <button type="button" data-lang="ru" aria-label="Русский">RU</button>
  <button type="button" data-lang="en" aria-label="English">EN</button>
  <button type="button" disabled>TJ</button>
`;
$("header .logo")?.after(languageSwitch);

const getProjectTitle = (value, language) => {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || value?.ru || pageCopy[language].project;
};

const getProjectMark = (projectData) => {
  const source = getProjectTitle(projectData.title, "en").trim();
  return [...source][0]?.toUpperCase() || "M";
};

const getBlockContent = (block, language) => {
  if (block.translations?.[language]) return block.translations[language];
  if (typeof block.content === "object" && block.content) {
    return block.content[language] || block.content.en || block.content.ru || "";
  }
  return block.content || "";
};

const getCategory = (projectData, copy) => (
  copy.categories[projectData.category] || projectData.category?.toUpperCase() || ""
);

const getServiceList = (projectData, copy) => (
  (projectData.services || [])
    .map((service) => copy.serviceNames[service] || service)
    .join(" · ") || "—"
);

const setCaseDetails = (copy) => {
  details?.setAttribute("aria-label", copy.details);
  $("#detail-services-label").textContent = copy.services;
  $("#detail-year-label").textContent = copy.year;
  $("#detail-type-label").textContent = copy.type;
  $("#detail-services").textContent = getServiceList(project, copy);
  $("#detail-year").textContent = project.year || "—";
  $("#detail-type").textContent = getCategory(project, copy);
};

const renderArtwork = (projectTitle, category, copy) => {
  art.hidden = false;
  art.className = `case-hero ${project.category || ""}`;
  art.replaceChildren();
  art.setAttribute("aria-label", `${copy.visualLabel}: ${projectTitle}`);

  const label = document.createElement("span");
  label.className = "case-art-label";
  label.textContent = category;

  const visualTitle = document.createElement("span");
  visualTitle.className = "case-art-title";
  visualTitle.textContent = getProjectMark(project);

  const index = document.createElement("span");
  index.className = "case-art-index";
  index.textContent = String(project.year || "");

  art.append(label, visualTitle, index);
};

const renderBlocks = (copy) => {
  blocks.replaceChildren();
  const source = project?.blocks || [];

  if (!source.length) {
    const paragraph = document.createElement("p");
    paragraph.textContent = copy.empty;
    blocks.appendChild(paragraph);
    return;
  }

  source.forEach((block) => {
    const element = document.createElement(block.type === "heading" ? "h2" : "p");
    element.textContent = getBlockContent(block, window.MGSLocale.current);
    blocks.appendChild(element);
  });
};

const setSharedCopy = (copy) => {
  document.documentElement.lang = window.MGSLocale.current;
  languageSwitch.setAttribute("aria-label", copy.languageLabel);
  $(".language-switch button:disabled")?.setAttribute("title", copy.tajikTitle);
  $$(".language-switch [data-lang]").forEach((button) => {
    const isActive = button.dataset.lang === window.MGSLocale.current;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  setLeadingText($("header .small"), copy.start);
  setLeadingText($(".case-contact"), copy.start);
  $(".case-header-back").textContent = copy.headerBack;
  $(".case-back").textContent = copy.back;
  $("#story-label").textContent = copy.story;
  $("#case-contact-kicker").textContent = copy.contactKicker;
  setHeadingLines($("#case-contact-title"), copy.contactTitle);
  $("#case-footer-place").textContent = copy.footerPlace;
};

const renderLoading = (copy) => {
  document.title = copy.pageTitle;
  $("meta[name='description']")?.setAttribute("content", copy.description);
  meta.textContent = copy.loading;
  title.textContent = copy.project;
  art.hidden = false;
  art.className = "case-hero";
  art.replaceChildren();
  details.hidden = true;
  story.hidden = true;
};

const renderMissing = (copy) => {
  document.title = copy.pageTitle;
  $("meta[name='description']")?.setAttribute("content", copy.description);
  meta.textContent = "404";
  title.textContent = copy.missingTitle;
  art.hidden = true;
  details.hidden = true;
  story.hidden = true;
};

const renderProject = (copy) => {
  const language = window.MGSLocale.current;
  const projectTitle = getProjectTitle(project.title, language);
  const category = getCategory(project, copy);
  document.title = `MGS — ${projectTitle}`;
  $("meta[name='description']")?.setAttribute(
    "content",
    `${projectTitle} — Madibaev Graphic Studio.`,
  );
  meta.textContent = `${category} · ${project.year}`;
  title.textContent = projectTitle;
  details.hidden = false;
  story.hidden = false;
  setCaseDetails(copy);
  renderArtwork(projectTitle, category, copy);
  renderBlocks(copy);
};

const render = () => {
  const copy = pageCopy[window.MGSLocale.current];
  setSharedCopy(copy);

  if (state === "loading") {
    renderLoading(copy);
    return;
  }

  if (state === "missing") {
    renderMissing(copy);
    return;
  }

  renderProject(copy);
};

languageSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lang]");
  if (button) window.MGSLocale.change(button.dataset.lang);
});

document.addEventListener("mgs:languagechange", render);
render();

if (!id) {
  location.replace("/#work");
} else {
  fetch(`/api/projects/${encodeURIComponent(id)}`)
    .then((response) => (
      response.ok ? response.json() : Promise.reject(new Error("Project not found"))
    ))
    .then((data) => {
      project = data;
      state = "loaded";
      render();
    })
    .catch(() => {
      state = "missing";
      render();
    });
}
