# Contributing to Seraphim Music Bot

Thank you for considering contributing to Seraphim! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or insulting comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## How Can I Contribute?

### Reporting Bugs

**Before submitting a bug report:**
1. Check existing issues to avoid duplicates
2. Gather information about your environment
3. Provide clear reproduction steps

**Bug Report Template:**
```markdown
**Description:**
Brief description of the bug

**Steps to Reproduce:**
1. Step one
2. Step two
3. Expected vs actual behavior

**Environment:**
- OS: [e.g., Windows 10, Ubuntu 20.04]
- Node.js version: [e.g., v18.16.0]
- Docker version: [if applicable]
- Bot version: [e.g., 1.0.0]

**Logs:**
```
Paste relevant logs here
```

**Additional Context:**
Any other relevant information
```

### Suggesting Enhancements

**Before submitting an enhancement:**
1. Check if the enhancement already exists
2. Consider if it fits the project scope
3. Provide clear use cases

**Enhancement Template:**
```markdown
**Feature Description:**
What feature are you proposing?

**Use Case:**
Why is this feature needed?

**Proposed Solution:**
How should it work?

**Alternatives Considered:**
What other approaches did you consider?

**Additional Context:**
Screenshots, mockups, or examples
```

### Code Contributions

We welcome code contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** (follow coding standards)
4. **Write/update tests** (if applicable)
5. **Update documentation** (if applicable)
6. **Commit your changes** (follow commit guidelines)
7. **Push to your fork** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

---

## Development Setup

See [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) for detailed setup instructions.

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/seraphim-claude.git
cd seraphim-claude

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env

# Run in development mode
npm run dev
```

---

## Coding Standards

### TypeScript Guidelines

**1. Use TypeScript Strict Mode**
```typescript
// tsconfig.json already has strict: true
// Always provide types, avoid 'any'
```

**2. Naming Conventions**
```typescript
// Classes: PascalCase
class SeraphimClient extends Client { }

// Functions/Variables: camelCase
const playerManager = new LavalinkManager();
function handleButtonClick() { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const GUILD_ONLY_ERROR = "...";

// Interfaces/Types: PascalCase with 'I' prefix for interfaces
interface ICommandOptions { }
type QueueTrack = Track & { requester: User };

// Files: kebab-case
// voice-validation.ts, source-fallback.ts
```

**3. Function Documentation (JSDoc)**

All exported functions MUST have JSDoc:

```typescript
/**
 * Brief description of what the function does
 *
 * Longer description with additional details if needed.
 * Can span multiple lines.
 *
 * @param {Type} paramName - Parameter description
 * @param {Type} optionalParam - Optional parameter description
 * @returns {ReturnType} Description of return value
 * @throws {ErrorType} When this error occurs
 *
 * @example
 * const result = myFunction('example');
 * // result: { success: true }
 */
export function myFunction(paramName: Type): ReturnType {
  // Implementation
}
```

**4. Error Handling**

```typescript
// Always handle errors
try {
  await riskyOperation();
} catch (error) {
  logger.error('Descriptive error message:', error);
  // Provide fallback or user feedback
}

// Use custom error types when appropriate
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

**5. Async/Await Best Practices**

```typescript
// ✅ Good: Properly await promises
await player.skip();

// ❌ Bad: Forgetting await
player.skip(); // Returns unawaited promise

// ✅ Good: Handle errors in async functions
async execute() {
  try {
    await operation();
  } catch (error) {
    logger.error('Error:', error);
  }
}
```

**6. Imports Organization**

```typescript
// 1. External dependencies
import { Client, GatewayIntentBits } from 'discord.js';
import { LavalinkManager } from 'lavalink-client';

// 2. Internal modules (grouped by type)
import { SeraphimClient } from './client/SeraphimClient';
import { Command } from './types/Command';

// 3. Utilities
import { logger } from './utils/logger';
import { createErrorEmbed } from './utils/embeds';
```

### Code Quality Standards

**1. Keep Functions Small**
- Functions should do one thing well
- Maximum ~50 lines per function
- Extract complex logic into helper functions

**2. Avoid Deep Nesting**
```typescript
// ✅ Good: Early returns
if (!player) {
  await interaction.reply({ embeds: [createErrorEmbed('...')] });
  return;
}

if (!voiceChannel) {
  await interaction.reply({ embeds: [createErrorEmbed('...')] });
  return;
}

// Continue with main logic

// ❌ Bad: Deep nesting
if (player) {
  if (voiceChannel) {
    // ... lots of nested code
  }
}
```

**3. Use Meaningful Variable Names**
```typescript
// ✅ Good
const currentTrack = player.queue.current;
const isUserInVoiceChannel = member.voice.channel !== null;

// ❌ Bad
const t = player.queue.current;
const x = member.voice.channel !== null;
```

**4. Validate Inputs**
```typescript
// Always validate user inputs
const validation = validateQuery(query);
if (!validation.isValid) {
  return { error: validation.error };
}
```

**5. Prevent Memory Leaks**
```typescript
// Clean up Maps and event listeners
export function cleanup(guildId: string): void {
  nowPlayingMessages.delete(guildId);
  retryAttempts.clear();
}
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
# Feature
feat(commands): add volume control command

# Bug fix
fix(lavalink): resolve memory leak in now playing handler

# Documentation
docs(readme): update installation instructions

# Refactoring
refactor(utils): extract validation logic to separate module

# Multiple files
feat(validation): add input sanitization across all commands

- Add query validation utility
- Update play command to use validation
- Add guild context checks to all commands
```

### Commit Message Rules

1. **Use imperative mood** ("add" not "added" or "adds")
2. **Don't capitalize first letter** (except proper nouns)
3. **No period at the end** of subject line
4. **Limit subject to 50 characters**
5. **Wrap body at 72 characters**
6. **Reference issues** in footer (`Fixes #123`)

### Co-authoring

When collaborating with Claude Code:

```bash
git commit -m "feat(commands): add shuffle command

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Pull Request Process

### Before Submitting

**1. Update Your Branch**
```bash
git checkout main
git pull upstream main
git checkout feature/your-feature
git rebase main
```

**2. Self-Review Checklist**
- [ ] Code follows style guidelines
- [ ] All tests pass (if applicable)
- [ ] JSDoc added for new functions
- [ ] No console.log() statements (use logger)
- [ ] Error handling implemented
- [ ] Memory leaks prevented
- [ ] Backward compatible (or breaking changes documented)

**3. Update Documentation**
- [ ] README.md (if user-facing changes)
- [ ] COMMANDS.md (if new commands)
- [ ] Code comments (complex logic)
- [ ] CHANGELOG.md (significant changes)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Testing
How was this tested?

- [ ] Tested locally with Docker
- [ ] Tested in production-like environment
- [ ] Added/updated tests

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Tested thoroughly

## Screenshots (if applicable)
Add screenshots showing the changes

## Related Issues
Fixes #123
Related to #456
```

### Review Process

1. **Automated Checks**: CI/CD must pass
2. **Code Review**: At least one approval required
3. **Testing**: Manually tested by reviewer
4. **Merge**: Squash and merge (or rebase, depending on complexity)

---

## Testing Guidelines

### Manual Testing

**For command changes:**
```bash
# Test in Discord
1. Use the command with valid input
2. Use the command with invalid input
3. Use the command in DMs (should fail gracefully)
4. Use the command without required permissions
5. Test edge cases (empty queue, no voice channel, etc.)
```

**For event handler changes:**
```bash
1. Trigger the event naturally
2. Verify logs show expected behavior
3. Check for memory leaks (long-running test)
4. Verify cleanup on player destroy
```

### Future: Automated Testing

When test suite is implemented:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- handlers/nowPlayingHandler.test.ts

# Run with coverage
npm run test:coverage
```

---

## Documentation Guidelines

### Code Documentation (JSDoc)

**Required for:**
- All exported functions
- All exported classes
- Public methods
- Complex internal functions

**Optional but recommended:**
- Type definitions
- Constants with non-obvious purpose

### README Updates

Update README.md when:
- Adding new user-facing features
- Changing installation/setup process
- Modifying configuration options
- Adding new dependencies

### Changelog

Update CHANGELOG.md (when created) for:
- New features
- Bug fixes
- Breaking changes
- Deprecations

Format:
```markdown
## [Version] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Changed behavior description

### Fixed
- Bug fix description

### Deprecated
- Deprecated feature description

### Removed
- Removed feature description

### Security
- Security fix description
```

---

## File Structure Guidelines

### Where to Add New Code

**Commands:**
```
src/commands/
├── your-command.ts      # New command file
└── index.ts             # Add export here
```

**Event Handlers:**
```
src/events/
├── your-event.ts        # New event handler
└── index.ts             # Register event here
```

**Utilities:**
```
src/utils/
└── your-utility.ts      # New utility module
```

**Types:**
```
src/types/
└── YourType.ts          # New type definition
```

### File Naming

- Commands: `command-name.ts` (kebab-case)
- Events: `eventName.ts` (camelCase)
- Utils: `utility-name.ts` (kebab-case)
- Types: `TypeName.ts` (PascalCase)
- Tests: `file-name.test.ts`

---

## Common Pitfalls to Avoid

### 1. Memory Leaks
```typescript
// ❌ Bad: Map never cleaned up
const cache = new Map();
cache.set(guildId, data);

// ✅ Good: Cleanup function
export function cleanup(guildId: string) {
  cache.delete(guildId);
}
```

### 2. Unawaited Promises
```typescript
// ❌ Bad
player.skip(); // Promise not awaited

// ✅ Good
await player.skip();
```

### 3. Unsafe Type Casting
```typescript
// ❌ Bad
const queue = player.queue as unknown as QueueTrack[];

// ✅ Good
const queue = player.queue.tracks as QueueTrack[];
```

### 4. Hardcoded Values
```typescript
// ❌ Bad
const password = 'youshallnotpass';

// ✅ Good
const password = process.env.LAVALINK_PASSWORD;
```

### 5. Missing Error Handling
```typescript
// ❌ Bad
await riskyOperation();

// ✅ Good
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed:', error);
  // Provide user feedback
}
```

---

## Getting Help

### Resources

- **Documentation**: See `docs/` directory
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Development Setup**: See [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md)
- **Command Reference**: See [COMMANDS.md](COMMANDS.md)

### Questions?

- Open a discussion on GitHub Discussions
- Ask in the Discord server (if available)
- Comment on related issues

### Stuck?

Don't hesitate to:
1. Ask for clarification in your PR
2. Request help in discussions
3. Look at existing code for examples

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Appreciated in the community!

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

---

**Thank you for contributing to Seraphim Music Bot! 🎵**

Your contributions help make this bot better for everyone.
