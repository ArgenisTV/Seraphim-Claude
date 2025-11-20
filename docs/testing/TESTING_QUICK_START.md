# Seraphim-Claude Music Bot - Testing Quick Start Guide

**Last Updated:** November 19, 2025
**Current Coverage:** 0%
**Target Coverage:** 90%+
**Estimated Implementation Time:** 6-7 weeks

---

## EXECUTIVE QUICK REFERENCE

### The Problem
- 0 test files exist
- 21 TypeScript source files with 0 coverage
- Critical music functionality untested
- Risk: Memory leaks, race conditions, permission bypasses

### The Solution
- Implement 265+ test cases across music functionality
- Use Vitest as testing framework
- Follow provided test specifications
- Achieve 90%+ coverage in 6-7 weeks

### The Timeline
```
Week 1: Setup + Play Command (25 tests)       - 40% foundation coverage
Week 2: Lavalink Events (30 tests)            - 65% total coverage
Week 3: Pause, Skip, Stop (48 tests)          - 80% total coverage
Week 4: Queue, Shuffle, Commands (40 tests)   - 85% total coverage
Week 5: Button, Now Playing (33 tests)        - 88% total coverage
Week 6: Error Recovery & Edge Cases (30 tests)- 90%+ total coverage
Week 7: Polish, Integration, Load Tests       - 92%+ final coverage
```

---

## INSTALLATION (15 MINUTES)

### Step 1: Install Dependencies
```bash
npm install -D vitest @vitest/ui @testing-library/node
npm install -D jest-mock-extended @types/jest
npm install -D @vitest/coverage-v8
```

### Step 2: Update package.json
Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:coverage:watch": "vitest --coverage --watch"
  }
}
```

### Step 3: Create vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Step 4: Copy Mock Files
Copy these directories from TEST_SPECIFICATIONS.md:
- Create `src/__mocks__/client.ts` with mock factories
- Create `src/__mocks__/testUtils.ts` with test helpers

### Step 5: Verify Setup
```bash
npm run test -- --run
```

---

## DAY 1: HANDS-ON IMPLEMENTATION

### What You'll Do
1. Copy mock factories and test utilities (30 min)
2. Create first test file: `play.test.ts` (60 min)
3. Run tests and verify they pass (20 min)
4. Commit working setup (10 min)

### Your First Test File
**File: `src/commands/play.test.ts`** (copy from TEST_SPECIFICATIONS.md)

Key sections:
- Mock setup (beforeEach)
- Happy path tests (5 tests)
- Error handling (5 tests)
- Edge cases (5 tests)
- Cleanup (afterEach)

### Run Your First Tests
```bash
npm run test -- src/commands/play.test.ts --run
```

Expected output:
```
 ✓ src/commands/play.test.ts (25)
   ✓ Happy Path (5)
   ✓ Error Handling (5)
   ...

Test Files  1 passed (1)
     Tests  25 passed (25)
  Start at  14:23:45
  Duration  1.23s
```

---

## CRITICAL FILES & LOCATIONS

### Source Files Needing Tests

#### Music Commands (9 files)
| File | Tests Needed | Priority |
|---|---|---|
| `src/commands/play.ts` | 25 | CRITICAL |
| `src/commands/pause.ts` | 15 | HIGH |
| `src/commands/skip.ts` | 15 | HIGH |
| `src/commands/stop.ts` | 18 | HIGH |
| `src/commands/queue.ts` | 15 | HIGH |
| `src/commands/shuffle.ts` | 12 | MEDIUM |
| `src/commands/back.ts` | 5 | LOW |
| `src/commands/nowplaying.ts` | 8 | MEDIUM |
| `src/commands/index.ts` | 3 | LOW |

#### Event Handlers (4 files)
| File | Tests Needed | Priority |
|---|---|---|
| `src/events/lavalink.ts` | 30 | CRITICAL |
| `src/events/interactionCreate.ts` | 10 | HIGH |
| `src/events/ready.ts` | 5 | LOW |
| `src/events/index.ts` | 3 | LOW |

#### Utility Handlers (2 files)
| File | Tests Needed | Priority |
|---|---|---|
| `src/handlers/buttonHandler.ts` | 15 | HIGH |
| `src/handlers/nowPlayingHandler.ts` | 18 | MEDIUM |

#### Utilities (3 files)
| File | Tests Needed | Priority |
|---|---|---|
| `src/utils/embeds.ts` | 10 | MEDIUM |
| `src/utils/logger.ts` | 5 | LOW |
| `src/client/SeraphimClient.ts` | 5 | MEDIUM |

**Total Tests: 265+**

---

## WEEK-BY-WEEK BREAKDOWN

### WEEK 1: Foundation & Play Command
**Goal:** 65 tests, 40% coverage

**Deliverables:**
1. Vitest setup complete
2. Mock factories created
3. 25 play command tests (all passing)
4. 15 pause command tests (all passing)
5. 25 skip command tests (all passing)

**Time Allocation:**
- Day 1: Setup (2h) + Play tests (2h)
- Day 2: Pause tests (1.5h)
- Day 3: Skip tests (1.5h)
- Day 4-5: Edge cases + polish (3h)

**Validation:**
```bash
npm run test:coverage
# Should show: ~40% line coverage
```

### WEEK 2: Event Handling
**Goal:** 95 tests total, 65% coverage

**Deliverables:**
1. 30 Lavalink event tests
2. 10 interaction handler tests
3. All tests passing
4. Full event flow verified

**Key Tests:**
- trackStart, trackEnd events
- trackError, trackStuck handling
- queueEnd and cleanup
- playerDestroy lifecycle

**Validation:**
```bash
npm run test:coverage
# Should show: ~65% line coverage
```

### WEEK 3: Core Commands Completion
**Goal:** 140 tests total, 80% coverage

**Deliverables:**
1. 18 stop command tests
2. 15 queue command tests
3. 12 shuffle command tests
4. 10 command routing tests
5. Concurrent operation tests

**New Focus Areas:**
- Queue state management
- Type safety verification
- Concurrent operation handling
- Multi-guild isolation

### WEEK 4: UI & Message Handling
**Goal:** 170 tests total, 85% coverage

**Deliverables:**
1. 15 button handler tests
2. 18 now playing handler tests
3. 10 embed utility tests
4. Message caching & cleanup tests

**Key Tests:**
- Button routing and state updates
- Message creation and updates
- Cleanup on player destroy
- Error recovery in message updates

### WEEK 5: Error Recovery & Edge Cases
**Goal:** 215 tests total, 88% coverage

**Deliverables:**
1. 20 error recovery tests
2. 15 edge case tests
3. 10 concurrent operation stress tests
4. 5 permission bypass prevention tests

### WEEK 6: Performance & Integration
**Goal:** 250+ tests total, 90%+ coverage

**Deliverables:**
1. 15 integration workflow tests
2. 10 load/performance tests
3. 5 memory leak prevention tests
4. Final coverage gaps closed

### WEEK 7: Polish & Documentation
**Goal:** 265+ tests total, 92%+ coverage

**Deliverables:**
1. All tests passing
2. Coverage reports generated
3. Test documentation updated
4. CI/CD integration ready

---

## TEST EXECUTION QUICK COMMANDS

### Single Test File
```bash
npm run test -- src/commands/play.test.ts --run
```

### Watch Mode (Auto-rerun on changes)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### UI Dashboard
```bash
npm run test:ui
# Opens http://localhost:51204 with live dashboard
```

### Specific Test
```bash
npm run test -- -t "should successfully search and play single YouTube video"
```

### Only Failed Tests
```bash
npm run test -- --run --reporter=verbose
```

---

## COMMON ISSUES & SOLUTIONS

### Issue: Tests import Discord.js but it's not mocked
**Solution:** Ensure mock files are in `src/__mocks__/` directory
```bash
ls -la src/__mocks__/
# Should show: client.ts, testUtils.ts
```

### Issue: "Cannot find module" errors
**Solution:** Check tsconfig.json has correct moduleResolution
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

### Issue: Tests timeout after 10 seconds
**Solution:** Increase timeout in vitest.config.ts
```typescript
testTimeout: 15000, // 15 seconds
```

### Issue: Mock functions not being called
**Solution:** Use vi.fn() properly for mocking
```typescript
// WRONG
const mock = jest.fn(); // Using jest instead of vitest

// RIGHT
const mock = vi.fn();
```

### Issue: Coverage reports showing 0%
**Solution:** Make sure tests actually execute the code
```bash
npm run test:coverage -- --reporter=html
# Open coverage/index.html to see detailed report
```

---

## TEST STRUCTURE TEMPLATE

All tests should follow this structure:

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { yourFunction } from './yourFunction';
import { createMockX, createMockY } from '../__mocks__/client';
import { TestHelper } from '../__mocks__/testUtils';

describe('Feature Name', () => {
  let mockClient: any;
  let mockInteraction: any;

  beforeEach(() => {
    // Setup mocks
    mockClient = createMockX();
    mockInteraction = createMockY();
  });

  describe('Happy Path', () => {
    it('should do something', async () => {
      // Arrange
      const input = setupInput();

      // Act
      await yourFunction.execute(mockClient, mockInteraction);

      // Assert
      expect(mockFunction).toHaveBeenCalled();
    });
  });

  describe('Error Cases', () => {
    it('should handle errors', async () => {
      // Setup error condition
      mockFunction.mockRejectedValue(new Error('Test error'));

      // Execute and verify error handling
      await yourFunction.execute(mockClient, mockInteraction);
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
```

---

## TRACKING PROGRESS

### Coverage Targets
```
Week 1: 40% (65/265 tests)
Week 2: 65% (95/265 tests)
Week 3: 80% (140/265 tests)
Week 4: 85% (170/265 tests)
Week 5: 88% (215/265 tests)
Week 6: 90% (250/265 tests)
Week 7: 92%+ (265+/265 tests)
```

### Weekly Checklist

**Week 1:**
- [ ] Vitest installed and configured
- [ ] Mock factories created
- [ ] Play command tests (25) - all passing
- [ ] Pause command tests (15) - all passing
- [ ] Skip command tests (15) - all passing
- [ ] Coverage at 40%

**Week 2:**
- [ ] Lavalink event tests (30) - all passing
- [ ] Interaction handler tests (10) - all passing
- [ ] Coverage at 65%
- [ ] No flaky tests

**Weeks 3-7:**
- [ ] Continue per schedule
- [ ] Weekly coverage increase
- [ ] All tests passing
- [ ] No new bugs introduced

---

## BEST PRACTICES

### 1. Test Naming
```typescript
// GOOD
it('should pause playing audio when user clicks pause button')

// BAD
it('pause test')
```

### 2. Assertion Messages
```typescript
// GOOD
expect(mockPlayer.play).toHaveBeenCalled();

// BAD (no error message if fails)
expect(true).toBe(true);
```

### 3. Mock Isolation
```typescript
// GOOD
beforeEach(() => {
  vi.clearAllMocks();
})

// BAD (mocks carry over between tests)
// No cleanup
```

### 4. Arrange-Act-Assert
```typescript
// GOOD structure
it('should do X', async () => {
  // Arrange - setup
  const input = setupInput();

  // Act - execute
  const result = await function(input);

  // Assert - verify
  expect(result).toBe(expected);
});
```

### 5. Test Independence
```typescript
// GOOD - each test is independent
it('should work alone', async () => {
  // Complete setup
  const state = createState();
  await function(state);
});

// BAD - depends on previous test
it('should build on previous test') {
  // Assumes previous test ran
});
```

---

## KEY METRICS TO TRACK

### Test Coverage
```
Lines: Aim for 90%+
Branches: Aim for 85%+
Functions: Aim for 90%+
Statements: Aim for 90%+
```

### Test Quality
- No flaky tests (consistent results)
- Clear error messages (understand failures)
- Fast execution (<5s total for full suite)
- Good isolation (no test interference)

### Code Coverage by Module
```
commands/play.ts: 95%+
commands/pause.ts: 90%+
commands/skip.ts: 90%+
events/lavalink.ts: 95%+
handlers/buttonHandler.ts: 85%+
handlers/nowPlayingHandler.ts: 85%+
```

---

## RESOURCES & REFERENCES

### Vitest Documentation
- **Official Docs:** https://vitest.dev
- **API Reference:** https://vitest.dev/api
- **Best Practices:** https://vitest.dev/guide/features

### Test Examples
- See TEST_SPECIFICATIONS.md for 100+ ready-to-use test examples
- See TEST_COVERAGE_ANALYSIS.md for detailed test case specifications

### Mock Factories
- See TEST_SPECIFICATIONS.md, Section 1.1 for complete mock setup

### Common Testing Patterns
```typescript
// Testing async functions
it('should handle async', async () => {
  await functionThatReturnsPromise();
  expect(result).toBe(expected);
});

// Testing with spy
it('should call method', () => {
  const spy = vi.spyOn(object, 'method');
  expect(spy).toHaveBeenCalled();
});

// Testing rejections
it('should handle errors', async () => {
  mockFunction.mockRejectedValue(new Error('Fail'));
  await functionThatErrors();
  expect(errorHandler).toHaveBeenCalled();
});

// Testing multiple calls
it('should call multiple times', () => {
  function();
  function();
  expect(mock).toHaveBeenCalledTimes(2);
});
```

---

## CI/CD INTEGRATION (FUTURE)

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

---

## CRITICAL SUCCESS FACTORS

1. **Consistency:** Run tests every day, track coverage
2. **Momentum:** Start with quick wins (Play command)
3. **Documentation:** Keep test names clear and readable
4. **Isolation:** Each test should be independent
5. **Cleanup:** Always clear mocks between tests
6. **Assertion:** Always verify expected behavior

---

## SUCCESS DEFINITION

You'll know testing is working when:

1. **All 265+ tests pass consistently**
   ```bash
   npm run test -- --run
   # Test Files  50 passed (50)
   #      Tests  265 passed (265)
   ```

2. **Coverage >90%**
   ```bash
   npm run test:coverage
   # Lines: 92%
   # Functions: 92%
   # Branches: 88%
   ```

3. **Build failures caught by tests**
   - Any code change that breaks functionality fails tests
   - Regressions detected before production

4. **New features tested before deployment**
   - All new code has corresponding tests
   - Test coverage maintained >90%

5. **Developer confidence**
   - Developers can refactor safely
   - CI/CD pipeline rejects untested code
   - Bug fixes verified with regression tests

---

## NEXT IMMEDIATE STEPS

### TODAY (Day 1)
1. Install Vitest: `npm install -D vitest @vitest/ui @vitest/coverage-v8`
2. Copy mock factories from TEST_SPECIFICATIONS.md
3. Create first test file: `src/commands/play.test.ts`
4. Run: `npm run test:watch`
5. Get 5 Play command tests passing

### THIS WEEK (Week 1)
1. Complete all 25 Play command tests
2. Add 15 Pause command tests
3. Add 15 Skip command tests
4. Achieve 40% coverage
5. Commit working setup to git

### NEXT WEEK (Week 2)
1. Add 30 Lavalink event tests
2. Add 10 interaction handler tests
3. Achieve 65% coverage
4. Document any setup issues

### ONGOING
1. Follow weekly schedule
2. Track coverage metrics
3. Maintain test speed (<5s)
4. Keep tests independent

---

## SUPPORT & DEBUGGING

### Check Your Setup
```bash
# Verify Vitest installed
npm list vitest

# Verify config file exists
ls -la vitest.config.ts

# Verify mocks exist
ls -la src/__mocks__/

# Run one test to verify setup
npm run test -- src/commands/play.test.ts --run --reporter=verbose
```

### Debug Failing Test
```bash
# Run with more verbose output
npm run test -- --reporter=verbose

# Run specific test
npm run test -- -t "test name"

# Run with debugger
node --inspect-brk ./node_modules/vitest/vitest.mjs
```

### Check Mock Functions
```typescript
// After test, inspect mock calls
console.log(mockFunction.mock.calls);
console.log(mockFunction.mock.results);

// Verify all mocks cleared
afterEach(() => {
  vi.clearAllMocks(); // Must be here!
});
```

---

**You've got this! Start with Day 1, follow the schedule, and you'll have excellent test coverage in 7 weeks.**

**Need help?** Refer to:
1. TEST_SPECIFICATIONS.md - Copy/paste test code
2. TEST_COVERAGE_ANALYSIS.md - Understand why tests matter
3. This guide - Quick reference and setup

**Good luck!**
