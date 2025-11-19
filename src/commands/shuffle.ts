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
        embeds: [createErrorEmbed('The queue is empty.')],
        ephemeral: true,
      });
      return;
    }

    player.queue.shuffle();

    await interaction.reply({
      embeds: [createSuccessEmbed(`🔀 Shuffled **${player.queue.size}** tracks`)],
    });
  },
};
