#!/usr/bin/env bash
# One-time setup (root) for WorknAI on a VPS that may already host other apps.
# Safe for shared servers: does NOT stop PM2, host nginx or anything else.
set -euo pipefail

APP_DIR="/opt/worknai"
DEPLOY_USER="${DEPLOY_USER:-deploy}"

echo "🚀 Setting up VPS for WorknAI Media (Docker)..."

# 1. Docker Engine + Compose plugin
if ! command -v docker >/dev/null 2>&1; then
  echo "📦 Installing Docker..."
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker

# 2. Deploy user (used by GitHub Actions over SSH)
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  useradd -m -s /bin/bash "$DEPLOY_USER"
fi
usermod -aG docker "$DEPLOY_USER"
mkdir -p "/home/$DEPLOY_USER/.ssh"
touch "/home/$DEPLOY_USER/.ssh/authorized_keys"
chmod 700 "/home/$DEPLOY_USER/.ssh"
chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"

# 3. App directory
mkdir -p "$APP_DIR"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR"

# 4. Port used by the WorknAI stack on localhost
if ss -ltn | grep -qE ':8390\s'; then
  echo "⚠️  Port 8390 is already in use. Set WORKNAI_HTTP_PORT=<free port> in $APP_DIR/.env (or PROD_ENV_FILE)."
fi

echo ""
echo "✅ VPS ready."
echo "Next steps:"
echo "  1. Add the GitHub Actions public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
echo "  2. Push to main (or re-run the workflow) to deploy the containers"
echo "  3. Then once: sudo bash $APP_DIR/deploy/scripts/setup-host-nginx.sh"
