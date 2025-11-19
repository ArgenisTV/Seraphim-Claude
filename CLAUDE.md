# CLAUDE.md - AI Assistant Guide for Seraphim-Claude

## Project Overview

**Seraphim-Claude** is a bot project being developed using Claude Code. This is a fresh implementation following issues with a previous version that stopped working due to YouTube API or library changes.

### Project Status
- **Stage**: Early Development
- **Primary Goal**: Create a functional bot using Claude Code
- **Context**: Replacement for a previous bot implementation that failed

---

## Repository Structure

### Current Structure
```
Seraphim-Claude/
├── .git/                 # Git version control
├── README.md            # Project description
└── CLAUDE.md            # This file - AI assistant guide
```

### Recommended Structure (To Be Implemented)
```
Seraphim-Claude/
├── src/                 # Source code
│   ├── bot/            # Bot core functionality
│   ├── commands/       # Bot commands
│   ├── events/         # Event handlers
│   ├── utils/          # Utility functions
│   └── config/         # Configuration management
├── tests/              # Test files
├── docs/               # Additional documentation
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── requirements.txt    # Python dependencies (if Python)
├── package.json        # Node.js dependencies (if Node)
└── config.json         # Bot configuration template
```

---

## Development Guidelines for AI Assistants

### 1. Technology Stack Determination

**Priority**: Determine the bot framework and language based on:
- Previous bot implementation (if information is available)
- YouTube integration requirements
- User preferences

**Common Options**:
- **Python**: discord.py, disnake, py-cord (for Discord bots)
- **JavaScript/TypeScript**: discord.js, eris (for Discord bots)
- **Python YouTube Integration**: google-api-python-client, yt-dlp

### 2. Code Organization Principles

#### Modularity
- Keep functions small and focused (max 50 lines preferred)
- Separate concerns: commands, events, utilities, configuration
- Use clear, descriptive names for files and functions

#### Configuration Management
- **NEVER** hardcode credentials or tokens
- Use environment variables for sensitive data
- Provide `.env.example` with dummy values
- Load configuration from a central config module

#### Error Handling
- Implement comprehensive error handling in all async operations
- Log errors with context (timestamp, function name, error details)
- Provide user-friendly error messages
- Implement retry logic for API calls (especially YouTube)

### 3. Git Workflow

#### Branch Strategy
- Work on feature branches starting with `claude/`
- Branch naming: `claude/feature-description-sessionid`
- Never commit directly to main/master

#### Commit Standards
- Use clear, descriptive commit messages
- Format: `type: description`
  - Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
  - Examples:
    - `feat: add YouTube video search command`
    - `fix: resolve API rate limiting issue`
    - `docs: update installation instructions`

#### Before Committing
1. Review all changes with `git diff`
2. Ensure no sensitive data (tokens, API keys) is included
3. Update relevant documentation
4. Run tests if they exist

### 4. YouTube Integration Best Practices

#### API Key Management
- Store YouTube API key in environment variables
- Implement quota monitoring
- Handle quota exceeded errors gracefully

#### Error Handling for YouTube
```python
# Example pattern (Python)
try:
    # YouTube API call
    result = youtube.videos().list(...)
except HttpError as e:
    if e.resp.status == 403:
        # Quota exceeded
        logger.error("YouTube API quota exceeded")
    elif e.resp.status == 404:
        # Not found
        logger.error("Video not found")
    # Handle other errors
```

#### Rate Limiting
- Implement exponential backoff for retries
- Cache results when possible
- Batch requests when appropriate

### 5. Bot Development Patterns

#### Command Structure
- Use command decorators/handlers provided by the framework
- Validate user input before processing
- Provide help text for each command
- Implement permission checks where needed

#### Event Handling
- Register event handlers in a centralized location
- Keep event handlers lightweight (delegate to services)
- Log important events for debugging

#### Logging
- Use structured logging with levels (DEBUG, INFO, WARNING, ERROR)
- Include context in log messages
- Separate log files for different components if needed

### 6. Security Considerations

#### Authentication & Authorization
- Validate all user inputs
- Implement role-based access control for sensitive commands
- Rate limit user commands to prevent abuse

#### Data Protection
- Never log sensitive information (tokens, passwords, user data)
- Sanitize user inputs before logging
- Follow platform ToS (Discord, YouTube, etc.)

#### Secrets Management
```bash
# .env file (never commit this!)
DISCORD_TOKEN=your_token_here
YOUTUBE_API_KEY=your_key_here
PREFIX=!
```

```python
# Load from environment
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
YOUTUBE_KEY = os.getenv('YOUTUBE_API_KEY')
```

### 7. Testing Guidelines

#### Unit Tests
- Test individual functions in isolation
- Mock external API calls (YouTube, Discord)
- Test error handling paths

#### Integration Tests
- Test command workflows end-to-end
- Test API integrations with test data
- Verify error handling in realistic scenarios

#### Manual Testing Checklist
- [ ] Bot connects successfully
- [ ] Commands respond correctly
- [ ] Error messages are user-friendly
- [ ] YouTube integration works
- [ ] Rate limiting is respected
- [ ] Logs are informative

### 8. Documentation Standards

#### Code Documentation
- Add docstrings to all functions and classes
- Document parameters, return values, and exceptions
- Include usage examples for complex functions

#### README Updates
- Keep installation instructions current
- Document all available commands
- Include configuration steps
- Add troubleshooting section

#### Changelog
- Document all significant changes
- Include migration notes for breaking changes
- Reference related issues/PRs

---

## Common Tasks

### Setting Up the Project

1. **Determine technology stack** (ask user if unclear)
2. **Create project structure**
   ```bash
   mkdir -p src/{bot,commands,events,utils,config}
   mkdir tests docs
   ```
3. **Initialize package manager**
   - Python: Create `requirements.txt` or `pyproject.toml`
   - Node: Run `npm init` or create `package.json`
4. **Create configuration files**
   - `.env.example`
   - `.gitignore`
   - `config.json` (template)

### Adding a New Command

1. Create command file in `src/commands/`
2. Implement command handler with:
   - Input validation
   - Error handling
   - Help text
   - Permission checks (if needed)
3. Register command in bot
4. Add documentation to README
5. Write tests
6. Test manually

### Debugging Issues

1. **Check logs** for error messages and stack traces
2. **Verify configuration** (tokens, API keys, permissions)
3. **Test API connections** independently
4. **Check API quotas** (especially YouTube)
5. **Review recent changes** with `git log` and `git diff`

### Handling API Changes

1. **Identify breaking changes** in library/API updates
2. **Check migration guides** for the library
3. **Update dependencies** incrementally
4. **Test thoroughly** after updates
5. **Document changes** in changelog

---

## Troubleshooting Guide

### Bot Won't Start
- [ ] Check environment variables are set
- [ ] Verify tokens/API keys are valid
- [ ] Check for syntax errors in recent changes
- [ ] Review logs for specific error messages

### YouTube Integration Failing
- [ ] Verify API key is valid and has quota remaining
- [ ] Check YouTube API is enabled in Google Cloud Console
- [ ] Test API calls with curl or Postman
- [ ] Review error codes and messages
- [ ] Check for library version compatibility

### Commands Not Responding
- [ ] Verify command prefix is correct
- [ ] Check bot has necessary permissions
- [ ] Review command registration code
- [ ] Check for errors in command handler
- [ ] Verify bot is in the correct channels/servers

---

## Key Principles for AI Assistants

### When Starting Work
1. ✅ Read existing code to understand structure
2. ✅ Check for existing patterns and conventions
3. ✅ Use TodoWrite to plan multi-step tasks
4. ✅ Ask for clarification on ambiguous requirements

### During Development
1. ✅ Follow existing code style and patterns
2. ✅ Implement comprehensive error handling
3. ✅ Add logging for debugging
4. ✅ Write secure code (validate inputs, protect secrets)
5. ✅ Keep functions focused and testable

### Before Completing
1. ✅ Test changes manually
2. ✅ Review all modified files
3. ✅ Update documentation
4. ✅ Ensure no secrets in code
5. ✅ Commit with clear messages
6. ✅ Push to the correct branch

### Communication
- Be concise and technical
- Explain decisions when making architectural choices
- Ask questions when requirements are unclear
- Report issues and blockers promptly

---

## Project-Specific Context

### Background
- Previous bot implementation failed due to YouTube-related changes
- This is a fresh start using Claude Code
- Need to implement robust error handling for external APIs
- YouTube integration is a core feature

### Requirements (To Be Defined)
- [ ] Determine specific bot platform (Discord, Telegram, etc.)
- [ ] Define YouTube integration features (search, playback, etc.)
- [ ] Establish command list and functionality
- [ ] Set up deployment strategy

### Known Issues
- Previous implementation had issues with YouTube integration
- Need to ensure compatibility with current YouTube API

---

## Resources

### Documentation Links (To Be Added)
- Bot Framework Documentation
- YouTube Data API Documentation
- Hosting/Deployment Guide
- API Reference

### Useful Commands
```bash
# Check git status
git status

# View recent commits
git log --oneline -10

# View changes
git diff

# Check branch
git branch

# Create and switch to new branch
git checkout -b claude/feature-name-sessionid
```

---

## Version History

- **v1.0.0** (2025-11-19): Initial CLAUDE.md creation
  - Established project structure guidelines
  - Documented development workflows
  - Added security and best practices
  - Created troubleshooting guide

---

## Notes for Future Development

- Consider implementing a plugin/cog system for extensibility
- Plan for database integration if persistence is needed
- Implement comprehensive logging from the start
- Set up CI/CD pipeline for automated testing
- Consider containerization (Docker) for consistent deployment
- Implement health checks and monitoring
- Plan for graceful shutdown and restart
- Consider multi-language support if needed

---

*Last Updated: 2025-11-19*
*Maintained by: AI Assistants working on Seraphim-Claude*
