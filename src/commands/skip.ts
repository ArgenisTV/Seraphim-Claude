import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds';

export const skipCommand: Command = {
  name: 'skip',
  description: 'Skip to the next track',
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
        embeds: [createErrorEmbed('No further vibrations await in the celestial queue.')],
        ephemeral: true,
      });
      return;
    }

    await player.skip();

    await interaction.reply({
      embeds: [createSuccessEmbed(`⏭️ Transcending to the next harmony...`)],
    });
  },
};
