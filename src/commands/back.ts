import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds';

export const backCommand: Command = {
  name: 'back',
  description: 'Go back to the previous track',
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

    if (!voiceChannel || voiceChannel.id !== player.voiceChannel) {
      await interaction.reply({
        embeds: [createErrorEmbed('Thou must share the sacred chamber with Seraphim.')],
        ephemeral: true,
      });
      return;
    }

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
      embeds: [createSuccessEmbed('⏮️ Returning to the echoes of the past...')],
    });
  },
};
