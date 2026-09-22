# Deployment

Push to `main` → GitHub Actions verifies the code, builds Docker images, pushes them to GHCR and deploys to the VPS. Pull requests only run the verify step.

```
                        ┌──────────── VPS (/opt/worknai) ────────────┐
worknai.media ─┐        │  nginx :80/:443 ──┬── /api/leads, /api/upload ─► web (Next.js :3000)
admin.worknai. ┼─► DNS ─►  (Let's Encrypt)  ├── /api/*  ─────────────────► backend (Express :5001)
www ──► apex ──┘        │                   ├── /videos/* ─► uploads volume, else web
                        │                   └── /*  ─────────────────────► web
                        │  certbot (auto-renew every 12h)                  │
                        └──────────────────────────────────────────────────┘
```

- `worknai.media` — public site + employee `/dashboard`. `/admin/*` redirects to the admin subdomain.
- `admin.worknai.media` — `/` → `/admin`. Non-admin paths redirect back to the main domain.
- Login cookies are scoped to `.worknai.media`, so one login works on both hosts.

## One-time setup

### 1. DNS
Create **A records** pointing to the VPS IP for `worknai.media`, `www.worknai.media`, `admin.worknai.media`.

### 2. VPS (Ubuntu/Debian, as root)
```bash
git clone <this repo> /tmp/worknai && bash /tmp/worknai/deploy/setup-vps.sh
```
Installs Docker, creates the `deploy` user, opens ports 22/80/443, disables the old PM2/host nginx setup and creates `/opt/worknai`.

### 3. SSH key for GitHub Actions
On your machine:
```bash
ssh-keygen -t ed25519 -f worknai_deploy -N ""
```
Append `worknai_deploy.pub` to `/home/deploy/.ssh/authorized_keys` on the VPS.

### 4. GitHub repository secrets (Settings → Secrets and variables → Actions)

| Secret | Value |
|---|---|
| `VPS_HOST` | VPS IP, e.g. `72.61.171.164` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | contents of the private key `worknai_deploy` |
| `VPS_PORT` | optional, default `22` |
| `PROD_ENV_FILE` | optional: full contents of the production `.env` (see `.env.example`) |

If you don't use `PROD_ENV_FILE`, create `/opt/worknai/.env` on the VPS by hand from `.env.example`. **`JWT_SECRET` must be a long random value** (`openssl rand -hex 48`).

### 5. Deploy
Push to `main` (or run the workflow manually from the Actions tab). The first deploy also issues the SSL certificate automatically — DNS must already point to the VPS.

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

**Uploaded media** lives in the `worknai_uploads` Docker volume (served by nginx at `/videos/`). Media also goes to Supabase Storage when configured.

## Local development
```bash
cd services/backend && cp .env.example .env && npm install && npm run dev   # :5001
cd apps/web && cp .env.example .env.local && npm install && npm run dev      # :3000
```
Leave `MAIN_HOST` / `ADMIN_HOST` unset locally so `/admin` works on `localhost`.
