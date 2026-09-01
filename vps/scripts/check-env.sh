#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
VPS_DIR=$(dirname "$SCRIPT_DIR")
ENV_FILE=${1:-"$VPS_DIR/.env"}

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE. Run: sh ./scripts/init-env.sh" >&2
  exit 1
fi

get_env() {
  sed -n "s/^$1=//p" "$ENV_FILE" | tail -n 1
}

failures=0
warn() { printf 'WARN: %s\n' "$1"; }
fail() { printf 'ERROR: %s\n' "$1" >&2; failures=$((failures + 1)); }
ok() { printf 'OK: %s\n' "$1"; }

site_domain=$(get_env SITE_DOMAIN)
site_url=$(get_env NEXT_PUBLIC_SITE_URL)
admin_password=$(get_env ADMIN_PASSWORD)
session_secret=$(get_env ADMIN_SESSION_SECRET)
turnstile_mode=$(get_env TURNSTILE_REQUIRED | tr '[:upper:]' '[:lower:]')
turnstile_site=$(get_env NEXT_PUBLIC_TURNSTILE_SITE_KEY)
turnstile_secret=$(get_env TURNSTILE_SECRET_KEY)
cloudflare=$(get_env MGS_TRUST_CLOUDFLARE | tr '[:upper:]' '[:lower:]')
rclone_remote=$(get_env RCLONE_REMOTE)

[ -n "$site_domain" ] && ok "SITE_DOMAIN=$site_domain" || fail "SITE_DOMAIN is empty."
case "$site_url" in
  https://*) ok "NEXT_PUBLIC_SITE_URL uses HTTPS." ;;
  *) fail "NEXT_PUBLIC_SITE_URL must be an https:// URL in production." ;;
esac

if [ ${#admin_password} -lt 20 ] || [ "$admin_password" = "CHANGE_ME_USE_A_LONG_RANDOM_PASSWORD" ]; then
  fail "ADMIN_PASSWORD is missing, still a placeholder, or shorter than 20 characters."
else
  ok "ADMIN_PASSWORD is configured."
fi

if [ ${#session_secret} -lt 64 ] || [ "$session_secret" = "CHANGE_ME_USE_AT_LEAST_64_RANDOM_CHARACTERS" ]; then
  fail "ADMIN_SESSION_SECRET is missing, still a placeholder, or shorter than 64 characters."
else
  ok "ADMIN_SESSION_SECRET is configured."
fi

if { [ -n "$turnstile_site" ] && [ -z "$turnstile_secret" ]; } || { [ -z "$turnstile_site" ] && [ -n "$turnstile_secret" ]; }; then
  fail "Turnstile is only partially configured. Set both NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY, or clear both."
elif [ -n "$turnstile_site" ] && [ -n "$turnstile_secret" ]; then
  case "$turnstile_mode" in
    false|0|no|off) warn "Turnstile keys exist but TURNSTILE_REQUIRED disables verification." ;;
    *) ok "Turnstile keys are present; anti-spam will be enforced." ;;
  esac
else
  case "$turnstile_mode" in
    true|1|yes|on) fail "TURNSTILE_REQUIRED=true but Turnstile keys are missing." ;;
    *) warn "Turnstile keys are not configured; rate limit + honeypot remain active, but CAPTCHA is disabled." ;;
  esac
fi

case "$cloudflare" in
  true|1|yes|on) warn "MGS_TRUST_CLOUDFLARE is enabled. Ensure the VPS cannot be reached directly with spoofed Cloudflare headers." ;;
  *) ok "Direct-client IP handling is enabled." ;;
esac

if [ -n "$rclone_remote" ]; then
  ok "Off-site backup destination is configured: $rclone_remote"
else
  warn "RCLONE_REMOTE is empty; backups will remain local until an off-site target is configured."
fi

if [ "$failures" -gt 0 ]; then
  printf '\nPreflight failed with %s error(s). Do not start production yet.\n' "$failures" >&2
  exit 1
fi

printf '\nProduction environment preflight passed.\n'
