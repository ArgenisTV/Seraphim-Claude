import { ChatInputCommandInteraction } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createNowPlayingEmbed } from '../utils/embeds';
import { QueueTrack } from '../types/QueueTrack';

export const nowplayingCommand: Command = {
  name: 'nowplaying',
  description: 'Show the currently playing track',
  async execute(client: SeraphimClient, interaction: ChatInputCommandInteraction) {
    const player = client.music.players.get(interaction.guildId!);

    if (!player || !player.queue.current) {
      await interaction.reply({
        embeds: [createErrorEmbed('No celestial harmonies resonate at this moment.')],
        ephemeral: true,
      });
      return;
    }

    const track = player.queue.current as QueueTrack;

    await interaction.reply({
      embeds: [createNowPlayingEmbed(track)],
    });
  },
};
