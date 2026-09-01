"use client";

import { useState } from "react";

import { MgsAdminMediaPicker } from "@/components/mgs-admin-media-library";

type MgsAdminCoverMediaBridgeProps = {
  initialValue: string;
  disabled?: boolean;
};

function findCoverInput() {
  const labels = Array.from(document.querySelectorAll<HTMLLabelElement>("label"));
  const label = labels.find((item) =>
    Array.from(item.querySelectorAll("span")).some((span) => span.textContent?.trim() === "Cover image"),
  );
  return label?.querySelector<HTMLInputElement>("input") ?? null;
}

function setNativeInputValue(input: HTMLInputElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  descriptor?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

export function MgsAdminCoverMediaBridge({ initialValue, disabled = false }: MgsAdminCoverMediaBridgeProps) {
  const [value, setValue] = useState(initialValue);
  const [message, setMessage] = useState<string | null>(null);

  function applyCover(nextValue: string) {
    setValue(nextValue);
    const input = findCoverInput();
    if (!input) {
      setMessage("Поле обложки не найдено. Обновите страницу и попробуйте ещё раз.");
      return;
    }

    setNativeInputValue(input, nextValue);
    input.focus({ preventScroll: true });
    setMessage("Обложка выбрана. Нажмите Save project, чтобы сохранить изменение.");
  }

  return (
    <div className="mb-5 rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#c6b798]">Cover media</p>
        <p className="mt-1 text-sm leading-6 text-[#b7aa9d]">Выберите обложку из медиатеки или загрузите новый файл. Выбранный URL автоматически попадёт в поле Cover image ниже.</p>
      </div>
      <MgsAdminMediaPicker disabled={disabled} onChange={applyCover} value={value} />
      {message ? <p className="mt-3 text-xs leading-5 text-[#a99c90]">{message}</p> : null}
    </div>
  );
}
