# Seraphim Music Bot - Development Setup Guide

This guide will help you set up a local development environment for the Seraphim Music Bot.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [IDE Setup](#ide-setup)
- [Additional Resources](#additional-resources)

---

## Prerequisites

### Required Software

**1. Node.js** (v18.0.0 or higher)
- Download: https://nodejs.org/
- Verify: `node --version`

**2. npm** (v9.0.0 or higher)
- Comes with Node.js
- Verify: `npm --version`

**3. Git**
- Download: https://git-scm.com/
- Verify: `git --version`

**4. Docker** (v20.10+ recommended)
- Download: https://docs.docker.com/get-docker/
- Verify: `docker --version`

**5. Docker Compose** (v2.0+ recommended)
- Comes with Docker Desktop
- Verify: `docker-compose --version`

### Optional Software

**1. Visual Studio Code** (recommended IDE)
- Download: https://code.visualstudio.com/
- Extensions recommended in [IDE Setup](#ide-setup)

**2. Postman** (for API testing)
- Download: https://www.postman.com/

---

## Quick Start

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/yourusername/seraphim-claude.git
cd seraphim-claude

# Or clone via SSH
git clone git@github.com:yourusername/seraphim-claude.git
cd seraphim-claude
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Windows: notepad .env
# Mac/Linux: nano .env
```

**Required Variables:**
```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_application_id_here
LAVALINK_PASSWORD=your_secure_password_here
```

### 4. Start Development Environment

**Option A: Docker (Recommended)**
```bash
# Start both bot and Lavalink
docker-compose up -d

# View logs
docker-compose logs -f bot
```

**Option B: Local Development**
```bash
# Terminal 1: Start Lavalink
docker-compose up lavalink

# Terminal 2: Start bot in dev mode
npm run dev
```

### 5. Verify Setup

```bash
# Check if bot is online in Discord
# Try /play command in a voice channel
```

---

## Detailed Setup

### Step 1: Get Discord Bot Token

**1.1. Create Discord Application**

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Enter a name (e.g., "Seraphim Music Bot Dev")
4. Click "Create"

**1.2. Create Bot User**

1. Navigate to "Bot" tab
2. Click "Add Bot"
3. Confirm "Yes, do it!"
4. Under "Token", click "Reset Token" and copy it
   - ⚠️ **IMPORTANT:** Never share this token!
   - Save it to `.env` as `DISCORD_TOKEN`

**1.3. Configure Bot Settings**

Enable these intents:
- ✅ Server Members Intent
- ✅ Message Content Intent (if needed)
- ✅ Presence Intent (optional)

**1.4. Get Application ID**

1. Navigate to "General Information" tab
2. Copy "Application ID"
3. Save it to `.env` as `CLIENT_ID`

**1.5. Generate Bot Invite URL**

1. Navigate to "OAuth2" > "URL Generator"
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ Send Messages
   - ✅ Send Messages in Threads
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Use External Emojis
   - ✅ Connect (to voice)
   - ✅ Speak (in voice)
   - ✅ Use Voice Activity
4. Copy generated URL
5. Open in browser and invite to test server

### Step 2: Configure Lavalink

**2.1. Generate Secure Password**

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or use online generator
# https://www.random.org/strings/
```

**2.2. Add to .env**

```env
LAVALINK_PASSWORD=your_generated_password_here
```

**2.3. Download Lavalink Plugins** (if not using Docker)

```bash
cd lavalink/plugins

# Download YouTube plugin
curl -L -o youtube-plugin-1.16.0.jar \
  https://maven.lavalink.dev/releases/dev/lavalink/youtube/youtube-plugin/1.16.0/youtube-plugin-1.16.0.jar

cd ../..
```

### Step 3: Optional - Spotify Integration

**3.1. Create Spotify App**

1. Go to https://developer.spotify.com/dashboard
2. Log in with Spotify account
3. Click "Create an App"
4. Fill in details:
   - App name: "Seraphim Music Bot Dev"
   - App description: "Development bot"
   - Redirect URI: Leave blank
5. Accept terms and click "Create"

**3.2. Get Credentials**

1. Click on your new app
2. Click "Settings"
3. Copy "Client ID" and "Client Secret"
4. Add to `.env`:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Step 4: Project Structure Overview

```
seraphim-claude/
├── src/
│   ├── client/           # Bot client
│   │   └── SeraphimClient.ts
│   ├── commands/         # Slash commands
│   │   ├── play.ts
│   │   ├── pause.ts
│   │   └── ...
│   ├── events/           # Event handlers
│   │   ├── ready.ts
│   │   ├── interactionCreate.ts
│   │   └── lavalink.ts
│   ├── handlers/         # Button & message handlers
│   │   ├── buttonHandler.ts
│   │   └── nowPlayingHandler.ts
│   ├── types/            # TypeScript types
│   │   ├── Command.ts
│   │   └── QueueTrack.ts
│   ├── utils/            # Utility functions
│   │   ├── embeds.ts
│   │   ├── logger.ts
│   │   ├── voiceValidation.ts
│   │   ├── guildValidation.ts
│   │   ├── queryValidation.ts
│   │   └── sourceFallback.ts
│   └── index.ts          # Entry point
├── lavalink/
│   ├── application.yml   # Lavalink config
│   └── plugins/          # Lavalink plugins
├── .env.example          # Environment template
├── .env                  # Your environment (gitignored)
├── docker-compose.yml    # Docker orchestration
├── Dockerfile            # Bot container build
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript config
└── README.md             # Project documentation
```

---

## Development Workflow

### Running Locally (Without Docker)

**1. Start Lavalink in Docker**

```bash
docker-compose up lavalink
```

**2. Run Bot in Development Mode**

```bash
# Watch mode (auto-restart on changes)
npm run dev

# Or compile and run
npm run build
npm start
```

### Running with Docker

**1. Start All Services**

```bash
docker-compose up -d
```

**2. View Logs**

```bash
# All services
docker-compose logs -f

# Bot only
docker-compose logs -f bot

# Lavalink only
docker-compose logs -f lavalink
```

**3. Restart After Changes**

```bash
# Rebuild and restart bot
docker-compose up -d --build bot

# Or restart without rebuild
docker-compose restart bot
```

### Making Changes

**1. Create Feature Branch**

```bash
git checkout -b feature/my-new-feature
```

**2. Make Changes**

Edit files in `src/`

**3. Test Changes**

```bash
# Local: npm run dev will auto-restart
# Docker: docker-compose restart bot
```

**4. Format and Lint** (when implemented)

```bash
npm run lint
npm run format
```

**5. Commit Changes**

```bash
git add .
git commit -m "feat(commands): add volume control"
```

---

## Testing

### Manual Testing

**1. Test Commands in Discord**

```bash
# Test play command
/play never gonna give you up

# Test with URL
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Test with Spotify
/play https://open.spotify.com/track/...

# Test queue
/queue

# Test controls
/pause
/skip
/stop
```

**2. Test Error Scenarios**

```bash
# Use command in DMs (should fail)
# Use command without being in voice (should fail)
# Use invalid URL (should fail gracefully)
# Remove bot permissions (should show error)
```

**3. Test Edge Cases**

```bash
# Empty queue
# Long queue (100+ songs)
# Network interruption
# Lavalink restart
# Bot restart
```

### Future: Automated Testing

When test suite is implemented:

```bash
# Run all tests
npm test

# Run specific test
npm test -- commands/play.test.ts

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

---

## Troubleshooting

### Common Issues

#### Issue 1: "An invalid token was provided"

**Cause:** Invalid or expired Discord token

**Solution:**
1. Go to Discord Developer Portal
2. Bot > Reset Token
3. Copy new token to `.env`
4. Restart bot

#### Issue 2: "Cannot connect to Lavalink"

**Cause:** Lavalink not running or wrong password

**Solution:**

```bash
# Check if Lavalink is running
docker-compose ps

# Check Lavalink logs
docker-compose logs lavalink

# Verify password in .env matches lavalink/application.yml
```

#### Issue 3: "EADDRINUSE: Port already in use"

**Cause:** Port 2333 already in use

**Solution:**

```bash
# Find process using port
# Linux/Mac
lsof -i :2333

# Windows
netstat -ano | findstr :2333

# Change port in .env or kill process
```

#### Issue 4: YouTube plugin not loading

**Cause:** Plugin not downloaded or wrong version

**Solution:**

```bash
# Check plugin exists
ls lavalink/plugins/

# Should see: youtube-plugin-1.16.0.jar

# If missing, download manually
cd lavalink/plugins
curl -L -o youtube-plugin-1.16.0.jar \
  https://maven.lavalink.dev/releases/dev/lavalink/youtube/youtube-plugin/1.16.0/youtube-plugin-1.16.0.jar
```

#### Issue 5: "npm install" fails

**Cause:** Node version mismatch or network issues

**Solution:**

```bash
# Check Node.js version
node --version  # Should be v18+

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

**Enable detailed logging:**

```env
# Add to .env
DEBUG=true
```

**Check logs:**

```bash
# Docker
docker-compose logs -f bot

# Local
# Logs print to console
```

---

## IDE Setup

### Visual Studio Code

**Recommended Extensions:**

1. **ESLint** - `dbaeumer.vscode-eslint`
   - JavaScript/TypeScript linting

2. **Prettier** - `esbenp.prettier-vscode`
   - Code formatting

3. **TypeScript** - Built-in
   - TypeScript IntelliSense

4. **Docker** - `ms-azuretools.vscode-docker`
   - Docker file support

5. **GitLens** - `eamodio.gitlens`
   - Enhanced Git features

6. **Error Lens** - `usernamehw.errorlens`
   - Inline error display

7. **Path Intellisense** - `christian-kohler.path-intellisense`
   - File path autocomplete

**Settings (.vscode/settings.json):**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

**Launch Configuration (.vscode/launch.json):**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Bot",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "envFile": "${workspaceFolder}/.env"
    }
  ]
}
```

---

## Additional Resources

### Documentation

- **Discord.js Guide:** https://discordjs.guide/
- **Discord.js Docs:** https://discord.js.org/
- **Lavalink Docs:** https://lavalink.dev/
- **TypeScript Docs:** https://www.typescriptlang.org/docs/

### Community

- **Discord.js Discord:** https://discord.gg/djs
- **Lavalink Discord:** https://discord.gg/lavalink

### Useful Tools

- **Discord Token Generator:** Discord Developer Portal
- **Password Generator:** https://www.random.org/passwords/
- **JSON Validator:** https://jsonlint.com/
- **Regex Tester:** https://regex101.com/

---

## Environment Variables Reference

### Required

```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_application_id_here

# Lavalink Configuration
LAVALINK_HOST=lavalink                      # Or localhost for local dev
LAVALINK_PORT=2333
LAVALINK_PASSWORD=your_secure_password_here
```

### Optional

```env
# Spotify Configuration (optional)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Bot Configuration
DEFAULT_VOLUME=50                           # 0-100
DEBUG=false                                 # true for debug logs

# Node Environment
NODE_ENV=development                        # development or production
```

---

## Scripts Reference

### Available npm Scripts

```bash
# Development
npm run dev          # Start in watch mode (auto-restart)
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled JavaScript

# Future Scripts (when implemented)
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild
docker-compose build --no-cache

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart bot

# Execute command in container
docker-compose exec bot sh
```

---

## Next Steps

After setup:

1. ✅ Bot is running in Discord
2. ✅ Commands work (`/play`, `/pause`, etc.)
3. ✅ Music plays in voice channels
4. ✅ No errors in logs

**Now you can:**
- Make changes to commands
- Add new features
- Fix bugs
- Write tests
- Contribute to the project

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines!

---

## Getting Help

### Debug Checklist

Before asking for help:

- [ ] Checked logs (`docker-compose logs -f`)
- [ ] Verified all environment variables are set
- [ ] Confirmed Discord token is valid
- [ ] Confirmed Lavalink is running (`docker-compose ps`)
- [ ] Confirmed bot has proper permissions
- [ ] Tried restarting services
- [ ] Checked [Troubleshooting](#troubleshooting) section

### Where to Get Help

1. **GitHub Issues** - Report bugs or ask questions
2. **GitHub Discussions** - Community help
3. **Documentation** - Check all .md files

---

**Happy Coding! 🎵**

Build amazing features for Seraphim Music Bot!

---

**Document Version:** 1.0
**Last Updated:** November 19, 2025
