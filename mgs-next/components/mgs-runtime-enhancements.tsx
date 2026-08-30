"use client";

import { useEffect } from "react";

type LogoAsset = {
  src: string;
  mode?: "logo" | "mark-with-label";
  label?: string;
};

const CLIENT_LOGOS: Record<string, LogoAsset> = {
  Samsung: {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Samsung_wordmark.svg",
  },
  "MegaFon Tajikistan": {
    src: "https://logotyp.us/file/megafon.svg",
  },
  "Aga Khan": {
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/%D0%9C%D0%BE%D0%BD%D1%82%D0%B0%D0%B6%D0%BD%D0%B0%D1%8F_%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C_1%404x.png",
  },
  "МИД Республики Таджикистан": {
    src: "https://www.google.com/s2/favicons?domain=mfa.tj&sz=256",
    mode: "mark-with-label",
    label: "МИД Республики Таджикистан",
  },
  "Ministry of Foreign Affairs of Tajikistan": {
    src: "https://www.google.com/s2/favicons?domain=mfa.tj&sz=256",
    mode: "mark-with-label",
    label: "Ministry of Foreign Affairs of Tajikistan",
  },
  Saloma: {
    src: "https://www.google.com/s2/favicons?domain=salomat.tj&sz=256",
    mode: "mark-with-label",
    label: "Salomat",
  },
  Salomat: {
    src: "https://www.google.com/s2/favicons?domain=salomat.tj&sz=256",
    mode: "mark-with-label",
    label: "Salomat",
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

export function MgsRuntimeEnhancements() {
  useEffect(() => {
    const stopStats = animateStats();
    enhanceClients();

    const observer = new MutationObserver(() => {
      enhanceClients();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      stopStats();
      observer.disconnect();
    };
  }, []);

  return null;
}
