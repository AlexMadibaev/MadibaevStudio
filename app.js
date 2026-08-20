const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const setText = (selector, value, scope) => {
  const element = selector ? $(selector, scope) : scope;
  if (element) element.textContent = value;
};

const setHtml = (selector, value, scope) => {
  const element = $(selector, scope);
  if (element) element.innerHTML = value;
};

const setLeadingText = (element, value) => {
  if (!element) return;
  const textNode = [...element.childNodes].find(
    (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim(),
  );

  if (textNode) {
    textNode.nodeValue = value;
  } else {
    element.insertBefore(document.createTextNode(value), element.firstChild);
  }
};

const translations = {
  ru: {
    title: "Madibaev Graphic Studio — дизайн-студия",
    description: "Madibaev Graphic Studio — брендинг, сайты и цифровые продукты.",
    languageLabel: "Выбор языка",
    tajikTitle: "Таджикский язык появится позже",
    menuLabel: "Открыть меню",
    navigation: ["Работы", "Услуги", "О студии", "Начать проект"],
    headerCta: "Начать проект ",
    heroKicker: "MADIBAEV GRAPHIC STUDIO",
    heroHeading: "Дизайн,<br><em>который движет вперёд.</em>",
    heroDescription:
      "Создаём визуальные системы, сайты и digital-продукты для брендов с амбициями.",
    heroCta: "Смотреть работы ",
    availability: "Открыты для новых проектов",
    workHeading: "Работы<br><em>со смыслом.</em>",
    filters: ["Все", "Брендинг", "Digital", "Кампании"],
    projects: [
      { title: "Айдентика<br>Nava", services: "БРЕНДИНГ · АРТ-ДИРЕКШН" },
      { title: "Студия<br>Aria", services: "ВЕБ-ДИЗАЙН · UI/UX" },
      { title: "Фестиваль<br>SOLO", services: "КАМПАНИЯ · СОБЫТИЕ" },
      { title: "North<br>Roasters", services: "УПАКОВКА · АЙДЕНТИКА" },
    ],
    allWork: "Все работы ",
    servicesHeading: "От айдентики<br>до <em>влияния.</em>",
    services: [
      "Брендинг ",
      "Веб-дизайн и разработка ",
      "UI/UX и цифровые продукты ",
      "Кампании и арт-дирекшн ",
    ],
    aboutHeading: "Ясная точка<br><em>зрения.</em>",
    aboutDescription:
      "Madibaev Graphic Studio — независимая дизайн-студия Александра Мадибаева. Работаем на стыке стратегии, визуальной идентичности и цифрового опыта.",
    stats: ["лет практики", "реализованных проектов", "изученных индустрий"],
    contactHeading: "Создадим<br>что-то <em>важное.</em>",
    fields: {
      name: ["Имя", "Ваше имя"],
      email: ["Электронная почта", "you@company.com"],
      company: ["Компания", "Название компании"],
      projectType: ["Тип проекта", ""],
      budget: ["Бюджет", "От / до"],
      deadline: ["Желаемый срок", ""],
      message: ["Расскажите о проекте", "Задача, сроки, бюджет…"],
    },
    projectTypes: ["Брендинг", "Сайт", "UI/UX", "Графический дизайн", "Печать", "3D", "Другое"],
    submit: "Отправить заявку ",
    form: {
      sending: "Отправляем…",
      success: "Спасибо! Ваша заявка отправлена.",
      error: "Не удалось отправить заявку. Напишите нам: hello@madibaev.studio.",
    },
    footer: "Душанбе, Таджикистан · Работаем по всему миру",
  },
  en: {
    title: "Madibaev Graphic Studio — Design Studio",
    description: "Madibaev Graphic Studio — branding, websites and digital products.",
    languageLabel: "Language selection",
    tajikTitle: "Tajik language coming soon",
    menuLabel: "Open menu",
    navigation: ["Work", "Services", "About", "Start a project"],
    headerCta: "Start a project ",
    heroKicker: "MADIBAEV GRAPHIC STUDIO",
    heroHeading: "Design that<br><em>moves forward.</em>",
    heroDescription:
      "We create visual systems, websites and digital products for ambitious brands.",
    heroCta: "Explore selected work ",
    availability: "Open to new projects",
    workHeading: "Work with<br><em>purpose.</em>",
    filters: ["All", "Branding", "Digital", "Campaigns"],
    projects: [
      { title: "Nava<br>Identity", services: "BRANDING · ART DIRECTION" },
      { title: "Aria<br>Studio", services: "WEB DESIGN · UI/UX" },
      { title: "SOLO<br>Festival", services: "CAMPAIGN · EVENT" },
      { title: "North<br>Roasters", services: "PACKAGING · IDENTITY" },
    ],
    allWork: "View all work ",
    servicesHeading: "From identity<br>to <em>impact.</em>",
    services: [
      "Branding ",
      "Web Design & Development ",
      "UI/UX & Digital Products ",
      "Campaigns & Art Direction ",
    ],
    aboutHeading: "A clear point<br>of <em>view.</em>",
    aboutDescription:
      "Madibaev Graphic Studio is an independent design studio founded by Alexander Madibaev. We work where strategy, visual identity and digital experience meet.",
    stats: ["years of practice", "projects delivered", "industries explored"],
    contactHeading: "Let’s make<br>something <em>matter.</em>",
    fields: {
      name: ["Name", "Your name"],
      email: ["Email", "you@company.com"],
      company: ["Company", "Company name"],
      projectType: ["Project type", ""],
      budget: ["Budget", "From / to"],
      deadline: ["Deadline", ""],
      message: ["Tell us about your project", "Scope, timeline, budget…"],
    },
    projectTypes: ["Branding", "Website", "UI/UX", "Graphic Design", "Print", "3D", "Other"],
    submit: "Send enquiry ",
    form: {
      sending: "Sending…",
      success: "Thank you! Your enquiry has been sent.",
      error: "Could not send the enquiry. Please email hello@madibaev.studio.",
    },
    footer: "Dushanbe, Tajikistan · Available worldwide",
  },
};

const projectIds = ["nava-identity", "aria-studio", "solo-festival", "north-roasters"];
const projects = $$(".project");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }),
    { threshold: 0.12 },
  );

  $$(".reveal").forEach((element) => observer.observe(element));
} else {
  $$(".reveal").forEach((element) => element.classList.add("show"));
}

projects.forEach((card, index) => {
  card.href = `project.html?id=${projectIds[index]}`;
});

$$("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    $$("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
    projects.forEach((card) => {
      card.hidden = button.dataset.filter !== "all" && card.dataset.type !== button.dataset.filter;
    });
  });
});

const form = $("#contact form");
const buildContactFields = () => {
  const messageLabel = form?.querySelector("textarea")?.closest("label");
  if (!messageLabel || form.querySelector('[name="company"]')) return;

  messageLabel.insertAdjacentHTML(
    "beforebegin",
    `<label>Company<input name="company" placeholder="Company name"></label>
     <label>Project type<select name="projectType">
       <option value="branding">Branding</option>
       <option value="website">Website</option>
       <option value="ui-ux">UI/UX</option>
       <option value="graphic-design">Graphic Design</option>
       <option value="print">Print</option>
       <option value="3d">3D</option>
       <option value="other">Other</option>
     </select></label>
     <label>Budget<input name="budget" placeholder="From / to"></label>
     <label>Deadline<input name="deadline" type="date"></label>`,
  );
};

buildContactFields();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = $(".form-status", form);
  const button = $('[type="submit"]', form);
  const formCopy = () => translations[window.MGSLocale.current].form;

  button.disabled = true;
  status.textContent = formCopy().sending;

  try {
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });

    if (!response.ok) throw new Error("Could not send enquiry");
    form.reset();
    status.textContent = formCopy().success;
  } catch {
    status.textContent = formCopy().error;
  } finally {
    button.disabled = false;
  }
});

const switchStyle = document.createElement("style");
switchStyle.textContent = `
  .language-switch{position:relative;display:flex;align-items:center;gap:2px;padding:3px;border:1px solid rgba(245,242,234,.18);border-radius:999px;background:rgba(12,12,14,.72);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);isolation:isolate}
  .language-switch button{position:relative;min-width:32px;height:30px;padding:0 8px;border:0;border-radius:999px;background:transparent;color:rgba(245,242,234,.58);font:700 10px/1 Manrope,Arial,sans-serif;letter-spacing:.06em;cursor:pointer;transition:background-color .28s ease,color .28s ease,opacity .28s ease}
  .language-switch button:not(:disabled):hover{color:#f5f2ea;background:rgba(245,242,234,.09)}
  .language-switch button:focus-visible{outline:2px solid #f5f2ea;outline-offset:2px}
  .language-switch button.active{color:#0b0b0c;background:#f5f2ea}
  .language-switch button:disabled{min-width:26px;padding:0 5px;color:rgba(245,242,234,.3);opacity:.72;cursor:not-allowed}
  #contact select{width:100%;margin-top:8px;padding:14px;border:1px solid #f5f2ea22;border-radius:14px;background:#171719;color:#f5f2ea;font:15px Manrope,Arial,sans-serif}
  #contact select option{background:#171719;color:#f5f2ea}
  @media(max-width:800px){.language-switch{margin-left:auto}.language-switch button{min-width:30px;height:28px;padding:0 7px}}
`;
document.head.append(switchStyle);

const languageSwitch = document.createElement("div");
languageSwitch.className = "language-switch";
languageSwitch.setAttribute("role", "group");
languageSwitch.innerHTML = `
  <button type="button" data-lang="ru" aria-label="Русский">RU</button>
  <button type="button" data-lang="en" aria-label="English">EN</button>
  <button type="button" disabled aria-label="Тоҷикӣ">TJ</button>
`;
$("header nav")?.after(languageSwitch);

const setFieldCopy = (name, [label, placeholder]) => {
  const control = form?.elements.namedItem(name);
  const fieldLabel = control?.closest("label");
  if (!control || !fieldLabel) return;

  setLeadingText(fieldLabel, label);
  if ("placeholder" in control) control.placeholder = placeholder;
};

const applyLanguage = (language) => {
  const copy = translations[language];
  if (!copy) return;

  document.title = copy.title;
  $("meta[name='description']")?.setAttribute("content", copy.description);
  languageSwitch.setAttribute("aria-label", copy.languageLabel);
  $(".language-switch button:disabled")?.setAttribute("title", copy.tajikTitle);

  $$(".language-switch [data-lang]").forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  $$("header nav a").forEach((link, index) => setText(null, copy.navigation[index], link));
  $(".menu")?.setAttribute("aria-label", copy.menuLabel);
  setLeadingText($("header .small"), copy.headerCta);

  setText(".hero-copy .kicker", copy.heroKicker);
  setHtml(".hero-copy h1", copy.heroHeading);
  setText(".hero-copy > p:not(.kicker)", copy.heroDescription);
  setLeadingText($(".hero-copy .cta"), copy.heroCta);
  $$(".availability").forEach((element) => setText(null, copy.availability, element));

  setHtml("#work h2", copy.workHeading);
  $$("[data-filter]").forEach((button, index) => setText(null, copy.filters[index], button));
  projects.forEach((card, index) => {
    setHtml("b", copy.projects[index].title, card);
    setText("small", copy.projects[index].services, card);
  });
  setLeadingText($("#work > .link"), copy.allWork);

  setHtml("#services h2", copy.servicesHeading);
  $$("#services .services a").forEach((link, index) => setLeadingText(link, copy.services[index]));

  setHtml("#about h2", copy.aboutHeading);
  setText(".about-copy > p", copy.aboutDescription);
  $$(".about-copy dd").forEach((item, index) => setText(null, copy.stats[index], item));

  setHtml("#contact h2", copy.contactHeading);
  Object.entries(copy.fields).forEach(([name, fieldCopy]) => setFieldCopy(name, fieldCopy));
  const projectType = form?.elements.namedItem("projectType");
  if (projectType instanceof HTMLSelectElement) {
    [...projectType.options].forEach((option, index) => {
      option.textContent = copy.projectTypes[index];
    });
  }
  setLeadingText($("[type='submit']", form), copy.submit);

  setText("footer p", copy.footer);
};

languageSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lang]");
  if (button) window.MGSLocale.change(button.dataset.lang);
});

document.addEventListener("mgs:languagechange", (event) => applyLanguage(event.detail.language));
applyLanguage(window.MGSLocale.current);
