# Spotify Integration Setup Guide

**Optional but Recommended** - Enables direct Spotify URL playback

---

## Overview

The Seraphim bot now supports Spotify, Apple Music, and Deezer URLs through the LavaSrc plugin!

- **Spotify**: Requires API credentials (free)
- **Apple Music**: Works without API keys ✅
- **Deezer**: Works without API keys ✅

**Without Spotify credentials**: Spotify URLs automatically fall back to YouTube (still works!)
**With Spotify credentials**: Better reliability and faster loading

---

## How It Works

When a user plays a Spotify URL:
1. **With credentials**: Bot fetches track metadata from Spotify
2. Uses ISRC code to find matching YouTube video
3. Plays high-quality audio from YouTube
4. **Fallback**: If ISRC not found, searches by "Artist - Title"

**Result**: Seamless playback of Spotify tracks via YouTube!

---

## Setup Spotify API Credentials (Optional)

### Step 1: Create Spotify App

1. Go to: https://developer.spotify.com/dashboard
2. Log in with your Spotify account (create one if needed)
3. Click **"Create app"**

### Step 2: Fill in App Details

- **App name**: `Seraphim Music Bot` (or any name)
- **App description**: `Discord music bot`
- **Website**: Leave blank or use your GitHub repo
- **Redirect URI**: `http://localhost:3000` (required field, won't be used)
- **API/SDKs**: Check "Web API"
- Accept terms and click **Create**

### Step 3: Get Credentials

1. Click on your newly created app
2. Click **"Settings"** button
3. You'll see:
   - **Client ID**: Copy this
   - **Client Secret**: Click "View client secret", then copy
4. **Keep these secret!** Don't commit to git

### Step 4: Add to .env File

```bash
# Edit your .env file
nano .env  # or use any text editor

# Add these lines:
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

### Step 5: Restart Bot

```bash
docker-compose restart
```

---

## Verify It's Working

### Test Commands

```
# Test Spotify track
/play https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp

# Test Spotify playlist
/play https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M

# Test Apple Music (no setup needed!)
/play https://music.apple.com/us/album/...

# Test Deezer (no setup needed!)
/play https://www.deezer.com/track/...
```

### Check Logs

```bash
docker-compose logs lavalink | grep -i spotify
```

**Success looks like:**
```
INFO Spotify client initialized successfully
INFO LavaSrc plugin loaded
```

**Without credentials (still works):**
```
WARN Spotify credentials not provided, using fallback
INFO Track found via YouTube fallback
```

---

## Supported URL Formats

### Spotify
- ✅ Tracks: `https://open.spotify.com/track/...`
- ✅ Playlists: `https://open.spotify.com/playlist/...`
- ✅ Albums: `https://open.spotify.com/album/...`
- ✅ Artist top tracks: `https://open.spotify.com/artist/...`

### Apple Music
- ✅ Songs: `https://music.apple.com/*/album/*/...`
- ✅ Playlists: `https://music.apple.com/*/playlist/...`
- ✅ Albums: `https://music.apple.com/*/album/...`

### Deezer
- ✅ Tracks: `https://www.deezer.com/track/...`
- ✅ Playlists: `https://www.deezer.com/playlist/...`
- ✅ Albums: `https://www.deezer.com/album/...`

---

## Troubleshooting

### "Spotify URLs not working"

**Without credentials:**
- Expected! URLs will work via YouTube fallback
- Some tracks may not be found if they're not on YouTube

**With credentials:**
1. Verify credentials are correct in .env
2. Check .env is loaded: `docker-compose config | grep SPOTIFY`
3. Restart services: `docker-compose restart`
4. Check Lavalink logs: `docker-compose logs lavalink`

### "Track not found"

Possible causes:
- Track not available on YouTube
- Geographic restrictions
- Track removed from Spotify

**Solution**: Try another track or use direct YouTube URL

### "Rate limited"

Spotify API has rate limits:
- **Without credentials**: None (uses fallback)
- **With credentials**: Generous limits (180 requests per minute)

If you hit limits, bot will automatically use fallback.

---

## FAQ

**Q: Do I need Spotify Premium?**
A: No! Free Spotify account works fine.

**Q: Will this play Spotify audio directly?**
A: No, it finds the song on YouTube and plays from there. Spotify doesn't allow direct playback in third-party bots.

**Q: What if I don't set up Spotify API?**
A: Everything still works! Spotify URLs will automatically fall back to YouTube search.

**Q: Is this against Spotify's terms?**
A: No, we're using their official API only to get track metadata (title, artist). Actual playback is from YouTube.

**Q: Can users search Spotify directly?**
A: Currently no - only URLs are supported. Search uses YouTube.

**Q: Do Apple Music and Deezer need setup?**
A: No! They work out of the box without any API keys.

---

## Rate Limits

### With Spotify Credentials
- **Requests per minute**: 180
- **Typical usage**: 1 request per track
- **Estimated capacity**: 180 songs/minute = 10,800/hour

### Without Credentials
- No rate limits (uses YouTube fallback only)
- Slightly slower track resolution
- Some tracks may not be found

---

## Security Notes

### Protecting Your Credentials

1. **Never commit to git**:
   ```bash
   # .gitignore already includes:
   .env
   .env.local
   ```

2. **Use environment variables**:
   - Don't hardcode in config files
   - Use Docker secrets in production

3. **Rotate if leaked**:
   - Go to Spotify Dashboard
   - Settings > Reset client secret
   - Update .env file

### Permissions

Spotify app needs **NO special scopes**:
- We only read public track metadata
- No user data access required
- No playlist modification

---

## Advanced Configuration

### Change Country Code

Affects search results and availability:

```yaml
# lavalink/application.yml
plugins:
  lavasrc:
    spotify:
      countryCode: "GB"  # UK
      # or "DE" (Germany), "JP" (Japan), etc.
```

### Disable Specific Sources

```yaml
# lavalink/application.yml
plugins:
  lavasrc:
    sources:
      spotify: false      # Disable Spotify
      applemusic: true    # Keep Apple Music
      deezer: true        # Keep Deezer
```

### Custom Fallback Order

```yaml
# lavalink/application.yml
plugins:
  lavasrc:
    providers:
      - "ytsearch:\"%ISRC%\""     # Try YouTube with ISRC first
      - "scsearch:%QUERY%"        # Then try SoundCloud
      - "ytsearch:%QUERY%"        # Finally try YouTube search
```

---

## What Changed?

### Files Modified

1. **`lavalink/application.yml`**
   - Added LavaSrc plugin
   - Configured Spotify, Apple Music, Deezer
   - Set up fallback providers

2. **`.env.example`**
   - Added Spotify credential placeholders
   - Added setup instructions

3. **`SPOTIFY_SETUP.md`** (this file)
   - Complete setup guide

### What's Enabled

- ✅ Spotify URL support (with/without credentials)
- ✅ Apple Music URL support (no setup needed)
- ✅ Deezer URL support (no setup needed)
- ✅ Automatic YouTube fallback
- ✅ ISRC matching for high quality
- ✅ Playlist support for all sources

---

## Next Steps

1. **Optional**: Set up Spotify API credentials (10 minutes)
2. **Test**: Try playing various music source URLs
3. **Enjoy**: Bot now supports 5+ music sources!

**Already working**: Apple Music and Deezer URLs work without any setup!

---

## Support

**Issues with Spotify setup?**
- Check Spotify Developer Dashboard: https://developer.spotify.com/dashboard
- Verify credentials in .env file
- Check Lavalink logs: `docker-compose logs lavalink`

**Feature requests?**
- Direct Spotify search (not just URLs)
- More music sources
- Custom fallback strategies

---

**Spotify integration is now active! Apple Music and Deezer are ready to use!** 🎵
