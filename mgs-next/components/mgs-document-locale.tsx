"use client";

import { useEffect } from "react";

import type { MgsLocale } from "@/lib/mgs-project-data";

type MgsDocumentLocaleProps = {
  locale: MgsLocale;
  title: string;
  description: string;
};

export function MgsDocumentLocale({ locale, title, description }: MgsDocumentLocaleProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [description, locale, title]);

  return null;
}
