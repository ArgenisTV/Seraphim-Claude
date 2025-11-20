# 🔧 Discord Bot Setup Guide

Complete step-by-step guide to create and configure your Discord bot.

## 📋 Table of Contents

1. [Creating the Discord Bot](#creating-the-discord-bot)
2. [Getting Your Bot Token](#getting-your-bot-token)
3. [Configuring Bot Permissions](#configuring-bot-permissions)
4. [Inviting Bot to Your Server](#inviting-bot-to-your-server)
5. [Optional: Spotify Integration](#optional-spotify-integration)
6. [Testing Your Configuration](#testing-your-configuration)

## 🤖 Creating the Discord Bot

### Step 1: Access Discord Developer Portal

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Log in with your Discord account
3. Click **"New Application"** button (top right)
4. Enter a name for your bot (e.g., "Seraphim Music Bot")
5. Click **"Create"**

### Step 2: Configure Application

1. You'll see your application's General Information page
2. **Optional**: Add a description and avatar for your bot
3. **Important**: Copy your **Application ID** (also called Client ID)
   - You'll need this for the `.env` file as `CLIENT_ID`

### Step 3: Create Bot User

1. In the left sidebar, click **"Bot"**
2. Click **"Add Bot"**
3. Confirm by clicking **"Yes, do it!"**
4. Your bot is now created!

## 🔑 Getting Your Bot Token

### Step 1: Reset and Copy Token

1. On the Bot page, find the **"TOKEN"** section
2. Click **"Reset Token"** (or **"Copy"** if this is your first time)
3. Confirm the reset if prompted
4. **Copy the token immediately** - you won't be able to see it again!

**⚠️ IMPORTANT**: Keep your token SECRET!
- Never share it publicly
- Never commit it to Git
- Never post it in Discord
- If exposed, reset it immediately

### Step 2: Save Token to .env File

1. Open your `.env` file (or create from `.env.example`)
2. Paste your token:

```env
DISCORD_TOKEN=your_token_here_it_will_be_long
CLIENT_ID=your_application_id_here
```

## 🔐 Configuring Bot Permissions

### Step 1: Enable Privileged Gateway Intents

The bot needs certain intents to function:

1. Still on the Bot page, scroll to **"Privileged Gateway Intents"**
2. Enable the following (toggle ON):
   - ❌ **PRESENCE INTENT** - Not required
   - ❌ **SERVER MEMBERS INTENT** - Not required
   - ✅ **MESSAGE CONTENT INTENT** - Enable this if you want prefix commands
3. Click **"Save Changes"**

**Note**: For this bot using slash commands only, you may not need MESSAGE CONTENT INTENT, but it's good to enable for future features.

### Step 2: Configure OAuth2 Settings

1. In the left sidebar, click **"OAuth2"** → **"URL Generator"**
2. Under **SCOPES**, select:
   - ✅ `bot`
   - ✅ `applications.commands`

3. Under **BOT PERMISSIONS**, select:
   - **General Permissions**:
     - ✅ Read Messages/View Channels
   - **Text Permissions**:
     - ✅ Send Messages
     - ✅ Send Messages in Threads
     - ✅ Embed Links
     - ✅ Attach Files
     - ✅ Read Message History
     - ✅ Add Reactions
     - ✅ Use Slash Commands
   - **Voice Permissions**:
     - ✅ Connect
     - ✅ Speak
     - ✅ Use Voice Activity

4. Copy the generated URL at the bottom

## 🎯 Inviting Bot to Your Server

### Step 1: Use Invite Link

1. Paste the OAuth2 URL from above into your browser
2. Select the server you want to add the bot to
3. Click **"Continue"**
4. Review permissions and click **"Authorize"**
5. Complete the captcha if prompted

### Step 2: Verify Bot Joined

1. Open Discord
2. Check your server's member list
3. You should see your bot (offline until you start it)

## 🎵 Optional: Spotify Integration

To enable Spotify link support:

### Step 1: Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account (free account works)
3. Click **"Create an App"**
4. Fill in:
   - **App name**: "Seraphim Music Bot" (or anything)
   - **App description**: "Discord music bot"
   - **Redirect URIs**: Leave empty
5. Accept terms and click **"Create"**

### Step 2: Get Credentials

1. You'll see your app's dashboard
2. Click **"Settings"** (top right)
3. You'll see:
   - **Client ID**: Copy this
   - **Client Secret**: Click "View client secret", then copy

### Step 3: Add to .env File

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

**Note**: These are NOT secret in the same way as your Discord token. They're safe to use client-side, but still keep them private.

## ✅ Testing Your Configuration

### Step 1: Create .env File

Your `.env` should look like this:

```env
# Required
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN_HERE_LONG_STRING
CLIENT_ID=YOUR_APPLICATION_CLIENT_ID_HERE

# Lavalink (defaults are fine)
LAVALINK_HOST=lavalink
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass

# Optional Spotify
SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID_HERE
SPOTIFY_CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET_HERE

# Bot settings (optional, these are defaults)
DEFAULT_VOLUME=50
MAX_QUEUE_SIZE=100
```

### Step 2: Test Locally (Development)

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev
```

You should see:

```
[INFO] Starting Seraphim Music Bot...
[INFO] Loaded 8 commands
[INFO] Registered event handlers
[INFO] Registering slash commands...
[INFO] Successfully registered slash commands
[INFO] Logged in as YourBotName#1234
[INFO] Ready to play music in 1 servers
[INFO] Lavalink node connected
```

### Step 3: Test Commands in Discord

1. Go to your Discord server
2. Bot should show as online (green status)
3. Type `/` and you should see your bot's commands
4. Try `/play never gonna give you up`
5. Bot should join your voice channel and play music!

## 🐛 Troubleshooting

### "An invalid token was provided"

- Your `DISCORD_TOKEN` is wrong
- Check for extra spaces or quotes
- Reset token in Developer Portal and update `.env`

### "Missing Access"

- Bot doesn't have permissions
- Re-invite bot with correct permissions URL
- Check server's role hierarchy

### Commands not showing

- Wait a few minutes (Discord caches commands)
- Bot needs `applications.commands` scope
- Check `CLIENT_ID` is correct
- Re-invite bot with updated scopes

### Bot joins voice but no sound

- Check you're in a voice channel
- Lavalink might not be running (if using Docker)
- Check Lavalink logs: `docker-compose logs lavalink`

### "DiscordAPIError: Missing Permissions"

- Bot role is too low in server hierarchy
- Drag bot's role higher in Server Settings → Roles
- Ensure bot has "Connect" and "Speak" permissions for the voice channel

### Spotify links not working

- Check `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are correct
- Restart bot after adding Spotify credentials
- Look for "Spotify support enabled" in logs

## 📋 Configuration Checklist

Before running the bot:

- [ ] Created Discord application
- [ ] Created bot user
- [ ] Copied bot token to `.env`
- [ ] Copied client ID to `.env`
- [ ] Enabled necessary intents
- [ ] Configured bot permissions
- [ ] Invited bot to server
- [ ] Bot shows in server member list
- [ ] (Optional) Set up Spotify credentials
- [ ] Created `.env` file with all values
- [ ] No quotes around values in `.env`
- [ ] No extra spaces in `.env`

## 🎓 Understanding Bot Permissions

### Why these permissions?

**Voice Permissions**:
- **Connect**: Join voice channels
- **Speak**: Play audio
- **Use Voice Activity**: Better audio quality

**Text Permissions**:
- **Send Messages**: Reply to commands
- **Embed Links**: Send rich embeds with song info
- **Read Message History**: See context (if needed)
- **Use Slash Commands**: Enable `/` commands

### Permission Integer

If you prefer a permission integer: `3148800`

This grants all necessary permissions for the music bot.

## 🔒 Security Best Practices

### Protect Your Token

```bash
# NEVER do this
git add .env

# Check .gitignore includes .env
cat .gitignore | grep .env
```

### If Token Leaked

1. Go to Discord Developer Portal
2. Bot → Reset Token
3. Update `.env` with new token
4. Restart bot
5. Change any passwords if needed

### Environment Variables

On production/Raspberry Pi:

```bash
# Don't make .env readable by others
chmod 600 .env

# Verify
ls -la .env
# Should show: -rw------- (only owner can read/write)
```

## 🚀 Next Steps

After setup:

1. ✅ Test all commands (`/play`, `/pause`, `/skip`, etc.)
2. ✅ Test with YouTube URL
3. ✅ Test with Spotify URL (if configured)
4. ✅ Test with playlist
5. ✅ Test button controls
6. ✅ Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
7. ✅ Read [README.md](./README.md) for full documentation

## 📚 Additional Resources

- [Discord Developer Documentation](https://discord.com/developers/docs)
- [Discord.js Guide](https://discordjs.guide/)
- [Spotify for Developers](https://developer.spotify.com/documentation/web-api)
- [OAuth2 Scopes Reference](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes)

## 🆘 Still Need Help?

If you encounter issues:

1. Double-check this guide
2. Review [README.md](./README.md) troubleshooting section
3. Check logs for error messages
4. Search GitHub issues
5. Create new issue with:
   - Error message (remove tokens!)
   - Steps you've taken
   - Bot configuration (remove sensitive values)

Happy bot building! 🎉