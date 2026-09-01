#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
VPS_DIR=$(dirname "$SCRIPT_DIR")
ENV_FILE=${1:-"$VPS_DIR/.env"}
EXAMPLE_FILE="$VPS_DIR/.env.example"

if [ ! -f "$EXAMPLE_FILE" ]; then
  echo "Missing $EXAMPLE_FILE" >&2
  exit 1
fi

if [ -e "$ENV_FILE" ]; then
  echo "$ENV_FILE already exists; refusing to overwrite it."
  echo "Run: sh ./scripts/check-env.sh"
  exit 0
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "openssl is required to generate production secrets." >&2
  exit 1
fi

ADMIN_PASSWORD=$(openssl rand -hex 24)
ADMIN_SESSION_SECRET=$(openssl rand -hex 48)

cp "$EXAMPLE_FILE" "$ENV_FILE"
sed -i "s|^ADMIN_PASSWORD=.*$|ADMIN_PASSWORD=$ADMIN_PASSWORD|" "$ENV_FILE"
sed -i "s|^ADMIN_SESSION_SECRET=.*$|ADMIN_SESSION_SECRET=$ADMIN_SESSION_SECRET|" "$ENV_FILE"
chmod 600 "$ENV_FILE"

cat <<EOF
Created: $ENV_FILE
Permissions: 600

Generated admin password (store it in your password manager now):
$ADMIN_PASSWORD

ADMIN_SESSION_SECRET was generated locally and written only to $ENV_FILE.
It was not sent to GitHub.

Next:
1. Edit $ENV_FILE only if you need Turnstile, OpenRouter, Cloudflare proxy IP trust, or off-site backups.
2. Run: sh ./scripts/check-env.sh
3. Start: docker compose up -d --build
EOF
