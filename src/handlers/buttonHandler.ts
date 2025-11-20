import { ButtonInteraction } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { createErrorEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';
import { getPreviousTrack, hasPreviousTrack } from '../utils/trackHistory';

export async function handleButtonInteraction(
  client: SeraphimClient,
  interaction: ButtonInteraction
): Promise<void> {
  const player = client.music.players.get(interaction.guildId!);

  if (!player) {
    await interaction.reply({
      embeds: [createErrorEmbed('No celestial harmonies resonate at this moment.')],
      ephemeral: true,
    });
    return;
  }

  // Check if user is in the same voice channel
  const member = interaction.guild?.members.cache.get(interaction.user.id);
  const voiceChannel = member?.voice.channel;

  if (!voiceChannel || voiceChannel.id !== player.voiceChannelId) {
    await interaction.reply({
      embeds: [createErrorEmbed('Thou must share the sacred chamber with Seraphim to command the divine controls.')],
      ephemeral: true,
    });
    return;
  }

  try {
    switch (interaction.customId) {
      case 'music_previous':
        // Check if there's a previous track
        if (!hasPreviousTrack(interaction.guildId!)) {
          await interaction.reply({
            embeds: [createErrorEmbed('No previous harmonies exist in the ethereal record.')],
            ephemeral: true,
          });
          return;
        }

        // Get the previous track
        const previousTrack = getPreviousTrack(interaction.guildId!);

        if (!previousTrack) {
          await interaction.reply({
            embeds: [createErrorEmbed('The echoes of past vibrations have faded.')],
            ephemeral: true,
          });
          return;
        }

        // Add to front of queue and skip current track
        player.queue.splice(0, 0, previousTrack);
        await player.skip();

        await interaction.reply({
          content: `⏮️ *Returning to: **${previousTrack.info.title}***`,
          ephemeral: true,
        });
        break;

      case 'music_pause':
        if (player.paused) {
          await player.resume();
          await interaction.reply({
            content: '▶️ *The harmonies flow anew!*',
            ephemeral: true,
          });
        } else {
          await player.pause();
          await interaction.reply({
            content: '⏸️ *The vibrations rest...*',
            ephemeral: true,
          });
        }
        break;

      case 'music_skip':
        if (player.queue.tracks.length === 0) {
          await interaction.reply({
            embeds: [createErrorEmbed('No further vibrations await in the celestial queue.')],
            ephemeral: true,
          });
          return;
        }
        await player.skip();
        await interaction.reply({
          content: '⏭️ *Transcending to the next harmony...*',
          ephemeral: true,
        });
        break;

      case 'music_shuffle':
        if (player.queue.tracks.length === 0) {
          await interaction.reply({
            embeds: [createErrorEmbed('The celestial queue lays barren.')],
            ephemeral: true,
          });
          return;
        }
        player.queue.shuffle();
        await interaction.reply({
          content: '🔀 *The cosmic order has been rearranged...*',
          ephemeral: true,
        });
        break;

      case 'music_stop':
        await player.stopPlaying(); // Clears queue and stops playback
        await player.destroy();
        await interaction.reply({
          content: '*Slumbers...*',
          ephemeral: true,
        });
        break;

      default:
        logger.warn(`Unknown button interaction: ${interaction.customId}`);
    }
  } catch (error) {
    logger.error('Error in button handler:', error);

    // Check if we've already replied to avoid Discord API errors
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        embeds: [createErrorEmbed('The cosmic forces have disrupted thy command.')],
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        embeds: [createErrorEmbed('The cosmic forces have disrupted thy command.')],
        ephemeral: true,
      });
    }
  }
}
