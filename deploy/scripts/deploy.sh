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

export LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-$(grep -E "^LETSENCRYPT_EMAIL=" .env | tail -1 | cut -d= -f2- | tr -d "\"'")}"

echo "📥 Pulling images ($(grep -E "^IMAGE_TAG=" .env | cut -d= -f2- || echo latest))..."
docker compose pull backend web

echo "🔐 Ensuring SSL certificate..."
bash deploy/scripts/init-ssl.sh

echo "🚀 Starting containers..."
docker compose up -d --remove-orphans

echo "🔄 Reloading nginx..."
docker compose exec -T nginx nginx -t
docker compose exec -T nginx nginx -s reload

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

docker image prune -f >/dev/null
echo "🎉 Deployed $(grep -E "^IMAGE_TAG=" .env | cut -d= -f2-)"
