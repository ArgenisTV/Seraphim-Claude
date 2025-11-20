import { Track } from 'lavalink-client';

/**
 * Track History Manager
 *
 * Maintains a history of recently played tracks per guild to enable
 * "back" / "previous track" functionality.
 */

interface GuildHistory {
  tracks: Track[];
  maxSize: number;
}

// Store track history per guild
const guildHistories = new Map<string, GuildHistory>();

// Maximum number of tracks to keep in history
const DEFAULT_MAX_HISTORY = 50;

/**
 * Adds a track to the guild's history
 *
 * @param {string} guildId - The guild ID
 * @param {Track} track - The track that was played
 */
export function addToHistory(guildId: string, track: Track): void {
  let history = guildHistories.get(guildId);

  if (!history) {
    history = {
      tracks: [],
      maxSize: DEFAULT_MAX_HISTORY,
    };
    guildHistories.set(guildId, history);
  }

  // Add track to history
  history.tracks.push(track);

  // Keep history size manageable
  if (history.tracks.length > history.maxSize) {
    history.tracks.shift(); // Remove oldest track
  }
}

/**
 * Gets the previous track from history
 *
 * @param {string} guildId - The guild ID
 * @returns {Track | null} The previous track, or null if no history
 */
export function getPreviousTrack(guildId: string): Track | null {
  const history = guildHistories.get(guildId);

  if (!history || history.tracks.length === 0) {
    return null;
  }

  // Return and remove the last track from history
  return history.tracks.pop() || null;
}

/**
 * Checks if there's a previous track available
 *
 * @param {string} guildId - The guild ID
 * @returns {boolean} True if previous track exists
 */
export function hasPreviousTrack(guildId: string): boolean {
  const history = guildHistories.get(guildId);
  return history ? history.tracks.length > 0 : false;
}

/**
 * Clears the history for a guild
 *
 * @param {string} guildId - The guild ID
 */
export function clearHistory(guildId: string): void {
  guildHistories.delete(guildId);
}

/**
 * Gets the size of the history for a guild
 *
 * @param {string} guildId - The guild ID
 * @returns {number} Number of tracks in history
 */
export function getHistorySize(guildId: string): number {
  const history = guildHistories.get(guildId);
  return history ? history.tracks.length : 0;
}
