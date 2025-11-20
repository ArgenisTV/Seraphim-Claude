import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds';
import { isInGuild, GUILD_ONLY_ERROR } from '../utils/guildValidation';
import { getPreviousTrack, hasPreviousTrack } from '../utils/trackHistory';

/**
 * Back Command
 *
 * Plays the previous track from the guild's track history.
 * Track history is automatically maintained as songs play.
 *
 * @example
 * /back  // Plays the previous track
 */
export const backCommand: Command = {
  name: 'back',
  description: 'Go back to the previous track',
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

    // Check if there's a previous track
    if (!hasPreviousTrack(interaction.guildId!)) {
      await interaction.reply({
        embeds: [createErrorEmbed('No previous harmonies exist in the ethereal record.')],
        ephemeral: true,
      });
      return;
    }

    // Get the previous track
    const previousTrack = getPreviousTrack(interaction.guildId!);

    if (!previousTrack) {
      await interaction.reply({
        embeds: [createErrorEmbed('The echoes of past vibrations have faded.')],
        ephemeral: true,
      });
      return;
    }

    // Add to front of queue and skip current track
    player.queue.splice(0, 0, previousTrack);
    await player.skip();

    await interaction.reply({
      embeds: [createSuccessEmbed(`Returning to: **${previousTrack.info.title}**`)],
      ephemeral: true,
    });
  },
};
