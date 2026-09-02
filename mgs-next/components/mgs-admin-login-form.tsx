type MgsAdminLoginFormProps = {
  disabled: boolean;
  error?: string | null;
};

const errorMessages: Record<string, string> = {
  cancelled: "Google sign-in was cancelled.",
  identity_failed: "Google could not verify this account.",
  invalid_state: "The sign-in request expired or could not be verified. Try again.",
  not_allowed: "This Google account is not allowed to access the admin panel.",
  oauth_failed: "Google sign-in failed. Try again.",
  rate_limited: "Too many sign-in attempts. Try again later.",
};

export function MgsAdminLoginForm({ disabled, error }: MgsAdminLoginFormProps) {
  const message = error ? errorMessages[error] ?? "Unable to sign in." : null;

  return (
    <div className="space-y-4">
      {disabled ? (
        <button
          className="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white/45"
          disabled
          type="button"
        >
          Continue with Google
        </button>
      ) : (
        <a
          className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-white px-6 text-sm font-semibold text-[#111] shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition hover:bg-[#f3f3f3]"
          href="/api/admin/google/start"
        >
          <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
            <path d="M21.35 12.22c0-.71-.06-1.24-.19-1.79H12v3.34h5.38a4.6 4.6 0 0 1-1.99 2.93l-.02.11 2.89 2.24.2.02c1.82-1.68 2.89-4.16 2.89-6.85Z" fill="#4285F4" />
            <path d="M12 21.75c2.61 0 4.79-.86 6.39-2.34l-3.04-2.36c-.81.55-1.91.94-3.35.94-2.51 0-4.64-1.7-5.4-4.05l-.11.01-3.01 2.33-.04.1A9.65 9.65 0 0 0 12 21.75Z" fill="#34A853" />
            <path d="M6.6 13.94a5.82 5.82 0 0 1-.32-1.94c0-.68.12-1.34.31-1.95l-.01-.13-3.05-2.37-.1.05A9.73 9.73 0 0 0 2.35 12c0 1.58.38 3.07 1.09 4.4l3.16-2.46Z" fill="#FBBC05" />
            <path d="M12 6.01c1.82 0 3.04.78 3.74 1.43l2.72-2.66C16.78 3.22 14.61 2.25 12 2.25A9.65 9.65 0 0 0 3.44 7.6l3.15 2.45C7.36 7.71 9.49 6.01 12 6.01Z" fill="#EA4335" />
          </svg>
          Continue with Google
        </a>
      )}

      <p className="text-xs leading-5 text-[#8f847a]">
        Access is granted only to the single verified Google email configured on the server.
      </p>

      {message ? <p className="text-sm leading-6 text-amber-100">{message}</p> : null}
    </div>
  );
}
