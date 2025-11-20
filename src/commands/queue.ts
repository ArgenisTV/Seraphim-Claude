import { ChatInputCommandInteraction } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createQueueEmbed } from '../utils/embeds';
import { QueueTrack } from '../types/QueueTrack';
import { isInGuild, GUILD_ONLY_ERROR } from '../utils/guildValidation';

/**
 * Queue Command
 *
 * Displays the current music queue showing the now playing track
 * and upcoming tracks. Shows track titles, authors, and queue position.
 *
 * @example
 * /queue  // Displays current queue
 */
export const queueCommand: Command = {
  name: 'queue',
  description: 'Show the current music queue',
  async execute(client: SeraphimClient, interaction: ChatInputCommandInteraction) {
    // Ensure command is executed in a guild
    if (!isInGuild(interaction)) {
      await interaction.reply({
        embeds: [createErrorEmbed(GUILD_ONLY_ERROR)],
        ephemeral: true,
      });
      return;
    }

    const player = client.music.players.get(interaction.guildId!);

    if (!player) {
      await interaction.reply({
        embeds: [createErrorEmbed('No celestial harmonies resonate at this moment.')],
        ephemeral: true,
      });
      return;
    }

    if (!player.queue.current) {
      await interaction.reply({
        embeds: [createErrorEmbed('The celestial queue lays barren.')],
        ephemeral: true,
      });
      return;
    }

    const currentTrack = player.queue.current as QueueTrack;
    const queueTracks = player.queue.tracks as QueueTrack[];

    await interaction.reply({
      embeds: [createQueueEmbed(queueTracks, currentTrack)],
    });
  },
};
