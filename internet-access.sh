#!/bin/bash

echo "🌐 Foreign Exploration Gallery - Internet Access Setup"
echo "======================================================"

# Check if Docker services are running
echo "🔍 Checking if services are running..."
if ! sudo docker-compose ps | grep -q "Up"; then
    echo "⚠️  Starting Docker services..."
    sudo docker-compose up -d
    echo "⏳ Waiting for services to start..."
    sleep 8
fi

# Test local access
echo "🧪 Testing local access..."
if curl -s http://localhost/api/health > /dev/null 2>&1; then
    echo "✅ Local services are running!"
else
    echo "❌ Services not responding. Please check Docker containers."
    exit 1
fi

# Get local IP and tunnel password
LOCAL_IP=$(hostname -I | awk '{print $1}')
TUNNEL_PASSWORD=$(curl -s https://loca.lt/mytunnelpassword 2>/dev/null || echo "136.233.9.121")

echo ""
echo "📍 Current Access Status:"
echo "   🏠 Local: http://localhost"
echo "   🏠 Network: http://$LOCAL_IP"
echo ""

echo "🚀 INTERNET ACCESS OPTIONS"
echo "=========================="
echo ""

# Option 1: LocalTunnel with password info
echo "1️⃣  LOCALTUNNEL (Recommended - Works Now)"
echo "   ✅ No account required"
echo "   ✅ Works immediately"
echo "   ⚠️  Requires tunnel password for visitors"
echo ""

# Option 2: ngrok
echo "2️⃣  NGROK (Professional)"
echo "   ⚠️  Requires free account signup"
echo "   ✅ No password required for visitors"
echo "   ✅ Better performance"
echo ""

# Option 3: Manual methods
echo "3️⃣  MANUAL METHODS"
echo "   • Router port forwarding"
echo "   • Cloud deployment"
echo ""

read -p "Choose option (1/2/3): " -n 1 -r
echo ""
echo ""

case $REPLY in
    1|"")
        echo "🌍 STARTING LOCALTUNNEL..."
        echo "========================="
        echo ""
        echo "📋 Important Information:"
        echo "   🔑 Tunnel Password: $TUNNEL_PASSWORD"
        echo "   📝 Visitors will need this password to access your gallery"
        echo "   🔗 Share both the URL AND the password"
        echo ""
        echo "🚀 Starting tunnel..."
        echo "⏳ This will generate a public URL in a few seconds..."
        echo ""
        
        # Generate a unique subdomain
        SUBDOMAIN="exploration-gallery-$(date +%s)"
        
        echo "🎉 YOUR GALLERY WILL BE ACCESSIBLE AT:"
        echo "https://$SUBDOMAIN.loca.lt"
        echo ""
        echo "🔑 TUNNEL PASSWORD: $TUNNEL_PASSWORD"
        echo ""
        echo "📤 SHARE WITH OTHERS:"
        echo "   URL: https://$SUBDOMAIN.loca.lt"
        echo "   Password: $TUNNEL_PASSWORD"
        echo ""
        echo "⚠️  Keep this terminal open to maintain the connection!"
        echo ""
        
        # Start LocalTunnel
        lt --port 80 --subdomain $SUBDOMAIN
        ;;
        
    2)
        echo "🔑 SETTING UP NGROK..."
        echo "====================="
        echo ""
        echo "📋 Steps to complete setup:"
        echo ""
        echo "1️⃣  Sign up for free account:"
        echo "   👉 https://dashboard.ngrok.com/signup"
        echo ""
        echo "2️⃣  Get your authtoken:"
        echo "   👉 https://dashboard.ngrok.com/get-started/your-authtoken"
        echo ""
        echo "3️⃣  Configure ngrok:"
        echo "   ngrok config add-authtoken YOUR_TOKEN_HERE"
        echo ""
        echo "4️⃣  Start tunnel:"
        echo "   ngrok http 80"
        echo ""
        
        read -p "Have you completed steps 1-3? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🚀 Starting ngrok tunnel..."
            ngrok http 80
        else
            echo "⏳ Complete the setup steps above, then run:"
            echo "   ngrok http 80"
        fi
        ;;
        
    3)
        echo "🔧 MANUAL INTERNET ACCESS METHODS"
        echo "================================="
        echo ""
        echo "🏠 ROUTER PORT FORWARDING:"
        echo "   1. Access your router admin panel (usually 192.168.1.1)"
        echo "   2. Find 'Port Forwarding' or 'Virtual Server' settings"
        echo "   3. Forward external port 80 to $LOCAL_IP:80"
        echo "   4. Find your public IP: curl ifconfig.me"
        echo "   5. Share your public IP with others"
        echo ""
        echo "☁️  CLOUD DEPLOYMENT:"
        echo "   • AWS EC2 + Load Balancer"
        echo "   • Google Cloud Compute Engine"
        echo "   • DigitalOcean Droplets"
        echo "   • Heroku Container Registry"
        echo ""
        echo "📱 CURRENT NETWORK ACCESS:"
        echo "   Anyone on your WiFi can access: http://$LOCAL_IP"
        ;;
        
    *)
        echo "❌ Invalid option. Please run the script again."
        exit 1
        ;;
esac