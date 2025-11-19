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

    if (player.queue.size === 0) {
      await interaction.reply({
        embeds: [createErrorEmbed('There are no more tracks in the queue.')],
        ephemeral: true,
      });
      return;
    }

    const currentTrack = player.queue.current;
    player.stop();

    await interaction.reply({
      embeds: [createSuccessEmbed(`⏭️ Skipped **${currentTrack?.title}**`)],
    });
  },
};
