#!/usr/bin/env bash
# One-time setup for a fresh Ubuntu/Debian VPS.
# Run as root:  curl -fsSL <raw-url>/deploy/setup-vps.sh | bash   (or: sudo bash deploy/setup-vps.sh)
set -euo pipefail

APP_DIR="/opt/worknai"
DEPLOY_USER="${DEPLOY_USER:-deploy}"

echo "🚀 Setting up VPS for WorknAI Media (Docker)..."

apt-get update
apt-get install -y ca-certificates curl git ufw

# 1. Docker Engine + Compose plugin
if ! command -v docker >/dev/null 2>&1; then
  echo "📦 Installing Docker..."
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker

# 2. Old PM2 / host nginx setup would block ports 80/443
if command -v pm2 >/dev/null 2>&1; then
  pm2 delete all || true
  pm2 save --force || true
fi
if systemctl list-unit-files | grep -q '^nginx.service'; then
  systemctl disable --now nginx || true
fi

# 3. Deploy user (used by GitHub Actions over SSH)
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  useradd -m -s /bin/bash "$DEPLOY_USER"
fi
usermod -aG docker "$DEPLOY_USER"
mkdir -p "/home/$DEPLOY_USER/.ssh"
touch "/home/$DEPLOY_USER/.ssh/authorized_keys"
chmod 700 "/home/$DEPLOY_USER/.ssh"
chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"

# 4. App directory
mkdir -p "$APP_DIR"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR"

# 5. Firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 6. Small VPS safety net: 2G swap if none exists
if ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo ""
echo "✅ VPS ready."
echo "Next steps:"
echo "  1. Add the GitHub Actions public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
echo "  2. Point DNS A records (worknai.media, www.worknai.media, admin.worknai.media) to this server"
echo "  3. Push to main — GitHub Actions will deploy to $APP_DIR"
