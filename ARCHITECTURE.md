# Seraphim Music Bot - Architecture Documentation

This document provides a comprehensive overview of the Seraphim Music Bot's architecture, design patterns, and system components.

---

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Technology Stack](#technology-stack)
- [External Dependencies](#external-dependencies)
- [Security Architecture](#security-architecture)
- [Scalability Considerations](#scalability-considerations)
- [Deployment Architecture](#deployment-architecture)

---

## System Overview

Seraphim is a Discord music bot built with TypeScript, Discord.js v14, and Lavalink v4. It provides high-quality music playback from multiple sources with advanced features like automatic source fallback, queue management, and interactive controls.

### Key Features

- **Multi-Source Playback**: YouTube, Spotify, Apple Music, Deezer, SoundCloud, Bandcamp
- **Automatic Failover**: Tries alternative sources when primary source fails
- **Interactive Controls**: Button-based playback controls in Discord
- **Queue Management**: Add, remove, shuffle, and view queued tracks
- **Production Ready**: Docker deployment with comprehensive error handling

---

## Architecture Diagram

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Discord Platform                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Server 1   │  │  Server 2   │  │  Server N   │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
└─────────┼─────────────────┼─────────────────┼────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                     WebSocket (Gateway)
                            │
          ┌─────────────────▼─────────────────┐
          │                                    │
          │      Seraphim Bot Container       │
          │  ┌──────────────────────────────┐ │
          │  │   Discord.js v14 Client      │ │
          │  │  ┌────────────────────────┐  │ │
          │  │  │  Command Handler       │  │ │
          │  │  │  Event Handler         │  │ │
          │  │  │  Button Handler        │  │ │
          │  │  └────────────────────────┘  │ │
          │  │                               │ │
          │  │  ┌────────────────────────┐  │ │
          │  │  │  Lavalink Client       │  │ │
          │  │  │  (Music Manager)       │  │ │
          │  │  └────────┬───────────────┘  │ │
          │  └───────────┼──────────────────┘ │
          └──────────────┼─────────────────────┘
                         │
                  HTTP + WebSocket
                         │
          ┌──────────────▼─────────────────────┐
          │                                    │
          │     Lavalink Audio Server         │
          │  ┌──────────────────────────────┐ │
          │  │   Audio Processing Engine    │ │
          │  │  ┌────────────────────────┐  │ │
          │  │  │  YouTube Plugin        │  │ │
          │  │  │  v1.16.0               │  │ │
          │  │  └────────────────────────┘  │ │
          │  │  ┌────────────────────────┐  │ │
          │  │  │  LavaSrc Plugin        │  │ │
          │  │  │  v4.2.0                │  │ │
          │  │  │  (Spotify/Apple/Deezer)│  │ │
          │  │  └────────────────────────┘  │ │
          │  └────────┬─────────────────────┘ │
          └───────────┼────────────────────────┘
                      │
               HTTPS Requests
                      │
          ┌───────────▼────────────────────────┐
          │      Music Source Platforms        │
          │  ┌────────┐  ┌────────┐  ┌──────┐ │
          │  │YouTube │  │Spotify │  │Apple │ │
          │  └────────┘  └────────┘  └──────┘ │
          │  ┌────────┐  ┌─────────┐  ┌─────┐ │
          │  │ Deezer │  │SndCloud │  │etc. │ │
          │  └────────┘  └─────────┘  └─────┘ │
          └─────────────────────────────────────┘
```

### Component Communication

```
Discord User Command
       │
       ├─> Discord API (WebSocket)
       │
       ├─> Seraphim Bot
       │     ├─> Command Handler
       │     │     ├─> Validation (guild, voice, query)
       │     │     └─> Command Execution
       │     │
       │     ├─> Lavalink Client
       │     │     ├─> HTTP (REST API)
       │     │     └─> WebSocket (Events)
       │     │
       │     └─> Event Handlers
       │           ├─> Track Start/End
       │           ├─> Error Handling
       │           └─> Source Fallback
       │
       ├─> Lavalink Server
       │     ├─> YouTube Plugin
       │     ├─> LavaSrc Plugin
       │     └─> Audio Processing
       │
       └─> Music Sources (YouTube, Spotify, etc.)
```

---

## Core Components

### 1. SeraphimClient (Bot Core)

**Location:** `src/client/SeraphimClient.ts`

**Responsibilities:**
- Extends Discord.js Client
- Manages Lavalink music manager
- Stores command collection
- Initializes all components

**Key Methods:**
- `constructor()` - Initializes Discord client with intents
- `createMusicManager()` - Creates and configures Lavalink manager
- `registerCommands()` - Loads all slash commands
- `registerEvents()` - Registers event handlers

**Configuration:**
```typescript
{
  intents: [
    Guilds,
    GuildVoiceStates,
    GuildMessages
  ],
  music: {
    nodes: [{
      authorization: LAVALINK_PASSWORD,
      host: 'lavalink',
      port: 2333
    }],
    playerOptions: {
      clientBasedPositionUpdateInterval: 1000,
      defaultSearchPlatform: 'ytsearch',
      onEmptyQueue: {
        destroyAfterMs: 30_000
      }
    }
  }
}
```

---

### 2. Command System

**Location:** `src/commands/`

**Architecture:**

```
Command Interface (Command.ts)
       │
       ├─> play.ts (Play Command)
       ├─> pause.ts (Pause Command)
       ├─> skip.ts (Skip Command)
       ├─> stop.ts (Stop Command)
       ├─> shuffle.ts (Shuffle Command)
       ├─> queue.ts (Queue Command)
       ├─> nowplaying.ts (Now Playing Command)
       └─> back.ts (Back Command)
```

**Command Structure:**
```typescript
interface Command {
  name: string;
  description: string;
  options?: CommandOption[];
  execute: (
    client: SeraphimClient,
    interaction: ChatInputCommandInteraction
  ) => Promise<void>;
}
```

**Execution Flow:**
1. User invokes slash command in Discord
2. Discord sends interaction to bot
3. `interactionCreate` event fires
4. Command handler looks up command by name
5. Validation checks (guild, voice, permissions)
6. Command execute method runs
7. Response sent to Discord

**Validation Layers:**
```
Command Invoked
     │
     ├─> Guild Context Validation (isInGuild)
     │     └─> Fail: "Command must be used in a server"
     │
     ├─> Voice Channel Validation
     │     └─> Fail: "Must be in a voice channel"
     │
     ├─> Permission Validation (checkVoicePermissions)
     │     └─> Fail: "Bot lacks CONNECT/SPEAK permissions"
     │
     ├─> Query Validation (for play command)
     │     └─> Fail: "Invalid query format"
     │
     └─> Execute Command Logic
```

---

### 3. Event System

**Location:** `src/events/`

**Event Handlers:**

**Discord Events (`src/events/interactionCreate.ts`, `src/events/ready.ts`):**
- `ready` - Bot initialization complete
- `interactionCreate` - Slash command or button interaction

**Lavalink Events (`src/events/lavalink.ts`):**
- `trackStart` - Track begins playing
- `trackEnd` - Track finishes playing
- `trackStuck` - Track playback stalled
- `trackError` - Track encountered error
- `queueEnd` - All tracks finished
- `playerMove` - Bot moved voice channels
- `playerDestroy` - Player cleanup

**Error Recovery Flow:**
```
Track Error/Stuck
     │
     ├─> Log Error Details
     │
     ├─> Try Alternative Source (tryAlternativeSource)
     │     │
     │     ├─> Build Search Queries
     │     │     ├─> ytsearch:author title
     │     │     ├─> ytsearch:title
     │     │     ├─> Original URL (if not YouTube)
     │     │     └─> scsearch:author title
     │     │
     │     ├─> Search Each Query
     │     │     └─> Found? Add to queue, skip current
     │     │
     │     └─> Not Found After Max Retries?
     │           └─> Notify User, Skip Track
     │
     └─> Continue Playback
```

---

### 4. Handler System

**Location:** `src/handlers/`

**Button Handler (`buttonHandler.ts`):**
- Handles music control button clicks
- Validates user permissions
- Executes player commands
- Manages error states

**Now Playing Handler (`nowPlayingHandler.ts`):**
- Creates/updates "now playing" messages
- Manages button component state
- Prevents message spam (updates instead of new messages)
- Cleans up on player destroy

**Button Flow:**
```
User Clicks Button
     │
     ├─> Validate Guild Context
     ├─> Validate Player Exists
     ├─> Validate User in Voice Channel
     │
     ├─> Execute Action:
     │     ├─> Previous (disabled)
     │     ├─> Pause/Resume
     │     ├─> Skip
     │     ├─> Shuffle
     │     └─> Stop
     │
     └─> Update Button State
```

---

### 5. Utility Modules

**Location:** `src/utils/`

**Modules:**

**1. `embeds.ts` - Message Formatting**
- `createNowPlayingEmbed()` - Current track display
- `createQueueEmbed()` - Queue visualization
- `createErrorEmbed()` - Error messages
- `createSuccessEmbed()` - Success messages
- `formatDuration()` - Time formatting

**2. `logger.ts` - Logging System**
- Structured logging with levels
- Color-coded console output
- Timestamps and context

**3. `voiceValidation.ts` - Permission Checks**
- `checkVoicePermissions()` - Validates CONNECT/SPEAK
- `getPermissionErrorMessage()` - Error formatting

**4. `guildValidation.ts` - Context Validation**
- `isInGuild()` - Ensures guild context
- `GUILD_ONLY_ERROR` - Standard error message

**5. `queryValidation.ts` - Input Validation**
- `validateQuery()` - Sanitizes user input
- `isURL()` - URL detection
- `validateMusicURL()` - Platform validation

**6. `sourceFallback.ts` - Failover Logic**
- `tryAlternativeSource()` - Find alternative tracks
- `buildAlternativeQueries()` - Search query generation
- `cleanupRetryTracking()` - Memory management

---

## Data Flow

### Music Playback Flow

```
1. User: /play never gonna give you up
   │
   ├─> Validation Layer
   │     ├─> Guild context ✓
   │     ├─> Voice channel ✓
   │     ├─> Permissions ✓
   │     └─> Query format ✓
   │
   ├─> Player Creation/Retrieval
   │     ├─> Existing player? Use it
   │     └─> New player? Create & connect
   │
   ├─> Search Phase
   │     ├─> Send query to Lavalink
   │     ├─> Lavalink queries YouTube Plugin
   │     ├─> Plugin searches YouTube API
   │     └─> Return track results
   │
   ├─> Queue Management
   │     ├─> Add track(s) to queue
   │     ├─> If not playing, start playback
   │     └─> If playing, queue for later
   │
   ├─> Playback Start (trackStart event)
   │     ├─> Update now playing message
   │     ├─> Display interactive buttons
   │     └─> Begin audio streaming
   │
   └─> Audio Streaming
         ├─> Lavalink streams audio
         ├─> Discord transmits to voice channel
         └─> Users hear music

2. Track Finishes (trackEnd event)
   │
   ├─> Queue has more tracks?
   │     └─> Yes: Play next track (goto step 1.6)
   │
   └─> No: Queue empty (queueEnd event)
         ├─> Send completion message
         └─> Destroy player after 30s
```

### Error Handling Flow

```
Track Error Occurs
   │
   ├─> Log Error (logger.error)
   │
   ├─> Attempt #1: Try Alternative Source
   │     ├─> Search ytsearch:artist title
   │     ├─> Found? ✓ Play alternative
   │     └─> Not found? Continue
   │
   ├─> Attempt #2: Try Alternative Source
   │     ├─> Search ytsearch:title only
   │     ├─> Found? ✓ Play alternative
   │     └─> Not found? Continue
   │
   ├─> Max Retries Reached
   │     ├─> Notify user (track failed message)
   │     ├─> Skip to next track
   │     └─> Clean up retry tracking
   │
   └─> Continue Playback
```

---

## Design Patterns

### 1. Command Pattern

**Commands are encapsulated as objects:**
```typescript
interface Command {
  name: string;
  description: string;
  execute: (client, interaction) => Promise<void>;
}
```

**Benefits:**
- Easy to add new commands
- Testable in isolation
- Consistent interface

### 2. Event-Driven Architecture

**All interactions are event-based:**
- Discord events (ready, interactionCreate)
- Lavalink events (trackStart, trackError)
- User interactions (buttons, commands)

**Benefits:**
- Loose coupling
- Scalable
- Easy to extend

### 3. Factory Pattern

**Client creation:**
```typescript
class SeraphimClient extends Client {
  private createMusicManager(): LavalinkManager {
    // Factory method creates configured manager
  }
}
```

### 4. Strategy Pattern

**Source fallback uses strategy pattern:**
```typescript
const strategies = [
  'ytsearch:author title',
  'ytsearch:title',
  'original URL',
  'scsearch:author title'
];

for (const strategy of strategies) {
  const result = await tryStrategy(strategy);
  if (result) return result;
}
```

### 5. Singleton Pattern

**Logger and message Maps:**
```typescript
// Single logger instance
export const logger = new Logger();

// Single message cache per module
const nowPlayingMessages = new Map<string, Message>();
```

---

## Technology Stack

### Runtime Environment
- **Node.js** v18+ - JavaScript runtime
- **TypeScript** v5.0+ - Type-safe JavaScript

### Core Libraries
- **Discord.js** v14 - Discord API wrapper
- **lavalink-client** v2.6.6 - Lavalink integration
- **dotenv** - Environment variable management

### Audio Infrastructure
- **Lavalink** v4 - Audio processing server
- **YouTube Plugin** v1.16.0 - YouTube playback
- **LavaSrc Plugin** v4.2.0 - Multi-source support

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## External Dependencies

### Discord Platform
- **Purpose:** Bot hosting and user interaction
- **Communication:** WebSocket (Gateway API)
- **Data:** Commands, events, voice states

### Lavalink Server
- **Purpose:** Audio processing and streaming
- **Communication:** HTTP + WebSocket
- **Port:** 2333 (internal Docker network)
- **Authentication:** Password-based

### Music Sources

**YouTube:**
- **Plugin:** youtube-plugin v1.16.0
- **Purpose:** Primary music source
- **Rate Limits:** YouTube API limits apply

**Spotify** (via LavaSrc):
- **Plugin:** lavasrc-plugin v4.2.0
- **Purpose:** Track resolution via ISRC
- **Fallback:** YouTube search
- **Authentication:** OAuth2 (optional)

**Apple Music** (via LavaSrc):
- **Purpose:** Track resolution
- **Fallback:** YouTube search
- **Authentication:** Not required

**Others:**
- SoundCloud, Deezer, Bandcamp
- All supported via LavaSrc or YouTube fallback

---

## Security Architecture

### 1. Credential Management

**Environment Variables:**
```
DISCORD_TOKEN - Bot authentication
CLIENT_ID - Discord application ID
LAVALINK_PASSWORD - Lavalink authentication
SPOTIFY_CLIENT_ID - Spotify OAuth (optional)
SPOTIFY_CLIENT_SECRET - Spotify OAuth (optional)
```

**Storage:**
- `.env` file (gitignored)
- Docker secrets (production)
- Never hardcoded

### 2. Input Validation

**Query Sanitization:**
- Remove XSS vectors (`<>`, `javascript:`, `data:`)
- Length limits (1-500 characters)
- Null byte detection

**Permission Validation:**
- Guild context required
- Voice channel membership
- Bot permissions (CONNECT, SPEAK)

### 3. Network Security

**Lavalink Access:**
- Internal Docker network only
- No public exposure
- Password authentication

**Discord Communication:**
- TLS/SSL encrypted
- WebSocket with authentication
- No data persistence

---

## Scalability Considerations

### Current Design

**Single Instance:**
- Handles ~100 guilds comfortably
- 2GB RAM recommended
- Single Lavalink node

**Limitations:**
- No horizontal scaling
- Single point of failure
- Stateful (in-memory queues)

### Future Scaling Options

**1. Sharding (Discord.js)**
```typescript
const client = new SeraphimClient({
  shards: 'auto',
  shardCount: 'auto'
});
```

**2. Multiple Lavalink Nodes**
```typescript
nodes: [
  { id: 'node-1', host: 'lavalink-1', port: 2333 },
  { id: 'node-2', host: 'lavalink-2', port: 2333 },
  { id: 'node-3', host: 'lavalink-3', port: 2333 }
]
```

**3. Redis for State Management**
- Shared queue state
- Distributed caching
- Session persistence

**4. Load Balancing**
- Multiple bot instances
- Nginx/HAProxy frontend
- Round-robin distribution

---

## Deployment Architecture

### Docker Compose Setup

**Services:**

```yaml
services:
  bot:
    - Node.js application
    - Connects to Lavalink
    - Restart policy: unless-stopped
    - Health check: process running

  lavalink:
    - Java application
    - Audio processing
    - Restart policy: unless-stopped
    - Health check: HTTP endpoint
```

**Network:**
- Internal bridge network
- Lavalink not exposed externally
- Bot reaches Discord via internet

**Volumes:**
- Plugin persistence
- Configuration files
- No data volumes (stateless)

---

## Performance Characteristics

### Memory Usage

**Bot Container:**
- Idle: 100-150 MB
- Active (5 guilds playing): 150-200 MB

**Lavalink Container:**
- Idle: 500-800 MB
- Active (5 streams): 1-1.5 GB

### CPU Usage

**Bot Container:**
- Idle: <5%
- Active: 5-15%

**Lavalink Container:**
- Idle: <5%
- Active: 10-30% (per stream)

### Network

**Bandwidth (per stream):**
- YouTube: 128-256 kbps
- Total: Varies by quality and source

---

## Monitoring & Observability

### Logging

**Levels:**
- ERROR: Critical failures
- WARN: Recoverable issues
- INFO: Normal operations
- DEBUG: Detailed diagnostics

**Locations:**
- Console (Docker logs)
- Can be extended to file/service

### Health Checks

**Docker Health Checks:**
```bash
# Bot
test: ps aux | grep node

# Lavalink
test: wget --spider http://localhost:2333/version
```

### Metrics (Future)

- Command usage statistics
- Error rates
- Playback uptime
- Source fallback success rate

---

## Future Architecture Improvements

### 1. Database Integration
- Persistent playlists
- User preferences
- Play history
- Guild settings

### 2. Caching Layer
- Track metadata cache
- Search result cache
- Reduces API calls

### 3. Message Queue
- RabbitMQ/Redis
- Async command processing
- Better load distribution

### 4. Metrics & Monitoring
- Prometheus metrics
- Grafana dashboards
- Alert system

### 5. API Gateway
- REST API for external integrations
- Webhook support
- Web dashboard

---

## Architecture Decision Records

### ADR-001: Discord.js vs Other Libraries
**Decision:** Use Discord.js v14
**Rationale:**
- Most mature Discord library for Node.js
- Active community and support
- Excellent TypeScript support
- Regular updates for Discord API changes

### ADR-002: Lavalink for Audio Processing
**Decision:** Use Lavalink v4 instead of native voice
**Rationale:**
- Offloads audio processing from bot
- Better performance and quality
- Supports multiple sources via plugins
- Industry standard for Discord music bots

### ADR-003: TypeScript with Strict Mode
**Decision:** Use TypeScript in strict mode
**Rationale:**
- Type safety prevents runtime errors
- Better IDE support
- Easier refactoring
- Self-documenting code

### ADR-004: Docker for Deployment
**Decision:** Use Docker Compose for deployment
**Rationale:**
- Consistent environment across systems
- Easy setup and deployment
- Service orchestration
- Resource isolation

### ADR-005: Automatic Source Fallback
**Decision:** Implement automatic source fallback with retry limit
**Rationale:**
- Improves playback reliability
- Better user experience
- Prevents infinite loops with retry limits
- Leverages multiple music sources

---

## Conclusion

The Seraphim Music Bot architecture prioritizes:
- **Reliability** - Automatic failover and error recovery
- **Maintainability** - Clean separation of concerns
- **Scalability** - Ready for future horizontal scaling
- **Security** - Input validation and secure credential management
- **Performance** - Efficient resource usage

The modular design allows for easy extension and modification while maintaining code quality and stability.

---

**Document Version:** 1.0
**Last Updated:** November 19, 2025
**Maintained By:** Seraphim Development Team
