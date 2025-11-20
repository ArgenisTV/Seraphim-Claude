/**
 * Rate Limiter Utility
 *
 * Provides rate limiting for commands to prevent spam and abuse.
 * Uses a simple token bucket algorithm with per-user tracking.
 */

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

/**
 * Rate limiter configuration
 */
interface RateLimitConfig {
  /** Maximum number of tokens in the bucket */
  maxTokens: number;
  /** Number of tokens to refill per interval */
  refillRate: number;
  /** Refill interval in milliseconds */
  refillInterval: number;
  /** Tokens consumed per command */
  tokensPerCommand: number;
}

/**
 * Default rate limit configuration
 * Allows 5 commands per 10 seconds per user
 */
const DEFAULT_CONFIG: RateLimitConfig = {
  maxTokens: 5,
  refillRate: 1,
  refillInterval: 2000, // 2 seconds
  tokensPerCommand: 1,
};

/**
 * Stores rate limit buckets per user
 * Key: userId, Value: RateLimitBucket
 */
const userBuckets = new Map<string, RateLimitBucket>();

/**
 * Cleanup interval for inactive users
 * Removes buckets that haven't been accessed in 5 minutes
 */
const CLEANUP_INTERVAL = 300000; // 5 minutes
const INACTIVE_THRESHOLD = 300000; // 5 minutes

/**
 * Checks if a user is rate limited
 *
 * @param {string} userId - Discord user ID
 * @param {Partial<RateLimitConfig>} config - Optional rate limit configuration
 * @returns {Object} Result with isLimited boolean and retryAfter time in ms
 *
 * @example
 * const result = checkRateLimit(interaction.user.id);
 * if (result.isLimited) {
 *   await interaction.reply({
 *     content: `Please wait ${Math.ceil(result.retryAfter / 1000)} seconds`,
 *     ephemeral: true
 *   });
 *   return;
 * }
 */
export function checkRateLimit(
  userId: string,
  config: Partial<RateLimitConfig> = {}
): { isLimited: boolean; retryAfter: number } {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Get or create bucket for user
  let bucket = userBuckets.get(userId);

  if (!bucket) {
    // New user - create full bucket
    bucket = {
      tokens: cfg.maxTokens,
      lastRefill: Date.now(),
    };
    userBuckets.set(userId, bucket);
  }

  // Refill tokens based on time passed
  const now = Date.now();
  const timeSinceRefill = now - bucket.lastRefill;
  const refillCount = Math.floor(timeSinceRefill / cfg.refillInterval);

  if (refillCount > 0) {
    bucket.tokens = Math.min(
      cfg.maxTokens,
      bucket.tokens + refillCount * cfg.refillRate
    );
    bucket.lastRefill = now;
  }

  // Check if user has enough tokens
  if (bucket.tokens >= cfg.tokensPerCommand) {
    // Consume tokens
    bucket.tokens -= cfg.tokensPerCommand;
    return { isLimited: false, retryAfter: 0 };
  } else {
    // Calculate retry after time
    const tokensNeeded = cfg.tokensPerCommand - bucket.tokens;
    const refillsNeeded = Math.ceil(tokensNeeded / cfg.refillRate);
    const retryAfter = refillsNeeded * cfg.refillInterval;

    return { isLimited: true, retryAfter };
  }
}

/**
 * Resets rate limit for a specific user
 *
 * @param {string} userId - Discord user ID
 *
 * @example
 * // Admin command to reset rate limit
 * resetRateLimit(userId);
 */
export function resetRateLimit(userId: string): void {
  userBuckets.delete(userId);
}

/**
 * Gets current rate limit status for a user
 *
 * @param {string} userId - Discord user ID
 * @returns {Object} Current status with tokens and time until next refill
 *
 * @example
 * const status = getRateLimitStatus(userId);
 * console.log(`Tokens: ${status.tokens}/${status.maxTokens}`);
 */
export function getRateLimitStatus(userId: string): {
  tokens: number;
  maxTokens: number;
  nextRefillIn: number;
} {
  const bucket = userBuckets.get(userId);
  const cfg = DEFAULT_CONFIG;

  if (!bucket) {
    return {
      tokens: cfg.maxTokens,
      maxTokens: cfg.maxTokens,
      nextRefillIn: 0,
    };
  }

  const now = Date.now();
  const timeSinceRefill = now - bucket.lastRefill;
  const timeUntilRefill = Math.max(0, cfg.refillInterval - timeSinceRefill);

  return {
    tokens: bucket.tokens,
    maxTokens: cfg.maxTokens,
    nextRefillIn: timeUntilRefill,
  };
}

/**
 * Cleans up inactive rate limit buckets
 * Automatically called periodically to prevent memory leaks
 *
 * @private
 */
function cleanupInactiveBuckets(): void {
  const now = Date.now();
  let removed = 0;

  for (const [userId, bucket] of userBuckets.entries()) {
    if (now - bucket.lastRefill > INACTIVE_THRESHOLD) {
      userBuckets.delete(userId);
      removed++;
    }
  }

  if (removed > 0) {
    // Only log if buckets were removed (avoid spam)
    // Uncomment for debugging:
    // console.log(`[RateLimit] Cleaned up ${removed} inactive buckets`);
  }
}

/**
 * Starts periodic cleanup of inactive buckets
 * Called automatically when module is imported
 */
function startCleanupInterval(): void {
  setInterval(cleanupInactiveBuckets, CLEANUP_INTERVAL);
}

// Auto-start cleanup on module load
startCleanupInterval();

/**
 * Gets total number of tracked users (for monitoring)
 *
 * @returns {number} Number of users currently tracked
 *
 * @example
 * console.log(`Tracking ${getTrackedUserCount()} users`);
 */
export function getTrackedUserCount(): number {
  return userBuckets.size;
}

/**
 * Clears all rate limit buckets (for testing or emergency)
 *
 * @example
 * // Emergency: Clear all rate limits
 * clearAllRateLimits();
 */
export function clearAllRateLimits(): void {
  userBuckets.clear();
}
