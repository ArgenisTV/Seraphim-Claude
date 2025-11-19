# 🏠 Raspberry Pi Deployment Guide

Complete guide for deploying Seraphim Music Bot on a Raspberry Pi for 24/7 operation.

## 📋 Table of Contents

- [Hardware Requirements](#hardware-requirements)
- [Initial Setup](#initial-setup)
- [Installing Docker](#installing-docker)
- [Deploying the Bot](#deploying-the-bot)
- [Auto-Start Configuration](#auto-start-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)
- [Cost Analysis](#cost-analysis)

## 🖥️ Hardware Requirements

### Recommended Setup

**Raspberry Pi 4 Model B**
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 32GB+ microSD card (Class 10 or UHS-1)
- **Power**: Official Raspberry Pi 4 Power Supply (5V, 3A USB-C)
- **Cooling**: Heat sinks or small fan (optional but recommended)
- **Network**: Ethernet (recommended) or WiFi

### Why Not Other Options?

- **Router**: Routers don't run general-purpose software
- **Older Raspberry Pis**: Pi 3 can work but may struggle with Lavalink
- **Raspberry Pi Zero**: Insufficient RAM and processing power
- **Arduino**: Not a general-purpose computer, can't run Docker

### Alternative Hardware

If Raspberry Pi is unavailable:
- **Rock Pi 4** (4GB+)
- **Orange Pi 4** (4GB+)
- **Odroid N2+** (4GB+)
- **Old laptop or PC** (even 8+ years old can work)

## 🚀 Initial Setup

### 1. Install Raspberry Pi OS

1. Download [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Flash **Raspberry Pi OS Lite (64-bit)** to your microSD card
   - Lite version saves resources (no desktop GUI)
   - 64-bit required for better performance

3. **Configure during flashing** (Raspberry Pi Imager settings):
   - ✅ Enable SSH
   - ✅ Set username and password
   - ✅ Configure WiFi (if not using Ethernet)
   - ✅ Set hostname (e.g., `seraphim-bot`)

4. Insert microSD card into Pi and power on

### 2. First Boot Configuration

Connect via SSH from your computer:

```bash
# Replace 'raspberrypi' with your hostname if changed
ssh pi@raspberrypi.local
# Or use IP address: ssh pi@192.168.1.XXX
```

Update system:

```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

### 3. Basic System Configuration

```bash
# Reconnect after reboot
ssh pi@raspberrypi.local

# Set timezone
sudo timedatectl set-timezone America/New_York  # Change to your timezone

# Check timezone
timedatectl

# Expand filesystem (if not auto-expanded)
sudo raspi-config --expand-rootfs

# Reboot
sudo reboot
```

## 🐳 Installing Docker

### Quick Install

```bash
# Download and run Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (no sudo needed)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get install -y docker-compose

# Log out and back in for group changes to take effect
exit
```

Reconnect and verify:

```bash
ssh pi@raspberrypi.local

# Verify Docker installation
docker --version
docker-compose --version

# Test Docker
docker run hello-world
```

## 🤖 Deploying the Bot

### 1. Install Git and Clone Repository

```bash
# Install git
sudo apt-get install -y git

# Clone your repository
cd ~
git clone https://github.com/YOUR_USERNAME/Seraphim-Claude.git
cd Seraphim-Claude
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

Add your credentials:

```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_bot_client_id_here

# Optional: Spotify support
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Lavalink (defaults work fine)
LAVALINK_HOST=lavalink
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass

# Bot settings
DEFAULT_VOLUME=50
MAX_QUEUE_SIZE=100
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

### 3. Optimize for Raspberry Pi

Edit Docker Compose to reduce Lavalink memory:

```bash
nano docker-compose.yml
```

Change Lavalink environment:

```yaml
lavalink:
  environment:
    - _JAVA_OPTIONS=-Xmx1G  # Change from 2G to 1G for 4GB Pi
```

For 8GB Pi, you can keep 2G or use 1.5G.

### 4. Start the Bot

```bash
# Pull images and start
docker-compose up -d

# View logs
docker-compose logs -f
```

Wait for these messages:
- ✅ `Lavalink node connected`
- ✅ `Logged in as YourBotName`
- ✅ `Ready to play music in X servers`

Press `Ctrl+C` to exit logs (bot keeps running).

## 🔄 Auto-Start Configuration

### Enable Auto-Start on Boot

Create systemd service:

```bash
sudo nano /etc/systemd/system/seraphim-bot.service
```

Add this content:

```ini
[Unit]
Description=Seraphim Discord Music Bot
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/pi/Seraphim-Claude
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
User=pi

[Install]
WantedBy=multi-user.target
```

**Note**: Change `/home/pi` if your username is different.

Enable and start:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable auto-start
sudo systemctl enable seraphim-bot.service

# Start now
sudo systemctl start seraphim-bot.service

# Check status
sudo systemctl status seraphim-bot.service
```

Test auto-start:

```bash
# Reboot Pi
sudo reboot

# After reboot, check if bot is running
ssh pi@raspberrypi.local
docker-compose ps
```

## 📊 Monitoring & Maintenance

### Check Bot Status

```bash
# View running containers
docker-compose ps

# View logs (live)
docker-compose logs -f

# View logs (last 50 lines)
docker-compose logs --tail 50

# Check resource usage
docker stats

# Check system resources
htop  # Install with: sudo apt-get install htop
```

### Update the Bot

```bash
cd ~/Seraphim-Claude

# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build

# View logs to confirm
docker-compose logs -f
```

### Restart Services

```bash
# Restart everything
docker-compose restart

# Restart only bot
docker-compose restart bot

# Restart only Lavalink
docker-compose restart lavalink

# Full stop and start
docker-compose down
docker-compose up -d
```

### View Lavalink Metrics

Access from your computer:

```
http://raspberrypi.local:2333/version
```

Or using Pi's IP address:

```
http://192.168.1.XXX:2333/version
```

### Clean Up Disk Space

```bash
# Remove unused Docker images
docker system prune -a

# Check disk usage
df -h

# Check folder sizes
du -sh ~/Seraphim-Claude/*
```

## 🐛 Troubleshooting

### Bot Won't Start

```bash
# Check logs
docker-compose logs bot

# Check if containers are running
docker-compose ps

# Restart everything
docker-compose down
docker-compose up -d
```

### High CPU/Memory Usage

```bash
# Check resource usage
docker stats

# Reduce Lavalink memory (edit docker-compose.yml)
nano docker-compose.yml
# Change _JAVA_OPTIONS=-Xmx1G to -Xmx768M

# Restart
docker-compose down
docker-compose up -d
```

### Lavalink Won't Connect

```bash
# Check Lavalink logs
docker-compose logs lavalink

# Verify Lavalink is running
docker-compose ps

# Check network
docker network ls
docker network inspect seraphim-claude_seraphim-network
```

### Bot Disconnects Frequently

Possible causes:
1. **Unstable Internet**: Use Ethernet instead of WiFi
2. **Insufficient Power**: Use official Pi power supply
3. **Overheating**: Add cooling (heatsinks/fan)
4. **Low Memory**: Reduce Lavalink memory allocation

Check temperature:

```bash
# Check CPU temperature
vcgencmd measure_temp

# If over 80°C, add cooling
```

### YouTube Not Working

```bash
# Update Lavalink
docker-compose pull lavalink
docker-compose up -d

# Check Lavalink logs for errors
docker-compose logs lavalink | grep -i error
```

### Can't SSH to Pi

1. **Check if Pi is on**: Look for lights/activity
2. **Check network**: Ping Pi's IP address
3. **Try IP instead of hostname**: `ssh pi@192.168.1.XXX`
4. **Reflash SD card**: May be corrupted

Find Pi's IP:

```bash
# From your router's admin panel
# Or use network scanner like Angry IP Scanner
# Or connect a monitor and run: ip addr show
```

## 💰 Cost Analysis

### Initial Hardware Cost

| Item | Price (USD) |
|------|-------------|
| Raspberry Pi 4 (4GB) | $55 |
| MicroSD Card (32GB) | $8 |
| Power Supply | $8 |
| Case (optional) | $10 |
| **Total** | **~$81** |

### Operating Costs

**Power Consumption**:
- Raspberry Pi 4: ~5-8 watts
- Annual consumption: ~44-70 kWh
- At $0.13/kWh: **~$5.72-9.10/year**

**Comparison to Cloud Hosting**:
- VPS hosting: $5-10/month = **$60-120/year**
- **Savings**: $50-110/year
- **Payback period**: ~8-12 months

### Pros vs Cons

**Pros**:
- ✅ One-time hardware cost
- ✅ Full control
- ✅ Very low power consumption
- ✅ No monthly fees
- ✅ Can host multiple bots/services
- ✅ Learning experience

**Cons**:
- ❌ Requires stable home internet
- ❌ Vulnerable to power outages (UPS recommended)
- ❌ Limited to home network (unless port forwarding)
- ❌ Initial setup complexity
- ❌ Hardware failure risk

## 🔒 Security Best Practices

### Basic Security

```bash
# Change default password
passwd

# Update regularly
sudo apt update && sudo apt upgrade -y

# Enable firewall
sudo apt-get install ufw
sudo ufw allow ssh
sudo ufw enable

# Disable root login (edit SSH config)
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
# Restart SSH: sudo systemctl restart ssh
```

### Advanced Security

```bash
# Install fail2ban (blocks brute force attacks)
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Set up SSH keys (more secure than password)
# From your computer:
ssh-copy-id pi@raspberrypi.local

# Then disable password authentication
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart ssh
```

## 📱 Remote Access (Optional)

### Tailscale VPN (Recommended)

Access your Pi from anywhere securely:

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate
sudo tailscale up

# Get Tailscale IP
tailscale ip
```

Now you can SSH using Tailscale IP from anywhere!

### Dynamic DNS (Alternative)

If you want to access from home IP:

1. Set up Dynamic DNS (DynDNS, No-IP, Duck DNS)
2. Configure router port forwarding for SSH (port 22)
3. Use strong passwords or SSH keys

**Warning**: Exposing SSH to internet has security risks!

## 🎯 Next Steps

After successful deployment:

1. ✅ Test all bot commands in Discord
2. ✅ Monitor for 24 hours to ensure stability
3. ✅ Set up log rotation to prevent disk fill
4. ✅ Consider UPS for power backup
5. ✅ Document your specific configuration

## 📚 Additional Resources

- [Raspberry Pi Documentation](https://www.raspberrypi.com/documentation/)
- [Docker on Raspberry Pi](https://docs.docker.com/engine/install/debian/)
- [Discord Developer Portal](https://discord.com/developers/docs)
- [Lavalink Documentation](https://lavalink.dev/)

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs`
2. Review this guide's troubleshooting section
3. Search existing GitHub issues
4. Create new issue with:
   - Pi model and RAM
   - OS version: `cat /etc/os-release`
   - Docker version: `docker --version`
   - Error logs: `docker-compose logs`

Happy deploying! 🎉