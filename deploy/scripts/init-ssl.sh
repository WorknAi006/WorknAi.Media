#!/usr/bin/env bash
# Issues the Let's Encrypt certificate (worknai.media, www, admin) on first run.
# Idempotent: exits immediately once a real certificate exists.
# Usage (from /opt/worknai): LETSENCRYPT_EMAIL=you@example.com bash deploy/scripts/init-ssl.sh
#   LETSENCRYPT_STAGING=1  -> use the staging CA while testing (avoids rate limits)
set -euo pipefail

cd "$(dirname "$0")/../.."

PRIMARY="worknai.media"
DOMAINS=(${SSL_DOMAINS:-worknai.media www.worknai.media admin.worknai.media})
EMAIL="${LETSENCRYPT_EMAIL:-}"
STAGING="${LETSENCRYPT_STAGING:-0}"
CONF_DIR="./data/certbot/conf"
LIVE="/etc/letsencrypt/live/$PRIMARY"

if [ -f "$CONF_DIR/renewal/$PRIMARY.conf" ]; then
  echo "✅ SSL certificate for $PRIMARY already exists, skipping."
  exit 0
fi

certbot_sh() {
  docker compose run --rm --no-deps --entrypoint sh certbot -c "$1"
}

make_dummy_cert() {
  certbot_sh "mkdir -p $LIVE && openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout $LIVE/privkey.pem -out $LIVE/fullchain.pem -subj /CN=localhost"
}

mkdir -p "$CONF_DIR" ./data/certbot/www

echo "🔐 Creating temporary self-signed certificate so nginx can start..."
make_dummy_cert
docker compose up -d nginx
sleep 3

echo "🧹 Removing temporary certificate..."
certbot_sh "rm -rf $LIVE /etc/letsencrypt/archive/$PRIMARY /etc/letsencrypt/renewal/$PRIMARY.conf"

args="certonly --webroot -w /var/www/certbot --cert-name $PRIMARY --rsa-key-size 4096 --agree-tos --non-interactive"
for d in "${DOMAINS[@]}"; do args="$args -d $d"; done
if [ -n "$EMAIL" ]; then args="$args --email $EMAIL"; else args="$args --register-unsafely-without-email"; fi
[ "$STAGING" = "1" ] && args="$args --staging"

echo "📜 Requesting Let's Encrypt certificate for: ${DOMAINS[*]}"
if ! certbot_sh "certbot $args"; then
  echo "❌ Certificate request failed. Check that DNS A records for ${DOMAINS[*]} point to this server"
  echo "   and that ports 80/443 are open. Restoring temporary certificate so nginx keeps running."
  make_dummy_cert
  docker compose exec -T nginx nginx -s reload || true
  exit 1
fi

docker compose exec -T nginx nginx -s reload
echo "✅ SSL certificate installed."
