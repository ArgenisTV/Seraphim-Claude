import { config } from 'dotenv';
import { SeraphimClient } from './client/SeraphimClient';
import { logger } from './utils/logger';
import { startHealthMonitoring } from './utils/healthCheck';

// Load environment variables
config();

// Validate required environment variables
const requiredEnvVars = ['DISCORD_TOKEN', 'CLIENT_ID', 'LAVALINK_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Validate optional environment variables with defaults
const lavalinkPort = parseInt(process.env.LAVALINK_PORT || '2333');
const defaultVolume = Math.max(0, Math.min(100, parseInt(process.env.DEFAULT_VOLUME || '50')));

// Validate numeric values
if (isNaN(lavalinkPort) || lavalinkPort < 1 || lavalinkPort > 65535) {
  logger.error('LAVALINK_PORT must be a valid port number (1-65535)');
  process.exit(1);
}

if (isNaN(defaultVolume)) {
  logger.error('DEFAULT_VOLUME must be a number between 0 and 100');
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
client.start()
  .then(() => {
    // Start health monitoring in production (every 5 minutes)
    if (process.env.NODE_ENV === 'production') {
      startHealthMonitoring(client, 300000);
      logger.info('Production health monitoring enabled');
    }
  })
  .catch((error) => {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  });
