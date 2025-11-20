# Docker Deployment Guide

Complete guide for deploying Seraphim Music Bot using Docker.

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Docker & Docker Compose installed
- Discord bot token ([Get one here](https://discord.com/developers/applications))
- 1GB+ available RAM
- Internet connection

### One-Command Deployment

**Linux/Mac:**
```bash
chmod +x deploy.sh && ./deploy.sh
```

**Windows:**
```cmd
deploy.bat
```

The script will:
1. Check prerequisites
2. Download plugins
3. Build images
4. Start services
5. Verify deployment

---

## 📋 Manual Deployment Steps

### Step 1: Clone Repository
```bash
git clone https://github.com/your-repo/seraphim-claude.git
cd seraphim-claude
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env  # or use your preferred editor
```

**Required Variables:**
```env
DISCORD_TOKEN=your_token_here
CLIENT_ID=your_client_id_here
LAVALINK_PASSWORD=generate_secure_password
```

**Generate Secure Password:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Optional Variables:**
```env
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
DEFAULT_VOLUME=50
DEBUG=false
```

### Step 3: Download Plugins

**Automatic (Recommended):**
```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat
```

**Manual:**
```bash
cd lavalink/plugins

# Download YouTube plugin
curl -L -o youtube-plugin-1.16.0.jar \
  https://maven.lavalink.dev/releases/dev/lavalink/youtube/youtube-plugin/1.16.0/youtube-plugin-1.16.0.jar

# Remove old plugin if exists
rm youtube-plugin-1.5.2.jar 2>/dev/null || true

cd ../..
```

### Step 4: Build Images

```bash
docker-compose build --no-cache
```

**Expected Output:**
```
Successfully built [image-id]
Successfully tagged seraphim-music-bot_bot:latest
```

### Step 5: Start Services

```bash
docker-compose up -d
```

**Verify Services:**
```bash
docker-compose ps
```

**Expected Output:**
```
NAME                STATUS              PORTS
seraphim-bot        Up X seconds
seraphim-lavalink   Up X seconds (healthy)
```

### Step 6: Verify Deployment

```bash
# Check bot logs
docker-compose logs bot | grep "Logged in"

# Should see:
# Logged in as YourBotName#1234
# Ready to play music in X servers
```

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] **Services Running**: `docker-compose ps` shows both services "Up"
- [ ] **Lavalink Healthy**: `docker-compose ps` shows lavalink as "(healthy)"
- [ ] **Bot Logged In**: `docker-compose logs bot | grep "Logged in"`
- [ ] **Commands Registered**: `docker-compose logs bot | grep "slash commands"`
- [ ] **Lavalink Connected**: `docker-compose logs bot | grep "Lavalink"`
- [ ] **No Errors**: `docker-compose logs | grep -i error` returns minimal/no errors

### Test Basic Functionality

In Discord:
1. Run `/play never gonna give you up`
2. Bot should join voice channel
3. Music should start playing
4. Try `/pause`, `/skip`, `/stop`

### Test New Features

1. **Spotify**: `/play https://open.spotify.com/track/...`
2. **Apple Music**: `/play https://music.apple.com/...`
3. **Queue**: `/queue` to see current queue
4. **Shuffle**: `/shuffle` to randomize queue

---

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Bot only (recommended)
docker-compose logs -f bot

# Lavalink only
docker-compose logs -f lavalink

# Last 50 lines
docker-compose logs --tail=50

# Since timestamp
docker-compose logs --since="2025-01-01T00:00:00"
```

### Check Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Specific container
docker stats seraphim-bot
```

### Health Checks

```bash
# Manual health check
curl -H "Authorization: your_lavalink_password" \
  http://localhost:2333/version

# Check from inside bot container
docker-compose exec bot wget -qO- http://lavalink:2333/version
```

---

## 🔧 Management Commands

### Start/Stop

```bash
# Stop services
docker-compose stop

# Start services
docker-compose start

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart bot
```

### Update & Rebuild

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (CAUTION: deletes data)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Full cleanup
docker system prune -a
```

---

## 🐛 Troubleshooting

### Bot Not Starting

**Check logs:**
```bash
docker-compose logs bot
```

**Common Issues:**

1. **Missing Environment Variables**
   ```
   Error: Missing required environment variables: DISCORD_TOKEN
   ```
   **Fix**: Edit `.env` file and set required variables

2. **Invalid Discord Token**
   ```
   Error: An invalid token was provided
   ```
   **Fix**: Get new token from Discord Developer Portal

3. **Cannot Connect to Lavalink**
   ```
   Error: Lavalink node "seraphim-node" disconnected
   ```
   **Fix**: Ensure Lavalink is healthy: `docker-compose ps`

### Lavalink Not Starting

**Check logs:**
```bash
docker-compose logs lavalink
```

**Common Issues:**

1. **Port Already in Use**
   ```
   Error: Address already in use
   ```
   **Fix**: Change `LAVALINK_PORT` in `.env` or stop other service on port 2333

2. **Plugin Download Failed**
   ```
   Error: Failed to download plugin
   ```
   **Fix**: Download plugins manually (see Step 3)

3. **Invalid Password**
   ```
   Error: Unauthorized
   ```
   **Fix**: Ensure `LAVALINK_PASSWORD` matches in `.env` and `lavalink/application.yml`

### Music Not Playing

1. **Check Bot Permissions**
   - Bot needs "Connect" and "Speak" permissions in voice channel
   - Grant permissions in Discord server settings

2. **Check Lavalink Connection**
   ```bash
   docker-compose logs bot | grep -i lavalink
   ```
   Should see: "Lavalink connection initialized"

3. **Check Track Errors**
   ```bash
   docker-compose logs bot | grep -i "track error"
   ```

4. **Test Different Sources**
   - Try YouTube URL
   - Try search query
   - Try Spotify URL

### High Memory Usage

**Check usage:**
```bash
docker stats seraphim-bot seraphim-lavalink
```

**Expected Usage:**
- Bot: 100-200MB
- Lavalink: 500MB-1.5GB

**If High:**
1. Check for memory leaks (should be fixed in latest version)
2. Reduce Lavalink memory: Edit `docker-compose.yml` → `_JAVA_OPTIONS=-Xmx1G`
3. Restart services: `docker-compose restart`

### Bot Crashes After Hours

**Likely Causes:**
1. Memory leak (fixed in v1.0.0+)
2. Lavalink connection drops
3. Out of memory

**Check:**
```bash
# Check crash logs
docker-compose logs bot --tail=100

# Check system resources
free -h
df -h
```

**Fix:**
1. Update to latest version
2. Increase system memory
3. Enable auto-restart (already configured in docker-compose.yml)

---

## 🔒 Security Best Practices

### Production Deployment

1. **Use Strong Passwords**
   ```bash
   # Generate 32-character password
   openssl rand -base64 32
   ```

2. **Restrict Network Access**
   ```yaml
   # docker-compose.yml
   services:
     lavalink:
       ports:
         - "127.0.0.1:2333:2333"  # Only localhost
   ```

3. **Use Docker Secrets** (Docker Swarm)
   ```yaml
   services:
     bot:
       secrets:
         - discord_token
   secrets:
     discord_token:
       external: true
   ```

4. **Regular Updates**
   ```bash
   # Weekly updates
   git pull
   docker-compose build --no-cache
   docker-compose up -d
   ```

5. **Monitor Logs**
   - Set up log rotation
   - Monitor for errors
   - Alert on crashes

### Firewall Configuration

```bash
# Allow only necessary ports
ufw allow 22/tcp      # SSH
ufw enable

# Lavalink should NOT be exposed to internet
# Keep it internal to Docker network only
```

---

## 📈 Performance Tuning

### Optimize for Small Servers (<10 guilds)

```yaml
# docker-compose.yml
services:
  lavalink:
    environment:
      - _JAVA_OPTIONS=-Xmx512M  # Reduce from 2GB
```

### Optimize for Large Servers (100+ guilds)

```yaml
# docker-compose.yml
services:
  lavalink:
    environment:
      - _JAVA_OPTIONS=-Xmx4G  # Increase to 4GB
```

### Adjust Audio Quality vs CPU

Edit `lavalink/application.yml`:
```yaml
lavalink:
  server:
    opusEncodingQuality: 10    # Max quality (high CPU)
    # or
    opusEncodingQuality: 5     # Medium quality (lower CPU)

    resamplingQuality: MEDIUM  # Current setting
    # or
    resamplingQuality: HIGH    # Better quality (higher CPU)
```

---

## 🔄 Updates & Maintenance

### Update Bot Code

```bash
# 1. Pull latest code
git pull

# 2. Rebuild
docker-compose build --no-cache bot

# 3. Restart
docker-compose up -d bot
```

### Update Lavalink

```bash
# Update version in docker-compose.yml
services:
  lavalink:
    image: ghcr.io/lavalink-devs/lavalink:4

# Rebuild
docker-compose pull lavalink
docker-compose up -d lavalink
```

### Update Plugins

```bash
# Download new versions
cd lavalink/plugins
curl -L -o youtube-plugin-X.X.X.jar [new-url]

# Remove old versions
rm youtube-plugin-old-version.jar

# Update application.yml
# Change plugin version number

# Restart
docker-compose restart lavalink
```

### Backup

**Important Files:**
```bash
# Backup configuration
tar -czf seraphim-backup-$(date +%F).tar.gz \
  .env \
  lavalink/application.yml \
  lavalink/plugins/
```

**Restore:**
```bash
tar -xzf seraphim-backup-YYYY-MM-DD.tar.gz
docker-compose up -d
```

---

## 🌐 Production Deployment Options

### Option 1: Single VPS

**Requirements:**
- 2GB+ RAM
- 20GB+ disk
- Ubuntu 20.04+ or Debian 11+

**Providers:**
- DigitalOcean ($12/month)
- Linode ($12/month)
- Vultr ($12/month)
- AWS EC2 t3.small ($15/month)

### Option 2: Raspberry Pi

See `DEPLOYMENT.md` for complete Raspberry Pi setup guide.

**Requirements:**
- Raspberry Pi 4 (4GB+ RAM)
- 32GB+ SD card
- Stable internet

### Option 3: Docker Swarm

For high availability across multiple servers:

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml seraphim

# Scale bot (for sharding)
docker service scale seraphim_bot=3
```

### Option 4: Kubernetes

For enterprise deployments:
- Use provided Dockerfile
- Create Kubernetes manifests
- Deploy with Helm charts
- Scale horizontally

---

## 📞 Support

### Check Status

```bash
# All services
docker-compose ps

# Logs
docker-compose logs --tail=50

# Resource usage
docker stats
```

### Common Commands

```bash
# View configuration
docker-compose config

# Validate docker-compose.yml
docker-compose config --quiet

# Rebuild specific service
docker-compose build bot

# Execute command in container
docker-compose exec bot sh
```

### Get Help

- **GitHub Issues**: Report bugs and issues
- **Documentation**: Check README.md and other guides
- **Logs**: Always include logs when asking for help

---

## ✅ Post-Deployment Checklist

After successful deployment:

- [ ] Bot appears online in Discord
- [ ] All slash commands visible (`/play`, `/pause`, etc.)
- [ ] Music playback works
- [ ] Spotify URLs work
- [ ] Queue management works
- [ ] Logs show no errors
- [ ] Memory usage is stable
- [ ] Auto-restart works (test with `docker-compose stop bot`)
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Firewall configured
- [ ] Documentation reviewed
- [ ] Team knows how to access logs

---

## 🎉 Deployment Complete!

Your bot is now running in Docker!

**Next Steps:**
1. Invite bot to your Discord server
2. Test all commands
3. Set up monitoring
4. Configure backups
5. Enjoy the music! 🎵

**Useful Links:**
- Main README: `README.md`
- Spotify Setup: `SPOTIFY_SETUP.md`
- Raspberry Pi: `DEPLOYMENT.md`
- Quick Reference: `AUDIT_QUICK_REFERENCE.md`

---

**Need help?** Check logs with `docker-compose logs -f`
