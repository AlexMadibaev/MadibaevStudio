#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
VPS_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
cd "$VPS_DIR"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

BACKUP_DIR=${BACKUP_DIR:-$VPS_DIR/backups}
BACKUP_LOCAL_DAYS=${BACKUP_LOCAL_DAYS:-7}
BACKUP_REMOTE_DAYS=${BACKUP_REMOTE_DAYS:-30}
RCLONE_REMOTE=${RCLONE_REMOTE:-}
SITE_SLUG=${BACKUP_SITE_SLUG:-madibaevstudio}
STAMP=$(date -u +%Y-%m-%dT%H-%M-%SZ)
ARCHIVE="$BACKUP_DIR/${SITE_SLUG}-mgs-data-$STAMP.tar.gz"
TMP="$ARCHIVE.tmp"

mkdir -p "$BACKUP_DIR"
umask 077

cleanup() {
  rm -f "$TMP"
}
trap cleanup EXIT INT TERM

echo "[backup] checking web container"
docker compose ps --status running web >/dev/null

echo "[backup] archiving /app/data -> $ARCHIVE"
docker compose exec -T web sh -c 'tar -C /app/data -czf - .' > "$TMP"
mv "$TMP" "$ARCHIVE"

if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$ARCHIVE" > "$ARCHIVE.sha256"
fi

echo "[backup] removing local backups older than ${BACKUP_LOCAL_DAYS} days"
find "$BACKUP_DIR" -type f \( -name "${SITE_SLUG}-mgs-data-*.tar.gz" -o -name "${SITE_SLUG}-mgs-data-*.tar.gz.sha256" \) -mtime "+$BACKUP_LOCAL_DAYS" -delete

if [ -n "$RCLONE_REMOTE" ]; then
  if ! command -v rclone >/dev/null 2>&1; then
    echo "[backup] RCLONE_REMOTE is configured but rclone is not installed" >&2
    exit 1
  fi

  REMOTE_PATH="${RCLONE_REMOTE%/}/$SITE_SLUG"
  echo "[backup] uploading to $REMOTE_PATH"
  rclone copy "$ARCHIVE" "$REMOTE_PATH" --checksum --transfers 2
  if [ -f "$ARCHIVE.sha256" ]; then
    rclone copy "$ARCHIVE.sha256" "$REMOTE_PATH" --checksum --transfers 2
  fi

  echo "[backup] pruning remote backups older than ${BACKUP_REMOTE_DAYS} days"
  rclone delete "$REMOTE_PATH" --min-age "${BACKUP_REMOTE_DAYS}d" --include "${SITE_SLUG}-mgs-data-*.tar.gz" --include "${SITE_SLUG}-mgs-data-*.tar.gz.sha256"
else
  echo "[backup] WARNING: RCLONE_REMOTE is empty; backup remains on this VPS only" >&2
fi

echo "[backup] done: $ARCHIVE"
