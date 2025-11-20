import { SeraphimClient } from '../client/SeraphimClient';
import { logger } from '../utils/logger';
import { auditLogger } from '../utils/auditLogger';
import { handleButtonInteraction } from '../handlers/buttonHandler';
import { checkRateLimit } from '../utils/rateLimiter';
import { createErrorEmbed } from '../utils/embeds';

export function interactionCreateEvent(client: SeraphimClient): void {
  client.on('interactionCreate', async (interaction) => {
    try {
      // Handle slash commands
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
          logger.warn(`Unknown command: ${interaction.commandName}`);
          return;
        }

        // Check rate limit
        const rateLimitResult = checkRateLimit(interaction.user.id);
        if (rateLimitResult.isLimited) {
          const retryAfterSeconds = Math.ceil(rateLimitResult.retryAfter / 1000);

          // Audit log: Rate limit exceeded
          auditLogger.logRateLimitExceeded(interaction.user.id, rateLimitResult.retryAfter);

          await interaction.reply({
            embeds: [
              createErrorEmbed(
                `Thou art invoking commands too swiftly. Await ${retryAfterSeconds} seconds before thy next summons.`
              ),
            ],
            ephemeral: true,
          });
          logger.warn(`Rate limited user ${interaction.user.tag} (${interaction.user.id})`);
          return;
        }

        // Audit log: Command execution
        auditLogger.logCommandExecution(
          interaction.user.id,
          interaction.guildId || 'DM',
          interaction.commandName,
          {
            username: interaction.user.tag,
          }
        );

        await command.execute(client, interaction);
      }

      // Handle button interactions
      if (interaction.isButton()) {
        await handleButtonInteraction(client, interaction);
      }
    } catch (error) {
      logger.error('Error handling interaction:', error);

      // Audit log: Error occurred
      auditLogger.logError(
        'InteractionError',
        error instanceof Error ? error.message : 'Unknown error',
        {
          interactionType: interaction.type,
          userId: interaction.user?.id,
          guildId: interaction.guildId,
        }
      );

      const errorMessage = { content: 'An error occurred while processing your request.', ephemeral: true };

      if (interaction.isRepliable()) {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      }
    }
  });
}
