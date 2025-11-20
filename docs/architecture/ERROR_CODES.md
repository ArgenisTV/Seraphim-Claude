# Seraphim Music Bot - Error Codes Reference

Comprehensive reference guide for all error codes, messages, and troubleshooting steps.

---

## Table of Contents

- [Error Code Format](#error-code-format)
- [Error Categories](#error-categories)
- [Validation Errors](#validation-errors)
- [Permission Errors](#permission-errors)
- [Playback Errors](#playback-errors)
- [Network Errors](#network-errors)
- [System Errors](#system-errors)
- [Troubleshooting Guide](#troubleshooting-guide)

---

## Error Code Format

### Error Message Structure

Seraphim uses descriptive error messages rather than numeric error codes for better user experience.

**Format:**
```
[Error Type]
Error Message

Additional Context (if applicable)
```

**Example:**
```
⚠ The Divine Frequencies Falter
Thou must dwell within a voice channel to summon the celestial harmonies.
```

---

## Error Categories

### Category Overview

| Category | Prefix | Examples |
|----------|--------|----------|
| Validation | VAL | Invalid input, missing data |
| Permission | PERM | Missing permissions, access denied |
| Playback | PLAY | Track errors, queue issues |
| Network | NET | Connection failures, API errors |
| System | SYS | Internal errors, configuration |

---

## Validation Errors

### VAL-001: Guild Context Required

**Message:**
```
⚠ The Divine Frequencies Falter
This divine command may only be invoked within the sacred halls of a server.
```

**Cause:**
- Command used in Direct Messages (DMs)
- Command used outside of a Discord guild

**Solution:**
- Use the command in a Discord server
- Bot commands are guild-only

**Code Location:** `src/utils/guildValidation.ts`

**Prevention:**
- Commands automatically reject DM invocations
- No user action needed

---

### VAL-002: Voice Channel Required

**Message:**
```
⚠ The Divine Frequencies Falter
Thou must dwell within a voice channel to summon the celestial harmonies.
```

**Cause:**
- User is not in a voice channel
- Attempting to use `/play` or music commands

**Solution:**
1. Join a voice channel
2. Run the command again

**Code Location:** `src/commands/play.ts:54-59`

**Prevention:**
- Join voice channel before using music commands

---

### VAL-003: Same Voice Channel Required

**Message:**
```
⚠ The Divine Frequencies Falter
Thou must share the sacred chamber with Seraphim.
```

**Cause:**
- User is in different voice channel than bot
- Attempting to control playback from another channel

**Solution:**
1. Join the same voice channel as the bot
2. Or use `/stop` to disconnect bot, then `/play` from your channel

**Code Location:** `src/commands/pause.ts:40-46` (and other control commands)

**Commands Affected:**
- `/pause`
- `/skip`
- `/stop`
- `/shuffle`
- `/back`
- All button controls

**Prevention:**
- Stay in the same voice channel as the bot

---

### VAL-004: Invalid Query Format

**Message:**
```
⚠ The Divine Frequencies Falter
The query whispers too softly to be heard.
```

**Cause:**
- Query is empty or too short (< 1 character)
- Query contains only whitespace

**Solution:**
- Provide a valid search term or URL
- Minimum 1 character required

**Code Location:** `src/utils/queryValidation.ts:32-37`

**Example:**
```
# Invalid
/play

# Valid
/play  never gonna give you up
```

---

### VAL-005: Query Too Long

**Message:**
```
⚠ The Divine Frequencies Falter
The query resonates too powerfully - please shorten thy seeking.
```

**Cause:**
- Query exceeds 500 characters
- URL or search term too long

**Solution:**
- Shorten your search query
- Use shorter URL if possible

**Code Location:** `src/utils/queryValidation.ts:45-50`

**Limit:** 500 characters maximum

---

### VAL-006: Forbidden Characters

**Message:**
```
⚠ The Divine Frequencies Falter
The query contains forbidden void characters.
```

**Cause:**
- Query contains null bytes (`\0`)
- Potentially malicious input

**Solution:**
- Remove special characters from query
- Use standard text only

**Code Location:** `src/utils/queryValidation.ts:62-67`

**Sanitization:**
- Removes: `<`, `>`, `javascript:`, `data:`, `vbscript:`, `\0`

---

## Permission Errors

### PERM-001: Bot Missing Voice Permissions

**Message:**
```
⚠ The Divine Frequencies Falter
Seraphim lacks the divine authority to CONNECT in this sacred chamber.
```

or

```
⚠ The Divine Frequencies Falter
Seraphim lacks the divine authority to CONNECT and SPEAK in this sacred chamber.
```

**Cause:**
- Bot missing CONNECT permission in voice channel
- Bot missing SPEAK permission in voice channel
- Voice channel has permission overrides blocking bot

**Solution:**

**Option 1: Grant Permissions via Role**
1. Server Settings > Roles
2. Find bot's role
3. Enable: ✅ Connect, ✅ Speak

**Option 2: Grant Permissions for Specific Channel**
1. Right-click voice channel > Edit Channel
2. Permissions tab
3. Add bot role or @Seraphim
4. Enable: ✅ Connect, ✅ Speak

**Option 3: Move to Different Channel**
- Join a voice channel where bot has permissions

**Code Location:** `src/utils/voiceValidation.ts:23-46`

**Required Permissions:**
- ✅ CONNECT - Join voice channels
- ✅ SPEAK - Transmit audio

**Check Permissions:**
```typescript
const perms = channel.permissionsFor(bot);
console.log('Can Connect:', perms.has('Connect'));
console.log('Can Speak:', perms.has('Speak'));
```

---

### PERM-002: Bot Missing Text Permissions

**Symptom:**
- Bot joins voice but doesn't respond to commands
- No error messages appear

**Cause:**
- Bot missing Send Messages permission
- Bot missing Embed Links permission

**Solution:**
1. Server Settings > Roles > Bot Role
2. Enable: ✅ Send Messages, ✅ Embed Links, ✅ Use External Emojis

**Required Text Permissions:**
- ✅ Send Messages
- ✅ Embed Links
- ✅ Attach Files (for future features)
- ✅ Use External Emojis

---

## Playback Errors

### PLAY-001: No Active Player

**Message:**
```
⚠ The Divine Frequencies Falter
No celestial harmonies resonate at this moment.
```

**Cause:**
- No music playing or queued
- Player was destroyed
- Using control command without active player

**Solution:**
1. Use `/play` to start playing music
2. Then use control commands

**Code Location:** Multiple command files

**Commands Affected:**
- `/pause`, `/skip`, `/stop`, `/shuffle`, `/queue`, `/nowplaying`

---

### PLAY-002: Empty Queue

**Message:**
```
⚠ The Divine Frequencies Falter
The celestial queue lays barren.
```

or

```
⚠ The Divine Frequencies Falter
No further vibrations await in the celestial queue.
```

**Cause:**
- Queue is empty
- Attempting to skip with no tracks in queue
- Viewing empty queue

**Solution:**
- Add tracks with `/play`
- Queue will populate automatically

**Code Location:**
- `src/commands/skip.ts:31-37`
- `src/commands/shuffle.ts:31-37`
- `src/commands/queue.ts:21-27`

---

### PLAY-003: Track Search Failed

**Message:**
```
⚠ The Divine Frequencies Falter
The ethereal realm yielded no resonance for thy seeking.
```

**Cause:**
- No results found for search query
- Invalid URL
- Track unavailable or removed

**Solution:**
1. Try different search terms
2. Check if URL is valid and accessible
3. Try alternative source (Spotify → YouTube, etc.)

**Code Location:** `src/commands/play.ts:131-135`

**Debugging:**
- Check if track exists on platform
- Try searching directly on YouTube/Spotify
- Use different search terms

---

### PLAY-004: Track Playback Failed

**Message:**
```
⚠️ Unable to play [Track Name] - skipping to next track.
```

**Cause:**
- Track file unavailable
- Network error during streaming
- Track encoding incompatible
- Age-restricted content

**Solution:**
- Bot automatically tries alternative sources
- If all sources fail, track is skipped
- Next track plays automatically

**Automatic Recovery:**
1. Try YouTube search (artist + title)
2. Try YouTube search (title only)
3. Try original URL (if not YouTube)
4. Try SoundCloud search
5. If all fail: Skip and notify

**Code Location:** `src/events/lavalink.ts:56-74`

**Max Retries:** 2 attempts per track

---

### PLAY-005: Track Stuck

**Symptom:**
- Track starts but doesn't progress
- Playback position frozen
- No audio output

**Internal Handling:**
- `trackStuck` event fires
- Automatic source fallback initiated
- Track skipped if no alternative found

**User Notification:**
```
⚠️ Unable to play [Track Name] - skipping to next track.
```

**Code Location:** `src/events/lavalink.ts:36-54`

**Causes:**
- Network buffering issues
- Lavalink processing error
- Source stream interrupted

---

## Network Errors

### NET-001: Lavalink Connection Failed

**Symptom:**
- All commands fail
- Bot doesn't join voice
- Logs show connection errors

**Error in Logs:**
```
[ERROR] Lavalink node "seraphim-node" disconnected
[ERROR] Cannot connect to Lavalink
```

**Cause:**
- Lavalink server not running
- Wrong connection credentials
- Network connectivity issues

**Solution:**

**Docker Setup:**
```bash
# Check if Lavalink is running
docker-compose ps

# Should show:
# seraphim-lavalink   Up (healthy)

# If not running, start it
docker-compose up -d lavalink

# Check logs
docker-compose logs lavalink
```

**Local Setup:**
```bash
# Verify Lavalink process
ps aux | grep lavalink

# Check port
netstat -an | grep 2333

# Verify connection
curl http://localhost:2333/version
```

**Check Configuration:**
1. Verify `LAVALINK_PASSWORD` in `.env` matches `lavalink/application.yml`
2. Verify `LAVALINK_HOST` and `LAVALINK_PORT` are correct
3. Check Docker network connectivity

**Code Location:** `src/client/SeraphimClient.ts:39-59`

---

### NET-002: YouTube API Rate Limit

**Symptom:**
- YouTube searches fail
- All tracks fail with same error
- Works after some time

**Error in Logs:**
```
[ERROR] YouTube API quota exceeded
[ERROR] Rate limit reached
```

**Cause:**
- YouTube plugin hitting rate limits
- Too many requests in short time

**Solution:**
1. Wait 10-30 minutes
2. Use alternative sources (Spotify URLs)
3. Reduce search frequency

**Prevention:**
- Use direct URLs when possible
- Avoid rapid search requests
- Consider YouTube Data API key (advanced)

**Recovery:**
- Automatic fallback to SoundCloud
- Retry after cooldown period

---

### NET-003: Spotify API Error

**Symptom:**
- Spotify URLs don't work
- Error when using Spotify links

**Error in Logs:**
```
[ERROR] Spotify authentication failed
[WARN] Falling back to YouTube search
```

**Cause:**
- Spotify credentials invalid or missing
- Spotify API rate limit
- Network connectivity to Spotify API

**Solution:**

**If Spotify Credentials Not Set:**
- Bot automatically falls back to YouTube search using track metadata
- No user action needed

**If Spotify Credentials Invalid:**
1. Verify `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env`
2. Check credentials at https://developer.spotify.com/dashboard
3. Regenerate if needed
4. Restart bot

**Workaround:**
- Search for track name instead of using Spotify URL
- Bot will find YouTube version automatically

---

## System Errors

### SYS-001: Environment Configuration Error

**Error in Logs:**
```
[ERROR] Missing required environment variables: DISCORD_TOKEN
[ERROR] LAVALINK_PORT must be a valid port number (1-65535)
```

**Cause:**
- Missing `.env` file
- Missing required environment variables
- Invalid environment variable values

**Solution:**

1. **Create `.env` file:**
```bash
cp .env.example .env
```

2. **Set required variables:**
```env
DISCORD_TOKEN=your_token_here
CLIENT_ID=your_client_id_here
LAVALINK_PASSWORD=your_password_here
```

3. **Validate values:**
   - PORT: Must be 1-65535
   - VOLUME: Must be 0-100
   - Passwords: No restrictions

4. **Restart bot:**
```bash
docker-compose restart bot
```

**Code Location:** `src/index.ts:15-38`

**Validation Rules:**
```typescript
DISCORD_TOKEN: required, non-empty
CLIENT_ID: required, non-empty
LAVALINK_PASSWORD: required, non-empty
LAVALINK_PORT: optional, must be 1-65535 if set
DEFAULT_VOLUME: optional, must be 0-100 if set
```

---

### SYS-002: Memory Leak Detection

**Symptom:**
- Bot memory usage constantly increasing
- Performance degrades over time
- Eventual crash after hours/days

**Monitoring:**
```bash
# Check memory usage
docker stats seraphim-bot

# Watch over time
watch -n 5 docker stats --no-stream seraphim-bot
```

**Fixed Issues:**
- ✅ Now playing message Map cleaned up
- ✅ Retry tracking Map cleaned up on player destroy
- ✅ Event listeners properly removed

**If Still Occurring:**
1. Check logs for patterns
2. Monitor which guilds/commands trigger growth
3. Report issue with reproduction steps

**Code Location:**
- `src/handlers/nowPlayingHandler.ts:110-112`
- `src/utils/sourceFallback.ts:103-108`
- `src/events/lavalink.ts:97-105`

---

### SYS-003: Internal Error

**Message:**
```
⚠ The Divine Frequencies Falter
The cosmic forces have disrupted thy command.
```

**Cause:**
- Unexpected error during command execution
- Unhandled exception
- Bug in code

**Solution:**
1. Check bot logs for detailed error
2. Retry command
3. Report if issue persists

**Reporting:**
- Include command used
- Include error from logs
- Include steps to reproduce

**Code Location:** All command/handler try-catch blocks

---

## Troubleshooting Guide

### Quick Diagnostics

**1. Check Bot Status**
```bash
docker-compose ps

# Expected:
# seraphim-bot        Up
# seraphim-lavalink   Up (healthy)
```

**2. Check Logs**
```bash
# Bot logs
docker-compose logs --tail=50 bot

# Lavalink logs
docker-compose logs --tail=50 lavalink

# Follow logs in real-time
docker-compose logs -f
```

**3. Check Permissions**
```
In Discord:
1. Server Settings > Roles > @Seraphim
2. Verify permissions enabled
3. Check voice channel specific permissions
```

**4. Test Basic Functionality**
```
1. /play never gonna give you up
2. Join voice channel first
3. Check if bot responds and joins
```

---

### Common Issue Resolution

| Issue | Check | Fix |
|-------|-------|-----|
| Bot offline | Docker status | `docker-compose up -d` |
| Commands not working | Bot permissions | Grant required permissions |
| No audio | Voice permissions | Enable CONNECT + SPEAK |
| Can't join voice | User in channel? | Join voice channel first |
| Track won't play | Check logs | Usually auto-recovered with fallback |
| Lavalink error | Lavalink running? | `docker-compose restart lavalink` |

---

### Debug Mode

**Enable Detailed Logging:**

```env
# Add to .env
DEBUG=true
NODE_ENV=development
```

**Restart Bot:**
```bash
docker-compose restart bot
```

**View Debug Logs:**
```bash
docker-compose logs -f bot | grep DEBUG
```

---

### Getting Help

**Before Reporting:**
- [ ] Checked this error reference
- [ ] Checked bot logs
- [ ] Verified environment configuration
- [ ] Tried restarting services
- [ ] Tested with simple command

**When Reporting:**
1. Include error message (exact text)
2. Include relevant logs (last 50 lines)
3. Include command that triggered error
4. Include environment details (OS, Docker version)

**Where to Report:**
- GitHub Issues: Bug reports
- GitHub Discussions: Questions
- Community Discord: General help

---

## Error Code Summary

### By Severity

**Critical** (Bot cannot function):
- Missing environment variables
- Lavalink connection failed
- Invalid Discord token

**High** (Feature unavailable):
- Missing bot permissions
- YouTube rate limit
- Track playback failures

**Medium** (User error, recoverable):
- Invalid query format
- Wrong voice channel
- Empty queue

**Low** (Informational):
- No music playing
- Queue display when empty

---

## Changelog

### Version 1.0.0
- ✅ Comprehensive error handling implemented
- ✅ Automatic error recovery for playback failures
- ✅ User-friendly error messages
- ✅ Detailed logging for debugging

### Future Improvements
- 🔜 Error telemetry and analytics
- 🔜 Automatic error reporting
- 🔜 Enhanced recovery strategies
- 🔜 Error rate monitoring

---

**Document Version:** 1.0
**Last Updated:** November 19, 2025
**Bot Version:** 1.0.0

For additional help, see: [TROUBLESHOOTING.md](TROUBLESHOOTING.md) (when created)
