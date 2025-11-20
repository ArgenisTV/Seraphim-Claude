#!/bin/bash
# Seraphim Music Bot - Deployment Script
# This script prepares and deploys the bot in Docker

set -e  # Exit on any error

echo "================================================"
echo "Seraphim Music Bot - Deployment Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Step 1: Check prerequisites
echo "Step 1: Checking Prerequisites..."
echo "--------------------------------"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi
print_success "Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi
print_success "Docker Compose is installed"

# Check if .env exists
if [ ! -f .env ]; then
    print_error ".env file not found"
    echo ""
    echo "Creating .env from template..."
    cp .env.example .env
    print_warning ".env file created - YOU MUST EDIT IT!"
    echo ""
    echo "Edit .env and set:"
    echo "  - DISCORD_TOKEN"
    echo "  - CLIENT_ID"
    echo "  - LAVALINK_PASSWORD (use a secure random password)"
    echo "  - Optionally: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET"
    echo ""
    echo "After editing .env, run this script again."
    exit 1
fi
print_success ".env file exists"

# Validate required environment variables
source .env

if [ -z "$DISCORD_TOKEN" ] || [ "$DISCORD_TOKEN" == "your_discord_bot_token_here" ]; then
    print_error "DISCORD_TOKEN not configured in .env"
    exit 1
fi
print_success "DISCORD_TOKEN is set"

if [ -z "$CLIENT_ID" ] || [ "$CLIENT_ID" == "your_discord_application_id_here" ]; then
    print_error "CLIENT_ID not configured in .env"
    exit 1
fi
print_success "CLIENT_ID is set"

if [ -z "$LAVALINK_PASSWORD" ] || [ "$LAVALINK_PASSWORD" == "your_secure_password_here" ]; then
    print_error "LAVALINK_PASSWORD not configured in .env"
    echo "Generate a secure password with: openssl rand -base64 32"
    exit 1
fi
print_success "LAVALINK_PASSWORD is set"

echo ""

# Step 2: Check Lavalink plugins
echo "Step 2: Checking Lavalink Plugins..."
echo "------------------------------------"

PLUGINS_DIR="lavalink/plugins"
mkdir -p "$PLUGINS_DIR"

# Check for YouTube plugin
YOUTUBE_PLUGIN="$PLUGINS_DIR/youtube-plugin-1.16.0.jar"
if [ ! -f "$YOUTUBE_PLUGIN" ]; then
    print_warning "YouTube plugin not found, downloading..."
    curl -L -o "$YOUTUBE_PLUGIN" \
        "https://maven.lavalink.dev/releases/dev/lavalink/youtube/youtube-plugin/1.16.0/youtube-plugin-1.16.0.jar"

    if [ $? -eq 0 ]; then
        print_success "YouTube plugin downloaded"
    else
        print_error "Failed to download YouTube plugin"
        echo "Download manually from: https://maven.lavalink.dev/releases/dev/lavalink/youtube/youtube-plugin/1.16.0/"
        exit 1
    fi
else
    print_success "YouTube plugin v1.16.0 found"
fi

# Remove old YouTube plugin if exists
OLD_PLUGIN="$PLUGINS_DIR/youtube-plugin-1.5.2.jar"
if [ -f "$OLD_PLUGIN" ]; then
    print_warning "Removing old YouTube plugin (v1.5.2)..."
    rm "$OLD_PLUGIN"
    print_success "Old plugin removed"
fi

# LavaSrc will be downloaded automatically by Lavalink
print_info "LavaSrc plugin will be downloaded by Lavalink on first start"

echo ""

# Step 3: Stop existing containers
echo "Step 3: Stopping Existing Containers..."
echo "---------------------------------------"
docker-compose down 2>/dev/null || true
print_success "Stopped existing containers"

echo ""

# Step 4: Build images
echo "Step 4: Building Docker Images..."
echo "---------------------------------"
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    print_success "Docker images built successfully"
else
    print_error "Failed to build Docker images"
    exit 1
fi

echo ""

# Step 5: Start services
echo "Step 5: Starting Services..."
echo "---------------------------"
docker-compose up -d

if [ $? -eq 0 ]; then
    print_success "Services started"
else
    print_error "Failed to start services"
    exit 1
fi

echo ""

# Step 6: Wait for services to be healthy
echo "Step 6: Waiting for Services to Start..."
echo "----------------------------------------"

print_info "Waiting for Lavalink to be healthy..."
sleep 5

# Check Lavalink health
for i in {1..30}; do
    if docker-compose ps | grep -q "lavalink.*healthy"; then
        print_success "Lavalink is healthy"
        break
    fi

    if [ $i -eq 30 ]; then
        print_error "Lavalink failed to start"
        echo ""
        echo "Check logs with: docker-compose logs lavalink"
        exit 1
    fi

    echo -n "."
    sleep 2
done

echo ""

print_info "Waiting for bot to start..."
sleep 5

# Check if bot is running
if docker-compose ps | grep -q "bot.*Up"; then
    print_success "Bot is running"
else
    print_warning "Bot may not be running properly"
    echo "Check logs with: docker-compose logs bot"
fi

echo ""

# Step 7: Display status
echo "Step 7: Deployment Status"
echo "========================="
echo ""

docker-compose ps

echo ""
echo "================================================"
echo "Deployment Complete!"
echo "================================================"
echo ""
echo "📊 Service Status:"
docker-compose ps --format "table {{.Name}}\t{{.Status}}"
echo ""
echo "📝 View Logs:"
echo "  All services:  docker-compose logs -f"
echo "  Bot only:      docker-compose logs -f bot"
echo "  Lavalink only: docker-compose logs -f lavalink"
echo ""
echo "🔍 Check Bot Status:"
echo "  docker-compose logs bot | grep -i 'logged in'"
echo ""
echo "⚙️  Manage Services:"
echo "  Stop:    docker-compose stop"
echo "  Start:   docker-compose start"
echo "  Restart: docker-compose restart"
echo "  Remove:  docker-compose down"
echo ""
echo "🎵 Test Commands:"
echo "  /play never gonna give you up"
echo "  /play https://open.spotify.com/track/..."
echo ""

# Optional: Show bot logs
read -p "Show bot logs now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose logs --tail=50 -f bot
fi
