#!/usr/bin/env bash
# One-time (root): plug worknai.media into the EXISTING host nginx and issue SSL.
# Does not touch other sites. Run after the first successful deploy:
#   sudo LETSENCRYPT_EMAIL=you@example.com bash /opt/worknai/deploy/scripts/setup-host-nginx.sh
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$APP_DIR/deploy/host-nginx/worknai-media.conf"
DEST="/etc/nginx/sites-available/worknai-media.conf"
DOMAINS=(worknai.media www.worknai.media admin.worknai.media)

# Same port the Docker stack publishes (WORKNAI_HTTP_PORT in .env, default 8390)
PORT="$(grep -E '^WORKNAI_HTTP_PORT=' "$APP_DIR/.env" 2>/dev/null | cut -d= -f2- || true)"
PORT="${PORT:-8390}"

if [ "$(id -u)" != "0" ]; then echo "Run as root"; exit 1; fi

# Refuse to create duplicate server_name definitions
conflicts=$(grep -lE "server_name[^;]*\b(www\.|admin\.)?worknai\.media\b" /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf 2>/dev/null | grep -v "worknai-media.conf" || true)
if [ -n "$conflicts" ]; then
  echo "❌ These existing nginx files already use worknai.media:"
  echo "$conflicts"
  echo "   Remove/disable them first (e.g. rm /etc/nginx/sites-enabled/<file>), then re-run."
  exit 1
fi

if ! curl -fs "http://127.0.0.1:$PORT/healthz" >/dev/null; then
  echo "⚠️  WorknAI stack is not answering on 127.0.0.1:$PORT yet (deploy first). Continuing anyway."
fi

if [ ! -f "$DEST" ]; then
  sed "s/127\.0\.0\.1:8390/127.0.0.1:$PORT/" "$SRC" > "$DEST"
  ln -sf "$DEST" /etc/nginx/sites-enabled/worknai-media.conf
else
  echo "ℹ️  $DEST already exists, keeping it (certbot may have edited it)."
fi

nginx -t
systemctl reload nginx

if ! command -v certbot >/dev/null 2>&1; then
  apt-get update && apt-get install -y certbot python3-certbot-nginx
fi

args=()
for d in "${DOMAINS[@]}"; do args+=(-d "$d"); done
if [ -n "${LETSENCRYPT_EMAIL:-}" ]; then args+=(--email "$LETSENCRYPT_EMAIL"); else args+=(--register-unsafely-without-email); fi

certbot --nginx --cert-name worknai.media "${args[@]}" --redirect --agree-tos --non-interactive
systemctl reload nginx

echo "✅ https://worknai.media and https://admin.worknai.media are served via the host nginx."
echo "   Certificates auto-renew via the certbot systemd timer."
