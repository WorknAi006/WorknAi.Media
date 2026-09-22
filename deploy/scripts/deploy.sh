#!/usr/bin/env bash
# Runs on the VPS (called by GitHub Actions). Pulls new images and restarts the stack.
# Usage: IMAGE_TAG=<git-sha> bash deploy/scripts/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/../.."

if [ ! -f .env ]; then
  echo "❌ /opt/worknai/.env is missing. Create it from .env.example (or set the PROD_ENV_FILE GitHub secret)."
  exit 1
fi

# Persist the deployed images/tag in .env so manual `docker compose` commands
# (and rollbacks: IMAGE_TAG=<old-sha> bash deploy/scripts/deploy.sh) use the same images
persist_var() {
  local name="$1" value="$2"
  [ -z "$value" ] && return 0
  grep -v "^$name=" .env > .env.tmp || true
  echo "$name=$value" >> .env.tmp
  mv .env.tmp .env
}
persist_var IMAGE_TAG "${IMAGE_TAG:-}"
persist_var WEB_IMAGE "${WEB_IMAGE:-}"
persist_var BACKEND_IMAGE "${BACKEND_IMAGE:-}"
chmod 600 .env

echo "📥 Pulling images ($(grep -E "^IMAGE_TAG=" .env | cut -d= -f2- || echo latest))..."
docker compose pull --quiet

echo "🚀 Starting containers..."
docker compose up -d --remove-orphans

# Config files are bind-mounted: restart so nginx always runs the freshly copied config
# (a reload via `exec` fails if the container is still in a restart loop)
echo "🔄 Restarting nginx..."
docker compose restart nginx

echo "⏳ Waiting for services to become healthy..."
for i in $(seq 1 30); do
  backend=$(docker inspect -f '{{.State.Health.Status}}' "$(docker compose ps -q backend)" 2>/dev/null || echo starting)
  web=$(docker inspect -f '{{.State.Health.Status}}' "$(docker compose ps -q web)" 2>/dev/null || echo starting)
  if [ "$backend" = "healthy" ] && [ "$web" = "healthy" ]; then
    echo "✅ backend=$backend web=$web"
    break
  fi
  if [ "$i" = "30" ]; then
    echo "❌ Services not healthy (backend=$backend web=$web)"
    docker compose logs --tail=80 backend web
    exit 1
  fi
  sleep 5
done

port="$(grep -E '^WORKNAI_HTTP_PORT=' .env | cut -d= -f2- || true)"
port="${port:-8390}"
echo "🔎 Checking internal router on 127.0.0.1:$port..."
ok=0
for i in $(seq 1 10); do
  if curl -fsS -H "Host: worknai.media" "http://127.0.0.1:$port/api/health" >/dev/null 2>&1 \
     && curl -fsS -o /dev/null -H "Host: worknai.media" "http://127.0.0.1:$port/" 2>/dev/null; then
    ok=1; break
  fi
  sleep 3
done
if [ "$ok" != "1" ]; then
  echo "❌ nginx router not answering on 127.0.0.1:$port"
  docker compose ps nginx
  docker compose logs --tail=30 nginx
  exit 1
fi
echo "✅ Stack answering on 127.0.0.1:$port"
if [ ! -f /etc/nginx/sites-enabled/worknai-media.conf ]; then
  echo "ℹ️  Host nginx not configured yet: run once as root:"
  echo "    sudo bash $(pwd)/deploy/scripts/setup-host-nginx.sh"
fi

docker image prune -f >/dev/null
echo "🎉 Deployed $(grep -E "^IMAGE_TAG=" .env | cut -d= -f2-)"
