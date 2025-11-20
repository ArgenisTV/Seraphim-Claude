# Seraphim Music Bot - Commands Reference

Complete reference guide for all available commands in Seraphim Music Bot.

---

## Table of Contents

- [Command Overview](#command-overview)
- [Music Playback Commands](#music-playback-commands)
- [Queue Management Commands](#queue-management-commands)
- [Playback Control Commands](#playback-control-commands)
- [Information Commands](#information-commands)
- [Interactive Controls](#interactive-controls)
- [Command Permissions](#command-permissions)
- [Error Messages](#error-messages)
- [Tips & Best Practices](#tips--best-practices)

---

## Command Overview

### Available Commands

| Command | Description | Usage | Aliases |
|---------|-------------|-------|---------|
| `/play` | Play music from various sources | `/play <query/URL>` | - |
| `/pause` | Pause or resume playback | `/pause` | - |
| `/skip` | Skip to next track | `/skip` | - |
| `/stop` | Stop playback and clear queue | `/stop` | - |
| `/shuffle` | Shuffle the queue | `/shuffle` | - |
| `/queue` | Display current queue | `/queue` | - |
| `/nowplaying` | Show currently playing track | `/nowplaying` | `/np` |
| `/back` | Go to previous track | `/back` | - |

### Command Categories

**Music Playback:**
- `/play` - Primary command for playing music

**Playback Control:**
- `/pause` - Toggle pause/resume
- `/skip` - Skip current track
- `/stop` - Stop and disconnect

**Queue Management:**
- `/queue` - View queue
- `/shuffle` - Randomize queue order

**Information:**
- `/nowplaying` - Current track details

**Future/Disabled:**
- `/back` - Previous track (not implemented)

---

## Music Playback Commands

### `/play`

**Description:** Play music from YouTube, Spotify, Apple Music, Deezer, SoundCloud, Bandcamp, and more.

**Usage:**
```
/play <query or URL>
```

**Parameters:**
- `query` (required): Search query or direct URL

**Supported Input Types:**

**1. YouTube:**
```
# Search
/play never gonna give you up

# Direct URL
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Short URL
/play https://youtu.be/dQw4w9WgXcQ

# Playlist
/play https://www.youtube.com/playlist?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG
```

**2. Spotify** (requires Spotify credentials):
```
# Track
/play https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT

# Album
/play https://open.spotify.com/album/6kZ42qRrzov54LcAk4onW9

# Playlist
/play https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
```

**3. Apple Music:**
```
/play https://music.apple.com/us/album/...
```

**4. Deezer:**
```
/play https://www.deezer.com/track/...
```

**5. SoundCloud:**
```
/play https://soundcloud.com/artist/track
```

**6. Bandcamp:**
```
/play https://artist.bandcamp.com/track/song-name
```

**Behavior:**
- If queue is empty: Starts playback immediately
- If already playing: Adds to queue
- Joins your voice channel automatically
- Sends confirmation message with track/playlist info

**Requirements:**
- Must be in a voice channel
- Bot must have CONNECT and SPEAK permissions
- Cannot be used in DMs

**Examples:**

```
# Simple search
/play bohemian rhapsody

# Search with artist
/play queen bohemian rhapsody

# Playlist
/play https://www.youtube.com/playlist?list=...

# Spotify track (auto-converts to YouTube)
/play https://open.spotify.com/track/...
```

**Response:**

**Single Track:**
```
✧ Thy Request... is Worthy!
Attuning to: Never Gonna Give You Up
```

**Playlist:**
```
✧ Thy Request... is Worthy!
Attuning to playlist Best of 80s - 50 harmonies shall resonate through the cosmos.
```

**Error Responses:**

```
# Not in voice channel
⚠ The Divine Frequencies Falter
Thou must dwell within a voice channel to summon the celestial harmonies.

# No results
⚠ The Divine Frequencies Falter
The ethereal realm yielded no resonance for thy seeking.

# Missing permissions
⚠ The Divine Frequencies Falter
Seraphim lacks the divine authority to CONNECT and SPEAK in this sacred chamber.

# Invalid query
⚠ The Divine Frequencies Falter
The query whispers too softly to be heard. (< 1 character)

# Query too long
⚠ The Divine Frequencies Falter
The query resonates too powerfully - please shorten thy seeking. (> 500 characters)
```

---

## Playback Control Commands

### `/pause`

**Description:** Pauses currently playing music or resumes if already paused.

**Usage:**
```
/pause
```

**Parameters:** None

**Behavior:**
- If playing: Pauses playback
- If paused: Resumes playback
- Toggles between states

**Requirements:**
- Music must be playing
- Must be in same voice channel as bot

**Examples:**

```
# Pause music
User is in voice with bot, music playing
/pause
→ ⏸️ The vibrations rest...

# Resume music
Music is paused
/pause
→ ▶️ The harmonies flow anew!
```

**Error Responses:**

```
# No music playing
⚠ The Divine Frequencies Falter
No celestial harmonies resonate at this moment.

# Not in voice channel with bot
⚠ The Divine Frequencies Falter
Thou must share the sacred chamber with Seraphim.
```

---

### `/skip`

**Description:** Skips the currently playing track and moves to the next track in queue.

**Usage:**
```
/skip
```

**Parameters:** None

**Behavior:**
- Skips current track
- Plays next track in queue
- If queue is empty after skip, stops playback

**Requirements:**
- Music must be playing
- Must be in same voice channel as bot

**Examples:**

```
# Skip current track
/skip
→ ⏭️ Transcending to the next harmony...
```

**Error Responses:**

```
# No music playing
⚠ The Divine Frequencies Falter
No celestial harmonies resonate at this moment.

# Empty queue
⚠ The Divine Frequencies Falter
No further vibrations await in the celestial queue.

# Not in voice channel
⚠ The Divine Frequencies Falter
Thou must share the sacred chamber with Seraphim.
```

---

### `/stop`

**Description:** Stops music playback, clears the queue, and disconnects the bot from voice channel.

**Usage:**
```
/stop
```

**Parameters:** None

**Behavior:**
- Stops current playback
- Clears entire queue
- Disconnects from voice channel
- Cannot be undone

**Requirements:**
- Music must be playing
- Must be in same voice channel as bot

**Examples:**

```
# Stop and disconnect
/stop
→ *Slumbers...*
```

**Error Responses:**

```
# No music playing
⚠ The Divine Frequencies Falter
No celestial harmonies resonate at this moment.

# Not in voice channel
⚠ The Divine Frequencies Falter
Thou must share the sacred chamber with Seraphim.
```

---

## Queue Management Commands

### `/queue`

**Description:** Displays the current music queue with currently playing track and upcoming tracks.

**Usage:**
```
/queue
```

**Parameters:** None

**Behavior:**
- Shows currently playing track
- Shows up to 10 upcoming tracks
- Displays track duration
- Shows total number of tracks if > 10

**Requirements:**
- Music must be playing or queued

**Examples:**

```
# View queue
/queue

→ ✧ The Celestial Harmonies Await

Current Resonance:
Never Gonna Give You Up

Forthcoming Vibrations:
1. Bohemian Rhapsody - 5:55
2. Stairway to Heaven - 8:02
3. Hotel California - 6:30
...

And 47 more harmonies await...
```

**Error Responses:**

```
# Empty queue
⚠ The Divine Frequencies Falter
The celestial queue lays barren.

# No player
⚠ The Divine Frequencies Falter
No celestial harmonies resonate at this moment.
```

---

### `/shuffle`

**Description:** Randomly shuffles the order of tracks in the queue.

**Usage:**
```
/shuffle
```

**Parameters:** None

**Behavior:**
- Randomizes queue order
- Does NOT affect currently playing track
- Preserves all tracks in queue

**Requirements:**
- Queue must have at least 1 track
- Must be in same voice channel as bot

**Examples:**

```
# Shuffle queue
/shuffle
→ 🔀 The cosmic order has been rearranged... 10 harmonies shall flow in divine chaos.
```

**Error Responses:**

```
# Empty queue
⚠ The Divine Frequencies Falter
The celestial queue lays barren.

# No player
⚠ The Divine Frequencies Falter
No celestial harmonies resonate at this moment.

# Not in voice channel
⚠ The Divine Frequencies Falter
Thou must share the sacred chamber with Seraphim.
```

---

## Information Commands

### `/nowplaying`

**Description:** Shows detailed information about the currently playing track.

**Usage:**
```
/nowplaying
```

**Aliases:** `/np`

**Parameters:** None

**Behavior:**
- Displays track title and URL
- Shows artist/author
- Shows track duration
- Shows who requested the track
- Displays album artwork (if available)

**Requirements:**
- Music must be playing

**Examples:**

```
# View current track
/nowplaying

→ ✧ Resonating with Cosmic Vibrations

Never Gonna Give You Up
Divine Creator: Rick Astley
Duration: 3:33
Summoned by: @Username

[Album Artwork]
```

**Error Responses:**

```
# No music playing
⚠ The Divine Frequencies Falter
No celestial harmonies resonate at this moment.
```

---

### `/back`

**Description:** Attempts to play the previous track.

**Usage:**
```
/back
```

**Parameters:** None

**Status:** ⚠️ **NOT IMPLEMENTED**

**Current Behavior:**
- Returns error message explaining feature is not available
- Lavalink-client doesn't support track history by default
- Would require custom implementation

**Error Response:**

```
⚠ The Divine Frequencies Falter
The echoes of past vibrations are beyond mortal reach.
```

**Future Implementation:**
- Track playback history
- Maintain previous track list
- Allow going back multiple tracks

---

## Interactive Controls

### Now Playing Message Buttons

When a track starts playing, the bot sends an interactive message with control buttons:

**Button Layout:**
```
⏮️ Previous | ⏸️ Pause | ⏭️ Skip | 🔀 Shuffle | ⏹️ Stop
```

**Button Functions:**

**⏮️ Previous** (Disabled)
- Currently not functional
- Reserved for future implementation

**⏸️ Pause / ▶️ Resume**
- Pauses playback when playing
- Resumes playback when paused
- Button emoji changes based on state

**⏭️ Skip**
- Skips to next track in queue
- Disabled if queue is empty

**🔀 Shuffle**
- Randomizes queue order
- Disabled if queue has < 2 tracks

**⏹️ Stop**
- Stops playback
- Clears queue
- Disconnects bot

**Button Requirements:**
- Must be in same voice channel as bot
- Buttons work for any user in voice channel
- Buttons update automatically when state changes

---

## Command Permissions

### Required Discord Permissions

**For Users:**
- ✅ Use Application Commands (to see slash commands)
- ✅ Connect (to join voice channels)
- ✅ Speak (to hear music)

**For Bot:**
- ✅ Send Messages (to respond to commands)
- ✅ Embed Links (for rich embeds)
- ✅ Connect (to join voice channels)
- ✅ Speak (to play audio)
- ✅ Use Voice Activity (for audio transmission)

### Command Restrictions

**Guild-Only Commands** (Cannot be used in DMs):
- All music commands require guild context
- Using commands in DMs returns:
  ```
  ⚠ The Divine Frequencies Falter
  This divine command may only be invoked within the sacred halls of a server.
  ```

**Voice Channel Requirements:**
- User must be in a voice channel for `/play`
- User must be in SAME voice channel as bot for control commands

**Permission Checks:**
- Bot validates CONNECT and SPEAK permissions before joining
- Clear error messages if permissions are missing

---

## Error Messages

### Common Errors

**1. Not in Guild:**
```
⚠ The Divine Frequencies Falter
This divine command may only be invoked within the sacred halls of a server.
```

**2. Not in Voice Channel:**
```
⚠ The Divine Frequencies Falter
Thou must dwell within a voice channel to summon the celestial harmonies.
```

**3. Not in Same Voice Channel:**
```
⚠ The Divine Frequencies Falter
Thou must share the sacred chamber with Seraphim.
```

**4. Missing Bot Permissions:**
```
⚠ The Divine Frequencies Falter
Seraphim lacks the divine authority to CONNECT and SPEAK in this sacred chamber.
```

**5. No Music Playing:**
```
⚠ The Divine Frequencies Falter
No celestial harmonies resonate at this moment.
```

**6. Empty Queue:**
```
⚠ The Divine Frequencies Falter
The celestial queue lays barren.
```

**7. Invalid Query:**
```
⚠ The Divine Frequencies Falter
The query whispers too softly to be heard.
```

**8. Track Not Found:**
```
⚠ The Divine Frequencies Falter
The ethereal realm yielded no resonance for thy seeking.
```

**9. Track Playback Error:**
```
⚠️ Unable to play [Track Name] - skipping to next track.
```

### Error Recovery

**Automatic Source Fallback:**
When a track fails to play, the bot automatically:
1. Tries alternative YouTube search
2. Tries different search variations
3. Falls back to SoundCloud
4. Notifies user if all attempts fail

**Max Retry Attempts:** 2 per track

---

## Tips & Best Practices

### For Best Results

**Search Queries:**
- ✅ Include artist name: "queen bohemian rhapsody"
- ✅ Be specific: "official music video" or "live performance"
- ✅ Use quotation marks for exact match (not in Discord)
- ❌ Avoid very generic terms

**URLs:**
- ✅ Use direct URLs for specific tracks
- ✅ Spotify URLs work great (auto-converts to YouTube)
- ✅ Playlists are supported
- ❌ Age-restricted content may not work

**Queue Management:**
- `/shuffle` before playback for random order
- Check `/queue` to see what's coming up
- Use `/skip` instead of `/stop` to preserve queue
- Long queues work fine (100+ tracks)

**Voice Channels:**
- Ensure bot has permissions before inviting
- Bot can handle multiple servers simultaneously
- Bot auto-disconnects after 30 seconds of inactivity

### Performance Tips

**Large Playlists:**
- Bot handles large playlists efficiently
- May take a few seconds to load 100+ track playlists
- All tracks are queued immediately

**Connection Quality:**
- Bot uses MEDIUM audio quality by default
- Stable internet required for smooth playback
- Lavalink handles audio processing, reducing bot load

**Error Handling:**
- If track fails, bot automatically tries alternatives
- Problematic tracks are skipped automatically
- Check logs if issues persist

---

## Command Changelog

### Version 1.0.0
- ✅ All core commands implemented
- ✅ Multi-source playback support
- ✅ Automatic source fallback
- ✅ Interactive button controls
- ✅ Input validation and sanitization

### Future Additions
- 🔜 Volume control command
- 🔜 Seek/scrub command
- 🔜 Loop/repeat commands
- 🔜 Lyrics command
- 🔜 Saved playlists
- 🔜 DJ role restrictions
- 🔜 Vote skip system

---

## Getting Help

### Command Not Working?

**1. Check Requirements:**
- Are you in a voice channel?
- Does bot have proper permissions?
- Is the command used in a server (not DMs)?

**2. Check Bot Status:**
- Is bot online in Discord?
- Check bot logs: `docker-compose logs -f bot`
- Verify Lavalink is running

**3. Report Issues:**
- Include command used
- Include error message received
- Include bot version
- Open issue on GitHub

### Need More Help?

- Read full documentation: `README.md`
- Check troubleshooting: `DEPLOYMENT_READY.md`
- Ask in community Discord
- Open GitHub Discussion

---

**Happy Listening! 🎵**

Enjoy your music with Seraphim!

---

**Document Version:** 1.0
**Last Updated:** November 19, 2025
**Bot Version:** 1.0.0
