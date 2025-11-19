import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds';

export const shuffleCommand: Command = {
  name: 'shuffle',
  description: 'Shuffle the queue',
  async execute(client: SeraphimClient, interaction: ChatInputCommandInteraction) {
    const player = client.music.players.get(interaction.guildId!);

    if (!player) {
      await interaction.reply({
        embeds: [createErrorEmbed('No celestial harmonies resonate at this moment.')],
        ephemeral: true,
      });
      return;
    }

    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel || voiceChannel.id !== player.voiceChannelId) {
      await interaction.reply({
        embeds: [createErrorEmbed('Thou must share the sacred chamber with Seraphim.')],
        ephemeral: true,
      });
      return;
    }

    if (player.queue.tracks.length === 0) {
      await interaction.reply({
        embeds: [createErrorEmbed('The celestial queue lays barren.')],
        ephemeral: true,
      });
      return;
    }

    player.queue.shuffle();

    await interaction.reply({
      embeds: [
        createSuccessEmbed(
          `🔀 The cosmic order has been rearranged... ${player.queue.tracks.length} harmonies shall flow in divine chaos.`
        ),
      ],
    });
  },
};
