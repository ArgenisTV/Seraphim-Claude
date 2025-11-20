# DOCUMENTATION IMPLEMENTATION GUIDE
## Ready-to-Use Templates and Checklists

**Purpose:** Provide copy-paste ready templates for implementing documentation improvements
**Target Audience:** Developers adding documentation to the project
**Last Updated:** November 19, 2025

---

## TABLE OF CONTENTS

1. [JSDoc Templates](#jsDoc-templates)
2. [Command Documentation Template](#command-documentation-template)
3. [Contributing Guidelines Template](#contributing-guidelines-template)
4. [Architecture Documentation Template](#architecture-documentation-template)
5. [Code Comment Examples](#code-comment-examples)
6. [Implementation Checklists](#implementation-checklists)
7. [File Structure Template](#file-structure-template)

---

## JSOC TEMPLATES

### Template 1: Function Documentation

```typescript
/**
 * Brief one-line description of what this function does.
 *
 * Longer description explaining why this function exists, what problem it solves,
 * and any important context. Include design decisions or rationale here.
 *
 * @param paramName - Description of the parameter, including valid values
 * @param anotherParam - Another parameter with its description
 * @returns Description of what the function returns and its significance
 * @throws {ErrorType} Description of when/why this error is thrown
 * @example
 * // Example usage showing how to call this function
 * const result = functionName(value1, value2);
 * console.log(result); // Expected output: some value
 *
 * @see {@link relatedFunction} for related functionality
 */
export async function functionName(
  paramName: ParamType,
  anotherParam: AnotherType
): Promise<ReturnType> {
  // Implementation
}
```

### Template 2: Class Documentation

```typescript
/**
 * Main orchestrator for the Discord music bot.
 *
 * Manages:
 * - Command registration and execution
 * - Event handling
 * - Lavalink music player connection
 * - Player lifecycle
 *
 * @example
 * const client = new SeraphimClient();
 * await client.start();
 *
 * @see {@link Command} for command structure
 * @see {@link LavalinkManager} for music playback
 */
export class SeraphimClient extends Client {
  public commands: Collection<string, Command>;
  public music: LavalinkManager;

  constructor() {
    // ...
  }
}
```

### Template 3: Interface/Type Documentation

```typescript
/**
 * Represents a Discord slash command.
 *
 * Each command in the bot must implement this interface to be
 * properly registered and executed.
 *
 * @example
 * ```typescript
 * const playCommand: Command = {
 *   name: 'play',
 *   description: 'Play a song',
 *   options: [{...}],
 *   async execute(client, interaction) {
 *     // Command logic
 *   }
 * };
 * ```
 */
export interface Command {
  /** Name of the command (lowercase, no spaces) */
  name: string;

  /** User-facing description of what the command does */
  description: string;

  /** Command parameters/options */
  options?: CommandOption[];

  /** Function that executes when command is used */
  execute: (
    client: SeraphimClient,
    interaction: ChatInputCommandInteraction
  ) => Promise<void>;
}
```

### Template 4: Enum Documentation

```typescript
/**
 * Log levels for the logging system.
 *
 * Used to categorize and filter log messages during development
 * and production monitoring.
 */
enum LogLevel {
  /** Informational messages about normal operation */
  INFO = 'INFO',

  /** Warning messages about potential issues */
  WARN = 'WARN',

  /** Error messages about failures */
  ERROR = 'ERROR',

  /** Debug messages (only shown when DEBUG=true) */
  DEBUG = 'DEBUG',
}
```

---

## COMMAND DOCUMENTATION TEMPLATE

### Copy This For Each Command in COMMANDS.md

```markdown
## /commandname <required-param> [optional-param]

### Description
Brief one-sentence description of what this command does.

Longer explanation if needed, including context about when to use it
and any important behaviors users should know about.

### Syntax

\`\`\`bash
/commandname <required-param> [optional-param]
\`\`\`

### Parameters

#### required-param (required)
- **Type:** string/integer/boolean
- **Description:** What this parameter does and what it accepts
- **Valid values:** Examples of valid input
- **Examples:**
  - `never gonna give you up` (search term)
  - `https://www.youtube.com/watch?v=...` (URL)

#### optional-param (optional, default: default-value)
- **Type:** Type of parameter
- **Description:** What this parameter does
- **Valid values:** Examples
- **When to use:** When would you set this?

### Return Messages

#### Success
When the command completes successfully:
\`\`\`
"Attuning to: Song Name"
\`\`\`

#### Queued
When the item is added to queue (already playing):
\`\`\`
"Attuning to: Song Name
This harmony shall join the celestial queue."
\`\`\`

#### Error: Not in Voice Channel
When user tries to use command without joining voice:
\`\`\`
"Thou must dwell within a voice channel to summon the celestial harmonies."
\`\`\`

#### Error: No Results
When search yields no results:
\`\`\`
"The ethereal realm yielded no resonance for thy seeking."
\`\`\`

### Permission Requirements

**Bot Permissions Required:**
- CONNECT (join voice channel)
- SPEAK (play audio)

**User Requirements:**
- Must be in a voice channel
- Must not be deafened (for some commands)

**Channel Type:** Voice channels only

### Behavior

- **What happens if already playing:** [Explain]
- **What happens if queue is full:** [Explain]
- **What happens if track is unavailable:** [Explain]
- **Queue behavior:** [Is item added? Where? When does it play?]

### Examples

### Example 1: Basic Search
\`\`\`bash
/play never gonna give you up
\`\`\`

User is in a voice channel with no music playing.
Bot searches YouTube for "never gonna give you up" and plays first result.
Response: "Attuning to: Rick Astley - Never Gonna Give You Up"

### Example 2: Direct YouTube URL
\`\`\`bash
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
\`\`\`

User is in a voice channel.
Bot plays the specific YouTube video.
Response: "Attuning to: Rick Astley - Never Gonna Give You Up"

### Example 3: Spotify URL
\`\`\`bash
/play https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqLv
\`\`\`

Bot searches YouTube for the Spotify track and plays similar version.
Response: "Attuning to: [Track Name]"

### Example 4: Adding to Queue
\`\`\`bash
/play song 2
\`\`\`

Music is already playing.
Bot adds the song to the queue.
Response: "Attuning to: Song Name\nThis harmony shall join the celestial queue."

### Related Commands
- [/pause](/commands#pause) - Pause current playback
- [/skip](/commands#skip) - Skip to next track
- [/queue](/commands#queue) - View current queue
- [/nowplaying](/commands#nowplaying) - See what's playing

### Errors and Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Thou must dwell within a voice channel..." | User not in voice channel | Join a voice channel first |
| "ethereal realm yielded no resonance" | No search results | Try different search terms |
| "cosmic forces have disrupted" | Lavalink/network error | Wait a moment and try again |
| "Missing Permissions" | Bot can't speak in channel | Check bot permissions in server settings |

### Implementation Details

**Search Platform:** By default, uses YouTube search (prefix: `ytsearch:`)
**Search Timeout:** [X seconds]
**Max Queue Size:** 100 tracks (configurable)
**Volume:** Starts at DEFAULT_VOLUME setting

### Limitations

- Cannot play local files
- Some regions block certain content
- Spotify plays YouTube matches (not exact tracks)
- Playlist size limited by Lavalink configuration

### Related Features

- **Playlist Support:** Automatically detected from URL
- **Search Operators:** Can use `ytsearch:`, `scsearch:`, `spsearch:` prefixes
- **Query Types:** Song name, artist name, album, URL

---
```

---

## CONTRIBUTING GUIDELINES TEMPLATE

### Copy to: CONTRIBUTING.md

```markdown
# Contributing to Seraphim-Claude

First off, thank you for considering contributing to Seraphim-Claude! It's people like you that make this such a great music bot.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [maintainers].

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem** in as many details as possible
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (OS, Node.js version, Discord.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title** for the issue that identifies the suggestion
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior** and **explain the expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required PR template
* Follow the [TypeScript](#typescript-styleguide) styleguide
* Document new code with JSDoc comments
* Add tests for new features
* Update documentation for changes
* End all files with a newline
* Use present tense ("Add feature" not "Added feature")
* Use imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

## Getting Started

### Prerequisites

* Node.js 18.0.0 or higher
* npm or yarn
* Docker (optional, for Lavalink)
* A Discord bot token from Discord Developer Portal

### Local Development Setup

1. **Fork the repository**
   \`\`\`bash
   # On GitHub, click "Fork"
   \`\`\`

2. **Clone your fork**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/Seraphim-Claude.git
   cd Seraphim-Claude
   \`\`\`

3. **Add upstream remote**
   \`\`\`bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/Seraphim-Claude.git
   \`\`\`

4. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

5. **Create environment file**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your test bot token
   \`\`\`

6. **Start Lavalink (optional, needed for testing music)**
   \`\`\`bash
   docker-compose up -d lavalink
   \`\`\`

7. **Run in development mode**
   \`\`\`bash
   npm run dev
   \`\`\`

8. **Create test Discord server** (if not already done)
   - Create a new server on Discord
   - Invite your bot with these scopes and permissions
   - Test commands in the #general channel

### Development Workflow

1. **Create feature branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/your-bug-fix
   \`\`\`

2. **Make your changes**
   - Write code following the style guide
   - Add JSDoc comments to new functions
   - Add inline comments for complex logic
   - Write tests for new features

3. **Test your changes**
   \`\`\`bash
   npm run lint
   npm run format
   npm run test
   \`\`\`

4. **Commit your changes**
   \`\`\`bash
   git commit -m "type(scope): description"
   # Examples:
   # git commit -m "feat(play): add shuffle to queue"
   # git commit -m "fix(lavalink): handle connection timeout"
   # git commit -m "docs(readme): add performance tips"
   \`\`\`

5. **Keep in sync with main**
   \`\`\`bash
   git fetch upstream
   git rebase upstream/main
   \`\`\`

6. **Push to your fork**
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

7. **Open a Pull Request**
   - Go to GitHub and create PR from your fork
   - Fill in the PR template completely
   - Link any related issues
   - Wait for review and address feedback

## Styleguides

### Git Commit Messages

* Use the format: `type(scope): subject`
* Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
* Scope: The part of code affected (e.g., `play`, `lavalink`, `commands`)
* Subject: Clear description in imperative mood (lowercase, no period)

Examples:
\`\`\`
feat(play): add queue shuffle functionality
fix(lavalink): handle reconnection timeout
docs(readme): improve quick start section
refactor(client): simplify music manager initialization
test(commands): add unit tests for /skip command
\`\`\`

### TypeScript Styleguide

* Use TypeScript for all new code
* 2 spaces for indentation
* Use semicolons
* Use single quotes (except for strings containing single quotes)
* Maximum line length: 100 characters
* Follow naming conventions:
  - Classes: PascalCase
  - Functions/methods: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Interfaces: PascalCase
  - Private members: _camelCase prefix

### Documentation Styleguide

* Use Markdown for all documentation
* Reference functions and modules using backticks: \`functionName\`
* Keep line length to 100 characters in documentation files
* Start files with a heading: \`# File Title\`
* Use code blocks with language specification:
  \`\`\`typescript
  // code here
  \`\`\`

## Additional Notes

### Issue and Pull Request Labels

* \`bug\` - Something isn't working
* \`enhancement\` - New feature or request
* \`documentation\` - Improvements or additions to documentation
* \`good first issue\` - Good for newcomers
* \`help wanted\` - Extra attention is needed
* \`question\` - Further information is requested
* \`wontfix\` - This will not be worked on

## Questions?

Don't hesitate to ask questions! You can:

* Open a GitHub Discussion
* Create an issue with the \`question\` label
* Contact maintainers

Thank you for contributing! 🎉

---
```

---

## ARCHITECTURE DOCUMENTATION TEMPLATE

### Copy to: docs/ARCHITECTURE.md

```markdown
# System Architecture

## Overview

Seraphim-Claude is a Discord music bot that streams audio from YouTube, Spotify, and SoundCloud into Discord voice channels. It uses [Lavalink](https://lavalink.dev/) as a standalone audio server for reliable music streaming.

### Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Discord Bot (Node.js)                     │
│              Seraphim-Claude Music Bot                       │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
         ┌──────────────────┐  ┌────────────────┐
         │  Discord API     │  │  Lavalink      │
         │  (discord.js)    │  │  Audio Server  │
         └──────────────────┘  └────────────────┘
                    │                   │
                    │                   ▼
                    │          ┌────────────────┐
                    │          │  Audio Sources │
                    │          │  - YouTube     │
                    │          │  - Spotify     │
                    │          │  - SoundCloud  │
                    │          └────────────────┘
                    │
                    ▼
         ┌──────────────────┐
         │   Discord Voice  │
         │   Channels       │
         └──────────────────┘
\`\`\`

## Component Architecture

### 1. SeraphimClient (Main Orchestrator)

**Location:** \`src/client/SeraphimClient.ts\`
**Responsibility:** Central manager for the entire bot

**Key Responsibilities:**
- Extend Discord.js Client with custom functionality
- Initialize and manage Lavalink music player
- Register and handle slash commands
- Set up event listeners
- Manage graceful shutdown

**Key Properties:**
- \`commands: Collection<string, Command>\` - Registered commands
- \`music: LavalinkManager\` - Lavalink connection manager

**Key Methods:**
- \`start(): Promise<void>\` - Initialize and login bot
- \`shutdown(): Promise<void>\` - Graceful shutdown
- \`registerSlashCommands(): Promise<void>\` - Register commands with Discord

### 2. Commands (Slash Command Handlers)

**Location:** \`src/commands/\`
**Responsibility:** Handle user commands

**Structure:**
\`\`\`typescript
export const commandName: Command = {
  name: 'commandname',
  description: 'What this does',
  options: [ /* parameters */ ],
  async execute(client, interaction) {
    // Handle command
  }
}
\`\`\`

**Available Commands:**
- \`play\` - Search and play songs
- \`pause\` - Pause/resume playback
- \`skip\` - Skip to next track
- \`back\` - Go to previous track
- \`queue\` - View current queue
- \`shuffle\` - Shuffle queue
- \`nowplaying\` - Show current track
- \`stop\` - Stop and disconnect

### 3. Events (Event Listeners)

**Location:** \`src/events/\`
**Responsibility:** React to Discord and Lavalink events

**Key Events:**
- \`ready\` - Bot logged in and ready
- \`interactionCreate\` - User used a slash command
- \`lavalink\` - Lavalink events (track start, queue end, etc.)

### 4. Handlers (Interaction Handlers)

**Location:** \`src/handlers/\`
**Responsibility:** Handle button interactions and special flows

**Key Handlers:**
- \`buttonHandler\` - Handle "Now Playing" message buttons
- \`nowPlayingHandler\` - Update "Now Playing" message

### 5. Utils (Shared Utilities)

**Location:** \`src/utils/\`
**Responsibility:** Shared helper functions

**Key Utilities:**
- \`logger\` - Structured logging
- \`embeds\` - Create Discord message embeds

### 6. Types (TypeScript Definitions)

**Location:** \`src/types/\`
**Responsibility:** Define interfaces and types

**Key Types:**
- \`Command\` - Slash command interface
- \`QueueTrack\` - Queued track data
- \`CommandOption\` - Command parameter definition

## Data Flow

### Playing a Song (/play command)

\`\`\`
1. User types: /play never gonna give you up

2. Discord sends interaction to bot

3. interactionCreate event fires
   └─> Looks up "play" command

4. play.execute() is called
   ├─> Checks user is in voice channel
   ├─> Gets or creates Lavalink player
   ├─> Connects to voice channel
   ├─> Searches Lavalink for tracks
   ├─> Adds first result to queue
   ├─> Starts playback
   └─> Sends success embed to Discord

5. Lavalink starts streaming audio to Discord voice channel

6. User hears music!
\`\`\`

### Handling Lavalink Events

\`\`\`
1. Lavalink: Track finished

2. lavalink event fires with "trackEnd" event

3. Player automatically plays next track from queue

4. nowPlayingHandler updates "Now Playing" message

5. User sees updated track info
\`\`\`

## Key Design Decisions

### Why Lavalink?

**Pros:**
- Standalone audio server (handles heavy lifting)
- Supports YouTube, Spotify, SoundCloud, etc.
- Reliable streaming without bot restarts
- Better performance than in-process audio

**Cons:**
- Requires separate Java process
- Additional deployment complexity
- Network dependency

**Alternatives Considered:**
- **erela.js** - Simpler but less reliable
- **discord.js voice** - Limited sources, poor quality
- **Hydra** - Closed source, proprietary

### Why lavalink-client?

**Pros:**
- Modern, well-maintained library
- Full TypeScript support
- Excellent error handling
- Active community

**Cons:**
- Newer than alternatives
- Smaller community than erela.js

**Alternatives Considered:**
- **erela.js** - More community but aging codebase
- **Shoukaku** - Good but less TypeScript support

### Why No Database?

Current implementation doesn't need database because:
- Queue stored in player memory
- No user preferences
- No playback history
- No user accounts

### Why No Permission System?

- Discord already has permission system (roles)
- All users can access same commands
- Future enhancement if needed

## Error Handling

### Error Types

1. **User Errors**
   - Not in voice channel
   - No search results
   - Invalid permissions
   - Command syntax errors

2. **System Errors**
   - Lavalink disconnected
   - Network timeout
   - Invalid tracks
   - Out of memory

3. **Discord Errors**
   - Bot missing permissions
   - Server not found
   - Rate limited

### Error Handling Strategy

\`\`\`
Command Execution
    │
    ├─> Try: Execute command logic
    │   │
    │   ├─> Success → Send success embed
    │   │
    │   └─> Error → Catch error
    │
    └─> Catch: Handle error gracefully
        ├─> Log error with context
        ├─> Send user-friendly message
        └─> Clean up partial state
\`\`\`

## Concurrency Model

- **Command Execution:** Sequential per guild (Lavalink limitation)
- **Queue Management:** Thread-safe (handled by Lavalink)
- **Event Processing:** Asynchronous, non-blocking
- **Playback:** Managed by Lavalink

## Known Limitations

1. **One Player Per Guild**
   - Can't have different playlists in different channels
   - Lavalink architectural limitation

2. **Queue Persistence**
   - Queue lost on bot restart
   - Could add database persistence in future

3. **Search Results**
   - Limited to first result by default
   - Could add result selection UI in future

4. **Spotify Playback**
   - Plays YouTube match (not exact track)
   - Spotify songs not directly playable in Discord

## Future Improvements

### Short Term
- [ ] Improve search UI (select from results)
- [ ] Add command aliases
- [ ] Better error messages

### Medium Term
- [ ] Queue persistence (database)
- [ ] User preferences
- [ ] Better Spotify matching

### Long Term
- [ ] Multiple audio sources
- [ ] Advanced filtering/effects
- [ ] Music recommendations
- [ ] User accounts and playlists

## Testing Strategy

### Unit Tests
- Logger functionality
- Utility functions
- Type definitions

### Integration Tests
- Command execution
- Lavalink interaction
- Event handling
- Error recovery

### End-to-End Tests
- Full song playback
- Queue management
- User interactions

---
```

---

## CODE COMMENT EXAMPLES

### Example 1: Complex Configuration

```typescript
private createMusicManager(): LavalinkManager {
  return new LavalinkManager({
    nodes: [
      {
        // Authentication with Lavalink server
        authorization: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
        host: process.env.LAVALINK_HOST || 'lavalink',
        port: parseInt(process.env.LAVALINK_PORT || '2333'),
        id: 'seraphim-node',

        // Retry strategy: try 5 times, wait 3 seconds between attempts
        // Helps handle temporary network issues and Lavalink startup delays
        retryAmount: 5,
        retryDelay: 3000,

        // Don't use HTTPS (Lavalink typically runs HTTP within network)
        secure: false,
      },
    ],

    // Discord.js shard communication
    // When Lavalink needs to update voice state, this sends it to the right shard
    sendToShard: (guildId, payload) => {
      const guild = this.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    },

    client: {
      id: process.env.CLIENT_ID!,
      username: 'Seraphim',
    },

    // Auto-skip tracks when they fail to load (e.g., video removed)
    autoSkip: true,

    playerOptions: {
      // Update position every 150ms for smooth progress bar
      clientBasedPositionUpdateInterval: 150,

      // Default search platform: YouTube
      // Can also use: 'scsearch' for SoundCloud, 'spsearch' for Spotify
      defaultSearchPlatform: 'ytsearch',

      // Reduce volume if multiple tracks play simultaneously (not common case)
      volumeDecrementer: 0.75,

      onDisconnect: {
        // Automatically reconnect if bot is kicked from voice channel
        autoReconnect: true,

        // Keep player in memory (don't destroy) so we can reconnect quickly
        destroyPlayer: false,
      },

      onEmptyQueue: {
        // Destroy player 5 minutes after queue becomes empty
        // Frees up memory while allowing quick restart if user adds songs
        destroyAfterMs: 300000, // 5 minutes in milliseconds
      },

      // Use unresolved track data from Lavalink
      // Reduces memory usage by not caching full track info
      useUnresolvedData: true,
    },
  });
}
```

### Example 2: Complex Conditional Logic

```typescript
// Handle search results from Lavalink
if (!res || !res.tracks || res.tracks.length === 0) {
  // No results found - this can happen if:
  // 1. Search terms are too obscure
  // 2. Track is region-locked
  // 3. Lavalink is temporarily unavailable
  // 4. Track was removed from YouTube
  await interaction.editReply({
    embeds: [createErrorEmbed('The ethereal realm yielded no resonance for thy seeking.')],
  });
  return;
}

// Determine if this is a playlist or single track
// Important: Must handle both cases differently for proper queue management
if (res.loadType === 'playlist') {
  // Playlist: Add all tracks and don't start playing yet
  // (Lavalink will auto-play the first track)
  await player.queue.add(res.tracks);

  await interaction.editReply({
    embeds: [
      createSuccessEmbed(
        `Attuning to playlist **${res.playlist?.name || 'Unknown'}** - ${res.tracks.length} harmonies shall resonate through the cosmos.`
      ),
    ],
  });
} else {
  // Single track: Add to queue
  const track = res.tracks[0];
  await player.queue.add(track);

  // Different message if music is already playing
  // vs if this is the first track
  if (!player.playing && !player.paused) {
    // No music playing yet - this track will start immediately
    await interaction.editReply({
      embeds: [createSuccessEmbed(`Attuning to: **${track.info.title}**`)],
    });
  } else {
    // Music already playing - this track joins the queue
    await interaction.editReply({
      embeds: [
        createSuccessEmbed(
          `Attuning to: **${track.info.title}**\n*This harmony shall join the celestial queue.*`
        ),
      ],
    });
  }
}

// Start playback if nothing is playing
// This handles the case where player exists but isn't playing anything
if (!player.playing && !player.paused) {
  await player.play();
}
```

### Example 3: Error Recovery

```typescript
try {
  // Attempt the operation that might fail
  const res = await player.search(
    {
      query: query,
    },
    interaction.user
  );

  // Process results...
} catch (error) {
  // Log full error details for debugging
  // Include context: what command, what query, what user
  logger.error('Error in play command:', error);

  // Send user-friendly error message
  // Don't expose technical details that confuse users
  await interaction.editReply({
    embeds: [createErrorEmbed('The cosmic forces have disrupted the resonance. Seek thy harmony anew.')],
  });

  // NOTE: We don't rethrow or return here - graceful degradation
  // User can try again with different query
}
```

---

## IMPLEMENTATION CHECKLISTS

### Checklist: Adding JSDoc to a File

**File:** `src/commands/play.ts`

```markdown
## Pre-Implementation
- [ ] Read existing code and understand what each function does
- [ ] Read the JSDoc template section above
- [ ] Open the file in your editor

## Add Class/Interface Documentation
- [ ] Add JSDoc comment above the export
- [ ] Include brief description
- [ ] Add longer explanation if needed
- [ ] Include @example if useful

## Add Method/Function Documentation
For each method/function (including async ones):
- [ ] Add brief one-line description
- [ ] Add @param for each parameter
- [ ] Add @returns for return value
- [ ] Add @throws for errors thrown
- [ ] Add @example if complex

## Add Type Documentation
For interfaces and types:
- [ ] Add JSDoc above interface
- [ ] Add JSDoc for each property

## Testing
- [ ] Hover over function in VSCode - tooltip shows JSDoc?
- [ ] Autocomplete shows parameters?
- [ ] No TypeScript errors?

## Final Review
- [ ] All functions have documentation?
- [ ] Examples are correct?
- [ ] No typos in descriptions?
- [ ] Code still compiles?
```

### Checklist: Creating CONTRIBUTING.md

```markdown
## Setup
- [ ] Copy template from above
- [ ] Customize with your project-specific info
- [ ] Replace [maintainers] with actual contact info
- [ ] Update prerequisites if different

## Content
- [ ] Code of Conduct section present
- [ ] Bug reporting guidelines clear
- [ ] Enhancement suggestion format clear
- [ ] PR template requirements documented
- [ ] Local development setup complete and tested
- [ ] Development workflow explained step-by-step
- [ ] Commit message format documented with examples
- [ ] TypeScript style guide complete
- [ ] All links work

## Review
- [ ] Read through entire document
- [ ] Test setup instructions (actually follow them)
- [ ] Verify all links are correct
- [ ] Check for typos
- [ ] Have teammate review

## Publish
- [ ] Commit with message: `docs(contributing): add CONTRIBUTING.md`
- [ ] Push to branch
- [ ] Create PR
- [ ] Get review
- [ ] Merge to main
```

### Checklist: Creating COMMANDS.md

```markdown
## Setup
- [ ] List all commands: /play, /pause, /skip, /back, /shuffle, /queue, /nowplaying, /stop
- [ ] Test each command to understand its behavior
- [ ] Copy template above for consistency

## For Each Command
- [ ] Command name and syntax correct
- [ ] Description accurate
- [ ] Parameters documented with valid values
- [ ] Return messages match actual responses
- [ ] Permission requirements listed
- [ ] At least 3 realistic examples included
- [ ] Error scenarios documented
- [ ] Related commands linked

## Testing
- [ ] Run each example command and verify response
- [ ] Test error cases to verify error messages
- [ ] Verify all links work
- [ ] Check for typos

## Review
- [ ] Have teammate test commands against documentation
- [ ] Are examples clear enough for new users?
- [ ] Would you be able to use command from this doc?

## Publish
- [ ] Commit: `docs: add comprehensive COMMANDS.md`
- [ ] Create PR
- [ ] Get review
- [ ] Merge
```

---

## FILE STRUCTURE TEMPLATE

### Recommended Documentation Directory Structure

```
Seraphim-Claude/
├── README.md                           ← Main entry point
├── CONTRIBUTING.md                     ← How to contribute
├── CHANGELOG.md                        ← Version history
├── CODE_STYLE.md                       ← Coding standards
├── SETUP_GUIDE.md                      ← (EXISTING) Bot setup
├── DEPLOYMENT.md                       ← (EXISTING) Production deploy
│
├── docs/                               ← NEW: All documentation
│   ├── README.md                       ← Docs index/navigation
│   ├── GETTING_STARTED.md              ← Quick start guide
│   │
│   ├── getting-started/
│   │   ├── DEVELOPMENT_SETUP.md        ← Local dev environment
│   │   ├── FIRST_STEPS.md              ← After installation
│   │   └── QUICKSTART.md               ← Ultra-quick setup
│   │
│   ├── user-guide/
│   │   ├── README.md                   ← User guide index
│   │   ├── COMMANDS.md                 ← All commands detailed
│   │   ├── FEATURES.md                 ← Feature explanations
│   │   ├── FAQ.md                      ← Frequent questions
│   │   └── TROUBLESHOOTING.md          ← User troubleshooting
│   │
│   ├── developer-guide/
│   │   ├── README.md                   ← Developer guide index
│   │   ├── ARCHITECTURE.md             ← System design
│   │   ├── ERROR_CODES.md              ← All error codes
│   │   ├── API_REFERENCE.md            ← API documentation
│   │   ├── TESTING.md                  ← How to test
│   │   └── DEBUGGING.md                ← How to debug
│   │
│   ├── deployment/
│   │   ├── README.md                   ← Deployment index
│   │   ├── DOCKER.md                   ← Docker deployment
│   │   ├── RASPBERRY_PI.md             ← Pi deployment
│   │   ├── MONITORING.md               ← Health checks
│   │   └── TROUBLESHOOTING.md          ← Ops troubleshooting
│   │
│   └── advanced/
│       ├── PERFORMANCE_TUNING.md       ← Optimization
│       ├── BACKUP_RECOVERY.md          ← Disaster recovery
│       └── SCALING.md                  ← Multi-instance
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md               ← Bug report template
│   │   ├── feature_request.md          ← Feature request template
│   │   └── question.md                 ← Question template
│   └── PULL_REQUEST_TEMPLATE.md        ← PR template
│
├── src/
│   └── [All files with added JSDoc comments]
│
└── lavalink/
    └── application.yml
```

---

## QUICK REFERENCE

### When to Use Which Template

| Situation | Template |
|-----------|----------|
| Documenting a function | JSDoc Template 1 |
| Documenting a class | JSDoc Template 2 |
| Documenting an interface | JSDoc Template 3 |
| Documenting an enum | JSDoc Template 4 |
| Adding command docs | Command Documentation Template |
| Creating contributing guide | Contributing Guidelines Template |
| Adding architecture docs | Architecture Documentation Template |
| Explaining complex code | Code Comment Examples |
| Implementing documentation | Implementation Checklists |

### Quick Wins (Start Here)

1. **15 minutes:** Add JSDoc to `src/utils/logger.ts` (4 functions)
2. **30 minutes:** Add JSDoc to `src/types/Command.ts` (2 interfaces)
3. **1 hour:** Create basic CONTRIBUTING.md
4. **1.5 hours:** Create ARCHITECTURE.md outline
5. **2 hours:** Add JSDoc to `src/client/SeraphimClient.ts` (6 methods)

**Total: ~6 hours to complete Priority 1 basics**

---

## FINAL NOTES

### Consistency Is Key

- Use same JSDoc style across all files
- Keep comment length similar
- Use same terminology
- Follow code style guide

### Update Documentation With Code

- When you change code, update JSDoc
- When you fix bugs, update error docs
- When you add features, add examples
- Don't let documentation drift from code

### Get Reviews

- Have teammates review documentation
- Check that examples actually work
- Verify explanations are clear
- Fix typos before merging

### Iterative Improvement

- Documentation doesn't need to be perfect first
- Better to have good docs than perfect docs
- Can always improve and refine
- Start with templates and adjust

---

**Last Updated:** November 19, 2025
**Template Author:** Technical Documentation Architect
**For:** Seraphim-Claude Discord Music Bot
