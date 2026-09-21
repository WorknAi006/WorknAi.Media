#!/bin/bash
# One-time initialization script for Ubuntu/Debian VPS (72.61.171.164)
# Run as root: sudo bash deploy/setup-vps.sh

set -e

echo "🚀 Setting up VPS Server for WorknAI Media..."

# 1. Update system
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw nginx

# 2. Install Node.js 20 LTS
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Install PM2 globally
sudo npm install -g pm2
pm2 startup systemd -u root --hp /root || true

# 4. Create App Directory
sudo mkdir -p /var/www/WorknAi.Media
sudo chown -R $USER:$USER /var/www/WorknAi.Media

# 5. Allow Ports in Firewall
sudo ufw allow 22/tcp || true
sudo ufw allow 80/tcp || true
sudo ufw allow 443/tcp || true
sudo ufw --force enable || true

echo "✅ VPS Server Environment is ready!"
echo "Now copy deploy/nginx.conf to /etc/nginx/sites-available/worknai.conf and reload nginx."
