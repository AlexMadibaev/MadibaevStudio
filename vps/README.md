# Madibaev Studio — VPS Docker

This folder is the complete production package for a VPS. Do not run the legacy repository root or `mgs-next` directly on the server.

## What is included

- Next.js 16 application only
- multi-stage standalone Docker image
- persistent local content storage in a Docker volume
- container healthcheck
- Caddy reverse proxy with automatic HTTPS
- no MySQL
- no Redis
- no Express server

## First deploy

```bash
git clone https://github.com/AlexMadibaev/MadibaevStudio.git
cd MadibaevStudio/vps
cp .env.example .env
nano .env
```

Set at minimum:

- `SITE_DOMAIN` — domain without `https://`
- `NEXT_PUBLIC_SITE_URL` — full public URL
- `ADMIN_PASSWORD` — long random password
- `ADMIN_SESSION_SECRET` — at least 64 random characters
- `ACME_EMAIL` — email for TLS certificate notices

Before starting, point the domain DNS A/AAAA records to the VPS and make sure ports 80 and 443 are open.

Start:

```bash
docker compose up -d --build
```

Check:

```bash
docker compose ps
docker compose logs -f --tail=100
```

The `web` container must become `healthy`. Caddy will request and renew HTTPS certificates automatically.

## Persistent data

Admin projects and enquiries are stored under `/app/data` inside the application container and backed by the named Docker volume `mgs_data`. Rebuilding or recreating the container does not delete that data.

To back it up:

```bash
docker run --rm \
  -v vps_mgs_data:/data:ro \
  -v "$PWD":/backup \
  alpine tar czf /backup/mgs-data-backup.tar.gz -C /data .
```

The exact volume prefix can differ if the Compose project name is changed. Check it with `docker volume ls`.

## Update

```bash
git pull
cd vps
docker compose up -d --build
```

## Stop

```bash
docker compose down
```

Do not use `docker compose down -v` unless you intentionally want to delete persistent site data and Caddy certificates.
