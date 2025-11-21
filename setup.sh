#!/bin/bash

# Persian Kerman Carpet - Automated Setup Script
# This script sets up the complete e-commerce system with crypto payments

set -e  # Exit on error

echo "========================================="
echo "Persian Kerman Carpet - Setup Script"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"

    # Generate a secure JWT secret
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32)

    cat > .env << EOF
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=persian_carpet_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=7d

# NOWPayments (Get your API keys from https://nowpayments.io/)
NOWPAYMENTS_API_KEY=your_nowpayments_api_key
NOWPAYMENTS_IPN_SECRET=your_ipn_secret

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Frontend Port
FRONTEND_PORT=5173

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!@#
EOF

    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and add your API keys:${NC}"
    echo "   - NOWPayments API Key"
    echo "   - Email SMTP credentials"
    echo ""
    echo -e "${YELLOW}Press Enter when you're ready to continue...${NC}"
    read -r
fi

echo -e "${GREEN}✅ Environment configuration loaded${NC}"
echo ""

# Ask user about deployment method
echo "Choose deployment method:"
echo "1) Docker Compose (Recommended - One-click setup)"
echo "2) Manual Setup (Development)"
echo ""
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo -e "${GREEN}🐳 Starting Docker Compose setup...${NC}"
    echo ""

    # Build and start containers
    docker-compose up -d --build

    echo ""
    echo -e "${GREEN}✅ Docker containers started successfully!${NC}"
    echo ""
    echo "Waiting for services to be ready..."
    sleep 10

    # Check health
    if docker-compose ps | grep -q "healthy"; then
        echo -e "${GREEN}✅ All services are healthy!${NC}"
    else
        echo -e "${YELLOW}⚠️  Services are starting... Check logs with: docker-compose logs -f${NC}"
    fi

    echo ""
    echo "========================================="
    echo "🚀 Setup Complete!"
    echo "========================================="
    echo ""
    echo "Access your application:"
    echo "  📱 Frontend: http://localhost:5173"
    echo "  🔧 Backend API: http://localhost:5000"
    echo "  📊 API Health: http://localhost:5000/health"
    echo ""
    echo "Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop: docker-compose down"
    echo "  Restart: docker-compose restart"
    echo ""

elif [ "$choice" = "2" ]; then
    echo ""
    echo -e "${GREEN}🔧 Starting manual setup...${NC}"
    echo ""

    # Check if PostgreSQL is running
    if ! pg_isready -h localhost -p 5432 &> /dev/null; then
        echo -e "${RED}❌ PostgreSQL is not running on localhost:5432${NC}"
        echo "Please start PostgreSQL first or use Docker Compose setup."
        exit 1
    fi

    echo -e "${GREEN}✅ PostgreSQL is running${NC}"

    # Setup database
    echo ""
    echo -e "${YELLOW}📊 Setting up database...${NC}"
    psql -h localhost -U postgres -d postgres -c "CREATE DATABASE persian_carpet_db;" 2>/dev/null || true
    psql -h localhost -U postgres -d persian_carpet_db -f backend/src/config/schema.sql
    echo -e "${GREEN}✅ Database schema created${NC}"

    # Install backend dependencies
    echo ""
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    cd backend
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"

    # Install frontend dependencies
    echo ""
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    cd ..
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

    echo ""
    echo "========================================="
    echo "🚀 Setup Complete!"
    echo "========================================="
    echo ""
    echo "To start the application:"
    echo ""
    echo "1. Start backend:"
    echo "   cd backend && npm run dev"
    echo ""
    echo "2. Start frontend (in another terminal):"
    echo "   npm run dev"
    echo ""
    echo "Access your application:"
    echo "  📱 Frontend: http://localhost:5173"
    echo "  🔧 Backend API: http://localhost:5000"
    echo ""
else
    echo -e "${RED}Invalid choice. Exiting.${NC}"
    exit 1
fi

echo -e "${YELLOW}📖 For more information, see SETUP.md${NC}"
echo ""
