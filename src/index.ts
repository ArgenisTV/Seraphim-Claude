import { config } from 'dotenv';
import { SeraphimClient } from './client/SeraphimClient';
import { logger } from './utils/logger';
import { startHealthMonitoring } from './utils/healthCheck';
import { loadRequiredSecrets, isDockerSecretsMode, redactSecret } from './utils/secretsManager';
import { startAutoRotation, checkAndRotate } from './utils/logRotation';

// Load environment variables from .env file (if not using Docker secrets)
config();

// Load required secrets (supports both env vars and Docker secrets)
let secrets: Map<string, string>;
try {
  secrets = loadRequiredSecrets(['DISCORD_TOKEN', 'CLIENT_ID', 'LAVALINK_PASSWORD']);

  // Log secret loading mode (without exposing values)
  if (isDockerSecretsMode()) {
    logger.info('Loaded credentials from Docker secrets');
  } else {
    logger.info('Loaded credentials from environment variables');
  }

  // Optional: Log redacted token for debugging (only in development)
  if (process.env.NODE_ENV !== 'production') {
    logger.debug(`Discord token: ${redactSecret(secrets.get('DISCORD_TOKEN')!)}`);
  }
} catch (error) {
  logger.error('Failed to load required secrets:', error);
  process.exit(1);
}

// Make secrets available globally via process.env for backward compatibility
// This allows existing code to continue using process.env.DISCORD_TOKEN etc.
process.env.DISCORD_TOKEN = secrets.get('DISCORD_TOKEN');
process.env.CLIENT_ID = secrets.get('CLIENT_ID');
process.env.LAVALINK_PASSWORD = secrets.get('LAVALINK_PASSWORD');

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

// Check and rotate logs on startup
checkAndRotate({
  logDirectory: './logs',
  logFileName: 'app.log',
  maxSize: 10 * 1024 * 1024, // 10 MB
  maxFiles: 5,
});

// Start the bot
client.start()
  .then(() => {
    // Start health monitoring in production (every 5 minutes)
    if (process.env.NODE_ENV === 'production') {
      startHealthMonitoring(client, 300000);
      logger.info('Production health monitoring enabled');

      // Start automatic log rotation (check every hour)
      startAutoRotation(3600000, {
        logDirectory: './logs',
        logFileName: 'app.log',
      });
      logger.info('Automatic log rotation enabled');
    }
  })
  .catch((error) => {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  });
