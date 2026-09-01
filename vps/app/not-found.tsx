"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { MgsSiteFrame } from "@/components/mgs-site-frame";
import { MgsNotFoundPage } from "@/components/mgs-secondary-pages";

function NotFoundContent() {
  const searchParams = useSearchParams();
  const locale = searchParams.get("lang") === "en" ? "en" : "ru";

  return (
    <MgsSiteFrame locale={locale}>
      <MgsNotFoundPage locale={locale} />
    </MgsSiteFrame>
  );
}

function NotFoundFallback() {
  return (
    <MgsSiteFrame locale="ru">
      <MgsNotFoundPage locale="ru" />
    </MgsSiteFrame>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<NotFoundFallback />}>
      <NotFoundContent />
    </Suspense>
  );
}
