import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds';

export const stopCommand: Command = {
  name: 'stop',
  description: 'Stop playback and clear the queue',
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

    player.queue.clear();
    player.stop();
    player.destroy();

    await interaction.reply({
      embeds: [createSuccessEmbed('⏹️ Stopped playback and cleared the queue')],
    });
  },
};
