import { ChatInputCommandInteraction } from 'discord.js';

/**
 * Guild Validation Utilities
 *
 * Provides helper functions for validating guild context in commands
 * to ensure they're not executed in DMs or invalid contexts.
 */

/**
 * Checks if a command interaction is being executed in a valid guild context
 *
 * @param {ChatInputCommandInteraction} interaction - The command interaction to validate
 * @returns {boolean} True if the interaction is in a guild, false otherwise
 *
 * @example
 * if (!isInGuild(interaction)) {
 *   await interaction.reply({ content: 'This command can only be used in a server!', ephemeral: true });
 *   return;
 * }
 */
export function isInGuild(interaction: ChatInputCommandInteraction): boolean {
  return interaction.inGuild() && interaction.guildId !== null && interaction.guild !== null;
}

/**
 * Standard error message for commands used outside of guild context
 */
export const GUILD_ONLY_ERROR = 'This divine command may only be invoked within the sacred halls of a server.';
