import { config } from 'dotenv';
import { SeraphimClient } from './client/SeraphimClient';
import { logger } from './utils/logger';

// Load environment variables
config();

// Validate required environment variables
const requiredEnvVars = ['DISCORD_TOKEN', 'CLIENT_ID'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Create and start the bot
const client = new SeraphimClient();

// Setup raw event handler for lavalink-client
client.on('raw', (d) => client.music.sendRawData(d));

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  await client.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  await client.shutdown();
  process.exit(0);
});

// Handle uncaught errors
process.on('unhandledRejection', (error: Error) => {
  logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the bot
client.start().catch((error) => {
  logger.error('Failed to start bot:', error);
  process.exit(1);
});
