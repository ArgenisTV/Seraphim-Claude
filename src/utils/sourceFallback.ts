import { Player, Track } from 'lavalink-client';
import { logger } from './logger';

/**
 * Source Fallback Utilities
 *
 * Provides automatic fallback to alternative music sources when playback fails.
 * Tracks retry attempts to prevent infinite loops.
 */

// Store retry counts per track to prevent infinite loops
const retryAttempts = new Map<string, number>();
const MAX_RETRY_ATTEMPTS = 2;

/**
 * Generates a unique identifier for a track based on title and author
 *
 * @param {Track} track - The track to generate ID for
 * @returns {string} Unique track identifier
 */
function getTrackId(track: Track): string {
  return `${track.info.author}:${track.info.title}`.toLowerCase();
}

/**
 * Attempts to find and play an alternative source for a failed track
 *
 * @param {Player} player - The Lavalink player instance
 * @param {Track} failedTrack - The track that failed to play
 * @returns {Promise<boolean>} True if alternative source was found and played, false otherwise
 *
 * @example
 * const success = await tryAlternativeSource(player, failedTrack);
 * if (!success) {
 *   // Fallback failed, skip to next track
 *   await player.skip();
 * }
 */
export async function tryAlternativeSource(player: Player, failedTrack: Track): Promise<boolean> {
  const trackId = getTrackId(failedTrack);
  const currentRetries = retryAttempts.get(trackId) || 0;

  // Check if we've exceeded max retry attempts
  if (currentRetries >= MAX_RETRY_ATTEMPTS) {
    logger.warn(`Max retry attempts (${MAX_RETRY_ATTEMPTS}) reached for track: ${failedTrack.info.title}`);
    retryAttempts.delete(trackId); // Clean up
    return false;
  }

  // Increment retry count
  retryAttempts.set(trackId, currentRetries + 1);

  try {
    // Build alternative search queries
    const searchQueries = buildAlternativeQueries(failedTrack);

    logger.info(`Attempting fallback for "${failedTrack.info.title}" (attempt ${currentRetries + 1}/${MAX_RETRY_ATTEMPTS})`);

    // Try each alternative search query
    for (const query of searchQueries) {
      try {
        logger.debug(`Trying alternative source with query: ${query}`);

        const res = await player.search({ query }, failedTrack.requester);

        if (res && res.tracks && res.tracks.length > 0) {
          const alternativeTrack = res.tracks[0];

          logger.info(`Found alternative source: ${alternativeTrack.info.sourceName} - ${alternativeTrack.info.title}`);

          // Add to front of queue and play immediately
          player.queue.splice(0, 0, alternativeTrack);
          await player.skip(); // Skip current (failed) track, which will start the alternative

          // Clean up retry count on success
          retryAttempts.delete(trackId);

          return true;
        }
      } catch (searchError) {
        logger.debug(`Alternative search failed for query "${query}":`, searchError);
        // Continue to next query
      }
    }

    logger.warn(`No alternative sources found for: ${failedTrack.info.title}`);
    return false;
  } catch (error) {
    logger.error('Error in source fallback logic:', error);
    return false;
  }
}

/**
 * Builds alternative search queries for a failed track
 *
 * @param {Track} track - The track to build queries for
 * @returns {string[]} Array of search queries to try
 *
 * @private
 */
function buildAlternativeQueries(track: Track): string[] {
  const queries: string[] = [];
  const title = track.info.title;
  const author = track.info.author;

  // Query 1: YouTube search with author and title
  if (author && title) {
    queries.push(`ytsearch:${author} ${title}`);
  }

  // Query 2: YouTube search with title only (in case author is wrong)
  if (title) {
    queries.push(`ytsearch:${title}`);
  }

  // Query 3: Try original URL if it exists and wasn't from YouTube
  if (track.info.uri && !track.info.uri.includes('youtube.com') && !track.info.uri.includes('youtu.be')) {
    queries.push(track.info.uri);
  }

  // Query 4: SoundCloud search as last resort
  if (author && title) {
    queries.push(`scsearch:${author} ${title}`);
  }

  return queries;
}

/**
 * Cleans up retry tracking for a guild when player is destroyed
 *
 * @param {string} guildId - The guild ID to clean up
 */
export function cleanupRetryTracking(guildId: string): void {
  // In a more sophisticated implementation, we'd track retries per guild
  // For now, we clean up all retry attempts when a player is destroyed
  // This prevents memory leaks in long-running bots
  logger.debug(`Cleaning up retry tracking for guild ${guildId}`);
  retryAttempts.clear();
}

/**
 * Resets retry count for a specific track
 * Useful when a track successfully plays after a retry
 *
 * @param {Track} track - The track to reset retry count for
 */
export function resetRetryCount(track: Track): void {
  const trackId = getTrackId(track);
  retryAttempts.delete(trackId);
}
