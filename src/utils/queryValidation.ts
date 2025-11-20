/**
 * Query Validation Utilities
 *
 * Provides helper functions for validating and sanitizing search queries
 * and URLs to prevent issues with malformed or malicious inputs.
 */

import { isUrlSafe } from './ssrfProtection';

/**
 * Validates a music search query or URL
 *
 * @param {string} query - The query string to validate
 * @returns {Object} Validation result with isValid boolean and error message if invalid
 *
 * @example
 * const result = validateQuery('never gonna give you up');
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 */
export function validateQuery(query: string): {
  isValid: boolean;
  error?: string;
  sanitized: string;
} {
  // Check if query exists
  if (!query || typeof query !== 'string') {
    return {
      isValid: false,
      error: 'The ethereal query must not be void.',
      sanitized: '',
    };
  }

  // Trim whitespace
  const trimmed = query.trim();

  // Check minimum length
  if (trimmed.length < 1) {
    return {
      isValid: false,
      error: 'The query whispers too softly to be heard.',
      sanitized: trimmed,
    };
  }

  // Check maximum length (Discord has a 100 character limit for string options by default,
  // but we'll be more lenient for URLs which can be longer)
  if (trimmed.length > 500) {
    return {
      isValid: false,
      error: 'The query resonates too powerfully - please shorten thy seeking.',
      sanitized: trimmed,
    };
  }

  // Basic XSS prevention - remove potentially dangerous characters
  // Note: Lavalink should handle this, but we add a layer of defense
  const sanitized = trimmed
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, ''); // Remove vbscript: protocol

  // Check for null bytes (can cause issues)
  if (sanitized.includes('\0')) {
    return {
      isValid: false,
      error: 'The query contains forbidden void characters.',
      sanitized: sanitized.replace(/\0/g, ''),
    };
  }

  return {
    isValid: true,
    sanitized,
  };
}

/**
 * Checks if a query string is a URL
 *
 * @param {string} query - The query to check
 * @returns {boolean} True if the query appears to be a URL
 *
 * @example
 * isURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ') // true
 * isURL('never gonna give you up') // false
 */
export function isURL(query: string): boolean {
  try {
    new URL(query);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a URL for supported music platforms
 *
 * @param {string} url - The URL to validate
 * @returns {Object} Validation result with isValid boolean and platform name if valid
 *
 * @example
 * const result = validateMusicURL('https://open.spotify.com/track/...');
 * // Returns: { isValid: true, platform: 'Spotify' }
 */
export function validateMusicURL(url: string): {
  isValid: boolean;
  platform?: string;
  error?: string;
} {
  if (!isURL(url)) {
    return {
      isValid: false,
      error: 'The provided path does not lead to a valid realm.',
    };
  }

  const parsedURL = new URL(url);
  const hostname = parsedURL.hostname.toLowerCase();

  // Supported platforms
  const platforms = [
    { domains: ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'], name: 'YouTube' },
    { domains: ['open.spotify.com', 'spotify.com'], name: 'Spotify' },
    { domains: ['music.apple.com'], name: 'Apple Music' },
    { domains: ['deezer.com', 'www.deezer.com'], name: 'Deezer' },
    { domains: ['soundcloud.com', 'www.soundcloud.com', 'm.soundcloud.com'], name: 'SoundCloud' },
    { domains: ['bandcamp.com'], name: 'Bandcamp' },
    { domains: ['twitch.tv', 'www.twitch.tv'], name: 'Twitch' },
  ];

  for (const platform of platforms) {
    if (platform.domains.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
      return {
        isValid: true,
        platform: platform.name,
      };
    }
  }

  // Allow HTTP/HTTPS streams (with SSRF protection)
  if (parsedURL.protocol === 'http:' || parsedURL.protocol === 'https:') {
    // SSRF protection check
    const safetyCheck = isUrlSafe(url);
    if (!safetyCheck.safe) {
      return {
        isValid: false,
        error: `Security restriction: ${safetyCheck.reason}`,
      };
    }

    return {
      isValid: true,
      platform: 'HTTP Stream',
    };
  }

  return {
    isValid: false,
    error: `The realm "${hostname}" is unknown to Seraphim.`,
  };
}
