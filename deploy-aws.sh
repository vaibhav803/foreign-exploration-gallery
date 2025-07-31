#!/bin/bash

echo "🚀 Deploying Foreign Exploration Gallery to AWS"
echo "==============================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first:"
    echo "   curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'"
    echo "   unzip awscliv2.zip"
    echo "   sudo ./aws/install"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

echo "📋 AWS Deployment Options:"
echo "1️⃣  EC2 Instance (Recommended)"
echo "2️⃣  ECS with Fargate"
echo "3️⃣  Elastic Beanstalk"
echo ""

read -p "Choose deployment method (1/2/3): " -n 1 -r
echo ""

case $REPLY in
    1)
        echo "🖥️  DEPLOYING TO EC2"
        echo "==================="
        echo ""
        echo "📋 Steps to complete:"
        echo ""
        echo "1️⃣  Launch EC2 Instance:"
        echo "   • Go to AWS Console → EC2"
        echo "   • Launch Instance (Ubuntu 22.04 LTS)"
        echo "   • Instance type: t3.medium (recommended)"
        echo "   • Security Group: Allow HTTP (80), HTTPS (443), SSH (22)"
        echo "   • Create/Select Key Pair"
        echo ""
        echo "2️⃣  Connect to your instance:"
        echo "   ssh -i your-key.pem ubuntu@YOUR_EC2_IP"
        echo ""
        echo "3️⃣  Run these commands on EC2:"
        echo "   # Install Docker"
        echo "   sudo apt update"
        echo "   sudo apt install -y docker.io docker-compose"
        echo "   sudo systemctl start docker"
        echo "   sudo systemctl enable docker"
        echo "   sudo usermod -aG docker ubuntu"
        echo ""
        echo "   # Clone your repository"
        echo "   git clone https://github.com/YOUR_USERNAME/foreign-exploration-gallery.git"
        echo "   cd foreign-exploration-gallery"
        echo ""
        echo "   # Start the application"
        echo "   sudo docker-compose -f cloud-deploy/docker-compose.prod.yml up -d"
        echo ""
        echo "4️⃣  Access your gallery:"
        echo "   http://YOUR_EC2_PUBLIC_IP"
        echo ""
        ;;
        
    2)
        echo "☁️  DEPLOYING TO ECS FARGATE"
        echo "==========================="
        echo ""
        echo "📋 Steps to complete:"
        echo ""
        echo "1️⃣  Create ECR Repository:"
        echo "   aws ecr create-repository --repository-name foreign-exploration-gallery"
        echo ""
        echo "2️⃣  Build and push Docker image:"
        echo "   # Get login token"
        echo "   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com"
        echo ""
        echo "   # Build and tag image"
        echo "   docker build -t foreign-exploration-gallery ."
        echo "   docker tag foreign-exploration-gallery:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/foreign-exploration-gallery:latest"
        echo ""
        echo "   # Push image"
        echo "   docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/foreign-exploration-gallery:latest"
        echo ""
        echo "3️⃣  Create ECS Cluster and Service via AWS Console"
        echo "4️⃣  Set up Application Load Balancer"
        echo ""
        ;;
        
    3)
        echo "🌱 DEPLOYING TO ELASTIC BEANSTALK"
        echo "================================="
        echo ""
        echo "📋 Steps to complete:"
        echo ""
        echo "1️⃣  Install EB CLI:"
        echo "   pip install awsebcli"
        echo ""
        echo "2️⃣  Initialize Elastic Beanstalk:"
        echo "   eb init"
        echo "   # Choose region, platform (Docker), etc."
        echo ""
        echo "3️⃣  Create environment:"
        echo "   eb create production"
        echo ""
        echo "4️⃣  Deploy:"
        echo "   eb deploy"
        echo ""
        echo "5️⃣  Open in browser:"
        echo "   eb open"
        echo ""
        ;;
        
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "💡 Additional Setup:"
echo "==================="
echo ""
echo "🔒 SSL Certificate (Let's Encrypt):"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d yourdomain.com"
echo ""
echo "🌐 Domain Setup:"
echo "   • Buy domain from Route 53 or external provider"
echo "   • Point A record to your server IP"
echo "   • Update nginx configuration with your domain"
echo ""
echo "📊 Monitoring:"
echo "   • CloudWatch for logs and metrics"
echo "   • Set up alerts for high CPU/memory usage"
echo "   • Monitor application health"
echo ""
echo "🎯 Your Foreign Exploration Gallery will be live with:"
echo "   ✅ Load balancing across 2 servers"
echo "   ✅ Real-time analytics dashboard"
echo "   ✅ SSL/HTTPS encryption"
echo "   ✅ Global CDN delivery"
echo "   ✅ Auto-scaling capabilities"