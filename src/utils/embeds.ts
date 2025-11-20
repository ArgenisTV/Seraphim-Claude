import { EmbedBuilder } from 'discord.js';
import { QueueTrack } from '../types/QueueTrack';

/**
 * Embed Utilities
 *
 * Provides functions for creating styled Discord embeds
 * with consistent theming and formatting.
 */

/**
 * Creates a "now playing" embed for the current track
 *
 * @param {QueueTrack} track - The track to display
 * @returns {EmbedBuilder} Configured embed with track information
 *
 * @example
 * const embed = createNowPlayingEmbed(currentTrack);
 * await channel.send({ embeds: [embed] });
 */
export function createNowPlayingEmbed(track: QueueTrack): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle('✧ Resonating with Cosmic Vibrations')
    .setDescription(`**[${track.info.title}](${track.info.uri})**`)
    .addFields(
      { name: 'Divine Creator', value: track.info.author || 'Unknown', inline: true },
      { name: 'Duration', value: formatDuration(track.info.duration), inline: true },
      { name: 'Summoned by', value: track.requester.toString(), inline: true }
    )
    .setThumbnail(track.info.artworkUrl || null)
    .setTimestamp();
}

/**
 * Creates a queue display embed showing current and upcoming tracks
 *
 * @param {QueueTrack[]} queue - Array of queued tracks
 * @param {QueueTrack} currentTrack - The currently playing track
 * @returns {EmbedBuilder} Configured embed with queue information
 *
 * @example
 * const embed = createQueueEmbed(player.queue.tracks, player.queue.current);
 * await interaction.reply({ embeds: [embed] });
 */
export function createQueueEmbed(queue: QueueTrack[], currentTrack: QueueTrack): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle('✧ The Celestial Harmonies Await')
    .setDescription(
      `**Current Resonance:**\n[${currentTrack.info.title}](${currentTrack.info.uri})\n\n**Forthcoming Vibrations:**`
    )
    .setTimestamp();

  const upNext = queue
    .slice(0, 10)
    .map(
      (track, index) =>
        `${index + 1}. [${track.info.title}](${track.info.uri}) - ${formatDuration(track.info.duration)}`
    )
    .join('\n');

  if (upNext) {
    embed.setDescription(
      `**Current Resonance:**\n[${currentTrack.info.title}](${currentTrack.info.uri})\n\n**Forthcoming Vibrations:**\n${upNext}`
    );
  }

  if (queue.length > 10) {
    embed.setFooter({ text: `And ${queue.length - 10} more harmonies await...` });
  }

  return embed;
}

/**
 * Creates an error embed with red styling
 *
 * @param {string} message - The error message to display
 * @returns {EmbedBuilder} Configured error embed
 *
 * @example
 * const embed = createErrorEmbed('Track not found');
 * await interaction.reply({ embeds: [embed], ephemeral: true });
 */
export function createErrorEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x8B0000)
    .setTitle('⚠ The Divine Frequencies Falter')
    .setDescription(message)
    .setTimestamp();
}

/**
 * Creates a success embed with gold styling
 *
 * @param {string} message - The success message to display
 * @returns {EmbedBuilder} Configured success embed
 *
 * @example
 * const embed = createSuccessEmbed('Track added to queue');
 * await interaction.reply({ embeds: [embed] });
 */
export function createSuccessEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle('✧ Thy Request... is Worthy!')
    .setDescription(message)
    .setTimestamp();
}

/**
 * Creates an info embed with blue styling
 *
 * @param {string} title - The embed title
 * @param {string} message - The info message to display
 * @returns {EmbedBuilder} Configured info embed
 *
 * @example
 * const embed = createInfoEmbed('Bot Info', 'Version 1.0.0');
 * await interaction.reply({ embeds: [embed] });
 */
export function createInfoEmbed(title: string, message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(title)
    .setDescription(message)
    .setTimestamp();
}

/**
 * Formats a duration in milliseconds to a human-readable string
 *
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration (MM:SS or HH:MM:SS)
 *
 * @example
 * formatDuration(125000); // Returns "2:05"
 * formatDuration(3725000); // Returns "1:02:05"
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
