"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type MgsAdminLoginFormProps = {
  disabled: boolean;
};

export function MgsAdminLoginForm({ disabled }: MgsAdminLoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (disabled || pending) return;

        setPending(true);
        setMessage(null);

        try {
          const response = await fetch("/api/admin/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ password }),
          });
          const data = (await response.json().catch(() => null)) as { error?: string } | null;

          if (!response.ok) {
            setMessage(data?.error ?? "Unable to sign in.");
            return;
          }

          router.replace("/admin");
          router.refresh();
        } finally {
          setPending(false);
        }
      }}
    >
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#f6ecdd]">Admin password</span>
        <input
          autoComplete="current-password"
          className="w-full rounded-[24px] border border-white/12 bg-black/25 px-5 py-4 text-base text-[#fff7ee] outline-none transition placeholder:text-[#a99c90] focus:border-white/20 focus:bg-black/35"
          disabled={disabled || pending}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter the owner password"
          type="password"
          value={password}
        />
      </label>

      <button
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(120deg,#159bd3_0%,#e5097f_48%,#ffcf32_100%)] px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(229,9,127,0.24)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={disabled || pending || !password.trim()}
        type="submit"
      >
        {pending ? "Signing in..." : "Open admin"}
      </button>

      {message ? <p className="text-sm leading-6 text-amber-100">{message}</p> : null}
    </form>
  );
}
