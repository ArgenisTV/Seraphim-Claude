import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SeraphimClient } from '../client/SeraphimClient';
import { Command } from '../types/Command';
import { createErrorEmbed } from '../utils/embeds';
import { isInGuild, GUILD_ONLY_ERROR } from '../utils/guildValidation';

/**
 * Stop Command
 *
 * Stops music playback, clears the entire queue, and disconnects the bot
 * from the voice channel. Requires user to be in the same voice channel as the bot.
 *
 * @example
 * /stop  // Stops music and disconnects bot
 */
export const stopCommand: Command = {
  name: 'stop',
  description: 'Stop playback and clear the queue',
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

    await player.stopPlaying(); // Clears queue and stops playback
    await player.destroy();

    await interaction.reply({
      content: '*Slumbers...*',
    });
  },
};
