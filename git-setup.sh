#!/bin/bash

echo "🚀 Setting up Git repository for Foreign Exploration Gallery"
echo "============================================================"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo "📁 Adding all files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit: Complete Foreign Exploration Gallery

Features:
- 🖼️ Photo gallery with 6 exploration locations
- ⚖️ Nginx load balancer with 2 app instances
- 📊 Real-time analytics dashboard
- 🐳 Complete Docker containerization
- 🧪 Load testing suite (100 concurrent users)
- 🔒 Production-ready deployment scripts
- 📱 Responsive design for all devices
- 🌐 Cloud deployment configurations

Architecture:
- Load balancer (Nginx)
- 2x Node.js app servers
- PostgreSQL + Redis for analytics
- SSL/HTTPS support
- Rate limiting & security headers

Ready for deployment to AWS, DigitalOcean, or any cloud platform!"

echo ""
echo "🌐 Next Steps:"
echo "=============="
echo ""
echo "1️⃣  Create GitHub Repository:"
echo "   • Go to https://github.com/new"
echo "   • Repository name: foreign-exploration-gallery"
echo "   • Make it Public ✅"
echo "   • Don't initialize with README (we have one)"
echo "   • Click 'Create repository'"
echo ""
echo "2️⃣  Connect to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/foreign-exploration-gallery.git"
echo ""
echo "3️⃣  Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4️⃣  Your repository will contain:"
echo "   ✅ Complete application code"
echo "   ✅ Docker configurations"
echo "   ✅ Load balancer setup"
echo "   ✅ Analytics dashboard"
echo "   ✅ Load testing suite"
echo "   ✅ Cloud deployment scripts"
echo "   ✅ Comprehensive documentation"
echo ""
echo "🎯 After pushing to GitHub, you can:"
echo "   • Deploy to cloud platforms"
echo "   • Share with others"
echo "   • Enable GitHub Pages for static version"
echo "   • Set up CI/CD pipelines"
echo ""

# Check current status
echo "📊 Current Git Status:"
git status --short

echo ""
echo "🎉 Git setup complete! Ready to push to GitHub!"
echo ""
echo "💡 Quick commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/foreign-exploration-gallery.git"
echo "   git branch -M main"
echo "   git push -u origin main"