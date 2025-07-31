#!/bin/bash

echo "🌊 Deploying Foreign Exploration Gallery to DigitalOcean"
echo "========================================================"

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
apt install -y docker.io docker-compose git curl

# Start Docker
systemctl start docker
systemctl enable docker

# Install Node.js (for any additional tools)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo "📥 Cloning application..."
# Clone the actual repository
git clone https://github.com/vaibhav803/foreign-exploration-gallery.git /opt/exploration-gallery
cd /opt/exploration-gallery

echo "🏗️  Building application..."
docker build -t exploration-app .

echo "🚀 Starting services..."
docker-compose -f cloud-deploy/docker-compose.prod.yml up -d

# Install Nginx for SSL termination
echo "🔒 Setting up SSL..."
apt install -y nginx certbot python3-certbot-nginx

# Get server IP
SERVER_IP=$(curl -s http://checkip.amazonaws.com)

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "📍 Your Foreign Exploration Gallery is now live at:"
echo "   http://$SERVER_IP"
echo ""
echo "🔧 Next Steps:"
echo "1️⃣  Point your domain to this IP: $SERVER_IP"
echo "2️⃣  Setup SSL certificate:"
echo "   certbot --nginx -d yourdomain.com"
echo "3️⃣  Access your gallery:"
echo "   https://yourdomain.com"
echo ""
echo "📊 Analytics Dashboard:"
echo "   https://yourdomain.com/analytics.html"
echo ""
echo "🖥️  Server Management:"
echo "   docker-compose -f cloud-deploy/docker-compose.prod.yml logs"
echo "   docker-compose -f cloud-deploy/docker-compose.prod.yml restart"
echo ""
echo "✅ Features Active:"
echo "   • Load balancing across 2 servers"
echo "   • Real-time analytics"
echo "   • PostgreSQL database"
echo "   • Redis caching"
echo "   • Rate limiting"
echo "   • Security headers"

# Create a simple status check script
cat > /opt/exploration-gallery/status.sh << 'EOF'
#!/bin/bash
echo "🔍 Foreign Exploration Gallery Status"
echo "===================================="
echo ""
echo "🐳 Docker Containers:"
docker-compose -f cloud-deploy/docker-compose.prod.yml ps
echo ""
echo "📊 System Resources:"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')%"
echo "Memory Usage: $(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}')"
echo "Disk Usage: $(df -h / | awk 'NR==2{printf "%s", $5}')"
echo ""
echo "🌐 Service Health:"
curl -s http://localhost/health || echo "❌ Service not responding"
echo ""
EOF

chmod +x /opt/exploration-gallery/status.sh

echo ""
echo "💡 Useful Commands:"
echo "   Status Check: /opt/exploration-gallery/status.sh"
echo "   View Logs: docker-compose -f /opt/exploration-gallery/cloud-deploy/docker-compose.prod.yml logs"
echo "   Restart: docker-compose -f /opt/exploration-gallery/cloud-deploy/docker-compose.prod.yml restart"