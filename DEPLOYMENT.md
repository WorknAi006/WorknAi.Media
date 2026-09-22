# Deployment

Push to `main` → GitHub Actions verifies the code, builds Docker images, pushes them to GHCR and deploys to the VPS. Pull requests only run the verify step.

The VPS is **shared with other apps** (PM2 services behind the host nginx), so the WorknAI stack never takes ports 80/443. The existing host nginx terminates SSL and forwards WorknAI traffic to the Docker stack on `127.0.0.1:8390`.

```
                    ┌─────────────────────────── VPS ───────────────────────────┐
worknai.media ──┐   │ host nginx :80/:443 (SSL via certbot)                      │
admin.worknai.  ┼───►   ├── other sites ──► PM2 apps (unchanged)                 │
www ──► apex ───┘   │   └── worknai.* ──► 127.0.0.1:8390  Docker (/opt/worknai)  │
                    │                      nginx ├── /api/leads, /api/upload ─► web
                    │                            ├── /api/* ──────────────────► backend
                    │                            ├── /videos/* ─► uploads volume, else web
                    │                            └── /* ───────────────────────► web
                    └────────────────────────────────────────────────────────────┘
```

- `worknai.media` — public site + employee `/dashboard`. `/admin/*` redirects to the admin subdomain.
- `admin.worknai.media` — `/` → `/admin`. Non-admin paths redirect back to the main domain.
- Login cookies are scoped to `.worknai.media`, so one login works on both hosts.

## One-time setup

1. **DNS** — A records for `worknai.media`, `www.worknai.media`, `admin.worknai.media` → VPS IP.
2. **VPS base** (root) — copy `deploy/setup-vps.sh` to the server and run `bash setup-vps.sh`. Installs Docker if missing, creates the `worknai` user and `/opt/worknai`. It does not touch PM2, nginx or other apps.
3. **Deploy key** (root, on the VPS):
   ```bash
   ssh-keygen -t ed25519 -f /root/worknai_deploy -N "" -C "worknai-deploy"
   cat /root/worknai_deploy.pub >> /home/worknai/.ssh/authorized_keys
   cat /root/worknai_deploy      # -> GitHub secret VPS_SSH_KEY, then delete both files
   ```
4. **GitHub secrets** (Settings → Secrets and variables → Actions):

   | Secret | Value |
   |---|---|
   | `VPS_HOST` | VPS IP |
   | `VPS_USER` | `worknai` |
   | `VPS_SSH_KEY` | private key from step 3 |
   | `VPS_PORT` | optional, default `22` |
   | `PROD_ENV_FILE` | optional: full production `.env` (see `.env.example`) |

   Without `PROD_ENV_FILE`, create `/opt/worknai/.env` by hand. **`JWT_SECRET` must be long and random** (`openssl rand -hex 48`).
5. **First deploy** — push to `main`. Containers start on `127.0.0.1:8390`. The workflow's public smoke test fails until step 6 is done.
6. **Host nginx + SSL** (root, once):
   ```bash
   LETSENCRYPT_EMAIL=you@example.com bash /opt/worknai/deploy/scripts/setup-host-nginx.sh
   ```
   Adds `/etc/nginx/sites-available/worknai-media.conf`, reloads nginx and issues the certificate with `certbot --nginx` (auto-renews via the certbot timer). Refuses to run if another enabled site already uses `worknai.media`.

## Day-to-day

```bash
cd /opt/worknai
docker compose ps                    # status
docker compose logs -f web backend   # logs
docker compose restart backend       # restart one service
```

**Rollback** to an earlier commit's images:
```bash
cd /opt/worknai && IMAGE_TAG=<old-commit-sha> bash deploy/scripts/deploy.sh
```

**Uploaded media** lives in the `worknai_uploads` Docker volume (served at `/videos/`). Media also goes to Supabase Storage when configured.

## Local development
```bash
cd services/backend && cp .env.example .env && npm install && npm run dev   # :5001
cd apps/web && cp .env.example .env.local && npm install && npm run dev      # :3000
```
Leave `MAIN_HOST` / `ADMIN_HOST` unset locally so `/admin` works on `localhost`.
