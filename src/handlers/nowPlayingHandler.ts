import { Player, Track } from 'lavalink-client';
import { SeraphimClient } from '../client/SeraphimClient';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
import { createNowPlayingEmbed } from '../utils/embeds';
import { QueueTrack } from '../types/QueueTrack';
import { logger } from '../utils/logger';

// Store message IDs to update them instead of sending new ones
const nowPlayingMessages = new Map<string, Message>();

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

    // Create control buttons
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('music_previous')
        .setLabel('Previous')
        .setEmoji('⏮️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true), // Disabled as we don't track history yet
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

    const existingMessage = nowPlayingMessages.get(player.guildId);

    if (existingMessage) {
      // Update existing message
      try {
        await existingMessage.edit({ embeds: [embed], components: [row] });
      } catch (error) {
        // Message was deleted or we lost access, send a new one
        const newMessage = await channel.send({ embeds: [embed], components: [row] });
        nowPlayingMessages.set(player.guildId, newMessage);
      }
    } else {
      // Send new message
      const message = await channel.send({ embeds: [embed], components: [row] });
      nowPlayingMessages.set(player.guildId, message);
    }
  } catch (error) {
    logger.error('Error updating now playing message:', error);
  }
}

// Clean up message reference when player is destroyed
export function cleanupNowPlayingMessage(guildId: string): void {
  nowPlayingMessages.delete(guildId);
}
