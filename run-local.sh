#!/bin/bash

echo "🚀 Starting Foreign Exploration Gallery locally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start the application
echo "🌍 Starting the exploration gallery on port 3000..."
echo "📍 Open your browser and go to: http://localhost:3000"
echo "🔄 Press Ctrl+C to stop the server"

npm start