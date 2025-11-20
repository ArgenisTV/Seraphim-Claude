import { Player, Track } from 'lavalink-client';
import { SeraphimClient } from '../client/SeraphimClient';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createNowPlayingEmbed } from '../utils/embeds';
import { QueueTrack } from '../types/QueueTrack';
import { logger } from '../utils/logger';
import { hasPreviousTrack } from '../utils/trackHistory';

/**
 * Now Playing Message Handler
 *
 * Manages "now playing" messages in Discord channels.
 * Sends new messages for each track to keep chat flowing naturally.
 * Includes interactive control buttons for playback management.
 */

/**
 * Sends a "now playing" message for the current track
 *
 * Creates an embed with track information and interactive control buttons.
 * Always sends a new message so it appears at the bottom of the chat.
 *
 * @param {SeraphimClient} client - The bot client instance
 * @param {Player} player - The Lavalink player instance
 * @param {Track} track - The currently playing track
 * @returns {Promise<void>} Resolves when message is sent
 *
 * @example
 * await updateNowPlayingMessage(client, player, track);
 */
export async function updateNowPlayingMessage(
  client: SeraphimClient,
  player: Player,
  track: Track
): Promise<void> {
  const channel = client.channels.cache.get(player.textChannelId!);

  if (!channel || !('send' in channel)) {
    return;
  }

  try {
    const queueTrack = track as QueueTrack;
    const embed = createNowPlayingEmbed(queueTrack);

    // Check if previous track is available
    const hasPrevious = hasPreviousTrack(player.guildId);

    // Create control buttons
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('music_previous')
        .setLabel('Previous')
        .setEmoji('⏮️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!hasPrevious), // Enable if history exists
      new ButtonBuilder()
        .setCustomId('music_pause')
        .setLabel(player.paused ? 'Resume' : 'Pause')
        .setEmoji(player.paused ? '▶️' : '⏸️')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('music_skip')
        .setLabel('Skip')
        .setEmoji('⏭️')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('music_shuffle')
        .setLabel('Shuffle')
        .setEmoji('🔀')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('music_stop')
        .setLabel('Stop')
        .setEmoji('⏹️')
        .setStyle(ButtonStyle.Danger)
    );

    // Always send a new message (appears at bottom of chat)
    await channel.send({ embeds: [embed], components: [row] });
  } catch (error) {
    logger.error('Error sending now playing message:', error);
  }
}

/**
 * Cleans up resources when a player is destroyed
 *
 * Placeholder for future cleanup tasks if needed.
 * Currently a no-op since we don't store message references.
 *
 * @param {string} guildId - The guild ID to clean up
 *
 * @example
 * cleanupNowPlayingMessage(player.guildId);
 */
export function cleanupNowPlayingMessage(guildId: string): void {
  // No-op: We don't store message references anymore
  void guildId;
}
