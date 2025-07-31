#!/bin/bash

echo "🌐 Making Foreign Exploration Gallery Internet Accessible"
echo "========================================================="

# Check if Docker services are running
if ! sudo docker-compose ps | grep -q "Up"; then
    echo "⚠️  Starting Docker services first..."
    sudo docker-compose up -d
    sleep 5
fi

# Get local IP
LOCAL_IP=$(hostname -I | awk '{print $1}')

echo "📍 Current Status:"
echo "   🏠 Local Access: http://localhost"
echo "   🏠 Network Access: http://$LOCAL_IP"
echo ""

# Check if ngrok is installed
if command -v ngrok &> /dev/null; then
    echo "✅ ngrok found! Setting up internet access..."
    echo ""
    echo "🌍 MAKING YOUR GALLERY ACCESSIBLE WORLDWIDE!"
    echo "============================================="
    echo ""
    echo "📋 What will happen:"
    echo "   • Your gallery will get a public internet URL"
    echo "   • Anyone worldwide can access it with that URL"
    echo "   • All features will work: photos, analytics, load balancing"
    echo "   • Keep this terminal open to maintain connection"
    echo ""
    echo "🔒 Security Note:"
    echo "   • Your gallery is read-only (safe to share)"
    echo "   • No sensitive data is exposed"
    echo "   • Analytics will track all visitors"
    echo ""
    echo "🚀 Starting public tunnel in 3 seconds..."
    sleep 1
    echo "3..."
    sleep 1
    echo "2..."
    sleep 1
    echo "1..."
    echo ""
    echo "🌐 YOUR GALLERY IS NOW LIVE ON THE INTERNET!"
    echo "Copy the HTTPS URL below and share it with anyone:"
    echo ""
    
    # Start ngrok tunnel
    ngrok http 80
else
    echo "❌ ngrok not found. Installing now..."
    echo ""
    
    # Try to install ngrok
    if command -v wget &> /dev/null; then
        echo "📥 Downloading ngrok..."
        wget -q https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
        tar -xzf ngrok-v3-stable-linux-amd64.tgz
        sudo mv ngrok /usr/local/bin/
        rm ngrok-v3-stable-linux-amd64.tgz
        echo "✅ ngrok installed successfully!"
        echo ""
        echo "🚀 Starting public tunnel..."
        ngrok http 80
    else
        echo "❌ Could not install ngrok automatically."
        echo ""
        echo "📥 Manual installation:"
        echo "1. Download from: https://ngrok.com/download"
        echo "2. Extract and move to /usr/local/bin/"
        echo "3. Run this script again"
    fi
fi