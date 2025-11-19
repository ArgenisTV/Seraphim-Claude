import { ButtonInteraction } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { createErrorEmbed } from '../utils/embeds';
import { logger } from '../utils/logger';

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

  if (!voiceChannel || voiceChannel.id !== player.voiceChannel) {
    await interaction.reply({
      embeds: [createErrorEmbed('Thou must share the sacred chamber with Seraphim to command the divine controls.')],
      ephemeral: true,
    });
    return;
  }

  try {
    switch (interaction.customId) {
      case 'music_previous':
        if (!player.queue.previous) {
          await interaction.reply({
            embeds: [createErrorEmbed('No echoes of past vibrations remain.')],
            ephemeral: true,
          });
          return;
        }
        player.queue.unshift(player.queue.previous);
        player.stop();
        await interaction.reply({
          content: '⏮️ *Returning to the echoes of the past...*',
          ephemeral: true,
        });
        break;

      case 'music_pause':
        if (player.paused) {
          player.pause(false);
          await interaction.reply({
            content: '▶️ *The harmonies flow anew!*',
            ephemeral: true,
          });
        } else {
          player.pause(true);
          await interaction.reply({
            content: '⏸️ *The vibrations rest...*',
            ephemeral: true,
          });
        }
        break;

      case 'music_skip':
        if (player.queue.size === 0) {
          await interaction.reply({
            embeds: [createErrorEmbed('No further vibrations await in the celestial queue.')],
            ephemeral: true,
          });
          return;
        }
        player.stop();
        await interaction.reply({
          content: '⏭️ *Transcending to the next harmony...*',
          ephemeral: true,
        });
        break;

      case 'music_shuffle':
        if (player.queue.size === 0) {
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
        player.queue.clear();
        player.stop();
        player.destroy();
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
    await interaction.reply({
      embeds: [createErrorEmbed('The cosmic forces have disrupted thy command.')],
      ephemeral: true,
    });
  }
}
