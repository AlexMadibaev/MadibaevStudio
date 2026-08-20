(() => {
  const supported = ["ru", "en"];
  const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
  const storedLanguage = localStorage.getItem("mgs-language");
  let current = supported.includes(requestedLanguage)
    ? requestedLanguage
    : supported.includes(storedLanguage)
      ? storedLanguage
      : "ru";

  const applyDocumentLanguage = () => {
    document.documentElement.lang = current;
    document.documentElement.dataset.language = current;
  };

  applyDocumentLanguage();
  localStorage.setItem("mgs-language", current);

  const transitionStyle = document.createElement("style");
  transitionStyle.textContent = `
    .language-transition-scrim{position:fixed;inset:0;z-index:100;pointer-events:none;opacity:0;background:rgba(8,8,10,.36);-webkit-backdrop-filter:blur(0);backdrop-filter:blur(0);will-change:opacity,backdrop-filter}
    body>header,body>main,body>footer{will-change:opacity}
    .language-transition-logo{position:fixed;z-index:101;top:50%;left:50%;width:min(148px,38vw);pointer-events:none;opacity:0;transform:translate(-50%,-50%) scale(.96);will-change:opacity,transform}
    .language-transition-logo img{display:block;width:100%;height:auto}
    body.is-language-switching .language-transition-scrim{animation:language-soft-blur 1.08s cubic-bezier(.45,0,.55,1) both}
    body.is-language-switching>header,body.is-language-switching>main,body.is-language-switching>footer{animation:language-content-fade 1.08s cubic-bezier(.45,0,.55,1) both}
    body.is-language-switching .language-transition-logo{animation:language-logo-reveal 1.08s cubic-bezier(.45,0,.55,1) both}
    @keyframes language-soft-blur{0%{opacity:0;-webkit-backdrop-filter:blur(0) saturate(1);backdrop-filter:blur(0) saturate(1)}46%,54%{opacity:1;-webkit-backdrop-filter:blur(18px) saturate(.92);backdrop-filter:blur(18px) saturate(.92)}100%{opacity:0;-webkit-backdrop-filter:blur(0) saturate(1);backdrop-filter:blur(0) saturate(1)}}
    @keyframes language-content-fade{0%,100%{opacity:1}46%,54%{opacity:.42}}
    @keyframes language-logo-reveal{0%{opacity:0;transform:translate(-50%,-50%) scale(.96)}30%,68%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.025)}}
    @media (prefers-reduced-motion:reduce){.language-transition-scrim,.language-transition-logo{display:none}}
  `;
  document.head.append(transitionStyle);

  const transitionScrim = document.createElement("div");
  transitionScrim.className = "language-transition-scrim";
  transitionScrim.setAttribute("aria-hidden", "true");
  document.body.append(transitionScrim);

  const transitionLogo = document.createElement("div");
  transitionLogo.className = "language-transition-logo";
  transitionLogo.setAttribute("aria-hidden", "true");
  transitionLogo.innerHTML = '<img src="assets/mgs-logo.svg" alt="">';
  document.body.append(transitionLogo);

  const transitionDuration = 1080;
  const languageChangeOffset = 540;
  let changeTimer;
  let settleTimer;
  let pendingLanguage;
  let isTransitioning = false;

  const set = (language) => {
    if (!supported.includes(language)) return;
    current = language;
    localStorage.setItem("mgs-language", current);
    applyDocumentLanguage();
    document.dispatchEvent(new CustomEvent("mgs:languagechange", { detail: { language: current } }));
  };

  const change = (language) => {
    if (!supported.includes(language) || isTransitioning || language === current) return;
    const reducedMotion = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.clearTimeout(changeTimer);
    window.clearTimeout(settleTimer);

    if (reducedMotion) {
      pendingLanguage = undefined;
      isTransitioning = false;
      document.body.classList.remove("is-language-switching");
      set(language);
      return;
    }

    pendingLanguage = language;
    isTransitioning = true;
    document.body.classList.remove("is-language-switching");
    void document.body.offsetWidth;
    document.body.classList.add("is-language-switching");
    changeTimer = window.setTimeout(() => {
      const nextLanguage = pendingLanguage;
      pendingLanguage = undefined;
      set(nextLanguage);
    }, languageChangeOffset);
    settleTimer = window.setTimeout(() => {
      document.body.classList.remove("is-language-switching");
      isTransitioning = false;
    }, transitionDuration);
  };

  window.MGSLocale = {
    supported,
    get current() {
      return current;
    },
    set,
    change,
  };
})();
