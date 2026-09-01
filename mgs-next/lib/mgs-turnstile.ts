type TurnstileResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

export function isTurnstileRequired() {
  const value = process.env.TURNSTILE_REQUIRED?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export async function verifyTurnstile(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: !isTurnstileRequired(), reason: "TURNSTILE_SECRET_KEY is not configured." };
  }

  if (!token) return { ok: false, reason: "Missing Turnstile token." };

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (remoteIp && remoteIp !== "unknown") form.set("remoteip", remoteIp);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
      cache: "no-store",
    });
    const result = (await response.json().catch(() => null)) as TurnstileResponse | null;
    return {
      ok: response.ok && result?.success === true,
      reason: result?.["error-codes"]?.join(", ") || (response.ok ? "Turnstile rejected the request." : "Turnstile verification failed."),
    };
  } catch {
    return { ok: false, reason: "Turnstile verification is temporarily unavailable." };
  }
}
