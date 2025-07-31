#!/bin/bash

echo "🌍 Foreign Exploration Gallery - Access Information"
echo "=================================================="

# Get current IP address
IP=$(hostname -I | awk '{print $1}')

echo "📍 Your Current IP Address: $IP"
echo ""

echo "🔗 Share these URLs with others on your network:"
echo "   🌍 Main Gallery: http://$IP"
echo "   📊 Analytics Dashboard: http://$IP/analytics.html"
echo ""

echo "📱 Mobile/Tablet Access:"
echo "   Open browser and go to: http://$IP"
echo ""

echo "🧪 Test if it's working:"
echo "   From another device, try: http://$IP/api/health"
echo ""

# Test if the service is running
echo "🔍 Checking if service is accessible..."
if curl -s "http://$IP/api/health" > /dev/null 2>&1; then
    echo "✅ Service is running and accessible!"
    
    # Get server info
    SERVER_INFO=$(curl -s "http://$IP/api/health" | grep -o '"server":"[^"]*"' | cut -d'"' -f4)
    echo "🖥️  Currently served by: $SERVER_INFO"
    
    # Get analytics info
    PAGE_VIEWS=$(curl -s "http://$IP/api/analytics" | grep -o '"totalPageViews":[0-9]*' | cut -d':' -f2)
    echo "📊 Total page views: $PAGE_VIEWS"
    
else
    echo "❌ Service is not accessible. Make sure Docker containers are running:"
    echo "   sudo docker-compose up -d"
fi

echo ""
echo "👥 Who can access:"
echo "   ✅ Anyone connected to your WiFi/router"
echo "   ✅ Devices on the same local network"
echo "   ❌ People on the internet (requires additional setup)"
echo ""

echo "🚀 To make it internet accessible:"
echo "   1. Use ngrok: ngrok http 80"
echo "   2. Set up port forwarding on your router"
echo "   3. Deploy to cloud (AWS, Google Cloud, etc.)"
echo ""

echo "🎯 Ready to share! Send this URL to friends on your WiFi:"
echo "   👉 http://$IP"