"use client";

import { useEffect } from "react";

const HEADING_SELECTOR = [
  ".mgs-site h1",
  ".mgs-site h2",
  ".mgs-site h3",
  ".mgs-site h4",
  ".mgs-case h1",
  ".mgs-case h2",
  ".mgs-case h3",
  ".mgs-case h4",
].join(", ");

/*
 * ThreeUI `threeui-intro` — first authored beat only.
 * Source: creator-studio-intro.html / makeWordmark()
 * Authored scene: 0.00s -> 1.72s, rng seed 7719.
 *
 * The original ThreeUI/Creator Studio mark is intentionally omitted here:
 * the destination heading itself is the wordmark surface. Character motion,
 * easing, jitter, chromatic separation, blur and timing below are kept from
 * the authored first beat rather than approximated from the preview.
 */
const INTRO_DURATION_MS = 1720;
const SOURCE_SEED = 7719;

type CharacterMotion = {
  node: HTMLSpanElement;
  jitter: readonly [number, number, number];
};

type HeadingState = {
  overlay: HTMLSpanElement;
  characters: CharacterMotion[];
  positionWasInjected: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (t: number, a: number, b: number) =>
  clamp((t - a) / (b - a || 1e-6), 0, 1);
const eOut = (t: number) => 1 - Math.pow(1 - t, 3);

function sourceRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getHeadingText(root: HTMLElement) {
  /* innerText preserves authored block/flex line structure (notably the
     three-line home hero) while still ignoring non-rendered helper content. */
  return root.innerText.replace(/\r/g, "").trim();
}

function buildOverlay(heading: HTMLElement): HeadingState | null {
  const text = getHeadingText(heading);
  if (!text) return null;

  const overlay = document.createElement("span");
  overlay.className = "mgs-heading-intro__overlay";
  overlay.setAttribute("aria-hidden", "true");

  const rng = sourceRng(SOURCE_SEED);
  const characters: CharacterMotion[] = [];
  let word: HTMLSpanElement | null = null;

  const appendWord = () => {
    if (word) return word;
    word = document.createElement("span");
    word.className = "mgs-heading-intro__word";
    overlay.appendChild(word);
    return word;
  };

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index] ?? "";
    const jitter = [rng() * 2 - 1, rng() * 2 - 1, rng()] as const;

    if (character === "\n") {
      word = null;
      overlay.appendChild(document.createElement("br"));
      continue;
    }

    if (/\s/.test(character)) {
      word = null;
      overlay.appendChild(document.createTextNode(character));
      continue;
    }

    const node = document.createElement("span");
    node.className = "mgs-heading-intro__char";
    node.textContent = character;
    appendWord().appendChild(node);
    characters.push({ node, jitter });
  }

  const positionWasInjected = window.getComputedStyle(heading).position === "static";
  if (positionWasInjected) heading.style.position = "relative";

  heading.appendChild(overlay);
  heading.classList.add("mgs-heading-intro-active");

  return { overlay, characters, positionWasInjected };
}

function renderAuthoredFrame(characters: CharacterMotion[], progress: number) {
  characters.forEach(({ node, jitter }) => {
    const [jitterX, jitterY, delay] = jitter;
    const amount = eOut(clamp(seg(progress, 0.02, 0.5) * 1.5 - delay * 0.5, 0, 1));

    node.style.transform = `translate(${(jitterX * 62 * (1 - amount)).toFixed(1)}px,${(jitterY * 34 * (1 - amount)).toFixed(1)}px) scale(${lerp(1.24, 1, amount).toFixed(3)})`;
    node.style.opacity = Math.min(1, amount * 1.6).toFixed(3);

    const separation = (1 - amount) * 11;
    node.style.textShadow = separation > 0.4
      ? `${(-separation).toFixed(1)}px 0 rgba(255,64,72,.85),${separation.toFixed(1)}px 0 rgba(64,255,190,.8),0 ${(separation * 0.55).toFixed(1)}px rgba(96,124,255,.8)`
      : "none";
    node.style.filter = separation > 0.7
      ? `blur(${(separation * 0.3).toFixed(2)}px)`
      : "none";
  });
}

function restoreHeading(heading: HTMLElement, state: HeadingState | undefined) {
  state?.overlay.remove();
  heading.classList.remove("mgs-heading-intro-active");
  if (state?.positionWasInjected) heading.style.removeProperty("position");
}

function createHeadingIntroController() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bound = new Set<HTMLElement>();
  const states = new Map<HTMLElement, HeadingState>();
  const frames = new Map<HTMLElement, number>();

  if (reducedMotion || !("IntersectionObserver" in window)) {
    return {
      refresh: () => undefined,
      destroy: () => undefined,
    };
  }

  const finish = (heading: HTMLElement) => {
    const frame = frames.get(heading);
    if (frame) cancelAnimationFrame(frame);
    frames.delete(heading);

    const state = states.get(heading);
    restoreHeading(heading, state);
    states.delete(heading);
    heading.dataset.mgsHeadingIntroDone = "true";
  };

  const animate = (heading: HTMLElement) => {
    if (heading.dataset.mgsHeadingIntroDone === "true" || states.has(heading)) return;

    const state = buildOverlay(heading);
    if (!state) {
      heading.dataset.mgsHeadingIntroDone = "true";
      return;
    }

    states.set(heading, state);
    renderAuthoredFrame(state.characters, 0);
    const startedAt = performance.now();

    const frame = (now: number) => {
      if (!heading.isConnected) {
        finish(heading);
        return;
      }

      const progress = clamp((now - startedAt) / INTRO_DURATION_MS, 0, 1);
      renderAuthoredFrame(state.characters, progress);

      if (progress < 1) {
        frames.set(heading, requestAnimationFrame(frame));
      } else {
        finish(heading);
      }
    };

    frames.set(heading, requestAnimationFrame(frame));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const heading = entry.target as HTMLElement;
        observer.unobserve(heading);
        animate(heading);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "72px 0px 72px 0px",
    },
  );

  const refresh = () => {
    bound.forEach((heading) => {
      if (heading.isConnected) return;
      observer.unobserve(heading);
      finish(heading);
      bound.delete(heading);
    });

    document.querySelectorAll<HTMLElement>(HEADING_SELECTOR).forEach((heading) => {
      if (bound.has(heading) || heading.dataset.mgsHeadingIntroDone === "true") return;
      if (heading.closest("[aria-hidden='true']")) return;

      bound.add(heading);
      heading.dataset.mgsHeadingIntroBound = "true";
      observer.observe(heading);
    });
  };

  const destroy = () => {
    observer.disconnect();
    frames.forEach(cancelAnimationFrame);
    frames.clear();
    bound.forEach((heading) => {
      restoreHeading(heading, states.get(heading));
      delete heading.dataset.mgsHeadingIntroBound;
      delete heading.dataset.mgsHeadingIntroDone;
    });
    states.clear();
    bound.clear();
  };

  return { refresh, destroy };
}

export function MgsHeadingIntros() {
  useEffect(() => {
    const controller = createHeadingIntroController();
    controller.refresh();

    const mutationObserver = new MutationObserver(() => {
      controller.refresh();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      controller.destroy();
    };
  }, []);

  return null;
}
