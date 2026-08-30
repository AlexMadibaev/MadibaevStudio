"use client";

import { useEffect } from "react";

type LogoAsset = {
  src: string;
  mode?: "logo" | "mark-with-label";
  label?: string;
  opticalScale?: number;
};

const CLIENT_LOGOS: Record<string, LogoAsset> = {
  Samsung: {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Samsung_wordmark.svg",
    opticalScale: 0.96,
  },
  "MegaFon Tajikistan": {
    src: "https://www.megafon.tj/logo.svg",
    opticalScale: 1.08,
  },
  "Aga Khan": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/%D0%9C%D0%BE%D0%BD%D1%82%D0%B0%D0%B6%D0%BD%D0%B0%D1%8F_%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C_1%404x.png",
    opticalScale: 1.02,
  },
  "МИД Республики Таджикистан": {
    src: "https://www.google.com/s2/favicons?domain=mfa.tj&sz=256",
    mode: "mark-with-label",
    label: "МИД Республики Таджикистан",
    opticalScale: 1,
  },
  "Ministry of Foreign Affairs of Tajikistan": {
    src: "https://www.google.com/s2/favicons?domain=mfa.tj&sz=256",
    mode: "mark-with-label",
    label: "Ministry of Foreign Affairs of Tajikistan",
    opticalScale: 1,
  },
  Saloma: {
    src: "https://salomat.tj/images/logo.png",
    label: "Salomat",
    opticalScale: 0.96,
  },
  Salomat: {
    src: "https://salomat.tj/images/logo.png",
    label: "Salomat",
    opticalScale: 0.96,
  },
};

function animateStats() {
  const stats = Array.from(document.querySelectorAll<HTMLElement>(".mgs-live-stat__value"));
  if (!stats.length) return () => undefined;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0;
  let hasRun = false;

  const run = () => {
    if (hasRun) return;
    hasRun = true;

    const targets = stats.map((node) => {
      const label = node.closest("dt")?.getAttribute("aria-label") ?? node.textContent ?? "0";
      const target = Number.parseInt(label.replace(/\D/g, ""), 10) || 0;
      node.textContent = reducedMotion ? String(target) : "0";
      return { node, target };
    });

    if (reducedMotion) return;

    const duration = 1450;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      targets.forEach(({ node, target }) => {
        node.textContent = String(Math.round(target * eased));
      });

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        targets.forEach(({ node, target }) => {
          node.textContent = String(target);
        });
      }
    };

    frame = requestAnimationFrame(tick);
  };

  const section = stats[0]?.closest(".mgs-home-about") as HTMLElement | null;
  if (!section || !("IntersectionObserver" in window)) {
    run();
    return () => frame && cancelAnimationFrame(frame);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      requestAnimationFrame(run);
    },
    { threshold: 0.15 },
  );

  observer.observe(section);

  return () => {
    observer.disconnect();
    if (frame) cancelAnimationFrame(frame);
  };
}

function enhanceClients() {
  const title = document.querySelector<HTMLElement>(".mgs-home-clients__heading h2");
  if (title) {
    const current = title.textContent?.trim();
    if (current === "Наши клиенты") title.textContent = "Нам доверяют";
    if (current === "Our clients") title.textContent = "Trusted by";
  }

  const wordmarks = Array.from(document.querySelectorAll<HTMLElement>(".mgs-home-client__wordmark"));

  wordmarks.forEach((wordmark) => {
    const card = wordmark.closest<HTMLElement>(".mgs-home-client");
    if (!card || card.dataset.logoEnhanced === "true") return;

    const key = wordmark.textContent?.trim() ?? "";
    const asset = CLIENT_LOGOS[key];
    if (!asset) return;

    card.dataset.logoEnhanced = "true";
    card.dataset.opticalScale = String(asset.opticalScale ?? 1);
    card.classList.add("mgs-home-client--logo");

    const logo = document.createElement("img");
    logo.className = "mgs-home-client__logo";
    logo.src = asset.src;
    logo.alt = asset.label ?? key;
    logo.loading = "lazy";
    logo.decoding = "async";

    const restoreFallback = () => {
      logo.remove();
      wordmark.style.removeProperty("display");
      card.classList.remove("mgs-home-client--logo");
      card.classList.remove("mgs-home-client--mark-with-label");
      delete card.dataset.logoEnhanced;
      delete card.dataset.opticalScale;
    };

    logo.addEventListener("error", restoreFallback, { once: true });

    if (asset.mode === "mark-with-label") {
      card.classList.add("mgs-home-client--mark-with-label");
      wordmark.textContent = asset.label ?? key;
      card.insertBefore(logo, wordmark);
    } else {
      wordmark.style.display = "none";
      card.appendChild(logo);
    }
  });
}

function trackClientFocus() {
  const viewport = document.querySelector<HTMLElement>(".mgs-home-clients__viewport");
  if (!viewport) return () => undefined;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0;
  let running = false;

  const update = () => {
    const viewportRect = viewport.getBoundingClientRect();
    const viewportCenter = viewportRect.left + viewportRect.width / 2;
    const cards = Array.from(viewport.querySelectorAll<HTMLElement>(".mgs-home-client--logo"));

    if (!cards.length) return;

    const focusRange = Math.max(190, Math.min(viewportRect.width * 0.5, 430));
    let nearest: HTMLElement | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(viewportCenter - center);
      const linear = Math.max(0, 1 - distance / focusRange);
      const focus = linear * linear * (3 - 2 * linear);
      const opticalScale = Number.parseFloat(card.dataset.opticalScale ?? "1") || 1;

      card.style.setProperty("--client-logo-opacity", (0.56 + focus * 0.44).toFixed(3));
      card.style.setProperty("--client-logo-saturation", (0.68 + focus * 0.32).toFixed(3));
      card.style.setProperty("--client-logo-brightness", (0.9 + focus * 0.1).toFixed(3));
      card.style.setProperty("--client-logo-scale", (opticalScale * (0.94 + focus * 0.08)).toFixed(3));
      card.style.setProperty("--client-card-focus", focus.toFixed(3));

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = card;
      }
    });

    cards.forEach((card) => card.classList.toggle("is-centered", card === nearest));
  };

  const loop = () => {
    update();
    frame = requestAnimationFrame(loop);
  };

  const start = () => {
    if (running) return;
    running = true;
    if (reducedMotion) {
      update();
      return;
    }
    frame = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  let observer: IntersectionObserver | null = null;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) start();
        else stop();
      },
      { threshold: 0 },
    );
    observer.observe(viewport);
  } else {
    start();
  }

  const handleResize = () => {
    if (reducedMotion) update();
  };
  window.addEventListener("resize", handleResize);

  return () => {
    observer?.disconnect();
    window.removeEventListener("resize", handleResize);
    stop();
  };
}

export function MgsRuntimeEnhancements() {
  useEffect(() => {
    const stopStats = animateStats();
    enhanceClients();
    const stopClientFocus = trackClientFocus();

    const observer = new MutationObserver(() => {
      enhanceClients();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      stopStats();
      stopClientFocus();
      observer.disconnect();
    };
  }, []);

  return null;
}
