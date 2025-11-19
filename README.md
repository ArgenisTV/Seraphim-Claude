# 🎵 Seraphim Music Bot

A professional Discord music bot built with TypeScript, Discord.js, and Lavalink. Supports YouTube, Spotify, and SoundCloud with advanced queue management and a beautiful UI.

## ✨ Features

- 🎶 **Multi-Platform Support**: YouTube, Spotify, and SoundCloud
- 📜 **Advanced Queue System**: Previous, pause, skip, shuffle capabilities
- 🎯 **Non-Blocking Operations**: Add songs without interrupting playback
- 🔄 **Automatic Retry**: Handles connection errors gracefully
- 📋 **Playlist Support**: Automatically detects and loads entire playlists
- 👤 **User Tracking**: Shows who requested each song
- 💬 **Single Message Updates**: Updates one message instead of spamming chat
- 🎮 **Interactive Controls**: Native Discord buttons for easy control
- 🐳 **Fully Containerized**: Easy deployment with Docker
- ⚡ **Production Ready**: Built with industry-standard Lavalink

## 🏗️ Architecture

```
┌─────────────────┐
│  Discord Bot    │  (TypeScript/Node.js)
│  (discord.js)   │
└────────┬────────┘
         │
         │ Commands
         ▼
┌─────────────────┐
│   Lavalink      │  (Java Audio Server)
│  Audio Server   │  - Handles YouTube extraction
└────────┬────────┘  - Processes audio streams
         │           - Manages playback
         │
         ▼
    Discord Voice
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for local development)
- Docker & Docker Compose (for deployment)
- Discord Bot Token ([Get one here](https://discord.com/developers/applications))

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd Seraphim-Claude
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` with your credentials:

```env
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_bot_client_id

# Optional: For Spotify support
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 3. Run with Docker

```bash
# Start both bot and Lavalink
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### 4. Development Mode

```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 📝 Commands

| Command | Description |
|---------|-------------|
| `/play <query or URL>` | Play a song or playlist |
| `/pause` | Pause/resume playback |
| `/skip` | Skip to next track |
| `/back` | Go to previous track |
| `/shuffle` | Shuffle the queue |
| `/queue` | Show current queue |
| `/nowplaying` | Show current track |
| `/stop` | Stop and clear queue |

## 🎮 Interactive Controls

The bot displays interactive buttons under the "Now Playing" message:

- ⏮️ **Previous**: Go back to the previous track
- ⏸️ **Pause**: Pause/resume playback
- ⏭️ **Skip**: Skip to next track
- 🔀 **Shuffle**: Shuffle queue
- ⏹️ **Stop**: Stop and disconnect

## 🔧 Configuration

### Bot Settings (`.env`)

```env
# Required
DISCORD_TOKEN=         # Your Discord bot token
CLIENT_ID=             # Your bot's client ID

# Lavalink (Default values work with Docker Compose)
LAVALINK_HOST=lavalink
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass

# Optional Spotify Support
SPOTIFY_CLIENT_ID=     # Spotify API client ID
SPOTIFY_CLIENT_SECRET= # Spotify API client secret

# Bot Configuration
DEFAULT_VOLUME=50      # Default volume (0-100)
MAX_QUEUE_SIZE=100     # Maximum queue size
```

### Lavalink Settings

Edit `lavalink/application.yml` to customize:
- Audio quality
- Buffer settings
- Enabled sources
- Rate limits

## 🐳 Docker Deployment

The project includes:
- `Dockerfile`: Multi-stage build for the bot
- `docker-compose.yml`: Orchestrates bot + Lavalink
- Automatic health checks
- Volume mounts for logs
- Restart policies

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f bot
docker-compose logs -f lavalink

# Restart services
docker-compose restart

# Update and rebuild
git pull
docker-compose up -d --build
```

## 🏠 Raspberry Pi Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on:
- Setting up a Raspberry Pi 4
- Installing Docker
- Running 24/7
- Auto-start on boot
- Monitoring and maintenance

**Hardware Requirements**:
- Raspberry Pi 4 (4GB RAM minimum, 8GB recommended)
- 32GB+ microSD card (Class 10 or better)
- Stable internet connection
- Power consumption: ~5-10 watts (~$5-10/year)

## 📊 Monitoring

### Check Status

```bash
# Check if containers are running
docker-compose ps

# View resource usage
docker stats

# Check bot logs
docker-compose logs -f bot

# Check Lavalink logs
docker-compose logs -f lavalink
```

### Lavalink Health

Access Lavalink status: `http://localhost:2333/version`

## 🛠️ Development

### Project Structure

```
Seraphim-Claude/
├── src/
│   ├── client/          # Bot client setup
│   ├── commands/        # Slash commands
│   ├── events/          # Event handlers
│   ├── handlers/        # Button/interaction handlers
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilities (logger, embeds)
│   └── index.ts         # Entry point
├── lavalink/
│   └── application.yml  # Lavalink configuration
├── docker-compose.yml   # Docker orchestration
├── Dockerfile           # Bot container
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 🐛 Troubleshooting

### Bot not responding
1. Check bot token is correct in `.env`
2. Verify bot has proper permissions in Discord
3. Check logs: `docker-compose logs -f bot`

### Lavalink connection failed
1. Ensure Lavalink container is running: `docker-compose ps`
2. Check Lavalink logs: `docker-compose logs -f lavalink`
3. Verify password matches in `.env` and `lavalink/application.yml`

### YouTube videos not playing
1. Update Lavalink: `docker-compose pull lavalink`
2. Check Lavalink has latest YouTube plugin (configured in `application.yml`)
3. Restart services: `docker-compose restart`

### High memory usage
1. Adjust Java heap size in `docker-compose.yml` (currently 2GB)
2. Reduce `youtubePlaylistLoadLimit` in `lavalink/application.yml`
3. Clear queue more frequently

## 📚 Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Lavalink Documentation](https://lavalink.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [Discord Developer Portal](https://discord.com/developers/docs)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built with [Discord.js](https://discord.js.org/)
- Powered by [Lavalink](https://lavalink.dev/)
- Uses [Erela.js](https://github.com/MenuDocs/erela.js) for Lavalink integration
- Inspired by professional Discord music bots (Hydra, Rythm, FredBoat)
