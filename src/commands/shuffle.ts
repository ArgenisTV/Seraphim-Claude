import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds';
import { isInGuild, GUILD_ONLY_ERROR } from '../utils/guildValidation';

/**
 * Shuffle Command
 *
 * Randomly shuffles the order of tracks in the queue.
 * Does not affect the currently playing track.
 * Requires user to be in the same voice channel as the bot.
 *
 * @example
 * /shuffle  // Randomizes queue order
 */
export const shuffleCommand: Command = {
  name: 'shuffle',
  description: 'Shuffle the queue',
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
