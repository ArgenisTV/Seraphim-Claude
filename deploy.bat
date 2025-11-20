@echo off
REM Seraphim Music Bot - Windows Deployment Script

echo ================================================
echo Seraphim Music Bot - Deployment Script
echo ================================================
echo.

REM Step 1: Check prerequisites
echo Step 1: Checking Prerequisites...
echo --------------------------------

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed
    echo Please install Docker Desktop: https://docs.docker.com/desktop/install/windows-install/
    exit /b 1
)
echo [OK] Docker is installed

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed
    exit /b 1
)
echo [OK] Docker Compose is installed

REM Check if .env exists
if not exist .env (
    echo [ERROR] .env file not found
    echo.
    echo Creating .env from template...
    copy .env.example .env
    echo.
    echo [WARNING] .env file created - YOU MUST EDIT IT!
    echo.
    echo Edit .env and set:
    echo   - DISCORD_TOKEN
    echo   - CLIENT_ID
    echo   - LAVALINK_PASSWORD ^(use a secure random password^)
    echo   - Optionally: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET
    echo.
    echo After editing .env, run this script again.
    pause
    exit /b 1
)
echo [OK] .env file exists

echo.

REM Step 2: Check Lavalink plugins
echo Step 2: Checking Lavalink Plugins...
echo ------------------------------------

if not exist lavalink\plugins mkdir lavalink\plugins

REM Check for YouTube plugin
if not exist lavalink\plugins\youtube-plugin-1.16.0.jar (
    echo [WARNING] YouTube plugin not found, downloading...
    curl -L -o lavalink\plugins\youtube-plugin-1.16.0.jar ^
        "https://maven.lavalink.dev/releases/dev/lavalink/youtube/youtube-plugin/1.16.0/youtube-plugin-1.16.0.jar"

    if errorlevel 1 (
        echo [ERROR] Failed to download YouTube plugin
        echo Download manually from: https://maven.lavalink.dev/releases/dev/lavalink/youtube/youtube-plugin/1.16.0/
        pause
        exit /b 1
    )
    echo [OK] YouTube plugin downloaded
) else (
    echo [OK] YouTube plugin v1.16.0 found
)

REM Remove old YouTube plugin if exists
if exist lavalink\plugins\youtube-plugin-1.5.2.jar (
    echo [WARNING] Removing old YouTube plugin ^(v1.5.2^)...
    del lavalink\plugins\youtube-plugin-1.5.2.jar
    echo [OK] Old plugin removed
)

echo [INFO] LavaSrc plugin will be downloaded by Lavalink on first start

echo.

REM Step 3: Stop existing containers
echo Step 3: Stopping Existing Containers...
echo ---------------------------------------
docker-compose down 2>nul
echo [OK] Stopped existing containers

echo.

REM Step 4: Build images
echo Step 4: Building Docker Images...
echo ---------------------------------
docker-compose build --no-cache

if errorlevel 1 (
    echo [ERROR] Failed to build Docker images
    pause
    exit /b 1
)
echo [OK] Docker images built successfully

echo.

REM Step 5: Start services
echo Step 5: Starting Services...
echo ---------------------------
docker-compose up -d

if errorlevel 1 (
    echo [ERROR] Failed to start services
    pause
    exit /b 1
)
echo [OK] Services started

echo.

REM Step 6: Wait for services
echo Step 6: Waiting for Services to Start...
echo ----------------------------------------

echo [INFO] Waiting for Lavalink to be healthy...
timeout /t 10 /nobreak >nul

echo [INFO] Waiting for bot to start...
timeout /t 5 /nobreak >nul

echo [OK] Services should be running

echo.

REM Step 7: Display status
echo Step 7: Deployment Status
echo =========================
echo.

docker-compose ps

echo.
echo ================================================
echo Deployment Complete!
echo ================================================
echo.
echo Services Status:
docker-compose ps
echo.
echo View Logs:
echo   All services:  docker-compose logs -f
echo   Bot only:      docker-compose logs -f bot
echo   Lavalink only: docker-compose logs -f lavalink
echo.
echo Check Bot Status:
echo   docker-compose logs bot ^| findstr "Logged in"
echo.
echo Manage Services:
echo   Stop:    docker-compose stop
echo   Start:   docker-compose start
echo   Restart: docker-compose restart
echo   Remove:  docker-compose down
echo.
echo Test Commands:
echo   /play never gonna give you up
echo   /play https://open.spotify.com/track/...
echo.

pause
