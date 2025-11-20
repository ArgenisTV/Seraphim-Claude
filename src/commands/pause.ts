import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds';
import { isInGuild, GUILD_ONLY_ERROR } from '../utils/guildValidation';

/**
 * Pause Command
 *
 * Pauses currently playing music or resumes if already paused.
 * Toggles between pause and resume states.
 *
 * @example
 * /pause  // Pauses music
 * /pause  // Resumes music
 */
export const pauseCommand: Command = {
  name: 'pause',
  description: 'Pause or resume playback',
  /**
   * Executes the pause/resume command
   *
   * @param {SeraphimClient} client - The bot client instance
   * @param {ChatInputCommandInteraction} interaction - Discord slash command interaction
   * @returns {Promise<void>} Resolves when command completes
   */
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

    if (player.paused) {
      await player.resume();
      await interaction.reply({
        embeds: [createSuccessEmbed('▶️ The harmonies flow anew!')],
      });
    } else {
      await player.pause();
      await interaction.reply({
        embeds: [createSuccessEmbed('⏸️ The vibrations rest...')],
      });
    }
  },
};
