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
        embeds: [createErrorEmbed('No music is currently playing.')],
        ephemeral: true,
      });
      return;
    }

    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel || voiceChannel.id !== player.voiceChannel) {
      await interaction.reply({
        embeds: [createErrorEmbed('You must be in the same voice channel as the bot.')],
        ephemeral: true,
      });
      return;
    }

    if (!player.queue.previous) {
      await interaction.reply({
        embeds: [createErrorEmbed('There is no previous track.')],
        ephemeral: true,
      });
      return;
    }

    player.queue.unshift(player.queue.previous);
    player.stop();

    await interaction.reply({
      embeds: [createSuccessEmbed('⏮️ Playing previous track...')],
    });
  },
};
