import { ChatInputCommandInteraction } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createQueueEmbed } from '../utils/embeds';
import { QueueTrack } from '../types/QueueTrack';

export const queueCommand: Command = {
  name: 'queue',
  description: 'Show the current music queue',
  async execute(client: SeraphimClient, interaction: ChatInputCommandInteraction) {
    const player = client.music.players.get(interaction.guildId!);

    if (!player) {
      await interaction.reply({
        embeds: [createErrorEmbed('No music is currently playing.')],
        ephemeral: true,
      });
      return;
    }

    if (!player.queue.current) {
      await interaction.reply({
        embeds: [createErrorEmbed('The queue is empty.')],
        ephemeral: true,
      });
      return;
    }

    const currentTrack = player.queue.current as QueueTrack;
    const queue = player.queue as unknown as QueueTrack[];

    await interaction.reply({
      embeds: [createQueueEmbed(queue, currentTrack)],
    });
  },
};
