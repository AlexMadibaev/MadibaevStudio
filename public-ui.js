(() => {
  const header = document.querySelector(".public-page header");
  const menu = document.querySelector(".public-page .menu");
  const navigation = document.querySelector(".public-page header nav");

  const closeMenu = () => {
    header?.classList.remove("is-menu-open");
    menu?.setAttribute("aria-expanded", "false");
  };

  menu?.addEventListener("click", () => {
    const isOpen = header?.classList.toggle("is-menu-open");
    menu.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navigation?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const updateScrollState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    document.documentElement.style.setProperty("--scroll-progress", `${progress.toFixed(2)}%`);
  };

  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState, { passive: true });

})();
