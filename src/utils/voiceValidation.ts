import { VoiceBasedChannel, PermissionsBitField } from 'discord.js';

/**
 * Voice Validation Utilities
 *
 * Provides helper functions for validating voice channel permissions
 * and ensuring the bot can properly connect and speak in voice channels.
 */

/**
 * Checks if the bot has required permissions to join and speak in a voice channel
 *
 * @param {VoiceBasedChannel} voiceChannel - The voice channel to check permissions for
 * @returns {Object} Object containing canConnect and canSpeak booleans
 *
 * @example
 * const permissions = checkVoicePermissions(voiceChannel);
 * if (!permissions.canConnect) {
 *   // Handle missing connect permission
 * }
 */
export function checkVoicePermissions(voiceChannel: VoiceBasedChannel): {
  canConnect: boolean;
  canSpeak: boolean;
  missingPermissions: string[];
} {
  const permissions = voiceChannel.permissionsFor(voiceChannel.client.user!);

  if (!permissions) {
    return {
      canConnect: false,
      canSpeak: false,
      missingPermissions: ['CONNECT', 'SPEAK'],
    };
  }

  const canConnect = permissions.has(PermissionsBitField.Flags.Connect);
  const canSpeak = permissions.has(PermissionsBitField.Flags.Speak);

  const missingPermissions: string[] = [];
  if (!canConnect) missingPermissions.push('CONNECT');
  if (!canSpeak) missingPermissions.push('SPEAK');

  return {
    canConnect,
    canSpeak,
    missingPermissions,
  };
}

/**
 * Gets a user-friendly error message for missing voice permissions
 *
 * @param {string[]} missingPermissions - Array of missing permission names
 * @returns {string} Formatted error message
 *
 * @example
 * const message = getPermissionErrorMessage(['CONNECT', 'SPEAK']);
 * // Returns: "Seraphim lacks the divine authority to CONNECT and SPEAK in this sacred chamber."
 */
export function getPermissionErrorMessage(missingPermissions: string[]): string {
  if (missingPermissions.length === 0) {
    return 'Unknown permission error.';
  }

  const permList = missingPermissions.join(' and ');
  return `Seraphim lacks the divine authority to ${permList} in this sacred chamber.`;
}
